import { memo, useRef, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { FaLink } from 'react-icons/fa';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import { avatarnull } from '@src/utility/string';
import { SEE_MORE } from '@src/const/text';

const Infor3 = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.infor31}>
                <div>
                    <div>
                        <FaLink />
                    </div>
                </div>
                <div>
                    <div>Thông tin liên kết</div>
                    <div>Liên kết các đối tượng liên quan</div>
                </div>
            </div>
            <div className={style.infor32}>
                <div className={style.infor321}>
                    <div>
                        Thực hiện trên nhóm bán hàng nào ? <span>*</span>
                    </div>
                    <div>
                        <div>
                            <div>
                                <div>
                                    <div>
                                        <img src={avatarnull} alt="" />
                                    </div>
                                    <div>name</div>
                                    <div>group name</div>
                                </div>
                                <div>
                                    <div>
                                        <MdKeyboardArrowDown size={20} />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <div>
                                        <img src={avatarnull} alt="" />
                                    </div>
                                    <div>name</div>
                                    <div>group name</div>
                                </div>
                                <div>
                                    <div>Chọn</div>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <div>
                                        <img src={avatarnull} alt="" />
                                    </div>
                                    <div>name</div>
                                    <div>group name</div>
                                </div>
                                <div>
                                    <div>Chọn</div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div>{SEE_MORE}</div>
                        </div>
                    </div>
                </div>
                <div className={style.infor322}>
                    <div>Thông tin khách hàng</div>
                    <div>
                        <div>
                            <div>Số điện thoại</div>
                            <div>
                                <input placeholder="Số điện thoại" />
                            </div>
                        </div>
                        <div>
                            <div>Tên khách hàng</div>
                            <div>
                                <input placeholder="Tên khách hàng" />
                            </div>
                        </div>
                        <div>
                            <div>Địa chỉ</div>
                            <div>
                                <input placeholder="Địa chỉ" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(Infor3);
