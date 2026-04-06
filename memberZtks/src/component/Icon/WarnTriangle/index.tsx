import React, { FC, useRef, useEffect } from 'react';
import style from './style.module.scss';

import { WarnTriangleProps } from './type';

interface MyWarnTriangleProps extends React.HTMLProps<SVGSVGElement> {
    warnTriangle?: WarnTriangleProps;
    [key: string]: unknown;
}

const WarnTriangle: FC<MyWarnTriangleProps> = ({ warnTriangle, className, ...props }) => {
    const parent_element = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (
            parent_element.current &&
            warnTriangle?.size &&
            warnTriangle?.background &&
            warnTriangle?.fill &&
            warnTriangle?.stroke &&
            warnTriangle?.animation_time &&
            warnTriangle?.stroke_width
        ) {
            parent_element.current.style.setProperty('--size', `${warnTriangle.size}`);
            parent_element.current.style.setProperty('--background', `${warnTriangle.background}`);
            parent_element.current.style.setProperty('--fill', `${warnTriangle.fill}`);
            parent_element.current.style.setProperty('--stroke', `${warnTriangle.stroke}`);
            parent_element.current.style.setProperty('--animation-time', `${warnTriangle.animation_time}`);
            parent_element.current.style.setProperty('--stroke-width', `${warnTriangle.stroke_width}`);
        }
    }, [warnTriangle]);

    return (
        <svg
            className={`${style.parent} ${className || ''}`}
            ref={parent_element}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M1.608,18 L12,0 L22.4,18 Z M12,3 L12,13 Z M12,15 L12,16 Z" />
            {props.children}
        </svg>
    );
};

export default React.memo(WarnTriangle);
