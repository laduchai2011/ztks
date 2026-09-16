import dotenv from 'dotenv';

dotenv.config();

const isProduct = process.env.NODE_ENV === 'production';

export const prefix_cache__account = {
    key: {
        with_id: isProduct ? 'prefix_cache__account_with_id' : 'prefix_cache__account_with_id_dev',
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

export const prefix_cache__reply_accounts = {
    key: {
        with_chat_room_id: isProduct
            ? 'prefix_cache__reply_accounts_with_chat_room_id'
            : 'prefix_cache__reply_accounts_with_chat_room_id_dev',
        body_with_chat_room_id: isProduct
            ? 'prefix_cache__reply_accounts_body_with_chat_room_id'
            : 'prefix_cache__reply_accounts_body_with_chat_room_id_dev',
        max_page_with_chat_room_id: isProduct
            ? 'prefix_cache__reply_accounts_max_page_with_chat_room_id'
            : 'prefix_cache__reply_accounts_max_page_with_chat_room_id_dev',
    },
    time: 60 * 5, // 5p
};

export const prefix_cache__not_reply_accounts = {
    key: {
        with_chat_room_id: isProduct
            ? 'prefix_cache__not_reply_accounts_with_chat_room_id'
            : 'prefix_cache__not_reply_account_with_chat_room_id_dev',
        body_with_chat_room_id: isProduct
            ? 'prefix_cache__not_reply_account_body_with_chat_room_id'
            : 'prefix_cache__not_reply_account_body_with_chat_room_id_dev',
        max_page_with_chat_room_id: isProduct
            ? 'prefix_cache__not_reply_account_max_page_with_chat_room_id'
            : 'prefix_cache__not_reply_account_max_page_with_chat_room_id_dev',
    },
    time: 60 * 5, // 5p
};

export const prefix_cache__account_receive_message = {
    key: {
        with_account_id: isProduct
            ? 'prefix_cache__account_receive_message_with_account_id'
            : 'prefix_cache__account_receive_message_with_account_id_dev',
    },
    time: 60 * 5, // 5p
};
