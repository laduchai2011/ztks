import { memo, useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { global_set__data__toast_message } from '@src/redux/slice/Global';
import { CiSearch } from 'react-icons/ci';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { IoAddOutline } from 'react-icons/io5';

const Fillter = () => {
    const selected_option = '';
    const handle_Selected = () => {};

    return (
        <div className={style.parent}>
            <div className={style.filter1}>
                <div className={style.search_container}>
                    <div className={style.search}>
                        <CiSearch size={25} />
                        <input placeholder="Tìm theo số điện thoại" />
                    </div>
                </div>
                <div className={style.status_order}>
                    <label htmlFor="filter_select">Trạng thái</label>
                    <div className={style.select_box}>
                        <select id="filter_select" onChange={handle_Selected} value={selected_option}>
                            <option value={''}>Tất cả</option>
                            <option value={''}>Mã đơn hàng</option>
                            <option value={''}>Số điện thoại</option>
                        </select>
                    </div>
                </div>
                <div className={style.type_order}>
                    <label htmlFor="filter_select">Loại đơn</label>
                    <div className={style.select_box}>
                        <select id="filter_select" onChange={handle_Selected} value={selected_option}>
                            <option value={''}>Tất cả</option>
                            <option value={''}>Mã đơn hàng</option>
                            <option value={''}>Số điện thoại</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className={style.filter2}>
                <div>
                    <IoAddOutline size={25} color="white" />
                    <div>Tạo đơn hàng</div>
                </div>
            </div>
        </div>
    );
};

export default memo(Fillter);
