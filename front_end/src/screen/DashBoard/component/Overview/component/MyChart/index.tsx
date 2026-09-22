import { memo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { Statistics_Oa_Field } from '@src/data_struct/statistics';

const MyChart = () => {
    const statistics_oa_array: Statistics_Oa_Field[] = useSelector(
        (state: RootState) => state.Dash_Board_Slice.statistics_oa_array
    );

    const [sales, set__sales] = useState<number[]>([]);
    const [average_sales_array, set__average_sales_array] = useState<number[]>([]);
    const [order_amounts, set__order_amounts] = useState<number[]>([]);
    const [average_order_amounts_array, set__average_order_amounts_array] = useState<number[]>([]);
    const [of_day_array, set__of_day_array] = useState<string[]>([]);

    useEffect(() => {
        const _sales: number[] = [];
        const _average_sales_array: number[] = [];
        const _order_amounts: number[] = [];
        const _average_order_amounts_array: number[] = [];
        const _of_day_array: string[] = [];
        const length = statistics_oa_array.length;

        for (let i: number = 0; i < length; i++) {
            _sales.push(statistics_oa_array[i].sales);
            _order_amounts.push(statistics_oa_array[i].order_amount);
            _average_sales_array.push(statistics_oa_array[i].sales / statistics_oa_array[i].order_amount);
            _average_order_amounts_array.push(statistics_oa_array[i].order_amount / 2);
            _of_day_array.push(statistics_oa_array[i].of_day.toString().split('T')[0]);
        }

        set__sales(_sales);
        set__order_amounts(_order_amounts);
        set__average_sales_array(_average_sales_array);
        set__average_order_amounts_array(_average_order_amounts_array);
        set__of_day_array(_of_day_array);
    }, [statistics_oa_array]);

    // const data = [
    //     3000, 4000, 3500, 5000, 4900, 6000, 7000, 9100, 8000, 7500, 8500, 9500, 10000, 11000, 10500, 12000, 13000,
    //     12500, 14000, 15000,
    // ];
    // const data1 = [35, 35, 35, 55, 48, 69, 20, 95, 90, 22, 60, 88, 150, 100, 115, 121, 139, 123, 130, 155];
    // const datatb = [
    //     6900, 6900, 6900, 6900, 6900, 6900, 6900, 6900, 6900, 6900, 6900, 6900, 6900, 6900, 6900, 6900, 6900, 6900,
    //     6900, 6900,
    // ];
    // const data1tb = [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30];

    // const categories = [
    //     '01/08',
    //     '02/08',
    //     '03/08',
    //     '04/08',
    //     '05/08',
    //     '06/08',
    //     '07/08',
    //     '08/08',
    //     '09/08',
    //     '10/08',
    //     '11/08',
    //     '12/08',
    //     '13/08',
    //     '14/08',
    //     '15/08',
    //     '16/08',
    //     '17/08',
    //     '18/08',
    //     '19/08',
    //     '20/08',
    // ];

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
            categories: of_day_array,
        },

        // yaxis: [
        //     {
        //         title: {
        //             text: 'Doanh số',
        //         },
        //     },
        //     {
        //         opposite: true,
        //         title: {
        //             text: 'Số lượng đơn',
        //         },
        //     },
        // ],

        yaxis: [
            {
                seriesName: ['Doanh số', 'Doanh số TB'],
                title: {
                    text: 'Doanh số',
                },
                labels: {
                    formatter: (value) => value.toLocaleString('vi-VN'),
                },
            },
            {
                seriesName: ['Số lượng đơn', 'Số lượng đơn TB'],
                opposite: true,
                title: {
                    text: 'Số lượng đơn',
                },
                labels: {
                    formatter: (value) => Math.round(value).toString(),
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
            categories: of_day_array,
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
            data: sales,
            yAxisIndex: 0,
        },
        {
            name: 'Doanh số TB',
            data: average_sales_array,
            yAxisIndex: 0,
        },
        {
            name: 'Số lượng đơn',
            data: order_amounts,
            yAxisIndex: 1,
        },
        {
            name: 'Số lượng đơn TB',
            data: average_order_amounts_array,
            yAxisIndex: 1,
        },
    ];

    // const series = [
    //     {
    //         name: 'Doanh số',
    //         data: data,
    //         yAxisIndex: 0,
    //     },
    //     {
    //         name: 'Doanh số TB',
    //         data: datatb,
    //         yAxisIndex: 0,
    //     },
    //     {
    //         name: 'Số lượng đơn',
    //         data: data1,
    //         yAxisIndex: 1,
    //     },
    //     {
    //         name: 'Số lượng đơn TB',
    //         data: data1tb,
    //         yAxisIndex: 1,
    //     },
    // ];

    return (
        <div>
            {/* Chart chính */}
            <Chart options={mainOptions} series={series} type="line" height={400} />

            {/* Brush */}
            <Chart options={brushOptions} series={series} type="area" height={150} />
        </div>
    );
};

export default memo(MyChart);
