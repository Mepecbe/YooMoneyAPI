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

const notificationTypes = [
	"p2p-incoming"
] as const;

type NotificationType = typeof notificationTypes[number];

export {
	OperationInfo,
	NotificationType,
	notificationTypes
};