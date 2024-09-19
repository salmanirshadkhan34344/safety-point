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
const UsersYearBar = () => {
    let labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getAllUsers()
    }, []);

    const getAllUsers = () => {
        apiGetAuth(
            ENDPOINTS.DashboardUserChart,
            (res) => {
                setUsers(res);

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
                label: 'Users Chart',
                data: labels.map((item, index) => {
                    let single = users.find(e => e.month === item)
                    return single ? single?.user_count : 0
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

export default UsersYearBar