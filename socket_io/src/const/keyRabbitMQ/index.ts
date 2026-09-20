import { isProduct } from '@src/const/api/baseUrl';

export const customerSend_sendToMember = isProduct ? 'customerSend_sendToMember' : 'customerSend_sendToMember_dev';

export const memberSend_sendToCustomer = isProduct ? 'memberSend_sendToCustomer' : 'memberSend_sendToCustomer_dev';
