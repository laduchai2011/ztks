import React, { FC, useRef, useEffect } from 'react';
import style from './style.module.scss';

import { BigRightArrowProps } from './type';

interface MyBigRightArrowProps extends React.HTMLProps<SVGSVGElement> {
    bigRightArrow?: BigRightArrowProps;
    [key: string]: unknown;
}

const BigRightArrow: FC<MyBigRightArrowProps> = ({ bigRightArrow, className, ...props }) => {
    const parent_element = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (parent_element.current && bigRightArrow?.fill && bigRightArrow?.stroke && bigRightArrow?.stroke_width) {
            parent_element.current.style.setProperty('--fill', `${bigRightArrow.fill}`);
            parent_element.current.style.setProperty('--stroke', `${bigRightArrow.stroke}`);
            parent_element.current.style.setProperty('--stroke-width', `${bigRightArrow.stroke_width}`);
        }
    }, [bigRightArrow]);

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
            <path d="M12,0 L24,12 L12,24 L0,24 L12,12 L0,0 L12,0 Z" />
            <path d="M6,0 L18,12 L6,24 L18,12 L6,0 Z" />
            {props.children}
        </svg>
    );
};

// eslint-disable-next-line import/no-unused-modules
export default React.memo(BigRightArrow);
