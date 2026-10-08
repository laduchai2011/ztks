import { memo, useState, useRef, useEffect } from 'react';
import style from './style.module.scss';
import { IoMdAdd } from 'react-icons/io';
import { ADD, CREATE } from '@src/const/text';

const CreateTeam = () => {
    const create_container_element = useRef<HTMLDivElement | null>(null);

    const [selected_type, set__selected_type] = useState<string | null>(null);
    const [is_show, set__is_show] = useState<boolean>(false);

    useEffect(() => {
        if (!create_container_element.current) return;
        const createContainerElement = create_container_element.current;

        if (is_show) {
            createContainerElement.classList.add(style.is_show);
        } else {
            createContainerElement.classList.remove(style.is_show);
        }
    }, [is_show]);

    const handle_Show = () => {
        set__is_show(!is_show);
    };

    const handle_Type_Click = (type: string) => {
        set__selected_type(type);
    };

    const handle_Type_Style = (type: string) => {
        switch (selected_type) {
            case 'sale': {
                if (type === selected_type) {
                    return style.selected_sale;
                }
                return;
            }
            case 'store': {
                if (type === selected_type) {
                    return style.selected_store;
                }
                return;
            }
            default: {
                //statements;
                break;
            }
        }
    };

    return (
        <div className={style.parent}>
            <div className={style.icon}>
                <IoMdAdd onClick={() => handle_Show()} size={25} color="green" title={ADD} />
            </div>
            <div className={style.create_container} ref={create_container_element}>
                <div className={style.create}>
                    <div className={style.name}>
                        <input placeholder="Tên gợi nhớ" />
                    </div>
                    <div className={style.type}>
                        <div>
                            <div className={handle_Type_Style('sale')} onClick={() => handle_Type_Click('sale')}>
                                Bán hàng
                            </div>
                        </div>
                        <div>
                            <div className={handle_Type_Style('store')} onClick={() => handle_Type_Click('store')}>
                                Kho
                            </div>
                        </div>
                    </div>
                    <div className={style.btn_container}>
                        <div title={CREATE}>{CREATE}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(CreateTeam);
