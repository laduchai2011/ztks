import React, { FC } from 'react';
import style from './style.module.scss';

import { ThreeDotVerticalProps } from './type';

interface MyThreeDotHorizontalProps extends React.HTMLProps<SVGSVGElement> {
    threeDotVertical?: ThreeDotVerticalProps;
    [key: string]: unknown;
}

const ThreeDotVertical: FC<MyThreeDotHorizontalProps> = ({ className, ...props }) => {
    return (
        <svg
            className={`${style.parent} ${className || ''}`}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            {...props}
        >
            <circle r="2" cx="12" cy="6" fill="black" />
            <circle r="2" cx="12" cy="12" fill="black" />
            <circle r="2" cx="12" cy="18" fill="black" />
            {props.children}
        </svg>
    );
};

// eslint-disable-next-line import/no-unused-modules
export default React.memo(ThreeDotVertical);
