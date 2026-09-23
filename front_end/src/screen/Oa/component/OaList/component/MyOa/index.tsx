import { FC, memo, useState } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { FaRegEye, FaEyeSlash } from 'react-icons/fa';
import { GoDotFill } from 'react-icons/go';
import { IoMdSettings } from 'react-icons/io';
import { SETTING } from '@src/const/text';
import { route_enum } from '@src/router/type';
import { Zalo_Oa_Field } from '@src/data_struct/zalo';
import { set__is_show__take_token_dialog, set__zalo_oa__take_token_dialog } from '@src/redux/slice/Oa';

const MyOa: FC<{ index: number; data: Zalo_Oa_Field }> = ({ index, data }) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [is_show_id, set__is_show_id] = useState(false);
    const [is_show_secret, set__is_show_secret] = useState(false);

    const handle_Show_Id = (is_show: boolean) => {
        set__is_show_id(is_show);
    };

    const handle_Show_Secret = (is_show: boolean) => {
        set__is_show_secret(is_show);
    };

    const gotoSetting = () => {
        navigate(route_enum.OA_SETTING + '/' + `${data.id}`);
    };

    const handle_Open_Take_Token = () => {
        dispatch(set__is_show__take_token_dialog(true));
        dispatch(set__zalo_oa__take_token_dialog(data));
    };

    return (
        <div className={style.parent}>
            <div className={style.index}>
                <div>{index}</div>
            </div>
            <div className={style.main}>
                <div>
                    <div className={style.label}>{data.label}</div>
                    <div>
                        <div>
                            <div>Tên OA</div>
                            <div>{data.oa_name}</div>
                        </div>
                    </div>
                    <div>
                        <div>
                            <div>
                                <div>Định danh OA</div>
                                <div>
                                    {is_show_id && <FaRegEye onClick={() => handle_Show_Id(false)} />}
                                    {!is_show_id && <FaEyeSlash onClick={() => handle_Show_Id(true)} />}
                                </div>
                            </div>
                            <div>
                                {is_show_id && <div>{data.oa_id}</div>}
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
                                <div>Khóa OA</div>
                                <div>
                                    {is_show_secret && <FaRegEye onClick={() => handle_Show_Secret(false)} />}
                                    {!is_show_secret && <FaEyeSlash onClick={() => handle_Show_Secret(true)} />}
                                </div>
                            </div>
                            <div>
                                {is_show_secret && <div>{data.oa_secret}</div>}
                                {!is_show_secret && (
                                    <div>
                                        <GoDotFill /> <GoDotFill /> <GoDotFill /> <GoDotFill /> <GoDotFill />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={style.btnContainer}>
                        <div className={style.refresh} onClick={() => handle_Open_Take_Token()}>
                            Lấy token mới
                        </div>
                        <div className={style.setting}>
                            <IoMdSettings onClick={() => gotoSetting()} size={25} title={SETTING} />
                        </div>
                    </div>
                    <div className={style.warn}>Thông tin không được để lộ</div>
                </div>
            </div>
        </div>
    );
};

export default memo(MyOa);
