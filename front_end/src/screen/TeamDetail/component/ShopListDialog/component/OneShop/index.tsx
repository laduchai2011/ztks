import { memo, useState, useRef, useEffect } from 'react';
import style from './style.module.scss';
import { SEE_MORE, HIDDEN } from '@src/const/text';

const OneShop = () => {
    const parent_element = useRef<HTMLDivElement | null>(null);

    const [is_see_more, set__is_see_more] = useState<boolean>(false);

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        if (is_see_more) {
            parentElement.classList.add(style.is_show);
        } else {
            parentElement.classList.remove(style.is_show);
        }
    }, [is_see_more]);

    const handle_See_More = () => {
        set__is_see_more(!is_see_more);
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.name}>name</div>
            <div className={style.description}>description</div>
            <div className={style.content}>content</div>
            <div className={style.address}>address</div>
            <div className={style.phone}>phone</div>
            <div className={style.see_more} onClick={() => handle_See_More()}>
                {is_see_more ? HIDDEN : SEE_MORE}
            </div>
        </div>
    );
};

export default memo(OneShop);
