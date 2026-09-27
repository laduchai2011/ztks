import { FC, memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux';
import { useWindowSize } from '@src/hook/useWindowSize';
import { avatarnull } from '@src/utility/string';
import { handleSrcImage } from '@src/utility/string';
import { Account_Field } from '@src/data_struct/account';
import { route_enum, selected_type, select_enum } from '@src/router/type';
import { CHECK_IN_OUT, SHOP } from '@src/const/text';
import { MdDashboard } from 'react-icons/md';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { FcShop } from 'react-icons/fc';

const ToolBar: FC<{ selected: selected_type }> = ({ selected }) => {
    const navigate = useNavigate();

    const account: Account_Field | undefined = useSelector((state: RootState) => state.App_Slice.account);

    const [avatar_url, set__avatar_url] = useState<string>(avatarnull);
    const { is_md } = useWindowSize();
    const [is_show, set__is_show] = useState<boolean>(false);

    useEffect(() => {
        set__is_show(!is_md);
    }, [is_md]);

    useEffect(() => {
        const _avatarUrl = account?.avatar ? handleSrcImage(account.avatar) : avatarnull;
        set__avatar_url(_avatarUrl);
    }, [account]);

    const handle_Go_To_Home = () => {
        navigate(route_enum.HOME);
    };

    const handle_Go_To_Profile = () => {
        navigate(route_enum.PROFILE);
    };

    const handle_Selected_Class = (selected1: selected_type) => {
        if (selected === selected1) {
            return style.selected;
        } else {
            return '';
        }
    };

    const handle_Go_To = (selected2: selected_type) => {
        switch (selected2) {
            case select_enum.DASH_BOARD:
                navigate(route_enum.DASH_BOARD);
                break;

            case select_enum.CHECK_IN_OUT_MANAGER:
                navigate(route_enum.CHECK_IN_OUT_MANAGER);
                break;

            case select_enum.SHOP:
                navigate(route_enum.SHOP);
                break;

            default:
                console.log('Không xác định');
        }
    };

    return (
        <div className={style.parent}>
            <div className={style.logoZtks}>
                <img src={handleSrcImage('logo.jpg')} onClick={() => handle_Go_To_Home()} alt="logoZtks" />
            </div>
            <div className={style.options}>
                <div
                    className={handle_Selected_Class(select_enum.DASH_BOARD)}
                    onClick={() => handle_Go_To(select_enum.DASH_BOARD)}
                >
                    {is_show && <div>Dash board</div>}
                    {!is_show && <MdDashboard />}
                </div>
                <div
                    className={handle_Selected_Class(select_enum.CHECK_IN_OUT_MANAGER)}
                    onClick={() => handle_Go_To(select_enum.CHECK_IN_OUT_MANAGER)}
                >
                    {is_show && <div>{CHECK_IN_OUT}</div>}
                    {!is_show && <IoIosCheckmarkCircleOutline />}
                </div>
                <div className={handle_Selected_Class(select_enum.SHOP)} onClick={() => handle_Go_To(select_enum.SHOP)}>
                    {is_show && <div>{SHOP}</div>}
                    {!is_show && <FcShop />}
                </div>
            </div>
            <div className={style.avatar}>
                <img onClick={() => handle_Go_To_Profile()} src={avatar_url} alt="logoZtks" />
            </div>
        </div>
    );
};

export default memo(ToolBar);
