import { memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { SEARCH } from '@src/const/text';

const Filter = () => {
    const [fromDate, setFromDate] = useState<Dayjs | null>(dayjs());
    const [toDate, setToDate] = useState<Dayjs | null>(dayjs());

    useEffect(() => {
        if (fromDate) {
            console.log('dashboard filter', fromDate.format('YYYY-MM-DD'));
        }
    }, [fromDate]);

    return (
        <div className={style.parent}>
            <div>
                <div>
                    <div className={style.text}>Từ</div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Chọn ngày"
                            value={fromDate}
                            onChange={(newValue) => {
                                setFromDate(newValue);
                            }}
                        />
                    </LocalizationProvider>
                    <div className={style.text}>Tới</div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Chọn ngày"
                            value={toDate}
                            onChange={(newValue) => {
                                setToDate(newValue);
                            }}
                        />
                    </LocalizationProvider>
                    <div className={style.searchBtn}>{SEARCH}</div>
                </div>
            </div>
        </div>
    );
};

export default memo(Filter);
