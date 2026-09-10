import { FC, memo } from 'react';
import style from './style.module.scss';
import { handleSrcImage } from '@src/utility/string';
import { CheckInOutField } from '@src/dataStruct/checkInOut';

const OneCheck: FC<{ data: CheckInOutField }> = ({ data }) => {
    return (
        <div className={style.parent}>
            <div className={style.check}>
                <div>
                    <div>{data.type}</div>
                    <div>{data.note}</div>
                </div>
                <div>
                    <img src={handleSrcImage(data.image || '')} alt="" />
                </div>
            </div>
            <div className={style.inspect}>
                <div>
                    <div>
                        <input placeholder="Ghi chú" />
                    </div>
                    <div>
                        <div>Duyệt</div>
                        <div>Không duyệt</div>
                    </div>
                    <div>
                        <div>Đồng ý</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(OneCheck);
