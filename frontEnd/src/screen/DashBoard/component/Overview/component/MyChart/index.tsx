import { memo } from 'react';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

const MyChart = () => {
    const data = [
        3000, 4000, 3500, 5000, 4900, 6000, 7000, 9100, 8000, 7500, 8500, 9500, 10000, 11000, 10500, 12000, 13000,
        12500, 14000, 15000,
    ];
    const data1 = [35, 35, 35, 55, 48, 69, 20, 95, 90, 22, 60, 88, 150, 100, 115, 121, 139, 123, 130, 155];
    const datatb = [
        6900, 6900, 6900, 6900, 6900, 6900, 6900, 6900, 6900, 6900, 6900, 6900, 6900, 6900, 6900, 6900, 6900, 6900,
        6900, 6900,
    ];
    const data1tb = [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30];

    const categories = [
        '01/08',
        '02/08',
        '03/08',
        '04/08',
        '05/08',
        '06/08',
        '07/08',
        '08/08',
        '09/08',
        '10/08',
        '11/08',
        '12/08',
        '13/08',
        '14/08',
        '15/08',
        '16/08',
        '17/08',
        '18/08',
        '19/08',
        '20/08',
    ];

    const mainOptions: ApexOptions = {
        chart: {
            id: 'main-chart',
            type: 'line',
            toolbar: {
                show: false,
            },
        },

        legend: {
            show: true,
            position: 'bottom',
            horizontalAlign: 'center',

            // Quan trọng: tạo đủ chiều rộng cho legend
            width: 1000,

            itemMargin: {
                horizontal: 10,
                vertical: 0,
            },

            fontSize: '12px',
        },

        stroke: {
            curve: 'smooth',
        },

        xaxis: {
            categories,
        },

        yaxis: [
            {
                title: {
                    text: 'Doanh số',
                },
            },
            {
                opposite: true,
                title: {
                    text: 'Số lượng đơn',
                },
            },
        ],
    };

    const brushOptions: ApexOptions = {
        chart: {
            id: 'brush-chart',
            type: 'area',
            brush: {
                target: 'main-chart',
                enabled: true,
            },
            selection: {
                enabled: true,
                xaxis: {
                    min: 0,
                    max: 10,
                },
            },
        },

        xaxis: {
            categories,
        },

        stroke: {
            curve: 'smooth',
        },

        fill: {
            type: 'gradient',
        },

        yaxis: {
            show: false,
        },

        legend: {
            show: false,
        },
    };

    const series = [
        {
            name: 'Doanh số',
            data: data,
        },
        {
            name: 'Doanh số TB',
            data: datatb,
        },
        {
            name: 'Số lượng đơn',
            data: data1,
        },
        {
            name: 'Số lượng đơn TB',
            data: data1tb,
        },
    ];

    return (
        <div>
            {/* Chart chính */}
            <Chart options={mainOptions} series={series} type="line" height={350} />

            {/* Brush */}
            <Chart options={brushOptions} series={series} type="area" height={120} />
        </div>
    );
};

export default memo(MyChart);
