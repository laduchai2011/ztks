import React, { FC, useRef, useEffect } from 'react';
import style from './style.module.scss';

import { TickSymbolProps } from './type';

interface MyTickSymbolProps extends React.HTMLProps<SVGSVGElement> {
    tickSymbol?: TickSymbolProps;
    [key: string]: unknown;
}

const TickSymbol: FC<MyTickSymbolProps> = ({ tickSymbol, className, ...props }) => {
    const parent_element = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (
            parent_element.current &&
            tickSymbol?.size &&
            tickSymbol?.background &&
            tickSymbol?.fill &&
            tickSymbol?.stroke &&
            tickSymbol?.animation_time &&
            tickSymbol?.stroke_width
        ) {
            parent_element.current.style.setProperty('--size', `${tickSymbol.size}`);
            parent_element.current.style.setProperty('--background', `${tickSymbol.background}`);
            parent_element.current.style.setProperty('--fill', `${tickSymbol.fill}`);
            parent_element.current.style.setProperty('--stroke', `${tickSymbol.stroke}`);
            parent_element.current.style.setProperty('--animation-time', `${tickSymbol.animation_time}`);
            parent_element.current.style.setProperty('--stroke-width', `${tickSymbol.stroke_width}`);
        }
    }, [tickSymbol]);

    return (
        <svg
            className={`${style.parent} ${className || ''}`}
            ref={parent_element}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <circle cx="12" cy="12" r="12" />
            <path d="M7,11 L12,19 Z M12,18 L18,6 Z" />
            {props.children}
        </svg>
    );
};

export default React.memo(TickSymbol);
