import React, { FC, useRef, useEffect } from 'react';
import style from './style.module.scss';

import { SubCircleProps } from './type';

interface MySubCircleProps extends React.HTMLProps<SVGSVGElement> {
    subCircle?: SubCircleProps;
    [key: string]: unknown;
}

const SubCircle: FC<MySubCircleProps> = ({ subCircle, className, ...props }) => {
    const parent_element = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (
            parent_element.current &&
            subCircle?.size &&
            subCircle?.background &&
            subCircle?.fill &&
            subCircle?.stroke &&
            subCircle?.animation_time &&
            subCircle?.stroke_width
        ) {
            parent_element.current.style.setProperty('--size', `${subCircle.size}`);
            parent_element.current.style.setProperty('--background', `${subCircle.background}`);
            parent_element.current.style.setProperty('--fill', `${subCircle.fill}`);
            parent_element.current.style.setProperty('--stroke', `${subCircle.stroke}`);
            parent_element.current.style.setProperty('--animation-time', `${subCircle.animation_time}`);
            parent_element.current.style.setProperty('--stroke-width', `${subCircle.stroke_width}`);
        }
    }, [subCircle]);

    return (
        <svg
            className={`${style.parent} ${className || ''}`}
            ref={parent_element}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <circle cx="12" cy="12" r="12" />
            <path d="M3,12 L21,12 Z" />
            {props.children}
        </svg>
    );
};

// eslint-disable-next-line import/no-unused-modules
export default React.memo(SubCircle);
