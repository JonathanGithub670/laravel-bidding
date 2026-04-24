import Admin from './Admin';
import AuctionActivityController from './AuctionActivityController';
import AuctionController from './AuctionController';
import AuctionListController from './AuctionListController';
import BankAccountController from './BankAccountController';
import ChatController from './ChatController';
import DisbursementController from './DisbursementController';
import HomeController from './HomeController';
import MyAuctionController from './MyAuctionController';
import NotificationController from './NotificationController';
import OtpController from './OtpController';
import SellerSettlementController from './SellerSettlementController';
import Settings from './Settings';
import TopupController from './TopupController';
import TransactionController from './TransactionController';
import UserInvoiceController from './UserInvoiceController';
import UserReimbursementController from './UserReimbursementController';
const Controllers = {
    OtpController: Object.assign(OtpController, OtpController),
    HomeController: Object.assign(HomeController, HomeController),
    ChatController: Object.assign(ChatController, ChatController),
    MyAuctionController: Object.assign(
        MyAuctionController,
        MyAuctionController,
    ),
    SellerSettlementController: Object.assign(
        SellerSettlementController,
        SellerSettlementController,
    ),
    Admin: Object.assign(Admin, Admin),
    BankAccountController: Object.assign(
        BankAccountController,
        BankAccountController,
    ),
    DisbursementController: Object.assign(
        DisbursementController,
        DisbursementController,
    ),
    TopupController: Object.assign(TopupController, TopupController),
    TransactionController: Object.assign(
        TransactionController,
        TransactionController,
    ),
    UserInvoiceController: Object.assign(
        UserInvoiceController,
        UserInvoiceController,
    ),
    UserReimbursementController: Object.assign(
        UserReimbursementController,
        UserReimbursementController,
    ),
    NotificationController: Object.assign(
        NotificationController,
        NotificationController,
    ),
    AuctionListController: Object.assign(
        AuctionListController,
        AuctionListController,
    ),
    AuctionController: Object.assign(AuctionController, AuctionController),
    AuctionActivityController: Object.assign(
        AuctionActivityController,
        AuctionActivityController,
    ),
    Settings: Object.assign(Settings, Settings),
};

export default Controllers;
