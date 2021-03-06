import { 
	RgResult,
	RgSuccess,
	Event,
	format,
	RgError,
	timeout
} from 'rg';

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
import { ChangeTrackingMethod, Scopes } from './enums';

import { stringify } from 'uuid';
import { Request } from 'express';
import { Validators } from './validators';
import { 
	DetailedOperationInfo,
	Operation,
	NotificatonOperationInfo, 
	YooMoneyError, 
	AccountInfo,
	CurrencyType
} from './types';

class YooMoney{
	private readonly clientid: string;

	private readonly WebClient: RgWeb;
	private readonly port: number;

	private readonly BaseApiUrl: string = "yoomoney.ru";
	private readonly CallbackUrl: string;

	private readonly Server: ExpressFramework.Express;
	private readonly TrackingType: ChangeTrackingMethod;

	private PollUpdater: NodeJS.Timeout | undefined;
	private LastTxId = "";

	/**Событие срабатывает, когда сервер яндекса присылает временный токен */
	public readonly onReceiveToken: Event<string> = new Event();
	public readonly onPayment: Event<NotificatonOperationInfo> = new Event();
	
	authToken = "";

	private getAuthorizedRequestOptions(
		method: string, 
		path: string,
		query: string | undefined
	): RequestOptions {
		return {
			method,
			path: path + (query ? encodeURI(`?${query}`) : ""),
			headers: {
				"Authorization": "Bearer " + this.authToken
			}
		};
	}

	/**
	 * Запросить авторизацию
	 * https://yoomoney.ru/docs/wallet/using-api/authorization/request-access-token
	 * @param {Scopes} scopes Запрашиваемые права
	 * @returns {string} Ссылка на страницу авторизации
	 */
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
			path: ApiEndpoints.Auth + '?' + body,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			}
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

	/**Запросить у сервера токен авторизации, используя временный токен присланный яндексом
	 * https://yoomoney.ru/docs/wallet/using-api/authorization/obtain-access-token
	 * @param {string} key Временный токен
	 */
	async getAuthToken(key: string): Promise<RgResult<string>> {
		const body =
			encodeURI(
				`code=${key}`
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
							code: 
								1,
							message:
								error.error
						}
					};
				}

				const token = Validators.getValidatedAuthToken(json);

				if (token != null){
					if (token.length == 0){
						return {
							is_success: false,
							error: {
								code: 
									1,
								message: 
									`Token is empty! Unknown error`
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

	/**
	 * Запрос информации об аккаунте
	 */
	async getAccountInfo(): Promise<RgResult<AccountInfo>> {
		const reqOptions = 
			this.getAuthorizedRequestOptions("POST", ApiEndpoints.AccountInfo, undefined);

		const resp = await this.WebClient.request(reqOptions, null);

		if (resp.is_success){
			const json: unknown | null = JSON.parse(resp.data);

			if (json){
				const validated = Validators.getValidateAccountInfo(json);

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
						message: `Validation error`
					}
				};
			}

			if (json == ""){
				return {
					is_success: false,
					error: {
						code: 2,
						message: "Сервер ответил пустым сообщением, возможно ключ устарел"
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

		return {
			is_success: false,
			error: resp.error
		};
	}

	/**
	 * Получить историю операций
	 * @param {number} count Количество
	 */
	async getOperationsHistory(count: number): Promise<RgResult<Operation[]>> {
		const req =
			this.getAuthorizedRequestOptions(
				"POST",
				ApiEndpoints.OperationsHistory,
				`records=${count}`
			);

		const response = await this.WebClient.request(req, null);

		if (response.is_success){
			const json: unknown | null = JSON.parse(response.data);

			if (json){
				const error = Validators.getValidateError(json);
			
				if (error){
					return {
						is_success: false,
						error: {
							code:
								1,
							message:
								error.error
						}
					};
				}
				
				if (!Validators.isStruct(json)){
					return {
						is_success: false,
						error: {
							code: 1,
							message: "Validation error"
						}
					};
				}

				if (!Array.isArray(json.operations)){
					return {
						is_success: false,
						error: {
							code: 1,
							message: "Validation error"
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
						message: "Validation error"
					}
				};
			}

			return {
				is_success: false,
				error: {
					code: 1,
					message: "Error parse JSON"
				}
			};
		}
		return response;
	}


	/**
	 * @description Получить детализированную информацию об операции
	 * 
	 * @param {string} operationId Идентификатор операции
	 */
	async getOperationDetails(operationId: string): Promise<RgResult<DetailedOperationInfo>>{
		const req = this.getAuthorizedRequestOptions("POST", ApiEndpoints.OperationDetails, "");
		req.headers = Object.assign(
			req.headers,
			{ "Content-Type": "application/x-www-form-urlencoded" }
		);

		const resp = await this.WebClient.request(req, Buffer.from(`operation_id=${operationId}`));
		
		if (resp.is_success){
			const json: unknown | null = JSON.parse(resp.data);

			if (json){
				const error = Validators.getValidateError(json);

				if (error){
					return {
						is_success: false,
						error: {
							code: 
								1,
							message: 
								error.error
						}
					};
				}

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

	/** 
	 * @description Сгенерировать ссылку для оплаты
	 * 
	 * @param paymentName Наименование плажета
	 * @param amount Количество
	 * @param to На какой кошелёк
	 */
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

	private async poll(): Promise<void>{
		const requestOpResult = await this.getOperationsHistory(20);
		
		if (requestOpResult.is_success){
			for (const transaction of requestOpResult.data){
				if (transaction.operation_id == this.LastTxId){
					break;
				}

				this.onPayment.emit({
					notification_type: "p2p-incoming",
					bill_id: "",
					amount: transaction.amount.toString(),
					datetime: transaction.datetime,
					codepro: "",
					sender: "",
					operation_label: transaction.title,
					operation_id: transaction.operation_id,
					currency: transaction.amount_currency,
					label: ""
				});
			}

			this.LastTxId = requestOpResult.data[0].operation_id;
		} else {
			console.error(`YooMoney poll error\n` + requestOpResult.error.message);
		}
	}

	run(): void{
		if (this.TrackingType == ChangeTrackingMethod.HttpNotify){
			this.Server.listen(this.port);
		} else if (this.TrackingType == ChangeTrackingMethod.Poll){
			this.getOperationsHistory(1).then((result) => {
				if (result.is_success){
					this.LastTxId = result.data[0].operation_id;
					this.PollUpdater = 
							setInterval(() => this.poll(), 4000);
				}
			});
		}
	}

	stop(): void{
		if (this.TrackingType == ChangeTrackingMethod.Poll){
			if (this.PollUpdater){
				clearInterval(this.PollUpdater);
			}
		} else if (this.TrackingType == ChangeTrackingMethod.HttpNotify){
			this.Server.removeAllListeners();
		}
	}

	constructor(
		clientid: string,
		callback: string,
		port: number,
		trackingType: ChangeTrackingMethod
	){
		this.clientid = clientid;
		
		this.CallbackUrl = callback;
		this.port = port;

		this.TrackingType = trackingType;

		{
			this.Server = ExpressFramework();
			this.Server.use(BodyParser.urlencoded());

			this.Server.get(`/`, async (req, res) =>{
				if (typeof(req.query.code) !== "string"){
					return;
				}

				if (typeof(req.query.code) !== "string"){
					//console.log(`[reqHandler] code not found, exit`);
					return;
				}

				const authToken = await this.getAuthToken(req.query.code);
			
				if (authToken.is_success){
					this.authToken = authToken.data;
					this.onReceiveToken.emit(authToken.data);
				} else {
					/**не удалось запросить авторизационный токен */
					/*console.log(`[onReceiveToken] ошибка запроса авторизационного токена`);
					console.log(authToken);*/
				}
			});
			

			this.Server.post(`/`, async (req, res) => {
				const jsonData: unknown | null = req.body;

				if (jsonData != null){
					const valid = Validators.getValidateOperationInfo(jsonData);

					if (valid != null){
						this.onPayment.emit(valid);
					} else {
						console.log(`[POST] failed validation operation info`);
					}
				} else {
					console.log(`[POST] error parse JSON`);
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