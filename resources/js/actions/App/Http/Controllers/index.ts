import OtpController from './OtpController'
import HomeController from './HomeController'
import ChatController from './ChatController'
import MyAuctionController from './MyAuctionController'
import SellerSettlementController from './SellerSettlementController'
import Admin from './Admin'
import BankAccountController from './BankAccountController'
import DisbursementController from './DisbursementController'
import TopupController from './TopupController'
import TransactionController from './TransactionController'
import UserInvoiceController from './UserInvoiceController'
import UserReimbursementController from './UserReimbursementController'
import NotificationController from './NotificationController'
import AuctionListController from './AuctionListController'
import AuctionController from './AuctionController'
import AuctionActivityController from './AuctionActivityController'
import Settings from './Settings'
const Controllers = {
    OtpController: Object.assign(OtpController, OtpController),
HomeController: Object.assign(HomeController, HomeController),
ChatController: Object.assign(ChatController, ChatController),
MyAuctionController: Object.assign(MyAuctionController, MyAuctionController),
SellerSettlementController: Object.assign(SellerSettlementController, SellerSettlementController),
Admin: Object.assign(Admin, Admin),
BankAccountController: Object.assign(BankAccountController, BankAccountController),
DisbursementController: Object.assign(DisbursementController, DisbursementController),
TopupController: Object.assign(TopupController, TopupController),
TransactionController: Object.assign(TransactionController, TransactionController),
UserInvoiceController: Object.assign(UserInvoiceController, UserInvoiceController),
UserReimbursementController: Object.assign(UserReimbursementController, UserReimbursementController),
NotificationController: Object.assign(NotificationController, NotificationController),
AuctionListController: Object.assign(AuctionListController, AuctionListController),
AuctionController: Object.assign(AuctionController, AuctionController),
AuctionActivityController: Object.assign(AuctionActivityController, AuctionActivityController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers