import { FC, memo, useRef, useEffect, useState } from 'react';
import style from './style.module.scss';
import { avatarnull } from '@src/utility/string';
import { handleSrcImage } from '@src/utility/string';
import { AccountField } from '@src/dataStruct/account';
import { useLazyGetCheckInOutsWithDateQuery } from '@src/redux/query/checkInOutRTK';
import { CheckInOutEnum, CheckInOutField } from '@src/dataStruct/checkInOut';
import { GetCheckInOutsWithDateBodyField } from '@src/dataStruct/checkInOut/body';
import OneCheck from './component/OneCheck';

const OneCheckMember: FC<{ index: number; account: AccountField; day: string }> = ({ index, account, day }) => {
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

            setCheckInOut(_checkInOunts);
        }
        getCheck();
    }, [getCheckInOutsWithDate, account.id, day]);

    const list_check = checkInOut.map((item, index) => {
        return <OneCheck key={index} data={item} />;
    });

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

export default memo(OneCheckMember);
