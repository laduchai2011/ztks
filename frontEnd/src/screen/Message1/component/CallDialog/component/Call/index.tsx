import { memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { MdCall, MdWifiCalling3 } from 'react-icons/md';

const Call = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);

    return (
        <div className={style.parent} ref={parent_element}>
            <MdCall size={40} color="greenyellow" />
        </div>
    );
};

export default memo(Call);
