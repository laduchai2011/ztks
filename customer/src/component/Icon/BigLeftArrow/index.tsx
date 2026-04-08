import React, { FC, useRef, useEffect } from 'react';
import style from './style.module.scss';

import { BigLeftArrowProps } from './type';

interface MyBigLeftArrowProps extends React.HTMLProps<SVGSVGElement> {
    bigLeftArrow?: BigLeftArrowProps;
    [key: string]: unknown;
}

const BigLeftArrow: FC<MyBigLeftArrowProps> = ({ bigLeftArrow, className, ...props }) => {
    const parent_element = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (parent_element.current && bigLeftArrow?.fill && bigLeftArrow?.stroke && bigLeftArrow?.stroke_width) {
            parent_element.current.style.setProperty('--fill', `${bigLeftArrow.fill}`);
            parent_element.current.style.setProperty('--stroke', `${bigLeftArrow.stroke}`);
            parent_element.current.style.setProperty('--stroke-width', `${bigLeftArrow.stroke_width}`);
        }
    }, [bigLeftArrow]);

    return (
        <svg
            className={`${style.parent} ${className || ''}`}
            ref={parent_element}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            {...props}
        >
            <path d="M0,0 L24,0 L24,24 L0,24 Z" />
            <path d="M12,0 L0,12 L12,24 L24,24 L12,12 L24,0 L12,0 Z" />
            <path d="M18,0 L6,12 L18,24 L6,12 L18,0 Z" />
            {props.children}
        </svg>
    );
};

// eslint-disable-next-line import/no-unused-modules
export default React.memo(BigLeftArrow);
