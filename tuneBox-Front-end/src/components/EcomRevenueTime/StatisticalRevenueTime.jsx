import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2'; // Nhập thêm Bar
import {
    getRevenueBetweenDate, getRevenueBetweenMonth, getRevenueBetweenWeek, getRevenueBetweenYear,
    getRevenueByDate, getRevenueByMonth, getRevenueByWeek, getRevenueByYear
} from '../../service/EcommerceAdminSearchSta';
import { Link } from 'react-router-dom';

const StatisticalRevenueTime = () => {
    const { date, startDate, endDate, selectedWeek, startDateWeek, endDateWeek, yearOfMonth, month, startMonthYear, endMonthYear, year, startYear, endYear } = useParams();

    const [revenueData, setRevenueData] = useState(null);
    const [chartData, setChartData] = useState({});
    const [userChartData, setUserChartData] = useState({}); 
    const [instrumentChartData, setInstrumentChartData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                let response;
                if (date) {
                    response = await getRevenueByDate(date);
                } else if (startDate && endDate) {
                    response = await getRevenueBetweenDate(startDate, endDate);
                } else if (selectedWeek) {
                    response = await getRevenueByWeek(selectedWeek);
                } else if (startDateWeek && endDateWeek) {
                    response = await getRevenueBetweenWeek(startDateWeek, endDateWeek);
                } else if (yearOfMonth && month) {
                    response = await getRevenueByMonth(yearOfMonth, month);
                } else if (yearOfMonth && startMonthYear && endMonthYear) {
                    response = await getRevenueBetweenMonth(yearOfMonth, startMonthYear, endMonthYear);
                } else if (year) {
                    response = await getRevenueByYear(year);
                } else if (startYear && endYear) {
                    response = await getRevenueBetweenYear(startYear, endYear);
                }

                if (response) {
                    setRevenueData(response.data);
                    if (response.data?.revenueOverTime) {
                        const labels = response.data.revenueOverTime.map(item => item.date);
                        const data = response.data.revenueOverTime.map(item => item.revenue);
                        setChartData({
                            labels,
                            datasets: [
                                {
                                    label: 'Revenue',
                                    data,
                                    fill: false,
                                    borderColor: 'rgba(75, 192, 192, 1)',
                                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                    tension: 0.1
                                }
                            ]
                        });
                    } else {
                        setChartData({});
                    }
                }
            } catch (error) {
                console.error("Error fetching revenue data:", error);
                setError("Error fetching revenue data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [
        date, startDate, endDate,
        selectedWeek, startDateWeek, endDateWeek,
        yearOfMonth, month, startMonthYear, endMonthYear,
        year, startYear, endYear
    ]);

    useEffect(() => {
        if (revenueData?.userSells) {
            const userNames = revenueData.userSells.map(user => user.name);
            const userTotalPrices = revenueData.userSells.map(user => user.sumTotalPrice);

            setUserChartData({
                labels: userNames,
                datasets: [
                    {
                        label: 'Total Revenue by User',
                        data: userTotalPrices,
                        backgroundColor: 'rgba(153, 102, 255, 0.5)',
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 1,
                    }
                ]
            });
        }

        if (revenueData?.listInstrument) {
            const instrumentNames = revenueData.listInstrument.map(instrument => instrument.instrumentName);
            const instrumentTotalSold = revenueData.listInstrument.map(instrument => instrument.totalSold);

            setInstrumentChartData({
                labels: instrumentNames,
                datasets: [
                    {
                        label: 'Total Sold by Instrument',
                        data: instrumentTotalSold,
                        backgroundColor: 'rgba(255, 159, 64, 0.5)',
                        borderColor: 'rgba(255, 159, 64, 1)',
                        borderWidth: 1,
                    }
                ]
            });
        }
    }, [revenueData]);

    return (
        <div>
            <div className='container'>
                <div className='row'>
                    <h6 className='text-center'>
                        Statistical:
                        {date ? `Date: ${date}` :
                            selectedWeek ? `Week: ${selectedWeek}` :
                                yearOfMonth && month ? `Month: ${month} Year: ${yearOfMonth}` :
                                    startDate && endDate ? `From ${startDate} to ${endDate}` :
                                        startDateWeek && endDateWeek ? `From Week starting ${startDateWeek} to ${endDateWeek}` :
                                            startMonthYear && endMonthYear ? `From ${startMonthYear} to ${endMonthYear} in Year: ${yearOfMonth}` :
                                                startYear && endYear ? `From Year: ${startYear} to ${endYear}` :
                                                    'No specific date range selected.'}
                    </h6>
                    <div className='col-12'>
                        {loading ? (
                            <p>Loading data...</p>
                        ) : error ? (
                            <p>{error}</p>
                        ) : (
                            <>
                                <h6>
                                    Total revenue: {(revenueData?.revenueByDay || revenueData?.revenueByWeek ||
                                        revenueData?.revenueByMonth || revenueData?.revenueByYear || 'No data available').toLocaleString('vi')} VND
                                </h6>
                                {chartData.labels ? (
                                    <Line data={chartData} />
                                ) : (
                                    <p>No revenue data available for the selected date range.</p>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* List user */}
                <div className='row'>
                    <h6>List user</h6>
                    <div className='col-12'>
                        <table className='table border'>
                            <thead>
                                <tr>
                                    <th scope='col' style={{ textAlign: 'center' }}>#</th>
                                    <th scope='col' style={{ textAlign: 'center' }}>Name</th>
                                    <th scope='col' style={{ textAlign: 'center' }}>Phone number</th>
                                    <th scope='col' style={{ textAlign: 'center' }}>User name</th>
                                    <th scope='col' style={{ textAlign: 'center' }}>Location</th>
                                    <th scope='col' style={{ textAlign: 'center' }}>Email</th>
                                    <th scope='col' style={{ textAlign: 'center' }}>Total Order</th>
                                    <th scope='col' style={{ textAlign: 'center' }}>Sum totalPrice</th>
                                    <th scope='col' style={{ textAlign: 'center' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {revenueData?.userSells?.map((user, index) => (
                                    <tr key={user.userId}>
                                        <th style={{ textAlign: 'center' }}>{index + 1}</th>
                                        <td style={{ textAlign: 'center' }}>{user.name}</td>
                                        <td style={{ textAlign: 'center' }}>{user.phoneNumber}</td>
                                        <td style={{ textAlign: 'center' }}>{user.userName}</td>
                                        <td style={{ textAlign: 'center' }}>{user.location}</td>
                                        <td style={{ textAlign: 'center' }}>{user.email}</td>
                                        <td style={{ textAlign: 'center' }}>{user.totalOrder} order</td>
                                        <td style={{ textAlign: 'center' }}>{user.sumTotalPrice.toLocaleString('vi')} VND</td>
                                        <td>
                                            <Link className='btn btn-primary' style={{ color: '#000' }} to={`/ecomadmin/Customer/detail/${user.userId}`}>View</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Hiển thị biểu đồ cột cho người dùng */}
                    {userChartData.labels && <Bar data={userChartData} />}
                </div>

                {/* List instrument */}
                <div className='row'>
                    <h6>List instrument</h6>
                    <div className='col-12'>
                        <table className='table border'>
                            <thead>
                                <tr>
                                    <th scope='col' style={{ textAlign: 'center' }}>#</th>
                                    <th scope='col' style={{ textAlign: 'center' }}>Instrument name</th>
                                    <th scope='col' style={{ textAlign: 'center' }}>Price</th>
                                    <th scope='col' style={{ textAlign: 'center' }}>Total Sold</th>
                                </tr>
                            </thead>
                            <tbody>
                                {revenueData?.listInstrument?.map((instrument, index) => (
                                    <tr key={instrument.instrumentId}>
                                        <th style={{ textAlign: 'center' }}>{index + 1}</th>
                                        <td style={{ textAlign: 'center' }}>{instrument.instrumentName}</td>
                                        <td style={{ textAlign: 'center' }}>{(instrument.costPrice).toLocaleString('vi')} VND</td>
                                        <td style={{ textAlign: 'center' }}>{instrument.totalSold}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Hiển thị biểu đồ cột cho nhạc cụ */}
                    {instrumentChartData.labels && <Bar data={instrumentChartData} />}
                </div>
            </div>
        </div>
    );
};

export default StatisticalRevenueTime;
