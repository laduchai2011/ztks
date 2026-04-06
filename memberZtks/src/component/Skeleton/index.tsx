import { FC } from 'react';
import style from './style.module.scss';

interface MySkeletonProps extends React.HTMLProps<HTMLDivElement> {
    [key: string]: unknown;
}

const Skeleton: FC<MySkeletonProps> = ({ className, ...props }) => {
    return <div className={`${style.parent} ${className || ''}`} {...props} />;
};

export default Skeleton;
