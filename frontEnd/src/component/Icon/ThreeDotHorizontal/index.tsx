import React, { FC } from 'react';
import style from './style.module.scss';

import { ThreeDotHorizontalProps } from './type';

interface MyThreeDotHorizontalProps extends React.HTMLProps<SVGSVGElement> {
    threeDotHorizontal?: ThreeDotHorizontalProps;
    [key: string]: unknown;
}

const ThreeDotHorizontal: FC<MyThreeDotHorizontalProps> = ({ className, ...props }) => {
    return (
        <svg
            className={`${style.parent} ${className || ''}`}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            {...props}
        >
            <circle r="2" cx="6" cy="12" fill="black" />
            <circle r="2" cx="12" cy="12" fill="black" />
            <circle r="2" cx="18" cy="12" fill="black" />
            {props.children}
        </svg>
    );
};

// eslint-disable-next-line import/no-unused-modules
export default React.memo(ThreeDotHorizontal);
