import { FC, memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { handleSrcImage, avatarnull } from '@src/utility/string';
import { timeAgoSmart } from '@src/utility/time';
import { AccountField } from '@src/dataStruct/account';
import { CheckInOutField, CheckInOutInspectField } from '@src/dataStruct/checkInOut';
import { CreateCheckInOutInspectBodyField } from '@src/dataStruct/checkInOut/body';
import {
    useLazyGetCheckInOutInspectWithFkQuery,
    useCreateCheckInOutInspectMutation,
} from '@src/redux/query/checkInOutRTK';
import { useLazyGetAccountWithIdQuery } from '@src/redux/query/accountRTK';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { set_isLoading, setData_toastMessage } from '@src/redux/slice/CheckInOutManager';

const OneCheck: FC<{ data: CheckInOutField }> = ({ data }) => {
    const dispatch = useDispatch<AppDispatch>();
    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);

    const [isInspect, setIsInspect] = useState<boolean | null>(null);
    const [checkInOutInspect, setCheckInOutInspect] = useState<CheckInOutInspectField | null>(null);
    const [inspect_account, setInspect_account] = useState<AccountField | null>(null);

    const [content, setContent] = useState<string>('');

    const [getCheckInOutInspectWithFk] = useLazyGetCheckInOutInspectWithFkQuery();
    const [getAccountWithId] = useLazyGetAccountWithIdQuery();
    const [createCheckInOutInspect] = useCreateCheckInOutInspectMutation();

    useEffect(() => {
        getCheckInOutInspectWithFk({ checkInOutId: data.id })
            .then((res) => {
                const resData = res.data;
                console.log('getCheckInOutInspectWithFk', resData);
                if (resData?.isSuccess && resData.data) {
                    setCheckInOutInspect(resData.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [getCheckInOutInspectWithFk, data.id]);

    useEffect(() => {
        if (!checkInOutInspect) return;
        getAccountWithId({ id: checkInOutInspect.accountId })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setInspect_account(resData.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [checkInOutInspect, getAccountWithId]);

    const handleSlectedInspect = (is: boolean) => {
        if (isInspect === is) {
            return style.selected;
        }
        return '';
    };

    const handleInspect = (is: boolean) => {
        setIsInspect(is);
    };

    const handleContent = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setContent(value);
    };

    const handleAgree = () => {
        if (!account) return;
        if (isInspect === null) {
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Vui lòng chọn (Duyệt) hoặc (Không duyệt) !',
                })
            );
            return;
        }

        const createCheckInOutInspectBody: CreateCheckInOutInspectBodyField = {
            content: content.trim(),
            isPass: isInspect,
            checkInOutId: data.id,
            accountId: account.id,
        };

        dispatch(set_isLoading(true));
        createCheckInOutInspect(createCheckInOutInspectBody)
            .then((res) => {
                const resData = res.data;
                console.log('createCheckInOutInspect', resData);
                if (resData?.isSuccess && resData.data) {
                    setCheckInOutInspect(resData.data);
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.SUCCESS,
                            message: 'Gửi duyệt (không duyệt) thành công !',
                        })
                    );
                } else {
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.NORMAL,
                            message: 'Gửi duyệt (không duyệt) KHÔNG thành công !',
                        })
                    );
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(
                    setData_toastMessage({
                        type: messageType_enum.ERROR,
                        message: 'Đã có lỗi xảy ra !',
                    })
                );
            })
            .finally(() => dispatch(set_isLoading(false)));
    };

    return (
        <div className={style.parent}>
            <div className={style.check}>
                <div>
                    <div>{data.type}</div>
                    <div>{data.note}</div>
                </div>
                <div>
                    <img src={handleSrcImage(data.image || '')} alt="" />
                </div>
                <div>
                    <div>{timeAgoSmart(data.createTime)}</div>
                </div>
            </div>
            <div className={style.inspect}>
                {!checkInOutInspect && (
                    <div className={style.createInspect}>
                        <div>
                            <input value={content} onChange={(e) => handleContent(e)} placeholder="Ghi chú" />
                        </div>
                        <div>
                            <div className={handleSlectedInspect(true)} onClick={() => handleInspect(true)}>
                                Duyệt
                            </div>
                            <div className={handleSlectedInspect(false)} onClick={() => handleInspect(false)}>
                                Không duyệt
                            </div>
                        </div>
                        <div>
                            <div onClick={() => handleAgree()}>Đồng ý</div>
                        </div>
                    </div>
                )}
                {inspect_account && checkInOutInspect && (
                    <div className={style.getInspect}>
                        <div>
                            <img
                                src={inspect_account.avatar ? handleSrcImage(inspect_account.avatar) : avatarnull}
                                alt="avatar"
                            />
                        </div>
                        <div>
                            <div>{`${inspect_account.firstName} ${inspect_account.lastName}`}</div>
                        </div>
                        <div>
                            <div>{checkInOutInspect.isPass ? 'Duyệt' : 'Không duyệt'}</div>
                        </div>
                        <div>
                            <div>{checkInOutInspect.content}</div>{' '}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(OneCheck);
