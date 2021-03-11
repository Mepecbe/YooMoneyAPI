import { RgResult, RgSuccess, Event } from 'rg';
import { ApiUtils } from "./utils";

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
import { Operation, OperationInfo } from './types';

class YooMoney{
	private readonly clientid: string;

	private readonly WebClient: RgWeb;
	private readonly port: number;

	private readonly BaseApiUrl: string = "yoomoney.ru";
	private readonly CallbackUrl: string;
	private readonly Server: ExpressFramework.Express;

	authToken = "";

	public readonly onReceiveToken: Event<string> = new Event();
	public readonly onPayment: Event<OperationInfo> = new Event();
	

	async auth(): Promise<RgResult<string>> {
		const clientid = this.clientid;

		let body = 
		`client_id=${this.clientid}`
		+ `&response_type=code`
		+ `&redirect_uri=${this.CallbackUrl}`
		+ `&scope=${Scopes.AccountInfo} ${Scopes.OperationsDetails} ${Scopes.OperationsHistory}`
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

	async getAuthToken(code: string): Promise<RgResult<string>> {
		let body = 
			`code=${code}`
			+ `&client_id=${this.clientid}`
			+ `&grant_type=authorization_code`
			+ `&redirect_uri=${this.CallbackUrl}`;

		body = encodeURI(body);
		
		const req: RequestOptions = {
			method: "POST",
			path: ApiEndpoints.Token + '?' + body
		};

		const resp = await this.WebClient.request(req, null);
		
		if (resp.is_success){
			const json = JSON.parse(resp.data);

			if (typeof(json.access_token) == "string"){
				this.authToken = json.access_token;

				return {
					is_success: true,
					data: json.access_token
				};
			}
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

		const resp = await this.WebClient.request(req, null);
		
		if (resp.is_success){
			const json = JSON.parse(resp.data);
			
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

		return resp;
	}

	async getOperationsDetails(operationId: string): Promise<RgResult<string>>{
		const query = encodeURI(`operation_id=${operationId}`);
		
		const req: RequestOptions = {
			method: "POST",
			path: ApiEndpoints.OperationDetails + '?' + query,
			headers: {
				"Authorization": "Bearer " + this.authToken
			}
		};

		const resp = await this.WebClient.request(req, null);
		
		console.log(req);

		if (resp.is_success){
			const json = JSON.parse(resp.data);
			console.log(json);

			if (typeof(json.access_token) == "string"){
				return {
					is_success: true,
					data: json.access_token
				};
			}
		}

		return resp;
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