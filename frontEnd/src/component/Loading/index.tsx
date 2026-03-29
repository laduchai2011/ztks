import React, { FC } from 'react';
import style from './style.module.scss';

import { LoadProps, DotCircleLoadProps, LineCircleLoadProps, SkeletonLoadProps } from './type';

import { LOAD_COMPONENTS_CONST } from './const';

import DotCircle from './components/DotCircle';
import LineCircle from './components/LineCircle';
import Skeleton from './components/Skeleton';

interface MyLoadProps extends React.HTMLProps<HTMLDivElement> {
    load: LoadProps;
    [key: string]: unknown;
}

const Loading: FC<MyLoadProps> = ({ load, className, ...props }) => {
    const infor_m: DotCircleLoadProps | LineCircleLoadProps | SkeletonLoadProps = load.infor;

    switch (load.type) {
        case LOAD_COMPONENTS_CONST.LOADING_TYPE.DOT_CIRCLE: {
            const infor = infor_m as DotCircleLoadProps;
            if (
                !(
                    typeof infor.dotSize === 'string' &&
                    typeof infor.dotBackgroundColor === 'string' &&
                    typeof infor.dotAmount === 'string' &&
                    typeof infor.circleSize === 'string'
                )
            ) {
                console.warn({
                    type: 'Data type NOT valid',
                    message: `Loading type is a ${LOAD_COMPONENTS_CONST.LOADING_TYPE.DOT_CIRCLE}, when data type is NOT a DotCircleLoadProps`,
                });
            }
            break;
        }
        case LOAD_COMPONENTS_CONST.LOADING_TYPE.LINE_CIRCLE: {
            const infor = infor_m as LineCircleLoadProps;
            if (
                !(
                    typeof infor.lineSize === 'number' &&
                    typeof infor.lineBackgroundColor === 'string' &&
                    typeof infor.circleSize === 'number'
                )
            ) {
                console.warn({
                    type: 'Data type NOT valid',
                    message: `Loading type is a ${LOAD_COMPONENTS_CONST.LOADING_TYPE.LINE_CIRCLE}, when data type is NOT a LineCircleLoadProps`,
                });
            }
            break;
        }
        case LOAD_COMPONENTS_CONST.LOADING_TYPE.SKELETON: {
            const infor = infor_m as SkeletonLoadProps;
            if (
                !(
                    (typeof infor.width === 'number' || infor.width === undefined) &&
                    (infor.maxminWidth === 'max' || infor.maxminWidth === 'min' || infor.maxminWidth === undefined) &&
                    (typeof infor.height === 'number' || infor.height === undefined) &&
                    (infor.maxminHeight === 'max' || infor.maxminHeight === 'min' || infor.maxminHeight === undefined)
                )
            ) {
                console.warn({
                    type: 'Data type NOT valid',
                    message: `Loading type is a ${LOAD_COMPONENTS_CONST.LOADING_TYPE.SKELETON}, when data type is NOT a SkeletonLoadProps`,
                });
            }
            break;
        }
        default: {
            break;
        }
    }

    return (
        <div className={`${style.parent} ${className || ''}`} {...props}>
            {load.type === LOAD_COMPONENTS_CONST.LOADING_TYPE.DOT_CIRCLE && (
                <DotCircle dotCircleLoad={load.infor as DotCircleLoadProps} />
            )}
            {load.type === LOAD_COMPONENTS_CONST.LOADING_TYPE.LINE_CIRCLE && (
                <LineCircle lineCircleLoad={load.infor as LineCircleLoadProps} />
            )}
            {load.type === LOAD_COMPONENTS_CONST.LOADING_TYPE.SKELETON && (
                <Skeleton skeletonLoad={load.infor as SkeletonLoadProps} />
            )}
        </div>
    );
};

export default React.memo(Loading);
