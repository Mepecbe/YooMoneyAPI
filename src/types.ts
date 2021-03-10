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

/*
				notification_type: 'p2p-incoming',
				bill_id: '',
				amount: '679.51',
				datetime: '2021-03-10T09:20:17Z',
				codepro: 'false',
				sender: '41001000040',
				sha1_hash: 'f767de77b591e41e8ecc294cd705cc04e88c7e5f',
				test_notification: 'true',
				operation_label: '',
				operation_id: 'test-notification',
				currency: '643',
				label: ''

				notification_type: 'p2p-incoming',
				bill_id: '',
				amount: '1.00',
				codepro: 'false',
				withdraw_amount: '1.00',
				unaccepted: 'false',
				label: '',
				datetime: '2021-03-10T10:40:40Z',
				sender: '410015583870791',
				sha1_hash: 'fb364e59afe30788951722671e8e5767568372fd',
				operation_label: '27dab5e6-0011-5000-8000-17535c57ea82',
				operation_id: '668688040044003204',
				currency: '643'
			*/

export {
	OperationInfo,
	NotificationType,
	notificationTypes
};