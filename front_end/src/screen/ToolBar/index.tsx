import { FC, memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { useWindowSize } from '@src/hook/useWindowSize';
import { avatarnull } from '@src/utility/string';
import { handleSrcImage } from '@src/utility/string';
import { Account_Field } from '@src/data_struct/account';
import { route_enum, selected_type, select_enum } from '@src/router/type';
import { CHECK_IN_OUT, SHOP, TEAM } from '@src/const/text';
import { MdDashboard } from 'react-icons/md';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { MdGroups } from 'react-icons/md';
import { FcShop } from 'react-icons/fc';
import { MdMenu } from 'react-icons/md';
import { TbArrowsMoveHorizontal } from 'react-icons/tb';
import { set__is_show, set__is_max_show } from '@src/redux/slice/Tool_Bar';

const ToolBar: FC<{ selected: selected_type }> = ({ selected }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const account: Account_Field | undefined = useSelector((state: RootState) => state.App_Slice.account);
    const is_show: boolean = useSelector((state: RootState) => state.Tool_Bar_Slice.is_show);
    const is_max_show: boolean = useSelector((state: RootState) => state.Tool_Bar_Slice.is_max_show);

    const [avatar_url, set__avatar_url] = useState<string>(avatarnull);
    const { is_md } = useWindowSize();
    const [is_show1, set__is_show1] = useState<boolean>(is_show);

    useEffect(() => {
        dispatch(set__is_max_show(!is_md));
    }, [dispatch, is_md]);

    useEffect(() => {
        const _avatarUrl = account?.avatar ? handleSrcImage(account.avatar) : avatarnull;
        set__avatar_url(_avatarUrl);
    }, [account]);

    useEffect(() => {
        if (!is_show) {
            setTimeout(() => {
                set__is_show1(is_show);
            }, 300);
        } else {
            set__is_show1(is_show);
        }
    }, [is_show]);

    const handle_Show = () => {
        dispatch(set__is_show(!is_show));
    };

    const handle_show_In_Md = () => {
        dispatch(set__is_max_show(!is_max_show));
    };

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

            case select_enum.TEAM:
                navigate(route_enum.TEAM);
                break;

            default:
                console.log('Không xác định');
        }
    };

    if (!is_show1) {
        return (
            <div className={style.parent1}>
                <MdMenu onClick={() => handle_Show()} size={25} />
            </div>
        );
    }

    return (
        <div className={style.parent}>
            <div className={style.menuIcon}>
                <MdMenu onClick={() => handle_Show()} size={25} />
                <TbArrowsMoveHorizontal onClick={() => handle_show_In_Md()} size={25} />
            </div>
            <div className={style.logoZtks}>
                <img src={handleSrcImage('logo.jpg')} onClick={() => handle_Go_To_Home()} alt="logoZtks" />
            </div>
            <div className={style.options}>
                <div
                    className={handle_Selected_Class(select_enum.DASH_BOARD)}
                    onClick={() => handle_Go_To(select_enum.DASH_BOARD)}
                >
                    {is_max_show && <div>Dash board</div>}
                    {!is_max_show && <MdDashboard />}
                </div>
                <div
                    className={handle_Selected_Class(select_enum.CHECK_IN_OUT_MANAGER)}
                    onClick={() => handle_Go_To(select_enum.CHECK_IN_OUT_MANAGER)}
                >
                    {is_max_show && <div>{CHECK_IN_OUT}</div>}
                    {!is_max_show && <IoIosCheckmarkCircleOutline />}
                </div>
                <div className={handle_Selected_Class(select_enum.SHOP)} onClick={() => handle_Go_To(select_enum.SHOP)}>
                    {is_max_show && <div>{SHOP}</div>}
                    {!is_max_show && <FcShop />}
                </div>
                <div className={handle_Selected_Class(select_enum.TEAM)} onClick={() => handle_Go_To(select_enum.TEAM)}>
                    {is_max_show && <div>{TEAM}</div>}
                    {!is_max_show && <MdGroups />}
                </div>
            </div>
            <div className={style.avatar}>
                <img onClick={() => handle_Go_To_Profile()} src={avatar_url} alt="logoZtks" />
            </div>
        </div>
    );
};

export default memo(ToolBar);
