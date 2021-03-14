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
	PaymentStatus,
	CurrencyType,
	currencies,
	SpendingCategories,
	accountStates,
	accountTypes,
	AccountInfo,
	AccountState,
	AccountType,
	BalanceDetails,
	LinkedCard
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

	static getValidatedCurrency(input: unknown): CurrencyType | null {
		if (typeof input !== "string") {
			return null;
		}
	
		for (const val of currencies) {
			if (input === val) {
				return input;
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

		if (!this.getValidatedCurrency(data.amount_currency)){
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
			currency: data.amount_currency as CurrencyType,
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

	static getValidatedSpendingCategories(data: unknown): SpendingCategories[] | null {
		if (Array.isArray(data)) {
			const categories: SpendingCategories[] = [];

			for (const val of data){
				if (typeof(val.name) !== "string"){
					continue;
				}

				if (typeof(val.sum) !== "number"){
					continue;
				}
				
				categories.push({
					name: val.name,
					sum: val.sum
				});
			}

			return categories;
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

		if (!this.getValidatedCurrency(data.amount_currency)){
			return null;
		}

		if (Validators.getValidatePaymentStatus(data.status) == null){
			return null;
		}

		const categories = this.getValidatedSpendingCategories(data.spendingCategories);

		if (!categories){
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
			amount_currency: data.amount_currency as CurrencyType,
			is_sbp_operation: data.is_sbp_operation,
			spendingCategories: categories
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

		if (typeof(data.is_sbp_operation) !== "boolean"){
			return null;
		}

		if (typeof(data.message) !== "string" && typeof(data.message) !== "undefined"){
			return null;
		}	

		if (typeof(data.details) !== "string" && typeof(data.details) !== "undefined"){
			return null;
		}

		if (typeof(data.sender) !== "string" && typeof(data.sender) !== "undefined"){
			return null;
		}

		if (typeof(data.codepro) !== "boolean" && typeof(data.codepro) !== "undefined"){
			return null;
		}

		if (!Validators.getValidatePaymentStatus(data.status)){
			return null;
		}

		if (!Validators.getValidatedCurrency(data.amount_currency)){
			return null;
		}

		const categories = this.getValidatedSpendingCategories(data.spendingCategories);

		if (!categories){
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
			amount_currency: data.amount_currency as CurrencyType,
			is_sbp_operation: data.is_sbp_operation,
			message: data.message,
			details: data.details,
			sender: data.sender,
			codepro: data.codepro,
			spendingCategories: categories
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

	static getValidatedOperationsTypes(input: unknown): OperationType | null {
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

	static getValidateBalanceDetails(data: unknown): BalanceDetails | null{
		if (!Validators.isStruct(data)) {
			return null;
		}
	
		if (typeof(data.total) !== "number"){
			return null;
		}
	
		if (typeof(data.available) !== "number"){
			return null;
		}
	
		if (typeof(data.deposition_pending) !== "number" 
			&& typeof(data.deposition_pending) !== "undefined"){
			return null;
		}
	
		if (typeof(data.blocked) !== "number"  && typeof(data.blocked) !== "undefined"){
			return null;
		}
	
		if (typeof(data.debt) !== "number"  && typeof(data.debt) !== "undefined"){
			return null;
		}
	
		if (typeof(data.hold) !== "number"  && typeof(data.hold) !== "undefined"){
			return null;
		}
	
		return {
			total: data.total,
			available: data.available,
			deposition_pending: data.deposition_pending,
			blocked: data.blocked,
			debt: data.debt,
			hold: data.hold,
		};
	}

	static getValidatedAccountStates(input: unknown): AccountState | null {
		if (typeof input !== "string") {
			return null;
		}
	
		for (const val of accountStates) {
			if (input === val) {
				return input;
			}
		}
		
		return null;
	}

	static getValidatedAccountTypes(input: unknown): AccountType | null {
		if (typeof input !== "string") {
			return null;
		}
	
		for (const val of accountTypes) {
			if (input === val) {
				return input;
			}
		}
		
		return null;
	}
	
	static getValidateLinkedCard(data: unknown): LinkedCard | null{
		if (!Validators.isStruct(data)) {
			return null;
		}
	
		if (typeof(data.pan_fragment) !== "string"){
			return null;
		}
	
		if (typeof(data.type) !== "string"){
			return null;
		}
	
		return {
			pan_fragment: data.pan_fragment,
			type: data.type,
		};
	}

	static getValidateAccountInfo(data: unknown): AccountInfo | null{
		if (!Validators.isStruct(data)) {
			return null;
		}
	
		if (typeof(data.account) !== "string"){
			return null;
		}
	
		if (typeof(data.balance) !== "number"){
			return null;
		}

		if (typeof(data.currency) !== "string"){
			return null;
		}


		if (typeof(data.identified) !== "boolean"){
			return null;
		}
	
		const accountState = Validators.getValidatedAccountStates(data.account_status);

		if (!accountState){
			return null;
		}

		const accountType = Validators.getValidatedAccountTypes(data.account_type);

		if (!accountType){
			return null;
		}

		const balanceDetails = 
			typeof(data.balance_details) !== "undefined"
				? Validators.getValidateBalanceDetails(data.balance_details)
				: undefined;
	
		console.log(`metka`);

		if (balanceDetails == null){
			console.log(`metka1`);
			return null;
		}

		let linkedCards: LinkedCard[] | undefined = undefined;

		if (typeof(data.cards_linked) !== "undefined"){
			linkedCards = [];

			if (Array.isArray(data.cards_linked)){
				for (const r of data.cards_linked){
					if (typeof(r.pan_fragment) !== "string"){
						continue;
					}
				
					if (typeof(r.type) !== "string"){
						continue;
					}

					linkedCards.push({
						pan_fragment: r.pan_fragment,
						type: r.type
					});
				}
			}
		}
	
		return {
			account: data.account,
			balance: data.balance,
			currency: data.currency,
			identified: data.identified,
			account_status: accountState,
			account_type: accountType,
			balance_details: balanceDetails,
			cards_linked: linkedCards
		};
	}
}

export {
	Validators
};