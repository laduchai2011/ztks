import React, { FC, useEffect } from 'react';
import style from './style.module.scss';

import { DotCircleLoadProps } from '../../type';

import { $$ } from '@src/tricks';

const DotCircle: FC<{ dotCircleLoad: DotCircleLoadProps }> = ({ dotCircleLoad }) => {
    useEffect(() => {
        const q_dots = $$(style.dot);

        for (let i: number = 0; i < q_dots.length; i++) {
            if (q_dots !== undefined) {
                const q_dot = q_dots[i] as HTMLElement;
                q_dot.style.setProperty('--dot-index', `${i + 1}`);
                q_dot.style.setProperty('--dotSize', dotCircleLoad.dotSize);
                q_dot.style.setProperty('--dotBackgroundColor', dotCircleLoad.dotBackgroundColor);
                q_dot.style.setProperty('--dotAmount', dotCircleLoad.dotAmount);
                q_dot.style.setProperty('--circleSize', `${dotCircleLoad.circleSize}px`);
            }
        }
    }, [dotCircleLoad]);

    const spanArr: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

    const list_dot: React.ReactNode = spanArr.map((_: number, index: number) => {
        return <span className={style.dot} key={index} />;
    });

    return (
        <div className={style.parent}>
            <div>{list_dot}</div>
        </div>
    );
};

export default React.memo(DotCircle);
