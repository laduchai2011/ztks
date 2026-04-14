import dotenv from 'dotenv';

dotenv.config();

const isProduct = process.env.NODE_ENV === 'production';

export const prefix_cache_chatRoom_with_id = isProduct
    ? 'prefix_cache_chatRoom_with_id'
    : 'prefix_cache_chatRoom_with_id_dev';

export const prefix_cache_chatRoom = {
    key: {
        with_id: isProduct ? 'prefix_cache_chatRoom_with_id' : 'prefix_cache_chatRoom_with_id_dev',
    },
    time: 60 * 5, // 5p
};

export const prefix_cache_chatRoomRole = {
    key: {
        with_crid_Aaid: isProduct
            ? 'prefix_cache_chatRoomRole_with_crid_Aaid'
            : 'prefix_cache_chatRoomRole_with_crid_Aaid_dev',
        get_all_with_chatRoom_id: isProduct
            ? 'prefix_cache_chatRoomRole_with_chatRoom_id'
            : 'prefix_cache_chatRoomRole_with_chatRoom_id_dev',
    },
    time: 60 * 5, // 5p
};
