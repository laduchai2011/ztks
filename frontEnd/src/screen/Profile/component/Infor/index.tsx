import { memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { avatarnull } from '@src/utility/string';
import { AccountField, AccountInformationField, accountType_enum, accountType_type } from '@src/dataStruct/account';
import { ADMIN, MEMBER } from '@src/const/text';
import { SelectedTypeField } from './type';
import axiosInstance from '@src/api/axiosInstance';
import { MyResponse } from '@src/dataStruct/response';
import { CreateAccountInformationBodyField } from '@src/dataStruct/account/body';
import { set_isLoading, setData_toastMessage, setIsShow_editInforDialog } from '@src/redux/slice/Profile';
import { set_accountInformation } from '@src/redux/slice/App';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { IoAddCircleOutline } from 'react-icons/io5';

const Infor = () => {
    const dispatch = useDispatch<AppDispatch>();
    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);
    const accountInformation: AccountInformationField | undefined = useSelector(
        (state: RootState) => state.AppSlice.accountInformation
    );
    const [accountType, setAccountType] = useState<accountType_type | undefined>(undefined);
    const [selectedType, setSelectedType] = useState<SelectedTypeField | null>(null);
    const maxCount = 3;
    const avatarUrl = account?.avatar || avatarnull;

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
                    dispatch(set_isLoading(true));
                    handle_createAccountInformation({ accountType: type, accountId: -1 })
                        .then((res) => {
                            const resData = res;
                            if (resData?.isSuccess && resData.data) {
                                dispatch(set_accountInformation(resData.data));
                                dispatch(
                                    setData_toastMessage({
                                        type: messageType_enum.SUCCESS,
                                        message: res.message || 'Tạo thông tin tài khoản thành công !',
                                    })
                                );
                            } else {
                                dispatch(
                                    setData_toastMessage({
                                        type: messageType_enum.ERROR,
                                        message: res.message || 'Tạo thông tin tài khoản KHÔNG thành công !',
                                    })
                                );
                            }
                        })
                        .catch((err) => {
                            console.error('Error creating account information:', err);
                            dispatch(
                                setData_toastMessage({
                                    type: messageType_enum.ERROR,
                                    message: 'Đã có lỗi xảy ra',
                                })
                            );
                        })
                        .finally(() => {
                            dispatch(set_isLoading(false));
                        });
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

    const handle_createAccountInformation = async (createAccountInformationBody: CreateAccountInformationBodyField) => {
        try {
            const response = await axiosInstance.post<MyResponse<AccountInformationField>>(
                '/service_account/mutate/createAccountInformation',
                createAccountInformationBody
            );
            return response.data;
        } catch (error) {
            console.error('Error creating account information:', error);
            throw error;
        }
    };

    const handleShowEdit = () => {
        dispatch(setIsShow_editInforDialog(true));
    };

    return (
        <div className={style.parent}>
            <div className={style.avatarContainer}>
                <img className={style.avatar} src={avatarUrl} alt="avatar" />
                <IoAddCircleOutline onClick={() => handleShowEdit()} size={20} />
            </div>
            <div className={style.name}>{`${account?.firstName} ${account?.lastName}`}</div>
            {accountType && <div className={style.admin}>{handleTextAccountType(accountType)}</div>}
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
