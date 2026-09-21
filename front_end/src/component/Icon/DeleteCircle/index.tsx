import React, { FC, useRef, useEffect } from 'react';
import style from './style.module.scss';

import { DeleteCircleProps } from './type';

interface MyDeleteCircleProps extends React.HTMLProps<SVGSVGElement> {
    deleteCircle?: DeleteCircleProps;
    [key: string]: unknown;
}

const DeleteCircle: FC<MyDeleteCircleProps> = ({ deleteCircle, className, ...props }) => {
    const parent_element = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (
            parent_element.current &&
            deleteCircle?.size &&
            deleteCircle?.background &&
            deleteCircle?.fill &&
            deleteCircle?.stroke &&
            deleteCircle?.animation_time &&
            deleteCircle?.stroke_width
        ) {
            parent_element.current.style.setProperty('--size', `${deleteCircle.size}`);
            parent_element.current.style.setProperty('--background', `${deleteCircle.background}`);
            parent_element.current.style.setProperty('--fill', `${deleteCircle.fill}`);
            parent_element.current.style.setProperty('--stroke', `${deleteCircle.stroke}`);
            parent_element.current.style.setProperty('--animation-time', `${deleteCircle.animation_time}`);
            parent_element.current.style.setProperty('--stroke-width', `${deleteCircle.stroke_width}`);
        }
    }, [deleteCircle]);

    return (
        <svg
            className={`${style.parent} ${className || ''}`}
            ref={parent_element}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <circle cx="12" cy="12" r="12" />
            <path d="M5,5 L19,19 Z M5,19 L19,5 Z" />
            {props.children}
        </svg>
    );
};

export default React.memo(DeleteCircle);
