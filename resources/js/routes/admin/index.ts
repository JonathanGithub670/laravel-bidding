import users from './users'
import auctions from './auctions'
import durations from './durations'
import categories from './categories'
import disbursements from './disbursements'
import reimbursements from './reimbursements'
import settlements from './settlements'
const admin = {
    users: Object.assign(users, users),
auctions: Object.assign(auctions, auctions),
durations: Object.assign(durations, durations),
categories: Object.assign(categories, categories),
disbursements: Object.assign(disbursements, disbursements),
reimbursements: Object.assign(reimbursements, reimbursements),
settlements: Object.assign(settlements, settlements),
}

export default admin