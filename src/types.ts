/**Информация об операции (уведомление ЮМани) */
type NotificatonOperationInfo = {
	notification_type: NotificationType;
	bill_id: string;
	amount: string;
	datetime: string;
	codepro: string;
	sender: string;
	operation_label: string;
	operation_id: string;
	currency: string;
	label: string;
};

/**Краткая информация об операции */
type Operation = {
	group_id: string;
	operation_id: string;
	title: string;
	amount: number;
	direction: string;
	datetime: string;
	status: string;
	type: OperationType;
	amount_currency: string;
	is_sbp_operation: boolean;
};

/**Полная информация об операции */
type DetailedOperationInfo = Operation & {
	message: string;
	details: string;
};

type YooMoneyError = {
	error: string;
	error_description?: string;
};

/**=== */

const operationsTypes = [
	"deposition",
	"payment",
	"incoming-transfers-unaccepted",
	"incoming-transfer",
	"payment-shop",
	"outgoing-transfer"
] as const;

type OperationType = typeof operationsTypes[number];

/**=== */

const notificationTypes = [
	"p2p-incoming"
] as const;

type NotificationType = typeof notificationTypes[number];

/**=== */

const spendingCategories = [
	"Deposition"
] as const;

type SpendingCategories = {
	name: typeof spendingCategories[number];
	sum: number;
};



export {
	NotificatonOperationInfo,
	NotificationType,
	notificationTypes,
	Operation,
	operationsTypes,
	OperationType,
	DetailedOperationInfo,
	YooMoneyError
};