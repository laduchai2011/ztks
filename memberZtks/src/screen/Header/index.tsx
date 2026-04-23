import { FC, useEffect, useRef } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { HOME, VOUCHER, REQUIRE_TAKE_MONEY } from '@src/const/text';
import { route_enum, select_enum, selected_type } from '@src/router/type';

const Header: FC<{ selected: selected_type }> = ({ selected }) => {
    const navigate = useNavigate();
    const center_element = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const centerElement = center_element.current;
        if (!centerElement) return;
        const childs = centerElement.children;

        switch (selected) {
            case select_enum.HOME: {
                childs[0].classList.add(style.selected);
                break;
            }
            case select_enum.VOUCHER: {
                childs[1].classList.add(style.selected);
                break;
            }
            case select_enum.REQUIRE_TAKE_MONEY: {
                childs[2].classList.add(style.selected);
                break;
            }
            default: {
                //statements;
                break;
            }
        }
    }, [selected]);

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
            case select_enum.REQUIRE_TAKE_MONEY: {
                navigate(route_enum.REQUIRE_TAKE_MONEY);
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
            <div className={style.left}></div>
            <div className={style.center} ref={center_element}>
                <div onClick={() => handleSelect(select_enum.HOME)}>{HOME}</div>
                <div onClick={() => handleSelect(select_enum.VOUCHER)}>{VOUCHER}</div>
                <div onClick={() => handleSelect(select_enum.REQUIRE_TAKE_MONEY)}>{REQUIRE_TAKE_MONEY}</div>
            </div>
            <div className={style.right}></div>
        </div>
    );
};

export default Header;
