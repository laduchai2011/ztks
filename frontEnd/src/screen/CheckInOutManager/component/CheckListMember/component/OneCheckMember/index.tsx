import { FC, memo, useRef, useEffect, useState } from 'react';
import style from './style.module.scss';
import { avatarnull } from '@src/utility/string';
import { handleSrcImage } from '@src/utility/string';
import { AccountField } from '@src/dataStruct/account';
import {
    useLazyGetCheckInOutsWithDateQuery,
    useLazyGetCheckInOutInspectWithFkQuery,
} from '@src/redux/query/checkInOutRTK';
import { useLazyGetAccountWithIdQuery } from '@src/redux/query/accountRTK';
import { CheckInOutEnum, CheckInOutField, CheckInOutInspectField } from '@src/dataStruct/checkInOut';
import { GetCheckInOutsWithDateBodyField } from '@src/dataStruct/checkInOut/body';
import OneCheck from './component/OneCheck';

const OneCheckMember: FC<{ index: number; account: AccountField; day: string }> = ({ index, account, day }) => {
    const checkContainer_element = useRef<HTMLDivElement | null>(null);
    const [showImg, setShowImg] = useState<boolean>(false);

    const [countIn, setCountIn] = useState<number>(0);
    const [countOut, setCountOut] = useState<number>(0);
    const [checkInOuts, setCheckInOuts] = useState<CheckInOutField[]>([]);
    const [countInInspect, setCountInInspect] = useState<number>(0);
    const [countOutInspect, setCountOutInspect] = useState<number>(0);
    const [inspectText, setInspectText] = useState<string>('Chưa duyệt');
    const [checkInOutInspects, setCheckInOutInspects] = useState<CheckInOutInspectField[]>([]);
    const [inspectAccounts, setInspectAccounts] = useState<AccountField[]>([]);

    const [getCheckInOutsWithDate] = useLazyGetCheckInOutsWithDateQuery();
    const [getCheckInOutInspectWithFk] = useLazyGetCheckInOutInspectWithFkQuery();
    const [getAccountWithId] = useLazyGetAccountWithIdQuery();

    useEffect(() => {
        if (!checkContainer_element.current) return;
        const checkContainerElement = checkContainer_element.current;
        if (showImg) {
            checkContainerElement.classList.add(style.show);
        } else {
            checkContainerElement.classList.remove(style.show);
        }
    }, [showImg]);

    const handleSeeCheck = () => {
        setShowImg(!showImg);
    };

    useEffect(() => {
        async function getCheck() {
            let _checkInOunts: CheckInOutField[] = [];
            const bodyIn: GetCheckInOutsWithDateBodyField = {
                type: CheckInOutEnum.IN,
                date: day,
                accountId: account.id,
            };
            const bodyOut: GetCheckInOutsWithDateBodyField = {
                type: CheckInOutEnum.OUT,
                date: day,
                accountId: account.id,
            };

            try {
                const results = await Promise.all([getCheckInOutsWithDate(bodyIn), getCheckInOutsWithDate(bodyOut)]);

                const res1Data = results[0].data;
                const res2Data = results[1].data;

                if (res1Data?.isSuccess && res1Data.data) {
                    _checkInOunts = _checkInOunts.concat(res1Data.data);
                    setCountIn(res1Data.data.length);
                }

                if (res2Data?.isSuccess && res2Data.data) {
                    _checkInOunts = _checkInOunts.concat(res2Data.data);
                    setCountOut(res2Data.data.length);
                }

                _checkInOunts.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());

                setCheckInOuts(_checkInOunts);
            } catch (error) {
                console.error(error);
            }
        }
        getCheck();
    }, [getCheckInOutsWithDate, account.id, day]);

    useEffect(() => {
        let _countInInspect: number = 0;
        let _countOutInspect: number = 0;
        const _checkInOutInspects: CheckInOutInspectField[] = [];

        async function getCheckInOutInspect() {
            try {
                for (let i: number = 0; i < checkInOuts.length; i++) {
                    const result = await getCheckInOutInspectWithFk({ checkInOutId: checkInOuts[i].id });
                    const resData = result.data;
                    if (resData?.isSuccess && resData.data) {
                        _checkInOutInspects.push(resData.data);
                        switch (checkInOuts[i].type) {
                            case CheckInOutEnum.IN:
                                _countInInspect = _countInInspect + 1;
                                break;

                            case CheckInOutEnum.OUT:
                                _countOutInspect = _countOutInspect + 1;
                                break;

                            default:
                                console.log('Không xác định');
                                break;
                        }
                    }
                }
            } catch (error) {
                console.error(error);
            } finally {
                setCountInInspect(_countInInspect);
                setCountOutInspect(_countOutInspect);
                _checkInOutInspects.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
                setCheckInOutInspects(_checkInOutInspects);
            }
        }
        getCheckInOutInspect();
    }, [checkInOuts, getCheckInOutInspectWithFk]);

    useEffect(() => {
        async function getInspectUser() {
            const _inspectAccount: AccountField[] = [];
            try {
                for (let i: number = 0; i < checkInOutInspects.length; i++) {
                    const result = await getAccountWithId({ id: checkInOutInspects[i].accountId });
                    const resData = result.data;
                    if (resData?.isSuccess && resData.data) {
                        _inspectAccount.push(resData.data);
                    }
                }
            } catch (error) {
                console.error(error);
            } finally {
                setInspectAccounts(_inspectAccount);
            }
        }
        getInspectUser();
    }, [checkInOutInspects, getAccountWithId]);

    useEffect(() => {
        if (countIn === countInInspect && countOut === countOutInspect) {
            setInspectText('Đã duyệt');
        } else if (countInInspect === 0 && countOutInspect === 0) {
            setInspectText('Chưa duyệt');
        } else {
            setInspectText('Duyệt 1 phần');
        }
    }, [countIn, countOut, countInInspect, countOutInspect]);

    const handleInspectColor = () => {
        if (
            countInInspect !== 0 &&
            countOutInspect !== 0 &&
            countIn === countInInspect &&
            countOut === countOutInspect
        ) {
            for (let i: number = 0; i < checkInOutInspects.length; i++) {
                if (checkInOutInspects[i].isPass === false) {
                    return style.notPass;
                }
            }
            return style.pass;
        }

        return style.notPass;
    };

    const list_check = checkInOuts.map((item, index) => {
        return <OneCheck key={index} data={item} />;
    });

    const list_inspectAccount = inspectAccounts.map((item, index) => {
        return <span className={style.inspectAccount} key={index}>{`${item.firstName} ${item.lastName}`}</span>;
    });

    return (
        <div className={`${style.parent} ${handleInspectColor()}`}>
            <div>
                <div className={style.index}>{index + 1}</div>
                <div className={style.avatar}>
                    <img src={account?.avatar ? handleSrcImage(account.avatar) : avatarnull} alt="avatar" />
                </div>
                <div className={style.name}>{`${account.firstName} ${account.lastName}`}</div>
                <div className={style.in}>{`in (${countInInspect}/${countIn})`}</div>
                <div className={style.out}>{`out (${countOutInspect}/${countOut})`}</div>
                <div className={style.inspect}>{inspectText}</div>
                <div className={style.inspectUser}>
                    {inspectAccounts.length > 0 ? (
                        <div className={style.inspectAccounts}>{list_inspectAccount}</div>
                    ) : (
                        <div>Chưa có</div>
                    )}
                </div>
                <div className={style.seeCheck} onClick={() => handleSeeCheck()}>
                    Xem
                </div>
            </div>
            <div ref={checkContainer_element}>{list_check}</div>
        </div>
    );
};

export default memo(OneCheckMember);
