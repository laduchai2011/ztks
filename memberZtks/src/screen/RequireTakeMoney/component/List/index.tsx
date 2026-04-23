import { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import Title from './component/Title';
import One from './component/One';
import { RequireTakeMoneyField } from '@src/dataStruct/wallet';
import { MemberZtksGetRequiresTakeMoneyBodyField } from '@src/dataStruct/wallet/body';
import { useLazyMemberZtksGetRequiresTakeMoneyQuery } from '@src/redux/query/walletRTK';

const List = () => {
    const filterBody: MemberZtksGetRequiresTakeMoneyBodyField | undefined = useSelector(
        (state: RootState) => state.RequireTakeMoneySlice.filterBody
    );

    const [requiresTakeMoney, setRequiresTakeMoney] = useState<RequireTakeMoneyField[]>([]);

    const [memberZtksGetRequiresTakeMoney] = useLazyMemberZtksGetRequiresTakeMoneyQuery();

    useEffect(() => {
        if (!filterBody) return;
        memberZtksGetRequiresTakeMoney(filterBody)
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setRequiresTakeMoney(resData.data.items);
                } else {
                    setRequiresTakeMoney([]);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [filterBody, memberZtksGetRequiresTakeMoney]);

    const list_requiresTakeMoney = requiresTakeMoney.map((item, index) => {
        return <One key={item.id} index={index} data={item} />;
    });

    return (
        <div className={style.parent}>
            <div>
                <Title />
            </div>
            <div>{list_requiresTakeMoney}</div>
        </div>
    );
};

export default memo(List);
