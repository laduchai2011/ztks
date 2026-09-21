import { FC, useRef, useEffect } from 'react';
import style from './style.module.scss';
import { IoMdHome } from 'react-icons/io';
import { IoIosPeople } from 'react-icons/io';
import { CgProfile } from 'react-icons/cg';
import { PiNotepadFill } from 'react-icons/pi';
import { FaBasketShopping } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { route_enum, select_enum, selected_type } from '@src/router/type';

const Header: FC<{ selected: selected_type }> = ({ selected }) => {
    const navigate = useNavigate();
    const parent_element = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const parentElement = parent_element.current;
        if (!parentElement) return;
        const childs = parentElement.children;

        setTimeout(() => {
            switch (selected) {
                case select_enum.HOME: {
                    childs[0].classList.add(style.selected);
                    break;
                }
                case select_enum.SUPPORT_ROOM: {
                    childs[1].classList.add(style.selected);
                    break;
                }
                case select_enum.ZNS: {
                    childs[2].classList.add(style.selected);
                    break;
                }
                case select_enum.ORDER: {
                    childs[3].classList.add(style.selected);
                    break;
                }
                case select_enum.NOTE: {
                    childs[4].classList.add(style.selected);
                    break;
                }
                case select_enum.PROFILE: {
                    childs[5].classList.add(style.selected);
                    break;
                }
                default: {
                    //statements;
                    break;
                }
            }
        }, 50);
    }, [selected]);

    const handleSelect = (selected: selected_type) => {
        switch (selected) {
            case select_enum.HOME: {
                navigate(route_enum.HOME);
                break;
            }
            case select_enum.SUPPORT_ROOM: {
                navigate(route_enum.SUPPORT_ROOM);
                break;
            }
            case select_enum.ZNS: {
                navigate(route_enum.ZNS);
                break;
            }
            case select_enum.ORDER: {
                navigate(route_enum.ORDER);
                break;
            }
            case select_enum.NOTE: {
                navigate(route_enum.NOTE);
                break;
            }
            case select_enum.PROFILE: {
                navigate(route_enum.PROFILE);
                break;
            }
            default: {
                //statements;
                break;
            }
        }
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div onClick={() => handleSelect(select_enum.HOME)}>
                <IoMdHome />
            </div>
            <div onClick={() => handleSelect(select_enum.SUPPORT_ROOM)}>
                <IoIosPeople />
            </div>
            <div onClick={() => handleSelect(select_enum.ZNS)}>
                <div className={style.zns}>Z</div>
            </div>
            <div onClick={() => handleSelect(select_enum.ORDER)}>
                <FaBasketShopping />
            </div>
            <div onClick={() => handleSelect(select_enum.NOTE)}>
                <PiNotepadFill />
            </div>
            <div onClick={() => handleSelect(select_enum.PROFILE)}>
                <CgProfile />
            </div>
        </div>
    );
};

export default Header;
