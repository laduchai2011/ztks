import { FC, memo, useRef, useEffect, useState } from 'react';
import style from './style.module.scss';
import { avatarnull } from '@src/utility/string';
import { handleSrcImage } from '@src/utility/string';
import { AccountField } from '@src/dataStruct/account';
import { useLazyGetCheckInOutsWithDateQuery } from '@src/redux/query/checkInOutRTK';
import { CheckInOutEnum, CheckInOutField } from '@src/dataStruct/checkInOut';
import { GetCheckInOutsWithDateBodyField } from '@src/dataStruct/checkInOut/body';

const OneCheck: FC<{ index: number; account: AccountField; day: string }> = ({ index, account, day }) => {
    const checkImgContainer_element = useRef<HTMLDivElement | null>(null);
    const [showImg, setShowImg] = useState<boolean>(false);

    const [getCheckInOutsWithDate] = useLazyGetCheckInOutsWithDateQuery();
    const [countIn, setCountIn] = useState<number>(0);
    const [countOut, setCountOut] = useState<number>(0);
    const [checkInOut, setCheckInOut] = useState<CheckInOutField[]>([]);

    useEffect(() => {
        if (!checkImgContainer_element.current) return;
        const checkImgContainerElement = checkImgContainer_element.current;
        if (showImg) {
            checkImgContainerElement.classList.add(style.show);
        } else {
            checkImgContainerElement.classList.remove(style.show);
        }
    }, [showImg]);

    const handleShowImg = () => {
        setShowImg(!showImg);
    };

    useEffect(() => {
        const body: GetCheckInOutsWithDateBodyField = {
            type: CheckInOutEnum.IN,
            date: day,
            accountId: account.id,
        };

        getCheckInOutsWithDate(body)
            .then((res) => {
                const resData = res.data;
                console.log('accountId', account.id, resData);
                if (resData?.isSuccess && resData.data) {
                    setCountIn(resData.data.length);
                    setCheckInOut((prev) => [...prev, ...(resData.data || [])]);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, [getCheckInOutsWithDate, account, day]);

    useEffect(() => {
        const body: GetCheckInOutsWithDateBodyField = {
            type: CheckInOutEnum.OUT,
            date: day,
            accountId: account.id,
        };

        getCheckInOutsWithDate(body)
            .then((res) => {
                const resData = res.data;
                console.log('accountId', account.id, resData);
                if (resData?.isSuccess && resData.data) {
                    setCountOut(resData.data.length);
                    setCheckInOut((prev) => [...prev, ...(resData.data || [])]);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, [getCheckInOutsWithDate, account, day]);

    const list_check = checkInOut.map((item, index) => (
        <div className={style.checkGroup} key={index}>
            <div>
                <div>
                    <div>{item.type}</div>
                    <div>{item.note}</div>
                </div>
                <div>
                    <img src={handleSrcImage(item.image || '')} alt="" />
                </div>
            </div>
            <div>inspect</div>
        </div>
    ));

    return (
        <div className={style.parent}>
            <div>
                <div className={style.index}>{index + 1}</div>
                <div className={style.avatar}>
                    <img src={account?.avatar ? handleSrcImage(account.avatar) : avatarnull} alt="avatar" />
                </div>
                <div className={style.name}>{`${account.firstName} ${account.lastName}`}</div>
                <div className={style.in}>{`in (${0}/${countIn})`}</div>
                <div className={style.out}>{`out (${0}/${countOut})`}</div>
                <div className={style.inspect}>Chưa duyệt</div>
                <div className={style.inspectUser}>Chưa có</div>
                <div className={style.seeImage} onClick={() => handleShowImg()}>
                    Xem
                </div>
            </div>
            <div ref={checkImgContainer_element}>{list_check}</div>
        </div>
    );
};

export default memo(OneCheck);
