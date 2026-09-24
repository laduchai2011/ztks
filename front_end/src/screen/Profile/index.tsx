import { useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import {
    PROFILE,
    SIGNOUT,
    OA,
    ACCOUNT_RECEIVE_MESSAGE,
    MANAGE_AGENT,
    MEMBER,
    WALLET,
    BANK,
    POST,
    LEAVE,
    CHECK_IN_OUT,
} from '@src/const/text';
import MyLoading from './component/MyLoading';
import MyToastMessage from './component/MyToastMessage';
import Header from '../Header';
import Infor from './component/Infor';
import EditInforDialog from './component/EditInforDialog';
import { IoChevronBack } from 'react-icons/io5';
import { select_enum, route_enum } from '@src/router/type';
import { Account_Information_Field, account_type_enum } from '@src/data_struct/account';
import { set__data__toast_message } from '@src/redux/slice/Profile';

const Profile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const my_id = sessionStorage.getItem('myId');

    useEffect(() => {
        if (my_id === null) {
            navigate(route_enum.SIGNIN);
        }
    }, [navigate, my_id]);

    useEffect(() => {
        return () => {
            dispatch(
                set__data__toast_message({
                    type: undefined,
                    message: '',
                })
            );
        };
    }, [dispatch]);

    const account_information: Account_Information_Field | undefined = useSelector(
        (state: RootState) => state.App_Slice.account_information
    );

    const is_admin = account_information?.account_type === account_type_enum.ADMIN;

    const go_To_Oa = () => {
        navigate(route_enum.OA);
    };

    const go_To_Member = () => {
        navigate(route_enum.MEMBER);
    };

    const go_To_Manage_Agents = () => {
        navigate(route_enum.MANAGE_AGENT);
    };

    const go_To_Account_Receive_Message = () => {
        navigate(route_enum.ACCOUNT_RECEIVE_MESSAGE);
    };

    const go_To_Wallet = () => {
        navigate(route_enum.WALLET);
    };

    const go_To_Bank = () => {
        navigate(route_enum.BANK);
    };

    const go_To_Post = () => {
        navigate(route_enum.POST);
    };

    const go_To_Leave = () => {
        navigate(route_enum.LEAVE);
    };

    const go_To_Dashboard = () => {
        navigate(route_enum.DASH_BOARD);
    };

    const go_To_Check_In_Out = () => {
        navigate(route_enum.CHECK_IN_OUT);
    };

    const go_To_Signout = () => {
        navigate(route_enum.SIGNOUT);
    };

    const handle_Back = () => {
        navigate(-1);
    };

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={style.header}>
                    <div>{PROFILE}</div>
                    <IoChevronBack onClick={() => handle_Back()} size={20} color="white" />
                </div>
                <div className={style.list}>
                    <Infor />
                    <div className={style.options}>
                        <div className={style.optionGroup}>
                            <div className={style.optionGroupName}>Zalo</div>
                            <div className={style.option} onClick={() => go_To_Oa()}>
                                {OA}
                            </div>
                        </div>
                        {is_admin && (
                            <div className={style.optionGroup}>
                                <div className={style.optionGroupName}>Quản lý thành viên</div>
                                <div className={style.option} onClick={() => go_To_Member()}>
                                    {MEMBER}
                                </div>

                                <div className={style.option} onClick={() => go_To_Manage_Agents()}>
                                    {MANAGE_AGENT}
                                </div>

                                <div className={style.option} onClick={() => go_To_Account_Receive_Message()}>
                                    {ACCOUNT_RECEIVE_MESSAGE}
                                </div>
                            </div>
                        )}
                        <div className={style.optionGroup}>
                            <div className={style.optionGroupName}>Tiền</div>
                            <div className={style.option} onClick={() => go_To_Wallet()}>
                                {WALLET}
                            </div>
                            <div className={style.option} onClick={() => go_To_Bank()}>
                                {BANK}
                            </div>
                        </div>
                        {is_admin && (
                            <div className={style.optionGroup}>
                                <div className={style.optionGroupName}>Đăng tin</div>
                                <div className={style.option} onClick={() => go_To_Post()}>
                                    {POST}
                                </div>
                            </div>
                        )}
                        {!is_admin && (
                            <div className={style.optionGroup}>
                                <div className={style.optionGroupName}>{LEAVE}</div>
                                <div className={style.option} onClick={() => go_To_Leave()}>
                                    {LEAVE}
                                </div>
                            </div>
                        )}
                        <div className={style.optionGroup}>
                            <div className={style.optionGroupName}>Thống kê</div>
                            <div className={style.option} onClick={() => go_To_Dashboard()}>
                                Dash board
                            </div>
                        </div>
                        <div className={style.optionGroup}>
                            <div className={style.optionGroupName}>Mở rộng</div>
                            <div className={style.option} onClick={() => go_To_Check_In_Out()}>
                                {CHECK_IN_OUT}
                            </div>
                            <div className={style.option} onClick={() => go_To_Signout()}>
                                {SIGNOUT}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={style.headerTab}>
                    <Header selected={select_enum.PROFILE} />
                </div>
                <div>
                    <MyLoading />
                    <MyToastMessage />
                    <EditInforDialog />
                </div>
            </div>
        </div>
    );
};

export default Profile;
