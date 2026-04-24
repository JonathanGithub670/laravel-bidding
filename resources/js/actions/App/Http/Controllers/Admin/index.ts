import UserVerificationController from './UserVerificationController'
import AdminUserController from './AdminUserController'
import AuctionApprovalController from './AuctionApprovalController'
import AuctionDurationController from './AuctionDurationController'
import CategoryController from './CategoryController'
import DisbursementController from './DisbursementController'
import ReimbursementController from './ReimbursementController'
import AuctionSettlementController from './AuctionSettlementController'
const Admin = {
    UserVerificationController: Object.assign(UserVerificationController, UserVerificationController),
AdminUserController: Object.assign(AdminUserController, AdminUserController),
AuctionApprovalController: Object.assign(AuctionApprovalController, AuctionApprovalController),
AuctionDurationController: Object.assign(AuctionDurationController, AuctionDurationController),
CategoryController: Object.assign(CategoryController, CategoryController),
DisbursementController: Object.assign(DisbursementController, DisbursementController),
ReimbursementController: Object.assign(ReimbursementController, ReimbursementController),
AuctionSettlementController: Object.assign(AuctionSettlementController, AuctionSettlementController),
}

export default Admin