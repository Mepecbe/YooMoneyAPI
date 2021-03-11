/* eslint-disable max-len */
import { Colors } from "rg";
import { Scopes } from "../enums";
import { YooMoney } from "../index";
import { operationsTypes } from "../types";
import { config, Config } from "./config";

async function main(): Promise<void> {
	const api = new YooMoney(
		"2BE768D1A740CD033D5222F031E9E5791DDAD53CD4D05E3ABE58802FAF51CFF8", 
		" https://fe014486ec30.ngrok.io",
		4124,
		"yoomoney.ru"
	);

	{
		api.onReceiveToken.on(async (token) => {
			console.log(`[onReceiveToken] принял токен ${token}`);
			console.log(`[onReceiveToken] запрашиваю авторизационный токен...`);
	
			const authToken = await api.getAuthToken(token);
	
			if (authToken.is_success){
				console.log(`[onReceiveToken] authToken ${authToken.data}`);
			} else {
				console.log(`[onReceiveToken] error`);
				console.log(authToken);
			}
		});
	}

	// eslint-disable-next-line max-len
	api.authToken = "4100116305198344.14B285890D29C3E615A54185028C61C11FC061F2A72BC5EC98D0C9D63715C107F6A79D6FCF44365705CDBBA47232A588907851362A350F09E70F6868752C7F710E6A701725154B8AA03D0E580CA5C116FE8CB50FA39539798A69216B961E5D86060EE9B36AC534126619401B255889DC47D4F3FF02296AF99D47BBA76AEBD990";
	
	const operationsResult = await api.getOperationsHistory(10);
	let opId = "";

	if (operationsResult.is_success){
		//console.log(operationsResult.data);
		opId = operationsResult.data[0].operation_id;
	} else {
		console.log(operationsResult.error);
	}

	const detailedOperationInfo = await api.getOperationsDetails(opId);

	if (detailedOperationInfo.is_success){
		console.log(`detailed info`);
		console.log(detailedOperationInfo.data);
	} else {
		console.log(detailedOperationInfo.error);
	}

	/*
	setTimeout(async () => {
		const operations = await api.getOperationsHistory(10);

		if (operations.is_success){
			for (const op of operations.data){
				console.log(`\nЗапрос детальной информации об операции с ID ${op.operation_id}`);
				const result = await api.getOperationsDetails(op.operation_id);

				console.log(result);
				break;
			}
		} else {
			console.log(operations);
		}
	}, 2000);

	

	api.onPayment.on(async (info) => {
		console.log(`==== ON PAYMENT ====`);
		console.log(info);
	});*/

	
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
}

main();