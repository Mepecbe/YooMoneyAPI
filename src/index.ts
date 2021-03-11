import { RgResult, RgSuccess, Event, format, RgError } from 'rg';

import * as ExpressFramework from "express";
import * as BodyParser from "body-parser";

import {
	ApiEndpoints
} from "./endpoints";

import {
	RequestOptions,
	RgWeb,
	ErrorCodes as WebErrorCodes
} from 'rg-web';
import { Scopes } from './enums';

import { stringify } from 'uuid';
import { Request } from 'express';
import { Validators } from './validators';
import { DetailedOperationInfo, Operation, NotificatonOperationInfo, YooMoneyError } from './types';

class YooMoney{
	private readonly clientid: string;

	private readonly WebClient: RgWeb;
	private readonly port: number;

	private readonly BaseApiUrl: string = "yoomoney.ru";
	private readonly CallbackUrl: string;
	private readonly Server: ExpressFramework.Express;

	authToken = "";

	public readonly onReceiveToken: Event<string> = new Event();
	public readonly onPayment: Event<NotificatonOperationInfo> = new Event();

	async getAuthUrl(scopes: Scopes[]): Promise<RgResult<string>> {
		let body = 
		`client_id=${this.clientid}`
		+ `&response_type=code`
		+ `&redirect_uri=${this.CallbackUrl}`
		+ `&scope=${scopes.join(' ')}`
		+ `&instance_name=1123`;
		
		body = encodeURI(body);

		const req: RequestOptions = {
			method: "POST",
			path: ApiEndpoints.Auth + '?' + body
		};
		
		const resp = await this.WebClient.request(req, null);
		
		if (resp.is_success){
			if (resp.http_status_code == 302){
				if (!resp.headers.location) {
					return resp;
				}

				return {
					is_success: true,
					data: resp.headers.location
				};
			}
		}
		
		return resp;
	}

	/**Запросить у сервера токен используя временный ключ */
	async getAuthToken(code: string): Promise<RgResult<string>> {
		const body =
			encodeURI(
				`code=${code}`
				+ `&client_id=${this.clientid}`
				+ `&grant_type=authorization_code`
				+ `&redirect_uri=${this.CallbackUrl}`
			);
		
		const req: RequestOptions = {
			method: "POST",
			path: ApiEndpoints.Token + '?' + body
		};

		const resp = await this.WebClient.request(req, null);
		
		if (resp.is_success){
			const json: unknown | null = JSON.parse(resp.data);

			if (json){
				const error = Validators.getValidateError(json);

				if (error){
					return {
						is_success: false,
						error: {
							code: 1,
							message: 
							error.error
							+ error.error_description ? "\n" + error.error_description : ""
						}
					};
				}

				const token = Validators.getValidatedAuthToken(json);

				if (token != null){
					if (token.length == 0){
						return {
							is_success: false,
							error: {
								code: 1,
								message: `Token is empty! Unknown error`
							}
						};
					}
					
					this.authToken = token;

					return {
						is_success: true,
						data: token
					};
				}

				return {
					is_success: false,
					error: {
						code: 1,
						message: "Validation error"
					}
				};
			}
			
			return {
				is_success: false,
				error: {
					code: 1,
					message: `Error parse JSON`
				}
			};
		}

		return resp;
	}

	async getOperationsHistory(count: number): Promise<RgResult<Operation[]>>{
		const query = encodeURI(`records=${count}`);
		
		const req: RequestOptions = {
			method: "POST",
			path: ApiEndpoints.OperationsHistory + '?' + query,
			headers: {
				"Authorization": "Bearer " + this.authToken
			}
		};

		const response = await this.WebClient.request(req, null);
		
		if (response.is_success){
			const json = JSON.parse(response.data);

			console.log(response.data);

			{
				const error = Validators.getValidateError(json);
			
				if (error){
					return {
						is_success: false,
						error: {
							code: 1,
							message: error.error
						}
					};
				}
			}

			if (!Array.isArray(json.operations)){
				return {
					is_success: false,
					error: {
						code: 1,
						message: "unknown error"
					}
				};
			}

			const validatedOperations = Validators.getValidateOperations(json.operations);
			
			if (validatedOperations){
				return {
					is_success: true,
					data: validatedOperations
				};
			}

			return {
				is_success: false,
				error: {
					code: 1,
					message: "Validate error"
				}
			};
		}

		return response;
	}

	async getOperationsDetails(operationId: string): Promise<RgResult<DetailedOperationInfo>>{
		const query = `operation_id=${operationId}`;

		const req: RequestOptions = {
			method: "POST",
			path: ApiEndpoints.OperationDetails + '?' + query,
			headers: {
				"Authorization": "Bearer " + this.authToken,
				"Content-Type": "application/x-www-form-urlencoded"
			}
		};

		const resp = await this.WebClient.request(req, Buffer.from(query));
		
		if (resp.is_success){
			const json = JSON.parse(resp.data);
			const validated = Validators.getValidateDetailedOperationInfo(json);

			if (validated){
				return {
					is_success: true,
					data: validated
				};
			}

			return {
				is_success: false,
				error: {
					code: 1,
					message: "validate error"
				}
			};
		}

		return resp;
	}
	

	genPaymentUrl(
		paymentName: string,
		amount: number,
		to: string
	): string {
		let baseUrl = "https://yoomoney.ru/quickpay/shop-widget"
			+ "?writer=seller"
			+ "&targets={paymentName}"
			+ "&targets-hint="
			+ "&default-sum={amount}"
			+ "&button-text=12"
			+ "&hint="
			+ "&successURL="
			+ "&quickpay=shop"
			+ "&account={to}";

		baseUrl = format(
			baseUrl,
			{
				paymentName,
				amount,
				to
			}
		);

		
		return encodeURI(baseUrl);
	}

	run(): void{
		this.Server.listen(this.port);
	}

	stop(): void{
		//pass
	}

	constructor(
		clientid: string,
		callback: string,
		port: number,
		baseApiUrl = "yoomoney.ru"
	){
		this.clientid = clientid;
		
		this.CallbackUrl = callback;
		this.BaseApiUrl = baseApiUrl;
		this.port = port;

		{
			this.Server = ExpressFramework();
			this.Server.use(BodyParser.urlencoded());
			//this.Server.use(BodyParser.json());

			
			this.Server.get(`/`, async (req, res) =>{
				const jsonData: unknown = req.body;

				if (typeof(req.query.code) !== "string"){
					return;
				}

				if (typeof(req.query.code) !== "string"){
					console.log(`[reqHandler] code not found, exit`);
					return;
				}

				this.onReceiveToken.emit(req.query.code);
			});
			

			this.Server.post(`/`, async (req, res) => {
				const jsonData: unknown = req.body;

				if (jsonData != null){
					const valid = Validators.getValidateOperationInfo(jsonData);

					if (valid != null){
						this.onPayment.emit(valid);
					} else {
						console.log(`[POST] failed validate operations info`);
					}
				} else {
					console.log(`[POST] failed parse JSON`);
					console.log(req.body);
				}

				res.statusCode = 200;
			});
		}
		
		this.WebClient = new RgWeb(this.BaseApiUrl, 443, "HTTPS");
	}
}

export {
	YooMoney
};