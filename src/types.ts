type OperationInfo = {
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

type DetailedOperationInfo = Operation & {
	message: string;
	details: string;
};

const operationsTypes = [
	"deposition",
	"payment",
	"incoming-transfers-unaccepted",
	"incoming-transfer",
	"payment-shop",
	"outgoing-transfer"
] as const;

type OperationType = typeof operationsTypes[number];


const notificationTypes = [
	"p2p-incoming"
] as const;

type NotificationType = typeof notificationTypes[number];

export {
	OperationInfo,
	NotificationType,
	notificationTypes,
	Operation,
	operationsTypes,
	OperationType,
	DetailedOperationInfo
};