import { FC, memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { avatarnull } from '@src/utility/string';
import { handleSrcImage } from '@src/utility/string';
import { AccountField } from '@src/dataStruct/account';
import { route_enum, selected_type, select_enum } from '@src/router/type';

const ToolBar: FC<{ selected: selected_type }> = ({ selected }) => {
    const navigate = useNavigate();

    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);

    const [avatarUrl, setAvatarUrl] = useState<string>(avatarnull);

    useEffect(() => {
        const avatarUrl_ = account?.avatar ? handleSrcImage(account.avatar) : avatarnull;
        setAvatarUrl(avatarUrl_);
    }, [account]);

    const handleGoToHome = () => {
        navigate(route_enum.HOME);
    };

    const handleGoToProfile = () => {
        navigate(route_enum.PROFILE);
    };

    const handleSelectedClass = (selected1: selected_type) => {
        if (selected === selected1) {
            return style.selected;
        } else {
            return '';
        }
    };

    const handleGoTo = (selected2: selected_type) => {
        switch (selected2) {
            case select_enum.DASH_BOARD:
                navigate(route_enum.DASH_BOARD);
                break;

            case select_enum.CHECK_IN_OUT_MANAGER:
                navigate(route_enum.CHECK_IN_OUT_MANAGER);
                break;

            default:
                console.log('Không xác định');
        }
    };

    return (
        <div className={style.parent}>
            <div className={style.logoZtks}>
                <img src={handleSrcImage('logo.jpg')} onClick={() => handleGoToHome()} alt="logoZtks" />
            </div>
            <div className={style.options}>
                <div
                    className={handleSelectedClass(select_enum.DASH_BOARD)}
                    onClick={() => handleGoTo(select_enum.DASH_BOARD)}
                >
                    Dash board
                </div>
                <div
                    className={handleSelectedClass(select_enum.CHECK_IN_OUT_MANAGER)}
                    onClick={() => handleGoTo(select_enum.CHECK_IN_OUT_MANAGER)}
                >
                    Check In/Out
                </div>
            </div>
            <div className={style.avatar}>
                <img onClick={() => handleGoToProfile()} src={avatarUrl} alt="logoZtks" />
            </div>
        </div>
    );
};

export default memo(ToolBar);
