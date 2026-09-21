import { memo, useRef, useEffect } from 'react';
import style from './style.module.scss';
import Loading from '@src/component/Loading';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux';
import { LoadProps, LineCircleLoadProps } from '@src/component/Loading/type';
import { LOAD_COMPONENTS_CONST } from '@src/component/Loading/const';

const MyLoading = () => {
    const parent_element = useRef<HTMLDivElement | null>(null);
    const isLoading = useSelector((state: RootState) => state.OaSettingSlice.isLoading);

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        if (isLoading) {
            parentElement.classList.add(style.display);
            const timeout1 = setTimeout(() => {
                parentElement.classList.add(style.opacity);
                clearTimeout(timeout1);
            }, 50);
        } else {
            parentElement.classList.remove(style.opacity);
            const timeout2 = setTimeout(() => {
                parentElement.classList.remove(style.display);
                clearTimeout(timeout2);
            }, 550);
        }
    }, [isLoading]);

    const lineCircleLoad: LineCircleLoadProps = {
        lineSize: 3,
        lineBackgroundColor: 'blue',
        circleSize: 50,
    };

    const load: LoadProps = {
        type: LOAD_COMPONENTS_CONST.LOADING_TYPE.LINE_CIRCLE,
        infor: lineCircleLoad,
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <Loading className={style.loadding} load={load} />
        </div>
    );
};

export default memo(MyLoading);
