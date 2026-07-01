import { memo, FC, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { CLOSE, SEND } from '@src/const/text';
import { CallTypeEnum, CallTypeType } from '@src/dataStruct/call';

const RequestConsent: FC<{ isShow: boolean; setIsShow: React.Dispatch<React.SetStateAction<boolean>> }> = ({
    isShow,
    setIsShow,
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const options_element = useRef<HTMLDivElement | null>(null);
    const [isShowOptions, setIsShowOptions] = useState<boolean>(false);
    const [selectedCallType, setSelectedCallType] = useState<CallTypeType>(CallTypeEnum.AUDIO);

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        if (isShow) {
            parentElement.classList.add(style.isShow);
        } else {
            parentElement.classList.remove(style.isShow);
        }
    }, [isShow]);

    useEffect(() => {
        if (!options_element.current) return;
        const optionsElement = options_element.current;

        if (isShowOptions) {
            optionsElement.classList.add(style.isShow);
        } else {
            optionsElement.classList.remove(style.isShow);
        }
    }, [isShowOptions]);

    const handleClose = () => {
        setIsShow(false);
    };

    const handleIsShowOptions = (value: boolean) => {
        setIsShowOptions(value);
    };

    const handleTextCallType = (callType: CallTypeType) => {
        switch (callType) {
            case CallTypeEnum.AUDIO:
                return 'Chỉ âm thanh';
            case CallTypeEnum.VIDEO:
                return 'Chỉ thước phim';
            case CallTypeEnum.AUDIO_AND_VIDEO:
                return 'Cả âm thanh và thước phim';
            default:
                return 'Chọn loại cuộc gọi';
        }
    };

    const handleSelectCallType = (callType: CallTypeType) => {
        setSelectedCallType(callType);
        setIsShowOptions(false);
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.closeContainer}>
                <IoMdClose onClick={() => handleClose()} size={15} title={CLOSE} />
            </div>
            <div className={style.phone}>
                <div>1 - Nhập số điện thoại của zalo này</div>
                <div>
                    <input placeholder="Số điện thoại" />
                </div>
            </div>
            <div className={style.callType}>
                <div>2 - Chọn loại cuộc gọi</div>
                <div className={style.select}>
                    <div className={style.selected}>
                        <div>{handleTextCallType(selectedCallType)}</div>
                        <div>
                            {isShowOptions ? (
                                <FiChevronUp onClick={() => handleIsShowOptions(false)} />
                            ) : (
                                <FiChevronDown onClick={() => handleIsShowOptions(true)} />
                            )}
                        </div>
                    </div>
                    <div className={style.options} ref={options_element}>
                        <div onClick={() => handleSelectCallType(CallTypeEnum.AUDIO)}>
                            {handleTextCallType(CallTypeEnum.AUDIO)}
                        </div>
                        <div onClick={() => handleSelectCallType(CallTypeEnum.VIDEO)}>
                            {handleTextCallType(CallTypeEnum.VIDEO)}
                        </div>
                        <div onClick={() => handleSelectCallType(CallTypeEnum.AUDIO_AND_VIDEO)}>
                            {handleTextCallType(CallTypeEnum.AUDIO_AND_VIDEO)}
                        </div>
                    </div>
                </div>
            </div>
            <div className={style.send}>
                <div>3 - Gửi yêu cầu</div>
                <div>
                    <button>{SEND}</button>
                </div>
            </div>
        </div>
    );
};

export default memo(RequestConsent);
