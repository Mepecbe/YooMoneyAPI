import { Colors } from "rg";
import { YooMoney } from "../index";
import { config, Config } from "./config";

async function main(): Promise<void> {
	const api = new YooMoney(
		"2BE768D1A740CD033D5222F031E9E5791DDAD53CD4D05E3ABE58802FAF51CFF8", 
		" https://fe014486ec30.ngrok.io",
		4124,
		"yoomoney.ru"
	);

	api.onReceiveToken.on(async (token) => {
		console.log(`[onReceiveToken] ${token}`);

		console.log(`[onReceiveToken] getAuthToken...`);

		const authToken = await api.getAuthToken(token);

		if (authToken.is_success){
			console.log(`[onReceiveToken] authToken ${authToken.data}`);
		} else {
			console.log(`[onReceiveToken] error`);
			console.log(authToken);
		}
	});

	{
		api.run();
		const url = await api.auth();

		if (url.is_success){
			console.log(`AUTH URL ` + url.data);
		}
	}

	console.log("===============");
	console.log("==   ARMED   ==");
	console.log("===============");
}

main();