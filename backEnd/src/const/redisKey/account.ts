import dotenv from 'dotenv';

dotenv.config();

const isProduct = process.env.NODE_ENV === 'production';

export const prefix_cache_account = {
    key: {
        with_id: isProduct ? 'prefix_cache_account_with_id' : 'prefix_cache_account_with_id_dev',
    },
    time: 60 * 5, // 5p
};

export const prefix_cache_accountInformation = {
    key: {
        with_accountId: isProduct
            ? 'prefix_cache_accountInformation_with_accountId'
            : 'prefix_cache_accountInformation_with_accountId_dev',
    },
    time: 60 * 5, // 5p
};

export const prefix_cache_replyAccounts = {
    key: {
        with_chatRoomId: isProduct
            ? 'prefix_cache_replyAccount_with_chatRoomId'
            : 'prefix_cache_replyAccount_with_chatRoomId_dev',
        body_with_chatRoomId: isProduct
            ? 'prefix_cache_replyAccount_body_with_chatRoomId'
            : 'prefix_cache_replyAccount_body_with_chatRoomId_dev',
        maxPage_with_chatRoomId: isProduct
            ? 'prefix_cache_replyAccount_maxPage_with_chatRoomId'
            : 'prefix_cache_replyAccount_maxPage_with_chatRoomId_dev',
    },
    time: 60 * 5, // 5p
};

export const prefix_cache_notReplyAccounts = {
    key: {
        with_chatRoomId: isProduct
            ? 'prefix_cache_notReplyAccount_with_chatRoomId'
            : 'prefix_cache_notReplyAccount_with_chatRoomId_dev',
        body_with_chatRoomId: isProduct
            ? 'prefix_cache_notReplyAccount_body_with_chatRoomId'
            : 'prefix_cache_notReplyAccount_body_with_chatRoomId_dev',
        maxPage_with_chatRoomId: isProduct
            ? 'prefix_cache_notReplyAccount_maxPage_with_chatRoomId'
            : 'prefix_cache_notReplyAccount_maxPage_with_chatRoomId_dev',
    },
    time: 60 * 5, // 5p
};

export const prefix_cache_accountReceiveMessage = {
    key: {
        with_accountId: isProduct
            ? 'prefix_cache_accountReceiveMessage_with_accountId'
            : 'prefix_cache_accountReceiveMessage_with_accountId_dev',
    },
    time: 60 * 5, // 5p
};
