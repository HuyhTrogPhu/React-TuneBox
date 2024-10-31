import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getRevenueByDay, getRevenueByWeek, getRevenueByMonth, getRevenueByYear } from '../../service/EcommerceAdminSearchSta';

const StatisticalRevenueTime = () => {
    const { date } = useParams();
    const [period, setPeriod] = useState('');

    // Xác định mốc thời gian từ URL
    const path = window.location.pathname;
    if (path.includes('revenue-according-day')) {
        setPeriod('day');
    } else if (path.includes('revenue-according-week')) {
        setPeriod('week');
    } else if (path.includes('revenue-according-month')) {
        setPeriod('month');
    } else if (path.includes('revenue-according-year')) {
        setPeriod('year');
    }

    const [revenueData, setRevenueData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            let response;
            try {
                switch (period) {
                    case 'day':
                        response = await getRevenueByDay(date);
                        break;
                    case 'week':
                        response = await getRevenueByWeek(date);
                        break;
                    case 'month':
                        response = await getRevenueByMonth(date);
                        break;
                    case 'year':
                        response = await getRevenueByYear(date);
                        break;
                    default:
                        return;
                }
                setRevenueData(response.data);
            } catch (error) {
                console.error('Error fetching revenue data:', error);
            }
        };

        if (date && period) {
            fetchData();
        }
    }, [date, period]);

    return (
        <div>
            <div className='container'>
                <div className='row'>
                    {/* Chart */}
                    <div className='col-12'>
                        <h6>Total revenue: {revenueData ? revenueData[`revenueBy${period.charAt(0).toUpperCase() + period.slice(1)}`] : 0}</h6>
                    </div>
                </div>

                {/* List user */}
                <div className='row'>
                    <h6>List user</h6>
                    <div className='col-12'>
                        <table className='table border'>
                            <thead>
                                <tr>
                                    <th scope='col'>#</th>
                                    <th scope='col'>Name</th>
                                    <th scope='col'>phonNumber</th>
                                    <th scope='col'>userName</th>
                                    <th scope='col'>Location</th>
                                    <th scope='col'>Email</th>
                                    <th scope='col'>Total Order</th>
                                    <th scope='col'>Sum totalPrice</th>
                                </tr>
                            </thead>
                            <tbody>
                                {revenueData?.userSells.map((user) => (
                                    <tr key={user.userId}>
                                        <td></td>
                                        <td>{user.name}</td>
                                        <td>{user.phonNumber}</td>
                                        <td>{user.userName}</td>
                                        <td>{user.location}</td>
                                        <td>{user.email}</td>
                                        <td>{user.totalOrder}</td>
                                        <td>{user.sumTotalPrice}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* List instrument */}
                <div className='row'>
                    <h6>List instrument</h6>
                    <div className='col-12'>
                        <table className='table border'>
                            <thead>
                                <tr>
                                    <th scope='col'>#</th>
                                    <th scope='col'>Name</th>
                                    <th scope='col'>Image</th>
                                    <th scope='col'>costPrice</th>
                                    <th scope='col'>Total Sold</th>
                                </tr>
                            </thead>
                            <tbody>
                                {revenueData?.listInstrumentByDay || revenueData?.listInstrumentByWeek || revenueData?.listInstrumentByMonth || revenueData?.listInstrumentByYear.map((instrument) => (
                                    <tr key={instrument.instrumentId}>
                                        <td></td>
                                        <td>{instrument.instrumentName}</td>
                                        <td>{instrument.costPrice}</td>
                                        <td>{instrument.image}</td>
                                        <td>{instrument.totalSold}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatisticalRevenueTime;
