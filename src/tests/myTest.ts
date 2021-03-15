/* eslint-disable max-len */
import { Colors, timeout } from "rg";
import { ChangeTrackingMethod, Scopes } from "../enums";
import { YooMoney } from "../index";
import { operationsTypes } from "../types";
import { config, Config } from "./config";

async function main(): Promise<void> {
	const api = new YooMoney(
		config.yoomoney.Key,
		config.yoomoney.CallbackUrl,
		4124,
		ChangeTrackingMethod.Poll
	);

	api.authToken = config.yoomoney.AuthToken;

	api.onReceiveToken.on(async (token) => {
		console.log(`[onReceiveToken] принял токен ${token}`);
		console.log(`[onReceiveToken] запрашиваю авторизационный токен...`);
	
		const authToken = await api.getAuthToken(token);
	
		if (authToken.is_success){
			console.log(`[onReceiveToken] получил авторизационный токен ${authToken.data}`);
		} else {
			console.log(`[onReceiveToken] ошибка запроса авторизационного токена`);
			console.log(authToken);
		}
	});

	api.onPayment.on(async (info) => {
		console.log(`==== ON PAYMENT ====`);
		console.log(info);
	});

	
	{
		api.run();
		
		const url = await api.getAuthUrl(
			[Scopes.AccountInfo, Scopes.OperationsDetails, Scopes.OperationsHistory, Scopes.IncomingTransfers]
		);

		if (url.is_success){
			console.log(`AUTH URL ` + url.data);
		} else {
			console.log(`error get auth url`);
			console.log(url.error.message);
		}
	}

	console.log("===============");
	console.log("==   ARMED   ==");
	console.log("===============");

	/*
	const accInfo = await api.getAccountInfo();

	if (accInfo.is_success){
		console.log(accInfo.data);
	} else {
		console.log(`Ошибка запроса информации об аккаунте`);
		console.log(accInfo.error);
	}

	await timeout(5000);

	{
		const getOpResult = await api.getOperationsHistory(1);

		if (getOpResult.is_success){
			for (const op of getOpResult.data){
				console.log();
				console.log(op);
			}
			
			console.log();
			console.log();
			console.log(`Запрос детализации по операции ${getOpResult.data[0].operation_id}`);
			console.log();

			const opDetails = await api.getOperationDetails(getOpResult.data[0].operation_id);

			if (opDetails.is_success) {
				console.log(opDetails.data);
			} else {
				console.log(`Ошибка запроса детализированной информации по операции`);
				console.log(opDetails.error);
			}
		} else {
			console.log(`Ошибка запроса истории по операциям`);
		}
	}*/
}

main();