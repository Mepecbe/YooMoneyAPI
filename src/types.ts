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
	currency: CurrencyType;
	label: string;
};

/**Краткая информация об операции */
type Operation = {
	/**Шаблон операции ВЫВОДА
	 * при оплате на сервисе антиплагиата он равен 42508
	 * при переводе между кошельками яндекса он равен p2p
	 */
	pattern_id?: string;
	group_id: string;
	operation_id: string;
	title: string;
	amount: number;
	direction: DirectionType;
	datetime: string;
	status: PaymentStatus;
	type: OperationType;
	spendingCategories: SpendingCategories[];
	amount_currency: CurrencyType;
	is_sbp_operation: boolean;
};

/**Полная информация об операции */
type DetailedOperationInfo = Operation & {
	message?: string;
	details?: string;
	sender?: string;
	codepro?: boolean;
};

type YooMoneyError = {
	error: string;
	error_description?: string;
};

type LinkedCard = {
	pan_fragment: string;
	type: string;
};

type BalanceDetails = {
	total: number;
	available: number;
	deposition_pending?: number;
	blocked?: number;
	debt?: number;
	hold?: number;
};

type AccountInfo = {
	account: string;
	balance: number;
	currency: string;
	account_type: AccountType;
	identified: boolean;
	account_status: AccountState;
	balance_details?: BalanceDetails;
	cards_linked?: LinkedCard[];
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

const accountStates = [
	"anonymous",
	"named",
	"identified"
] as const;

type AccountState = typeof accountStates[number];

/**=== */

const accountTypes = [
	"personal",
	"professional"
] as const;

type AccountType= typeof accountTypes[number];

/**=== */

const notificationTypes = [
	"p2p-incoming"
] as const;

type NotificationType = typeof notificationTypes[number];

/**=== */

const spendingCategories = [
	"Deposition",
	"TransferWithdraw",
	"Digital"
] as const;

type SpendingCategories = {
	name: typeof spendingCategories[number];
	sum: number;
};

/**=== */

const directionTypes = [
	"in",
	"out"
] as const;

type DirectionType = typeof directionTypes[number];


/**=== */

const currencies = [
	"USD",
	"RUB",
	"EUR"
] as const;

type CurrencyType = typeof currencies[number];

/**=== */

const paymentStatus = [
	"success",
	"refused",
	"in_progress"
] as const;

type PaymentStatus = typeof paymentStatus[number];

/**=== */


export {
	NotificatonOperationInfo,

	NotificationType,
	notificationTypes,

	Operation,

	operationsTypes,
	OperationType,

	DetailedOperationInfo,
	YooMoneyError,

	AccountInfo,
	BalanceDetails,
	LinkedCard,

	directionTypes,
	DirectionType,

	paymentStatus,
	PaymentStatus,

	currencies,
	CurrencyType,

	SpendingCategories,

	accountStates,
	accountTypes,
	AccountState,
	AccountType
};