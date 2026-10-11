import { FC, memo, useState, useRef, useEffect } from 'react';
import style from './style.module.scss';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { SEE_MORE, HIDDEN } from '@src/const/text';
import { Store_Field } from '@src/data_struct/shop';
import { set__selected_store, set__is_show_store_list_dialog } from '@src/redux/slice/Team_Detail';

const OneStore: FC<{ data: Store_Field; index: number }> = ({ data, index }) => {
    const dispatch = useDispatch<AppDispatch>();

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

    const handle_Selected = () => {
        dispatch(set__selected_store(data));
        dispatch(set__is_show_store_list_dialog(false));
    };

    const handle_See_More = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        set__is_see_more(!is_see_more);
    };

    return (
        <div className={style.parent} onClick={() => handle_Selected()} ref={parent_element}>
            <div className={style.index}>{index + 1}</div>
            <div className={style.name}>{data.name}</div>
            <div className={style.description}>{data.description}</div>
            <div className={style.content}>
                <div dangerouslySetInnerHTML={{ __html: data.content }} />
            </div>

            <div className={style.see_more} onClick={(e) => handle_See_More(e)}>
                {is_see_more ? HIDDEN : SEE_MORE}
            </div>
        </div>
    );
};

export default memo(OneStore);
