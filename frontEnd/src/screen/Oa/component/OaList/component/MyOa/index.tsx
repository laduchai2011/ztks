import { FC, memo, useState } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { FaRegEye, FaEyeSlash } from 'react-icons/fa';
import { GoDotFill } from 'react-icons/go';
import { IoMdSettings } from 'react-icons/io';
import { SETTING } from '@src/const/text';
import { route_enum } from '@src/router/type';
import { ZaloOaField } from '@src/dataStruct/zalo';

const MyOa: FC<{ index: number; data: ZaloOaField }> = ({ index, data }) => {
    const navigate = useNavigate();
    const [isShow_id, setIsShow_id] = useState(false);
    const [isShow_secret, setIsShow_secret] = useState(false);

    const handleShow_id = (isShow: boolean) => {
        setIsShow_id(isShow);
    };

    const handleShow_secret = (isShow: boolean) => {
        setIsShow_secret(isShow);
    };

    const gotoSetting = () => {
        navigate(route_enum.OA_SETTING + '/' + `${data.id}`);
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
                            <div>{data.oaName}</div>
                        </div>
                    </div>
                    <div>
                        <div>
                            <div>
                                <div>Định danh OA</div>
                                <div>
                                    {isShow_id && <FaRegEye onClick={() => handleShow_id(false)} />}
                                    {!isShow_id && <FaEyeSlash onClick={() => handleShow_id(true)} />}
                                </div>
                            </div>
                            <div>
                                {isShow_id && <div>{data.oaId}</div>}
                                {!isShow_id && (
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
                                    {isShow_secret && <FaRegEye onClick={() => handleShow_secret(false)} />}
                                    {!isShow_secret && <FaEyeSlash onClick={() => handleShow_secret(true)} />}
                                </div>
                            </div>
                            <div>
                                {isShow_secret && <div>{data.oaSecret}</div>}
                                {!isShow_secret && (
                                    <div>
                                        <GoDotFill /> <GoDotFill /> <GoDotFill /> <GoDotFill /> <GoDotFill />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={style.btnContainer}>
                        <div className={style.refresh}>Lấy token mới</div>
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
