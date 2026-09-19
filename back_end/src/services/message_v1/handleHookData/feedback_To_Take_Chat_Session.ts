import { send_Message_To_User } from '../send_Message_To_User';
import { Zalo_App_Field, Zalo_Oa_Field } from '@src/data_struct/zalo';
import { Hook_Data_Field, Message_Text_Field } from '@src/data_struct/zalo/hook_data';
import { Chat_Session_Field } from '@src/data_struct/chat_session';
import { Wait_Session_Field } from '../type';
import ServiceRedis from '@src/cache/cacheRedis';
import { Zalo_Event_Name_Enum } from '@src/data_struct/zalo/hook_data/common';
import { User_Take_Session_To_Chat_Body_Field } from '@src/data_struct/chat_session/body';
import QueryDB_User_Take_Session_To_Chat from './queryDB/User_Take_Session_To_Chat';
import { my_log } from '@src/log';
import { prefix_cache__zalo_message_wait_session_with_zalo_oa_id_user_id_by_app } from '@src/const/redisKey';

// mssql_server.init();

const serviceRedis = ServiceRedis.getInstance();
serviceRedis.init();

const time_expireat = 60 * 2; // 1p

export async function feedback_To_Take_Chat_Session(
    zalo_app: Zalo_App_Field,
    zalo_oa: Zalo_Oa_Field,
    hook_data: Hook_Data_Field
): Promise<Wait_Session_Field | undefined> {
    const cache_msg_wait_session_key = `${prefix_cache__zalo_message_wait_session_with_zalo_oa_id_user_id_by_app}_${zalo_oa.id}_${hook_data.user_id_by_app}`;
    const event_name = hook_data.event_name;
    const is_user_send = event_name.startsWith('user_send');
    // const isOaSend = eventName.startsWith('oa_send');
    // console.log(hookData);

    const wait_session = await serviceRedis.getData<Wait_Session_Field>(cache_msg_wait_session_key);

    if (wait_session) {
        if (!wait_session.final) {
            let is_session: boolean = false;
            let is_session_code: boolean = false;
            let chat_session: Chat_Session_Field | undefined = undefined;
            if (is_user_send) {
                // check session
                if (hook_data.event_name === Zalo_Event_Name_Enum.user_send_text) {
                    const hook_data_text = hook_data as Hook_Data_Field<Message_Text_Field>;
                    const sesion_input = hook_data_text.message.text.trim();
                    chat_session = await get_Chat_Session(sesion_input, zalo_oa);

                    if (chat_session) {
                        is_session_code = true;
                    }
                }

                if (!is_session_code) {
                    is_session = false;
                } else {
                    is_session = true;
                }
            }
            const old_hook_datas = [...wait_session.hook_datas];
            const new_hook_datas: Hook_Data_Field[] = [...old_hook_datas, hook_data];
            let current_final = false;
            const current_index = wait_session.index + 1;
            if (wait_session.index === wait_session.max_index || is_session_code) {
                current_final = true;
            }
            const new_wait_session: Wait_Session_Field = {
                hook_datas: new_hook_datas,
                is_session: is_session,
                index: current_index,
                max_index: wait_session.max_index,
                final: current_final,
                chat_session: chat_session,
            };
            const is_set = await serviceRedis.setData<Wait_Session_Field>(
                cache_msg_wait_session_key,
                new_wait_session,
                time_expireat
            );
            if (!is_set) {
                console.error('Failed to set zaloApp in cookie in Redis (feedbackToTakeSessionCode)');
                serviceRedis.deleteData(cache_msg_wait_session_key);
                send_Message_To_User(zalo_app, zalo_oa, {
                    recipient: { user_id: hook_data.sender.id },
                    message: { text: 'Đã có lỗi xả ra, vui lòng thực hiện lại !' },
                });
            }

            if (is_user_send) {
                if (!current_final) {
                    send_Message_To_User(zalo_app, zalo_oa, {
                        recipient: { user_id: hook_data.sender.id },
                        message: { text: 'Phiên này không tồn tại, vui lòng nhập lại !' },
                    });
                } else {
                    if (!is_session_code) {
                        send_Message_To_User(zalo_app, zalo_oa, {
                            recipient: { user_id: hook_data.sender.id },
                            message: {
                                text: 'Bạn đã nhập sai quá số lần cho phép, chúng tôi sẽ chỉ định nhân viên chăm sóc cho bạn !',
                            },
                        });
                    } else {
                        send_Message_To_User(zalo_app, zalo_oa, {
                            recipient: { user_id: hook_data.sender.id },
                            message: { text: 'Bạn đã chọn được nhân viên chăm sóc, vui lòng chờ !' },
                        });
                    }
                }
            }
        } else {
            const old_hook_datas = [...wait_session.hook_datas];
            const new_hook_datas: Hook_Data_Field[] = [...old_hook_datas, hook_data];
            const new_wait_session: Wait_Session_Field = {
                hook_datas: new_hook_datas,
                is_session: wait_session.is_session,
                index: wait_session.index,
                max_index: wait_session.max_index,
                final: wait_session.final,
                chat_session: wait_session.chat_session,
            };
            const is_set = await serviceRedis.setData<Wait_Session_Field>(
                cache_msg_wait_session_key,
                new_wait_session,
                time_expireat
            );
            if (!is_set) {
                console.error('Failed to set zaloApp in cookie in Redis (feedbackToTakeSessionCode)');
                serviceRedis.deleteData(cache_msg_wait_session_key);
                send_Message_To_User(zalo_app, zalo_oa, {
                    recipient: { user_id: hook_data.sender.id },
                    message: { text: 'Đã có lỗi xả ra, vui lòng thực hiện lại !' },
                });
            }

            const wait_session_final = await serviceRedis.getData<Wait_Session_Field>(cache_msg_wait_session_key);
            serviceRedis.deleteData(cache_msg_wait_session_key);
            if (!wait_session_final) {
                return;
            }
            return wait_session_final;
        }
    } else {
        if (is_user_send) {
            const new_wait_session: Wait_Session_Field = {
                hook_datas: [hook_data],
                is_session: false,
                index: 0,
                max_index: 5,
                final: false,
            };
            const is_set = await serviceRedis.setData<Wait_Session_Field>(
                cache_msg_wait_session_key,
                new_wait_session,
                time_expireat
            );
            send_Message_To_User(zalo_app, zalo_oa, {
                recipient: { user_id: hook_data.sender.id },
                message: { text: 'Vui lòng gửi phiên hội thoại để xác định nhân viên phục vụ !' },
            });
            if (!is_set) {
                console.error('Failed to set zaloApp in cookie in Redis (feedbackToTakeSessionCode)');
                send_Message_To_User(zalo_app, zalo_oa, {
                    recipient: { user_id: hook_data.sender.id },
                    message: { text: 'Vui lòng thực hiện lại tin nhắn đã gửi !' },
                });
            }
        }
    }
}

async function get_Chat_Session(code: string, zalo_oa: Zalo_Oa_Field): Promise<Chat_Session_Field | undefined> {
    const user_take_session_to_chat_body: User_Take_Session_To_Chat_Body_Field = {
        code: code,
        zalo_oa_id: zalo_oa.id,
    };

    const queryDB = new QueryDB_User_Take_Session_To_Chat();
    queryDB.set_User_Take_Session_To_Chat_Body(user_take_session_to_chat_body);

    try {
        const result = await queryDB.run();
        if (result) {
            return result;
        } else {
            return;
        }
    } catch (error) {
        console.error(error);
        return;
    }
}
