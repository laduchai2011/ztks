import React from 'react';
import style from './style.module.scss';
import { DynamicMenuProps } from './type';

interface MyDynamicMenuProps extends React.HTMLProps<HTMLDivElement> {
    dynamicMenu?: DynamicMenuProps;
    [key: string]: unknown;
}

const DynamicMenu: React.FC<MyDynamicMenuProps> = ({ dynamicMenu, className, ...props }) => {
    const active: boolean | undefined = dynamicMenu?.active;
    return (
        <div className={`${style.parent} ${className || ''}`} {...props}>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="12" />
                <circle cx="7" cy="7" r="1.5" />
                <circle cx="12" cy="7" r="1.5" />
                <circle cx="17" cy="7" r="1.5" />
                <circle cx="7" cy="12" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="17" cy="12" r="1.5" />
                <circle cx="7" cy="17" r="1.5" />
                <circle cx="12" cy="17" r="1.5" />
                <circle cx="17" cy="17" r="1.5" />
            </svg>
            {active && (
                <svg viewBox="0 0 72 24" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: 'rgb(245, 245, 245)', stopOpacity: 1 }} />
                            <stop offset="25%" style={{ stopColor: 'rgb(236, 236, 236)', stopOpacity: 1 }} />
                            <stop offset="50%" style={{ stopColor: 'rgb(233, 233, 233)', stopOpacity: 1 }} />
                            <stop offset="75%" style={{ stopColor: 'rgb(219, 219, 219)', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: 'rgb(201, 201, 201)', stopOpacity: 1 }} />
                        </linearGradient>
                    </defs>
                    <path d="M 24 0 Q 16 16 0 24 L72 24 Q 56 16 48 0 A 12 12 0 0 0 24 0 Z" fill="url(#grad1)" />
                </svg>
            )}
        </div>
    );
};

export default DynamicMenu;
