import { memo } from 'react';
import style from './style.module.scss';
import { CiEdit } from 'react-icons/ci';
import { MdDeleteOutline } from 'react-icons/md';

const StoreList = () => {
    const handle_Selected = (data: number) => {
        if (data === 1) {
            return style.selected;
        }
        return;
    };

    const list = [1, 2, 3, 4].map((item, index) => {
        return (
            <div className={`${style.oneRow} ${handle_Selected(item)}`} key={index}>
                <div className={style.infor1}>
                    <div className={style.index}>{index + 1}</div>
                    <div className={style.infor}>
                        <div>1</div>
                        <div>2</div>
                        <div>3</div>
                    </div>
                    <div className={style.icons}>
                        <CiEdit size={20} color="green" />
                        <MdDeleteOutline size={20} color="red" />
                    </div>
                </div>
                <div className={style.infor2}>
                    <div>
                        <div className={style.name}>name</div>
                        <div className={style.des}>description</div>
                        <div className={style.content}>content</div>
                        <div className={style.address}>address address address address address</div>
                        <div className={style.seeAmount}>
                            <div>Xem</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    });
    return <div className={style.parent}>{list}</div>;
};

export default memo(StoreList);
