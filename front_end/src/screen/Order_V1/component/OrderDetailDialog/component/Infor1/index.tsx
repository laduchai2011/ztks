import { memo } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { LiaShoppingBasketSolid } from 'react-icons/lia';
import { MdOutlineAttachMoney } from 'react-icons/md';
import { LuTypeOutline, LuCalendarDays } from 'react-icons/lu';

const Infor1 = () => {
    const dispatch = useDispatch<AppDispatch>();

    return (
        <div className={style.parent}>
            <div className={style.infor11}>
                <div>
                    <div>
                        <div>
                            <LiaShoppingBasketSolid size={35} color="white" />
                        </div>
                    </div>
                </div>
                <div>
                    <div>Mã đơn hàng</div>
                    <div>dsfgdfgdfdf-dfg-dgdfgdfgdfg</div>
                </div>
            </div>
            <div className={style.infor12}>
                <div>
                    <div>
                        <div>
                            <MdOutlineAttachMoney />
                        </div>
                    </div>
                    <div>
                        <div>Tổng giá trị</div>
                        <div>sfsdf</div>
                    </div>
                </div>
                <div>
                    <div>
                        <div>
                            <LuTypeOutline />
                        </div>
                    </div>
                    <div>
                        <div>Loại đơn</div>
                        <div>sdgsdg</div>
                    </div>
                </div>
                <div>
                    <div>
                        <div>
                            <LuCalendarDays />
                        </div>
                    </div>
                    <div>
                        <div>Ngày tạo</div>
                        <div>sdgsdg</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(Infor1);
