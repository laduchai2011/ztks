import { FC, memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import LazyImage from '@src/component/LazyImage';
import { FaPlay } from 'react-icons/fa6';
import { MessageVideoField } from '@src/dataStruct/hookData';
import { setData_playVideo } from '@src/redux/slice/Message';

function getThumbnailFromVideo(url: string, seekTime = 1): Promise<string> {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.src = url;
        video.crossOrigin = 'anonymous';
        video.muted = true;
        video.playsInline = true;

        video.onloadedmetadata = () => {
            video.currentTime = Math.min(seekTime, video.duration);
        };

        video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('No canvas context');

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', 0.8));
        };

        video.onerror = reject;
    });
}

const Thumbnail: FC<{ data: MessageVideoField }> = ({ data }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [thumbnail, setThumbnail] = useState<string>('')
    
    useEffect(() => {
        getThumbnailFromVideo(data.attachment.payload.elements[0].url)
        .then(setThumbnail)
        .catch(err => console.error(err))
    }, [data]);

    const handlePlay = () => {
        dispatch(setData_playVideo({ isPlay: true, src: data.attachment.payload.elements[0].url }));
    };

    return (
        <div className={style.parent}>
            {/* <LazyImage className={style.image} src={data.attachment.payload.elements[0].thumbnail} alt="img" /> */}
              <LazyImage className={style.image} src={thumbnail} alt="img" />
            <FaPlay className={style.playIcon} onClick={() => handlePlay()} />
        </div>
    );
};

export default memo(Thumbnail);
