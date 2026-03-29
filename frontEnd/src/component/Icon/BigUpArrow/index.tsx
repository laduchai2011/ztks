import React, { FC, useRef, useEffect } from 'react';
import style from './style.module.scss';

import { BigUpArrowProps } from './type';

interface MyBigUpArrowProps extends React.HTMLProps<SVGSVGElement> {
    bigUpArrow?: BigUpArrowProps;
    [key: string]: unknown;
}

const BigUpArrow: FC<MyBigUpArrowProps> = ({ bigUpArrow, className, ...props }) => {
    const parent_element = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (parent_element.current && bigUpArrow?.fill && bigUpArrow?.stroke && bigUpArrow?.stroke_width) {
            parent_element.current.style.setProperty('--fill', `${bigUpArrow.fill}`);
            parent_element.current.style.setProperty('--stroke', `${bigUpArrow.stroke}`);
            parent_element.current.style.setProperty('--stroke-width', `${bigUpArrow.stroke_width}`);
        }
    }, [bigUpArrow]);

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
            <path d="M0,24 L0,12 L12,0 L24,12 L24,24 L12,12 L0,24 Z" />
            <path d="M0,18 L12,6 L24,18 L12,6 L12,6 Z" />
            {props.children}
        </svg>
    );
};

// eslint-disable-next-line import/no-unused-modules
export default React.memo(BigUpArrow);
