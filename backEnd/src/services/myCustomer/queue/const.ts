import { isProduct } from '@src/const/api/baseUrl';

export const customerSend_sendToMember_storeDB = isProduct
    ? 'customerSend_sendToMember_storeDB'
    : 'customerSend_sendToMember_storeDB_dev';

export const customerSend_sendToMember_storeDB_feedback = isProduct
    ? 'customerSend_sendToMember_storeDB_feedback'
    : 'customerSend_sendToMember_storeDB_feedback_dev';

export const customerSend_sendToMember = isProduct ? 'customerSend_sendToMember' : 'customerSend_sendToMember_dev';
