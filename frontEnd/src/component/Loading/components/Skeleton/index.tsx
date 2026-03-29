import React, { FC, useEffect, useRef } from 'react';
import style from './style.module.scss';

import { SkeletonLoadProps } from '../../type';

const Skeleton: FC<{ skeletonLoad: SkeletonLoadProps }> = ({ skeletonLoad }) => {
    const myElementRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (myElementRef.current) {
            if (skeletonLoad.maxminWidth === undefined) {
                myElementRef.current.style.setProperty('--width', `${skeletonLoad.width}px`);
            } else {
                if (skeletonLoad.maxminWidth === 'max') {
                    myElementRef.current.style.setProperty('--width', '100%');
                } else if (skeletonLoad.maxminWidth === 'min') {
                    myElementRef.current.style.setProperty('--width', 'min-content');
                } else {
                    console.warn('The maxminWidth value of skeletonLoad is invalid. It only recive values: [max, min]');
                }
            }

            if (skeletonLoad.maxminHeight === undefined) {
                myElementRef.current.style.setProperty('--height', `${skeletonLoad.height}px`);
            } else {
                if (skeletonLoad.maxminHeight === 'max') {
                    myElementRef.current.style.setProperty('--height', '100%');
                } else if (skeletonLoad.maxminHeight === 'min') {
                    myElementRef.current.style.setProperty('--height', 'min-content');
                } else {
                    console.warn(
                        'The maxminHeight value of skeletonLoad is invalid. It only recive values: [max, min]'
                    );
                }
            }
        }
    }, [skeletonLoad]);

    return <div className={`${style.parent} ${style.loading}`} ref={myElementRef}></div>;
};

export default React.memo(Skeleton);
