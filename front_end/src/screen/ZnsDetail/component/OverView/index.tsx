import { memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { useLazyGetZnsTemplateWithIdQuery } from '@src/redux/query/zaloRTK';
import { setData_toastMessage, set_isLoading } from '@src/redux/slice/ZnsDetail';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { AccountField } from '@src/dataStruct/account';
import { ZnsTemplateField } from '@src/dataStruct/zalo';
import { handleSrcImage, formatMoney } from '@src/utility/string';

const OverView = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { id } = useParams<{ id: string }>();

    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);

    const [isShow, setIsShow] = useState<boolean>(false);
    const [znsTemplate, setZnsTemplate] = useState<ZnsTemplateField | undefined>(undefined);
    const [preView, setPreView] = useState<string | undefined>(undefined);
    const [parameters, setParameters] = useState<string[]>(['']);

    const [getZnsTemplateWithId] = useLazyGetZnsTemplateWithIdQuery();

    useEffect(() => {
        if (!znsTemplate) return;
        setParameters(JSON.parse(znsTemplate.dataFields));
        setPreView(handleSrcImage(JSON.parse(znsTemplate.images)[0]));
    }, [znsTemplate]);

    useEffect(() => {
        if (!account) return;
        if (!id) return;

        dispatch(set_isLoading(true));
        getZnsTemplateWithId({ id: Number(id), accountId: account.id })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setZnsTemplate(resData.data);
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(setData_toastMessage({ type: messageType_enum.ERROR, message: 'Đã có lỗi xảy ra !' }));
            })
            .finally(() => {
                dispatch(set_isLoading(false));
            });
    }, [account, id, getZnsTemplateWithId, dispatch]);

    const handleIsShow = () => {
        setIsShow(!isShow);
    };

    const handleIsShowStyle = () => {
        if (isShow) {
            return style.show;
        } else {
            return '';
        }
    };

    const paramter_list = parameters.map((item, index) => {
        return <div key={index}>{item}</div>;
    });

    return (
        <div className={style.parent}>
            <div className={`${style.content} ${handleIsShowStyle()}`}>
                <div className={style.temId}>{znsTemplate?.temId}</div>
                <img className={style.image} src={preView} alt="" />
                <div className={style.fieldsContainer}>
                    <div>Những trường dữ liệu</div>
                    <div>{paramter_list}</div>
                </div>
                <div className={style.cost}>
                    <div>
                        <div>Số điện thoại</div>
                        <div>{formatMoney(znsTemplate?.phoneCost ?? '')}</div>
                    </div>
                    <div>
                        <div>UID</div>
                        <div>{formatMoney(znsTemplate?.uidCost ?? '')}</div>
                    </div>
                </div>
            </div>
            <div className={`${style.btn} ${handleIsShowStyle()}`} onClick={() => handleIsShow()}>
                {isShow ? 'Thu gọn' : 'Mở rộng'}
            </div>
        </div>
    );
};

export default memo(OverView);
