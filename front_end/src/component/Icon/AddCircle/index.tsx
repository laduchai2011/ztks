import React, { FC, useRef, useEffect } from 'react';
import style from './style.module.scss';

import { AddCircleProps } from './type';

interface MyAddCircleProps extends React.HTMLProps<SVGSVGElement> {
    addCircle?: AddCircleProps;
    [key: string]: unknown;
}

const AddCircle: FC<MyAddCircleProps> = ({ addCircle, className, ...props }) => {
    const parent_element = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (
            parent_element.current &&
            addCircle?.size &&
            addCircle?.background &&
            addCircle?.fill &&
            addCircle?.stroke &&
            addCircle?.animation_time &&
            addCircle?.stroke_width
        ) {
            parent_element.current.style.setProperty('--size', `${addCircle.size}`);
            parent_element.current.style.setProperty('--background', `${addCircle.background}`);
            parent_element.current.style.setProperty('--fill', `${addCircle.fill}`);
            parent_element.current.style.setProperty('--stroke', `${addCircle.stroke}`);
            parent_element.current.style.setProperty('--animation-time', `${addCircle.animation_time}`);
            parent_element.current.style.setProperty('--stroke-width', `${addCircle.stroke_width}`);
        }
    }, [addCircle]);

    return (
        <svg
            className={`${style.parent} ${className || ''}`}
            ref={parent_element}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <circle cx="12" cy="12" r="12" />
            <path d="M12,3 L12,21 Z M3,12 L21,12 Z" />
            {props.children}
        </svg>
    );
};

// eslint-disable-next-line import/no-unused-modules
export default React.memo(AddCircle);
