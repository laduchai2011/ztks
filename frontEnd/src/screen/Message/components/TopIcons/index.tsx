import { memo } from 'react';
import style from './style.module.scss';
import { LuNotebookPen } from 'react-icons/lu';

const TopIcons = () => {
    return (
        <div className={style.parent}>
            <LuNotebookPen size={25} />
        </div>
    );
};

export default memo(TopIcons);
