import { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { global_set__data__toast_message } from '@src/redux/slice/Global';

const ChartAccordingToMoney = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [state, setState] = useState({
        series: [
            {
                name: 'Sign-ups',
                data: [210, 380, 340, 520, 480, 610, 700, 880, 820, 1040, 1180, 1520],
            },
        ],
        options: {
            chart: {
                height: 350,
                type: 'line',
                zoom: {
                    enabled: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: 'straight',
            },
            title: {
                text: 'Theo doanh số',
                align: 'left',
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            },
        },
    });

    return (
        <div className={style.parent}>
            <ReactApexChart options={state.options as ApexOptions} series={state.series} type="line" height={350} />
        </div>
    );
};

export default memo(ChartAccordingToMoney);
