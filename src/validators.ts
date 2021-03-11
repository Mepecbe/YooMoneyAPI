import { 
	DetailedOperationInfo,
	NotificationType, 
	notificationTypes, 
	Operation, 
	NotificatonOperationInfo, 
	operationsTypes, 
	OperationType, 
	YooMoneyError,
	directionTypes,
	DirectionType,
	paymentStatus,
	PaymentStatus
} from "./types";

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

	static getValidateOperationInfo(data: unknown): NotificatonOperationInfo | null{
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

	static getValidatedoperationsTypes(input: unknown): OperationType | null {
		if (typeof input !== "string") {
			return null;
		}
	
		for (const val of operationsTypes) {
			if (input === val) {
				return input;
			}
		}
	
		return null;
	}

	static getValidateOperations(data: unknown): Operation[] | null{
		if (!Validators.isStruct(data)) {
			return null;
		}

		const ops: Operation[] = [];

		if (Array.isArray(data)){
			for (const rec of data){
				const valid = Validators.getValidateOperation(rec);

				if (valid){
					ops.push(rec);
				}
			}

			return ops;
		}
		
		return null;
	}

	static getValidatedDirection(input: unknown): DirectionType | null {
		if (typeof input !== "string") {
			return null;
		}
	
		for (const val of directionTypes) {
			if (input === val) {
				return input;
			}
		}
	
		return null;
	}

	static getValidatePaymentStatus(input: unknown): PaymentStatus | null {
		if (typeof input !== "string") {
			return null;
		}
	
		for (const val of paymentStatus) {
			if (input === val) {
				return input;
			}
		}
	
		return null;
	}
	
	static getValidateOperation(data: unknown): Operation | null{
		if (!Validators.isStruct(data)) {
			return null;
		}

		if (typeof(data.group_id) !== "string"){
			return null;
		}	

		if (typeof(data.operation_id) !== "string"){
			return null;
		}	

		if (typeof(data.title) !== "string"){
			return null;
		}		
	
		if (typeof(data.amount) !== "number"){
			return null;
		}
	
		if (typeof(data.direction) !== "string"){
			return null;
		}
	
		if (typeof(data.datetime) !== "string"){
			return null;
		}
	
		if (typeof(data.status) !== "string"){
			return null;
		}

		if (Validators.getValidatedoperationsTypes(data.type) == null){
			return null;
		}

		if (Validators.getValidatedDirection(data.direction) == null){
			return null;
		}
	
		if (typeof(data.amount_currency) !== "string"){
			return null;
		}
	
		if (typeof(data.is_sbp_operation) !== "boolean"){
			return null;
		}

		if (Validators.getValidatePaymentStatus(data.status) == null){
			return null;
		}

		return {
			group_id: data.group_id,
			operation_id: data.operation_id,
			title: data.title,
			amount: data.amount,
			direction: data.direction as DirectionType,
			datetime: data.datetime,
			status: data.status as PaymentStatus,
			type: data.type as OperationType,
			amount_currency: data.amount_currency,
			is_sbp_operation: data.is_sbp_operation,
		};
	}

	static getValidateDetailedOperationInfo(data: unknown): DetailedOperationInfo | null{
		if (!Validators.isStruct(data)) {
			return null;
		}

		if (typeof(data.group_id) !== "string"){
			return null;
		}	

		if (typeof(data.operation_id) !== "string"){
			return null;
		}	

		if (typeof(data.title) !== "string"){
			return null;
		}		
	
		if (typeof(data.amount) !== "number"){
			return null;
		}
	
		if (typeof(data.direction) !== "string"){
			return null;
		}
	
		if (typeof(data.datetime) !== "string"){
			return null;
		}
	
		if (typeof(data.status) !== "string"){
			return null;
		}

		if (Validators.getValidatedoperationsTypes(data.type) == null){
			return null;
		}
		
		if (Validators.getValidatedDirection(data.direction) == null){
			return null;
		}
	
		if (typeof(data.amount_currency) !== "string"){
			return null;
		}
	
		if (typeof(data.is_sbp_operation) !== "boolean"){
			return null;
		}
		
		if (typeof(data.message) !== "string"){
			return null;
		}
	
		if (typeof(data.details) !== "string"){
			return null;
		}

		if (typeof(data.sender) !== "string"){
			return null;
		}

		if (typeof(data.codepro) !== "boolean"){
			return null;
		}

		if (Validators.getValidatePaymentStatus(data.status) == null){
			return null;
		}

		return {
			group_id: data.group_id,
			operation_id: data.operation_id,
			title: data.title,
			amount: data.amount,
			direction: data.direction as DirectionType,
			datetime: data.datetime,
			status: data.status as PaymentStatus,
			type: data.type as OperationType,
			amount_currency: data.amount_currency,
			is_sbp_operation: data.is_sbp_operation,
			message: data.message,
			details: data.details,
			sender: data.sender,
			codepro: data.codepro
		};
	}

	static getValidatedAuthToken(data: unknown): string | null{
		if (!Validators.isStruct(data)) {
			return null;
		}

		if (typeof(data.access_token) !== "string"){
			return null;
		}

		return data.access_token;
	}

	static getValidateError(data: unknown): YooMoneyError | null{
		if (!Validators.isStruct(data)) {
			return null;
		}

		if (typeof(data.error) !== "string"){
			return null;
		}

		if (
			typeof(data.error_description) !== "string"
			&& typeof(data.error_description) !== "undefined"
		){
			return null;
		}

		return {
			error: data.error,
			error_description: data.error_description
		};
	}
}

export {
	Validators
};