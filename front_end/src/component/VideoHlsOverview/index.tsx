import { FC, memo, useRef, useState, useEffect } from 'react';
import style from './style.module.scss';
import VideoHls from '../VideoHls';
import LazyImg from '../LazyImg';

interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> {
    srcVideo?: string;
    srcImage?: string;
    onFailure?: () => void;
    isPlay?: boolean;
    alt?: string;
    root?: Element | Document | null | undefined;
}

const VideoHlsOverview: FC<ComponentProps> = ({
    srcVideo,
    srcImage,
    onFailure,
    isPlay,
    alt,
    root,
    className,
    ...props
}) => {
    const parent_element = useRef<HTMLDivElement>(null);

    const [myIsPlay, setMyIsPlay] = useState<boolean | undefined>(isPlay);

    useEffect(() => {
        setMyIsPlay(isPlay);
    }, [isPlay]);

    const handle_btn_onMouseEnter = () => {
        setMyIsPlay(true);
    };

    const handle_btn_onMouseOut = () => {
        setMyIsPlay(false);
    };

    return (
        <div
            className={`${style.parent} ${className || ''}`}
            {...props}
            ref={parent_element}
            onMouseEnter={() => handle_btn_onMouseEnter()}
            onMouseOut={() => handle_btn_onMouseOut()}
        >
            {!myIsPlay && <LazyImg className={style.image} srcImg={srcImage} alt={alt} root={root} />}
            {myIsPlay && (
                <VideoHls className={style.videoHls} srcVideo={srcVideo} onFailure={onFailure} autoPlay muted />
            )}
        </div>
    );
};

export default memo(VideoHlsOverview);
