import { memo, useState, useRef, useEffect } from 'react';
import style from './style.module.scss';
import { IoMdAdd } from 'react-icons/io';
import { ADD } from '@src/const/text';

const AddMember = () => {
    const add_container_element = useRef<HTMLDivElement | null>(null);

    const [is_show, set__is_show] = useState<boolean>(false);

    useEffect(() => {
        if (!add_container_element.current) return;
        const addContainerElement = add_container_element.current;

        if (is_show) {
            addContainerElement.classList.add(style.is_show);
        } else {
            addContainerElement.classList.remove(style.is_show);
        }
    }, [is_show]);

    const handle_Show = () => {
        set__is_show(!is_show);
    };

    return (
        <div className={style.parent}>
            <div className={style.icon}>
                <IoMdAdd onClick={() => handle_Show()} size={25} color="green" title={ADD} />
            </div>
            <div className={style.add_container} ref={add_container_element}>
                <div className={style.add}>
                    <div className={style.name}>
                        <input placeholder="Định danh" />
                    </div>
                    <div className={style.btn_container}>
                        <div title={ADD}>{ADD}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(AddMember);
