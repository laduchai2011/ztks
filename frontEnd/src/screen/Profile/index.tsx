import { useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux';
import {
    PROFILE,
    // MEMBER_RECEIVE_MESSAGE,
    // MANAGE_MEMBERS,
    SIGNOUT,
    OA,
    ACCOUNT_RECEIVE_MESSAGE,
    MANAGE_AGENT,
    MEMBER,
    WALLET,
} from '@src/const/text';
import MyLoading from './component/MyLoading';
import MyToastMessage from './component/MyToastMessage';
import Header from '../Header';
import Infor from './component/Infor';
import EditInforDialog from './component/EditInforDialog';
import { select_enum, route_enum } from '@src/router/type';
import { AccountInformationField, accountType_enum } from '@src/dataStruct/account';

const Profile = () => {
    const navigate = useNavigate();
    const myId = sessionStorage.getItem('myId');

    const accountInformation: AccountInformationField | undefined = useSelector(
        (state: RootState) => state.AppSlice.accountInformation
    );

    const isAdmin = accountInformation?.accountType === accountType_enum.ADMIN;

    useEffect(() => {
        if (myId === null) {
            navigate(route_enum.SIGNIN);
        }
    }, [navigate, myId]);

    const goToOa = () => {
        navigate(route_enum.OA);
    };

    const goToMember = () => {
        navigate(route_enum.MEMBER);
    };

    const goToManageAgents = () => {
        navigate(route_enum.MANAGE_AGENT);
    };

    const goToAccountReceiveMessage = () => {
        navigate(route_enum.ACCOUNT_RECEIVE_MESSAGE);
    };

    const goToWallet = () => {
        navigate(route_enum.WALLET);
    };

    const goToSignout = () => {
        navigate(route_enum.SIGNOUT);
    };

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={style.header}>{PROFILE}</div>
                <div className={style.list}>
                    <Infor />
                    {/* <div className={style.option} onClick={() => goToMemberReceiveMessage()}>
                        {MEMBER_RECEIVE_MESSAGE}
                    </div>
                    <div className={style.option} onClick={() => goToManageMembers()}>
                        {MANAGE_MEMBERS}
                    </div> */}
                    <div className={style.option} onClick={() => goToOa()}>
                        {OA}
                    </div>
                    {isAdmin && (
                        <div className={style.option} onClick={() => goToMember()}>
                            {MEMBER}
                        </div>
                    )}
                    {isAdmin && (
                        <div className={style.option} onClick={() => goToManageAgents()}>
                            {MANAGE_AGENT}
                        </div>
                    )}
                    {isAdmin && (
                        <div className={style.option} onClick={() => goToAccountReceiveMessage()}>
                            {ACCOUNT_RECEIVE_MESSAGE}
                        </div>
                    )}
                    <div className={style.option} onClick={() => goToWallet()}>
                        {WALLET}
                    </div>
                    <div className={style.option} onClick={() => goToSignout()}>
                        {SIGNOUT}
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
