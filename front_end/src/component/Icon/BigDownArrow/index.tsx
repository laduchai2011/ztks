import React, { FC, useRef, useEffect } from 'react';
import style from './style.module.scss';

import { BigDownArrowProps } from './type';

interface MyBigDownArrowProps extends React.HTMLProps<SVGSVGElement> {
    bigDownArrow?: BigDownArrowProps;
    [key: string]: unknown;
}

const BigDownArrow: FC<MyBigDownArrowProps> = ({ bigDownArrow, className, ...props }) => {
    const parent_element = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (parent_element.current && bigDownArrow?.fill && bigDownArrow?.stroke && bigDownArrow?.stroke_width) {
            parent_element.current.style.setProperty('--fill', `${bigDownArrow.fill}`);
            parent_element.current.style.setProperty('--stroke', `${bigDownArrow.stroke}`);
            parent_element.current.style.setProperty('--stroke-width', `${bigDownArrow.stroke_width}`);
        }
    }, [bigDownArrow]);

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
            <path d="M0,0 L0,12 L12,24 L24,12 L24,0 L12,12 L0,0 Z" />
            <path d="M0,6 L12,18 L24,6 L12,18 L0,6 Z" />
            {props.children}
        </svg>
    );
};

// eslint-disable-next-line import/no-unused-modules
export default React.memo(BigDownArrow);
