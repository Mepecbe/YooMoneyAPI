/* eslint-disable max-len */
import { Colors } from "rg";
import { Scopes } from "../enums";
import { YooMoney } from "../index";
import { config, Config } from "./config";

async function main(): Promise<void> {
	const api = new YooMoney(
		"2BE768D1A740CD033D5222F031E9E5791DDAD53CD4D05E3ABE58802FAF51CFF8", 
		" https://fe014486ec30.ngrok.io",
		4124,
		"yoomoney.ru"
	);

	// eslint-disable-next-line max-len
	api.authToken = "4100116305198344.D628A5CE204674923B3D09DF22AA5077327548204ABBB71662DEA3CEB89D40CD62D0AC56FFEB4D94EF539695AE9FA4975F58EC4F91E50DA40E2010975ED62A7EB256FA5C8E293B40FC45270E94F686E08296B63740011BD6FACBE7663B3B5917669DA83D10778620BA1A4B0695DB80EA53E277793BF7CEA0B034C8FD42C82DEC";
	
	/*
	setTimeout(() => {
		api.getOperationsHistory(10);
	}, 5000);*/

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

	api.onPayment.on(async (info) => {
		console.log(`==== ON PAYMENT ====`);
		console.log(info);
	});

	{
		api.run();
		const url = await api.auth(
			[Scopes.AccountInfo, Scopes.OperationsDetails, Scopes.OperationsHistory, Scopes.IncomingTransfers]
		);

		if (url.is_success){
			console.log(`AUTH URL ` + url.data);
		}
	}

	console.log("===============");
	console.log("==   ARMED   ==");
	console.log("===============");
}

main();