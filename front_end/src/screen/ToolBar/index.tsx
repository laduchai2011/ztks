import { FC, memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { avatarnull } from '@src/utility/string';
import { handleSrcImage } from '@src/utility/string';
import { Account_Field } from '@src/data_struct/account';
import { route_enum, selected_type, select_enum } from '@src/router/type';

const ToolBar: FC<{ selected: selected_type }> = ({ selected }) => {
    const navigate = useNavigate();

    const account: Account_Field | undefined = useSelector((state: RootState) => state.App_Slice.account);

    const [avatar_url, set__avatar_url] = useState<string>(avatarnull);

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
                    Dash board
                </div>
                <div
                    className={handle_Selected_Class(select_enum.CHECK_IN_OUT_MANAGER)}
                    onClick={() => handle_Go_To(select_enum.CHECK_IN_OUT_MANAGER)}
                >
                    Check In/Out
                </div>
            </div>
            <div className={style.avatar}>
                <img onClick={() => handle_Go_To_Profile()} src={avatar_url} alt="logoZtks" />
            </div>
        </div>
    );
};

export default memo(ToolBar);
