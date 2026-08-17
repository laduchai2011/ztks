import { memo, useState } from 'react';
import style from './style.module.scss';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const Filter = () => {
    const [date, setDate] = useState<Dayjs | null>(dayjs());
    return (
        <div className={style.parent}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label="Chọn ngày"
                    value={date}
                    onChange={(newValue) => {
                        setDate(newValue);
                    }}
                />
            </LocalizationProvider>
        </div>
    );
};

export default memo(Filter);
