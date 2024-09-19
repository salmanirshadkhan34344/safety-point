import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip
} from 'chart.js';
import React, { useEffect, useState } from "react";
import { Bar } from 'react-chartjs-2';
import { apiGetAuth } from '../../util/ApiRequest';
import { ENDPOINTS } from '../../util/EndPoint';
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'User Registration info',
        },
    },
};
const ReportingYearBar = () => {
    let labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const [items, setItems] = useState([]);

    useEffect(() => {
        getreporting()
    }, []);

    const getreporting = () => {
        apiGetAuth(
            ENDPOINTS.DashboardReportingChart,
            (res) => {
                setItems(res);

            },
            (error) => {
                console.log(error ,"Users Year Bar")
            }
        );
    };

    const data = {
        labels,
        datasets: [
            {
                label: 'Reporting  Chart',
                data: labels.map((item, index) => {
                    let single = items.find(e => e.month === item)
                    return single ? single?.report_count : 0
                }),
                backgroundColor: '#02275e',
            },

        ],
    };

    return (
        <div>
            <Bar options={options} data={data} />
        </div>
    )
}

export default ReportingYearBar