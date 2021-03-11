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

	// eslint-disable-next-line max-len
	api.authToken = "4100116305198344.BA12C0625B2F21B23DFE521F11A105B04FC45C3B33A7039EB0673E957E7BCFCE0C87F5D726D12C86A3706D861F0C19192216F8B7CE9845547F50B82916A9E5DA9F98D3883D3A0D9AB02E89ADE320BDBC690D037E42B9E60CBF3E13E63FAFA20F53F98957D6D2913381DEA00910DE3124EAFCC9FCF1D87249462B6ACC74B67160";
	
	/*
			setTimeout(() => {
				api.getOperationsHistory(10);
			}, 5000);*/

	setTimeout(async () => {
		console.log(await api.getOperationsHistory(10));
		console.log(`\n\n`);
		//await api.getOperationsDetails("668719270537039642");
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