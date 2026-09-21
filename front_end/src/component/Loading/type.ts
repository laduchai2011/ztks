// define load
export interface LoadProps {
    type: string;
    infor: DotCircleLoadProps | LineCircleLoadProps | SkeletonLoadProps;
}

export interface DotCircleLoadProps {
    dotSize: string;
    dotBackgroundColor: string;
    dotAmount: string;
    circleSize: string;
}

export interface LineCircleLoadProps {
    lineSize: number;
    lineBackgroundColor: string;
    circleSize: number;
}

export interface SkeletonLoadProps {
    width?: number;
    maxminWidth?: 'max' | 'min';
    height?: number;
    maxminHeight?: 'max' | 'min';
}
