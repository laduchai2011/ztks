import { FC, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { HOME, VOUCHER, ORDER, SIGNIN } from '@src/const/text';
import { route_enum, select_enum, selected_type } from '@src/router/type';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const Header: FC<{ selected: selected_type }> = ({ selected }) => {
    const navigate = useNavigate();
    const list_element = useRef<HTMLDivElement | null>(null);
    const [isMore, setIsMore] = useState<boolean>(false);

    useEffect(() => {
        if (!list_element.current) return;
        const listElement = list_element.current;

        if (isMore) {
            listElement.classList.add(style.show);
        } else {
            listElement.classList.remove(style.show);
        }
    }, [isMore]);

    const handleMore = (_isMore: boolean) => {
        setIsMore(_isMore);
    };

    const handleSelect = (selected: selected_type) => {
        switch (selected) {
            case select_enum.HOME: {
                navigate(route_enum.HOME);
                break;
            }
            case select_enum.VOUCHER: {
                navigate(route_enum.VOUCHER);
                break;
            }
            case select_enum.ORDER: {
                navigate(route_enum.ORDER);
                break;
            }
            case select_enum.SIGNIN: {
                navigate(route_enum.SIGNIN);
                break;
            }
            default: {
                //statements;
                break;
            }
        }
    };

    return (
        <div className={style.parent}>
            <div className={style.selectedContainer}>
                <div className={style.txt}>{selected}</div>
                <div className={style.icons}>
                    {!isMore && <FiChevronDown onClick={() => handleMore(true)} />}
                    {isMore && <FiChevronUp onClick={() => handleMore(false)} />}
                </div>
            </div>
            <div className={style.list} ref={list_element}>
                <div onClick={() => handleSelect(select_enum.HOME)}>{HOME}</div>
                <div onClick={() => handleSelect(select_enum.VOUCHER)}>{VOUCHER}</div>
                <div onClick={() => handleSelect(select_enum.ORDER)}>{ORDER}</div>
                <div onClick={() => handleSelect(select_enum.SIGNIN)}>{SIGNIN}</div>
            </div>
        </div>
    );
};

export default Header;
