import { memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux';
import { avatarnull } from '@src/utility/string';
import { AccountField, AccountInformationField, accountType_enum, accountType_type } from '@src/dataStruct/account';
import { ADMIN, MEMBER } from '@src/const/text';
import { SelectedTypeField } from './type';

const Infor = () => {
    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);
    const accountInformation: AccountInformationField | undefined = useSelector(
        (state: RootState) => state.AppSlice.accountInformation
    );
    const [accountType, setAccountType] = useState<accountType_type | undefined>(undefined);
    const [selectedType, setSelectedType] = useState<SelectedTypeField | null>(null);
    const maxCount = 3;

    useEffect(() => {
        if (accountInformation?.accountType === accountType_enum.ADMIN) {
            setAccountType(accountType_enum.ADMIN);
        }
        if (accountInformation?.accountType === accountType_enum.MEMBER) {
            setAccountType(accountType_enum.MEMBER);
        }
    }, [accountInformation]);

    const handleSelected = (type: accountType_enum) => {
        if (selectedType === null) {
            setSelectedType({
                type,
                count: 0,
            });
        } else {
            if (selectedType.type === type) {
                if (selectedType.count < 3) {
                    setSelectedType({
                        type,
                        count: selectedType.count + 1,
                    });
                } else {
                    // sumit type to BE
                }
            } else {
                setSelectedType({
                    type,
                    count: 0,
                });
            }
        }
    };

    const handleTextAccountType = (type: accountType_enum) => {
        if (type === accountType_enum.ADMIN) {
            return ADMIN;
        }
        if (type === accountType_enum.MEMBER) {
            return MEMBER;
        }
        return 'undefined';
    };

    return (
        <div className={style.parent}>
            <img className={style.avatar} src={avatarnull} alt="avatar" />
            <div className={style.name}>{`${account?.firstName} ${account?.lastName}`}</div>
            {accountType && <div className={style.admin}>{accountType}</div>}
            {!accountType && (
                <div className={style.selectType}>
                    <div className={style.text}>Chọn loại tài khoản ( chỉ chọn 1 lần duy nhất )</div>
                    <div className={style.selections}>
                        <div onClick={() => handleSelected(accountType_enum.ADMIN)}>
                            {handleTextAccountType(accountType_enum.ADMIN)}
                        </div>
                        <div onClick={() => handleSelected(accountType_enum.MEMBER)}>
                            {handleTextAccountType(accountType_enum.MEMBER)}
                        </div>
                    </div>
                    {selectedType && (
                        <div
                            className={style.text1}
                        >{`Còn ${maxCount - selectedType.count} lần chọn ( ${handleTextAccountType(selectedType.type)} )`}</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default memo(Infor);
