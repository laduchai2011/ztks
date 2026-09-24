import { memo, useEffect, useRef } from 'react';
import style from './style.module.scss';
import Loading from '@src/component/Loading';
import { LoadProps, LineCircleLoadProps } from '@src/component/Loading/type';
import { LOAD_COMPONENTS_CONST } from '@src/component/Loading/const';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux';

const DialogLoading = () => {
    const parent_element = useRef<HTMLDivElement | null>(null);
    const is_show: boolean = useSelector((state: RootState) => state.Oa_Setting_Slice.dialog_loading.is_show);

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        if (is_show) {
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
    }, [is_show]);

    const lineCircleLoad: LineCircleLoadProps = {
        lineSize: 10,
        lineBackgroundColor: 'blue',
        circleSize: 100,
    };

    const load: LoadProps = {
        type: LOAD_COMPONENTS_CONST.LOADING_TYPE.LINE_CIRCLE,
        infor: lineCircleLoad,
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <Loading className={style.loadding} load={load} />
                <div className={style.text}>Vui lòng chờ</div>
            </div>
        </div>
    );
};

export default memo(DialogLoading);
