import React, { FC, useRef, useEffect } from 'react';
import style from './style.module.scss';

import { ErrorCircleProps } from './type';

interface MyErrorCircleProps extends React.HTMLProps<SVGSVGElement> {
    errorCircle?: ErrorCircleProps;
    [key: string]: unknown;
}

const ErrorCircle: FC<MyErrorCircleProps> = ({ errorCircle, className, ...props }) => {
    const parent_element = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (
            parent_element.current &&
            errorCircle?.size &&
            errorCircle?.background &&
            errorCircle?.fill &&
            errorCircle?.stroke &&
            errorCircle?.animation_time &&
            errorCircle?.stroke_width
        ) {
            parent_element.current.style.setProperty('--size', `${errorCircle.size}`);
            parent_element.current.style.setProperty('--background', `${errorCircle.background}`);
            parent_element.current.style.setProperty('--fill', `${errorCircle.fill}`);
            parent_element.current.style.setProperty('--stroke', `${errorCircle.stroke}`);
            parent_element.current.style.setProperty('--animation-time', `${errorCircle.animation_time}`);
            parent_element.current.style.setProperty('--stroke-width', `${errorCircle.stroke_width}`);
        }
    }, [errorCircle]);

    return (
        <svg
            className={`${style.parent} ${className || ''}`}
            ref={parent_element}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <circle cx="12" cy="12" r="12" />
            <path d="M12,3 L12,16 Z M12,18 L12,19 Z" />
            {props.children}
        </svg>
    );
};

export default React.memo(ErrorCircle);
