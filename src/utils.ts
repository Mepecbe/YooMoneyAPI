export class ApiUtils{
	public static isStruct(data: unknown): data is Record<string, unknown> {
		if (typeof data !== "object" || data == null) {
			return false;
		}
		
		return true;
	}

	public static getUnknownArray(data: unknown): unknown[] | null {
		if (!Array.isArray(data)) {
			return null;
		}

		return data as unknown[];
	}

	public static validateResponseCreateKey(data: unknown): string | null{
		if (!ApiUtils.isStruct(data)) {
			return null;
		}

		if (typeof(data.access_token) !== "string") {
			return null;
		}
		
		return data.access_token;
	}

	public static validateChatexCreateInvoiceResponse(data: unknown): null{
		if (!ApiUtils.isStruct(data)) {
			return null;
		}
	
		if (typeof(data.amount) !== "string") {
			return null;
		}
	
		if (typeof(data.callback_url) !== "string") {
			return null;
		}
		
		if (typeof(data.coin) !== "string") {
			return null;
		}
		
		if (typeof(data.country_code) !== "string") {
			return null;
		}
		
		if (typeof(data.created_at) !== "string") {
			return null;
		}
		
		if (typeof(data.fiat) !== "string") {
			return null;
		}
		
		if (typeof(data.id) !== "string") {
			return null;
		}
		
		if (typeof(data.lang_id) !== "string") {
			return null;
		}
		
		if (typeof(data.payment_system_id) !== "number") {
			return null;
		}

		if (typeof(data.payment_url) !== "string") {
			return null;
		}

		if (typeof(data.redirect_url) !== "string") {
			return null;
		}
		
		if (typeof(data.status) !== "string") {
			return null;
		}

		if (typeof(data.callback_url) !== "string"){
			return null;
		}

		return null;
	}
}