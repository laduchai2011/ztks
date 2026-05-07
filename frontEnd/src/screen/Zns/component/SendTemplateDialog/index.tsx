import { memo, useEffect, useRef, useState, useId } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CLOSE, AGREE, EXIT } from '@src/const/text';
import { setData_toastMessage, set_isLoading, setIsShow_sendTemplateDialog } from '@src/redux/slice/Zns';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { AccountField } from '@src/dataStruct/account';
import { ZaloOaField, ZnsTemplateField, ZnsMessageEnum, ZnsMessageType } from '@src/dataStruct/zalo';
import { EditZnsTemplateBodyField } from '@src/dataStruct/zalo/body';
import { useEditZnsTemplateMutation } from '@src/redux/query/zaloRTK';
import { handleSrcImage } from '@src/utility/string';

const SendTemplateDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);

    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);
    const selectedOa: ZaloOaField | undefined = useSelector((state: RootState) => state.ZnsSlice.selectedOa);
    const isShow: boolean = useSelector((state: RootState) => state.ZnsSlice.sendTemplateDialog.isShow);
    const znsTemplate: ZnsTemplateField | undefined = useSelector(
        (state: RootState) => state.ZnsSlice.sendTemplateDialog.znsTemplate
    );

    const [temId, setTemId] = useState<string>('');
    const [preView, setPreView] = useState<string | undefined>(undefined);
    const [parameters, setParameters] = useState<string[]>(['']);
    const [values, setValues] = useState<string[]>([]);
    const [selectedValue, setSelectedValue] = useState<string>('');
    const [selectedOption, setSelectedOption] = useState<ZnsMessageType>(ZnsMessageEnum.PHONE);
    const [znsTemplate1, setZnsTemplate1] = useState<ZnsTemplateField | undefined>(undefined);
    const [editZnsTemplate] = useEditZnsTemplateMutation();

    useEffect(() => {
        if (!znsTemplate) return;
        setZnsTemplate1(znsTemplate);
    }, [znsTemplate]);

    useEffect(() => {
        if (!znsTemplate1) return;
        setTemId(znsTemplate1.temId);
        setParameters(JSON.parse(znsTemplate1.dataFields));
        setPreView(handleSrcImage(JSON.parse(znsTemplate1.images)[0]));
    }, [znsTemplate1]);

    useEffect(() => {
        for (let i: number = 0; i < parameters.length; i++) {
            setValues((prev) => [...prev, '']);
        }
    }, [parameters]);

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        if (isShow) {
            parentElement.classList.add(style.display);
            const timeout2 = setTimeout(() => {
                parentElement.classList.add(style.opacity);
                clearTimeout(timeout2);
            }, 50);
        } else {
            parentElement.classList.remove(style.opacity);

            const timeout2 = setTimeout(() => {
                parentElement.classList.remove(style.display);
                clearTimeout(timeout2);
            }, 550);
        }
    }, [isShow]);

    const handleValues = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newValue = e.target.value;
        const values_cp = [...values];
        values_cp[index] = newValue;
        setValues(values_cp);
    };

    const handleSelectedOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as ZnsMessageType;
        setSelectedOption(value);
    };

    const handleSelectedValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSelectedValue(value);
    };

    const handleClose = () => {
        dispatch(setIsShow_sendTemplateDialog(false));
    };

    const handleAgree = async () => {
        const data: Record<string, string> = {};

        data[selectedOption] = selectedValue;

        console.log(data);
    };

    const paramter_list = parameters.map((item, index) => {
        return (
            <div className={style.fieldContainer} key={index}>
                <div>{item}</div>
                <input value={values[index]} onChange={(e) => handleValues(e, index)} />
            </div>
        );
    });

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handleClose()} size={25} title={CLOSE} />
                </div>
                <div className={style.contentContainer}>
                    <div className={style.imgContainer}>{preView && <img src={preView} alt="" />}</div>
                    <div className={style.sendVia}>
                        <select onChange={(e) => handleSelectedOption(e)} value={selectedOption}>
                            <option value={ZnsMessageEnum.PHONE}>Số điện thoại</option>
                            <option value={ZnsMessageEnum.UID}>Định danh</option>
                        </select>
                        <input value={selectedValue} onChange={(e) => handleSelectedValue(e)} />
                    </div>
                    <div className={style.fieldsContainer}>{paramter_list}</div>
                </div>
                <div className={style.buttonContainer}>
                    <button onClick={() => handleAgree()}>{AGREE}</button>
                    <button onClick={() => handleClose()}>{EXIT}</button>
                </div>
            </div>
        </div>
    );
};

export default memo(SendTemplateDialog);
