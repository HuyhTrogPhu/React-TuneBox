import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { getRevenueBetweenDate, getRevenueBetweenMonth, getRevenueBetweenWeek, getRevenueBetweenYear, getRevenueByDate, getRevenueByMonth, getRevenueByWeek, getRevenueByYear } from '../../service/EcommerceAdminSearchSta';

const StatisticalRevenueTime = () => {
    const { date, startDate, endDate, dateWeek, startDateWeek, endDateWeek,
        yearOfMonth, month, startMonthYear, endMonthYear,
        year, startYear, endYear
     } = useParams();

    const [revenueData, setRevenueData] = useState(null);
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                let response;
                if (date) {
                    response = await getRevenueByDate(date);
                } else if (startDate && endDate) {
                    response = await getRevenueBetweenDate(startDate, endDate);
                } else if (dateWeek) {
                    response = await getRevenueByWeek(dateWeek);
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

                    // Kiểm tra nếu response có `revenueOverTime`
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
            }
        };

        fetchData();
    }, [date, startDate, endDate, dateWeek, startDateWeek, endDateWeek
        , yearOfMonth, month, startMonthYear, endMonthYear, year, startYear, endYear
    ]);

    return (
        <div>
            <div className='container'>
                <div className='row'>
                    <h6 className='text-center'>Statistical: {date || dateWeek || `From ${startDate || startDateWeek} to ${endDate || endDateWeek}`}</h6>
                    <div className='col-12'>
                        <h6>
                            Total revenue: {(revenueData?.revenueByDay || revenueData?.revenueByDate || 'No data available').toLocaleString('vi')} VND
                        </h6>

                        {chartData.labels ? (
                            <Line data={chartData} />
                        ) : (
                            <p>No revenue data available for the selected date range.</p>
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
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Phone number</th>
                                    <th>User name</th>
                                    <th>Location</th>
                                    <th>Email</th>
                                    <th>Total Order</th>
                                    <th>Sum totalPrice</th>
                                </tr>
                            </thead>
                            <tbody>
                                {revenueData?.userSells?.map((user, index) => (
                                    <tr key={user.userId}>
                                        <th>{index + 1}</th>
                                        <td>{user.name}</td>
                                        <td>{user.phoneNumber}</td>
                                        <td>{user.userName}</td>
                                        <td>{user.location}</td>
                                        <td>{user.email}</td>
                                        <td>{user.totalOrder}</td>
                                        <td>{user.sumTotalPrice.toLocaleString('vi')} VND</td>
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
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Image</th>
                                    <th>Cost Price</th>
                                    <th>Total Sold</th>
                                </tr>
                            </thead>
                            <tbody>
                                {revenueData?.listInstrumentByDay?.map((instrument, index) => (
                                    <tr key={instrument.instrumentId}>
                                        <td>{index + 1}</td>
                                        <td>{instrument.instrumentName}</td>
                                        <td><img src={instrument.image} alt={instrument.instrumentName} style={{ width: "50px" }} /></td>
                                        <td>{instrument.costPrice.toLocaleString('vi')} VND</td>
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
