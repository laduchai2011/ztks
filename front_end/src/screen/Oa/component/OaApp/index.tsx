import { memo, useState } from 'react';
import style from './style.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux';
import { FaRegEye, FaEyeSlash } from 'react-icons/fa';
import { GoDotFill } from 'react-icons/go';
import { Zalo_App_Field } from '@src/data_struct/zalo';

const OaApp = () => {
    const zalo_app: Zalo_App_Field | undefined = useSelector((state: RootState) => state.App_Slice.zalo_app);

    const [is_show_id, set__is_show_id] = useState(false);
    const [is_show_secret, set__is_show_secret] = useState(false);

    const handle_Show_id = (is_show: boolean) => {
        set__is_show_id(is_show);
    };

    const handle_Show_Secret = (is_show: boolean) => {
        set__is_show_secret(is_show);
    };

    return (
        <div className={style.parent}>
            <div>
                <div className={style.label}>{zalo_app?.label}</div>
                <div>
                    <div>
                        <div>Tên ứng dụng</div>
                        <div>{zalo_app?.app_name}</div>
                    </div>
                </div>
                <div>
                    <div>
                        <div>
                            <div>Định danh ứng dụng</div>
                            <div>
                                {is_show_id && <FaRegEye onClick={() => handle_Show_id(false)} />}
                                {!is_show_id && <FaEyeSlash onClick={() => handle_Show_id(true)} />}
                            </div>
                        </div>
                        <div>
                            {is_show_id && <div>{zalo_app?.app_id}</div>}
                            {!is_show_id && (
                                <div>
                                    <GoDotFill /> <GoDotFill /> <GoDotFill /> <GoDotFill /> <GoDotFill />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div>
                    <div>
                        <div>
                            <div>Khóa ứng dụng</div>
                            <div>
                                {is_show_secret && <FaRegEye onClick={() => handle_Show_Secret(false)} />}
                                {!is_show_secret && <FaEyeSlash onClick={() => handle_Show_Secret(true)} />}
                            </div>
                        </div>
                        <div>
                            {is_show_secret && <div>{zalo_app?.app_secret}</div>}
                            {!is_show_secret && (
                                <div>
                                    <GoDotFill /> <GoDotFill /> <GoDotFill /> <GoDotFill /> <GoDotFill />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className={style.warn}>Thông tin không được để lộ</div>
            </div>
        </div>
    );
};

export default memo(OaApp);
