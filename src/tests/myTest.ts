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

	api.onPayment.on(async (info) => {
		console.log(`==== ON PAYMENT ====\n`, info);

		const fullOpInfo = await api.getOperationDetails(info.operation_id);
		
		if (fullOpInfo.is_success){
			console.log(`==== FULL INFO ====\n`, fullOpInfo);
		} else {
			console.error(`Error get full operation info`);
		}
	});
	
	{
		api.run();
		
		const url = await api.getAuthUrl(
			[Scopes.AccountInfo, Scopes.OperationsDetails, Scopes.OperationsHistory, Scopes.IncomingTransfers]
		);

		if (url.is_success){
			console.log(`AUTH URL `, url.data);
		} else {
			console.log(`error get auth url\n`, url.error.message);
		}
	}
}

main();