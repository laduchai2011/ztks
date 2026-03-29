import { memo } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { IoCloseSharp } from 'react-icons/io5';
import { setData_playVideo } from '@src/redux/slice/Message';

const PlayVideo = () => {
    const dispatch = useDispatch<AppDispatch>();
    const data = useSelector((state: RootState) => state.MessageSlice.playVideo);

    const handleClose = () => {
        dispatch(setData_playVideo({ isPlay: false, src: '' }));
    };

    return (
        data.isPlay && (
            <div className={style.parent}>
                <div className={style.main}>
                    <div className={style.main1}>
                        <div className={style.iconContainer}>
                            <IoCloseSharp className={style.closeIcon} onClick={() => handleClose()} />
                        </div>
                        <video src={data.src} controls autoPlay />
                    </div>
                </div>
            </div>
        )
    );
};

export default memo(PlayVideo);
