import React, { FC, useEffect, useRef } from 'react';
import style from './style.module.scss';

import { LineCircleLoadProps } from '../../type';

const LineCircle: FC<{ lineCircleLoad: LineCircleLoadProps }> = ({ lineCircleLoad }) => {
    const circleSize: number = lineCircleLoad.circleSize;
    const lineSize: number = lineCircleLoad.lineSize;
    const lineBackgroundColor: string = lineCircleLoad.lineBackgroundColor;
    const amplify: number = circleSize / 150;
    const r = (circleSize - lineSize) / 2;

    const myElementRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (myElementRef.current) {
            myElementRef.current.style.setProperty('--lineBackgroundColor', lineBackgroundColor);
            myElementRef.current.style.setProperty('--lineSize', `${lineSize}`);
            myElementRef.current.style.setProperty('--circleSize', `${circleSize}px`);
            myElementRef.current.style.setProperty('--amplify', `${amplify}`);
        }
    }, [circleSize, lineBackgroundColor, lineSize, amplify]);

    return (
        <div className={style.parent} ref={myElementRef}>
            <svg>
                <circle cx={`${circleSize / 2}`} cy={`${circleSize / 2}`} r={r} />
            </svg>
        </div>
    );
};

export default React.memo(LineCircle);
