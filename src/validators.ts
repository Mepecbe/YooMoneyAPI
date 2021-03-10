import { NotificationType, notificationTypes, OperationInfo } from "./types";

class Validators{
	public static isStruct(data: unknown): data is Record<string, unknown> {
		if (typeof data !== "object" || data == null) {
			return false;
		}
		
		return true;
	}

	static getValidatednotificationTypes(input: unknown): typeof notificationTypes | null {
		if (typeof input !== "string") {
			return null;
		}
	
		for (const val of notificationTypes) {
			if (input === val) {
				return [input];
			}	
		}

		return null;
	}

	static getValidateOperationInfo(data: unknown): OperationInfo | null{
		if (!Validators.isStruct(data)) {
			return null;
		}
	
		if (Validators.getValidatednotificationTypes(data.notification_type) == null){
			return null;
		}
	
		if (typeof(data.bill_id) !== "string"){
			return null;
		}
	
		if (typeof(data.amount) !== "string"){
			return null;
		}
	
		if (typeof(data.datetime) !== "string"){
			return null;
		}

	
		if (typeof(data.codepro) !== "string"){
			return null;
		}
	
		if (typeof(data.sender) !== "string"){
			return null;
		}
	
		if (typeof(data.operation_label) !== "string"){
			return null;
		}
	
		if (typeof(data.operation_id) !== "string"){
			return null;
		}
	
		if (typeof(data.currency) !== "string"){
			return null;
		}
	
		if (typeof(data.label) !== "string"){
			return null;
		}
	
		return {
			notification_type: data.notification_type as NotificationType,
			bill_id: data.bill_id,
			amount: data.amount,
			datetime: data.datetime,
			codepro: data.codepro,
			sender: data.sender,
			operation_label: data.operation_label,
			operation_id: data.operation_id,
			currency: data.currency,
			label: data.label,
		};
	}
}

export {
	Validators
};