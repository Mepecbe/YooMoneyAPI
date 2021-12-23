import { readFileSync } from "fs";
import { getMergedObjects } from "rg";

type YooMoney = {
	readonly Key: string;
	readonly CallbackUrl: string;
	readonly AuthToken: string;
};

export type Config = {
	readonly is_production: boolean;
	readonly yoomoney: YooMoney;
};

const defaultConfigString = readFileSync("./config.default.json", "utf-8");
const defaultConfig = <Config> JSON.parse(defaultConfigString);

let configString = "{}";

try {
	configString = readFileSync("./config.json", "utf-8");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
} catch (err: any) {
	if (err.code !== "ENOENT") {
		console.error(err);
		process.exit(1);
	}
}

export const config: Config = getMergedObjects<Config>(
	defaultConfig,
	JSON.parse(configString)
);

type Package = {
	name: string;
	version: string;
};

const packageString = readFileSync("./package.json", "utf-8");
export const packageDescription = <Package> JSON.parse(packageString);
