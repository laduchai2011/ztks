import { FC, memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { MdCall, MdWifiCalling3 } from 'react-icons/md';
import { CallTypeEnum, CallTypeType } from '@src/dataStruct/call';

const Call: FC<{ setIsRinging: React.Dispatch<React.SetStateAction<boolean>> }> = ({ setIsRinging }) => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);

    const handleIsRinging = (value: boolean) => {
        setIsRinging(value);
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <MdCall onClick={() => handleIsRinging(true)} size={40} color="greenyellow" />
        </div>
    );
};

export default memo(Call);
