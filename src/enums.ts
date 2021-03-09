/**НЕЛЬЗЯ ОДНОВРЕМЕННО ИСПОЛЬЗОВАТЬ 
 * право payment-p2p и права payment.to-account
 * ИЛИ
 * право payment-shop и права payment.to-pattern
*/
enum Scopes{
	AccountInfo = "account-info",
	OperationsHistory = "operation-history",
	OperationsDetails = "operation-details",
	IncomingTransfers = "incoming-transfers",
	Payment = "payment",
	PaymentShop = "payment-shop",
	PaymentP2P = "payment-p2p",
	MoneySource = "money-source"
}



export {
	Scopes
};