import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Line } from 'react-chartjs-2';
import { getRevenueBeforeCurrently, getRevenueCurrently } from '../../../service/EcommerceStatistical';

const Statistical = () => {

    const [currentRevenue, setCurrentRevenue] = useState({});
    const [previousRevenue, setPreviousRevenue] = useState({});
    const navigate = useNavigate();

    // revenue by day or between days
    const [selectedDate, setSelectedDate] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // revenue by week or between weeks
    const [selectedWeek, setSelectedWeek] = useState('');
    const [startDateWeek, setStartDateWeek] = useState('');
    const [endDateWeek, setEndDateWeek] = useState('');

    // revenue by month or between months
    const [selectYearOfMonth, setSelectedYearOfMonth] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [startDateMonth, setStartDateMonth] = useState('');
    const [endDateMonth, setEndDateMonth] = useState('');
    const [months, setMonths] = useState([]);

    // revenue by year or between years
    const [selectedYear, setSelectedYear] = useState('');
    const [startDateYear, setStartDateYear] = useState('');
    const [endDateYear, setEndDateYear] = useState('');

    // stattistical revenue currently and before
    useEffect(() => {
        const fetchRevenueData = async () => {
            try {
                const { data: current } = await getRevenueCurrently();
                const { data: previous } = await getRevenueBeforeCurrently();
                setCurrentRevenue(current);
                setPreviousRevenue(previous);
            } catch (error) {
                console.error("Error fetching revenue data:", error);
            }
        };
        fetchRevenueData();
    }, []);


    const createChartData = (currentData, previousData, label) => ({
        labels: ['Today', 'Yesterday'], // cập nhật nhãn phù hợp cho từng khoảng thời gian
        datasets: [
            {
                label: `${label} - Hiện tại`,
                data: [currentData, 0], // chỉ số hiện tại
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
            {
                label: `${label} - Trước`,
                data: [0, previousData], // chỉ số trước đó
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
            }
        ]
    });

    // search statistical revenue by day
    const handleSubmitDay = (e) => {
        e.preventDefault();
        if (selectedDate) {
            navigate(`/ecomadmin/Statistical/revenue-according-date/${selectedDate}`);
        }
    };

    // search statistical revenue between days
    const handleSubmitBetweenDates = (e) => {
        e.preventDefault();
        if (startDate && endDate) {
            navigate(`/ecomadmin/Statistical/revenue-between-date/${startDate}/${endDate}`);
        }
    };

    // search statistical revenue by week
    const handleSingleDateSubmit = (e) => {
        e.preventDefault();
        if (selectedWeek) {
            navigate(`/ecomadmin/Statistical/revenue-by-week/${selectedWeek}`);
        }
    };

    // search statistical revenue between weeks
    const handleBetweenDatesSubmit = (e) => {
        e.preventDefault();
        if (startDateWeek && endDateWeek) {
            navigate(`/ecomadmin/Statistical/revenue-between-weeks/${startDateWeek}/${endDateWeek}`);
        }
    };

    // calculate months in a year
    const handleYearChange = (e) => {
        const year = e.target.value;
        setSelectedYearOfMonth(year);

        const monthArray = [];
        for (let i = 1; i <= 12; i++) {
            monthArray.push({ value: i, label: `Month ${i}` });
        }
        setMonths(monthArray);
    };

    // search statistical revenue month
    const handleSingleMonthSubmit = (e) => {
        e.preventDefault();
        if (selectYearOfMonth && selectedMonth) {
            navigate(`/ecomadmin/Statistical/revenue-by-month/${selectYearOfMonth}/${selectedMonth}`);
        }
    };

    // search statistical revenue between months
    const handleBetweenMonthsSubmit = (e) => {
        e.preventDefault();
        if (selectYearOfMonth && startDateMonth && endDateMonth) {
            navigate(`/ecomadmin/Statistical/revenue-between-months/${selectYearOfMonth}/${startDateMonth}/${endDateMonth}`);
        }
    };

    // search statistical revenue year
    const handleSingleYearSubmit = (e) => {
        e.preventDefault();
        if (selectedYear) {
            navigate(`/ecomadmin/Statistical/revenue-by-year/${selectedYear}`);
        }
    };

    // search statistical revenue between years
    const handleBetweenYearsSubmit = (e) => {
        e.preventDefault();
        if (startDateYear && endDateYear) {
            navigate(`/ecomadmin/Statistical/revenue-between-years/${startDateYear}/${endDateYear}`);
        }
    };


    return (
        <div>

            <div className='container'>
                {/* Statistical customer */}
                <section className='row d-flex justify-content-center gap-3'>
                    <div className='col-4 border rounded bg-white d-flex align-items-center' style={{ height: '100%' }}>
                        <Link to={'/ecomadmin/Statistical/sell-the-most'}>
                            <div className='row d-flex align-items-center'>
                                <div className='col-3 m-0 d-flex justify-content-center align-items-center'>
                                    <i className="fa-solid fa-users" style={{ color: '#e94f37', fontSize: '1.2rem' }}></i>
                                </div>
                                <div className='col-9 m-0 '>
                                    <h6 className='ps-0'>Top selling customer to date</h6>
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className='col-4 border rounded bg-white d-flex align-items-center' style={{ height: '100%' }}>
                        <Link to={'/ecomadmin/Statistical/sell-the-least'}>
                            <div className='row d-flex align-items-center'>

                                <div className='col-3 m-0 d-flex justify-content-center align-items-center'>
                                    <i className="fa-solid fa-users" style={{ color: '#e94f37', fontSize: '1.2rem' }}></i>
                                </div>
                                <div className='col-9 m-0'>
                                    <h6 className='ps-0'>Least number of buyers to date </h6>
                                </div>

                            </div>
                        </Link>
                    </div>
                    <div className='col-3 border rounded bg-white d-flex align-items-center' style={{ height: '100%' }}>
                        <Link to={'/ecomadmin/Statistical/user-not-sell'}>
                            <div className='row d-flex align-items-center'>
                                <div className='col-3 m-0 d-flex justify-content-center align-items-center'>
                                    <i className="fa-solid fa-users" style={{ color: '#e94f37', fontSize: '1.2rem' }}></i>
                                </div>
                                <div className='col-9 m-0'>
                                    <h6 className='ps-0 pe-0'>Customer not sell</h6>
                                </div>
                            </div>
                        </Link>
                    </div>

                </section>

                {/* Revenue statistical currently */}
                <section className='row mt-5'>
                    <div className='col-5 border rounded bg-white d-flex align-items-center' style={{ height: '100%' }}>
                        <Link to={'/ecomadmin/Statistical/revenue-currently'}>
                            <div className='row d-flex align-items-center'>
                                <div className='col-2 m-0 d-flex justify-content-center align-items-center'>
                                    <i className="fa-solid fa-money-bill" style={{ color: '#e94f37', fontSize: '1.2rem' }}></i>
                                </div>
                                <div className='col-10 m-0'>
                                    <h6 className='ps-0'>Revenue statistical currently</h6>
                                </div>
                            </div>
                        </Link>
                    </div>
                </section>

                {/* Statistical instrument */}
                <section className='row mt-5 d-flex justify-content-center gap-3'>
                    <div className='col-4 border rounded bg-white d-flex align-items-center' style={{ height: '100%' }}>
                        <Link to={'/ecomadmin/Statistical/statistical-instrument'}>
                            <div className='row d-flex align-items-center'>
                                <div className='col-3 m-0 d-flex justify-content-center align-items-center'>
                                    <i className="fa-solid fa-music" style={{ color: '#e94f37', fontSize: '1.2rem' }}></i>
                                </div>
                                <div className='col-9 m-0'>
                                    <h6 className='ps-0'>Statistical Instrument</h6>
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className='col-4 border rounded bg-white d-flex align-items-center' style={{ height: '100%' }}>
                        <Link to={'/ecomadmin/Statistical/statistical-brand'}>
                            <div className='row d-flex align-items-center'>
                                <div className='col-3 m-0 d-flex justify-content-center align-items-center'>
                                    <i className="fa-solid fa-music" style={{ color: '#e94f37', fontSize: '1.2rem' }}></i>
                                </div>
                                <div className='col-9 m-0'>
                                    <h6 className='ps-0'>Statistical Brand</h6>
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className='col-4 border rounded bg-white d-flex align-items-center' style={{ height: '100%' }}>
                        <Link to={'/ecomadmin/Statistical/statistical-category'}>
                            <div className='row d-flex align-items-center'>
                                <div className='col-3 m-0 d-flex justify-content-center align-items-center'>
                                    <i className="fa-solid fa-music" style={{ color: '#e94f37', fontSize: '1.2rem' }}></i>
                                </div>
                                <div className='col-9 m-0'>
                                    <h6 className='ps-0'>Statistical Category</h6>
                                </div>
                            </div>
                        </Link>
                    </div>

                </section>

                {/* Search revenue by day or between day */}
                <section className='row mt-5 d-flex justify-content-between gap-3'>
                    <div className='col border rounded bg-white'>
                        <h6>Statistical revenue by day</h6>
                        <form onSubmit={handleSubmitDay} className='p-3'>
                            <div className='mt-3'>
                                <label className='form-label'>Revenue statistical of day</label>
                                <input
                                    type="date"
                                    className='form-control'
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                />
                            </div>
                            <div className='mt-3'>
                                <button type='submit' className='btn border' style={{ backgroundColor: '#e94f37', color: '#fff' }}>Submit</button>
                            </div>
                        </form>
                    </div>
                    <div className='col border rounded bg-white'>
                        <h6>Statistical revenue between days</h6>
                        <form onSubmit={handleSubmitBetweenDates} className="p-3">
                            <div className='mt-3'>
                                <label className='form-label'>From date:</label>
                                <input
                                    type="date"
                                    className='form-control'
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div className='mt-3'>
                                <label className='form-label'>To date:</label>
                                <input
                                    type="date"
                                    className='form-control'
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                            <div className='mt-3'>
                                <button type='submit' className='btn border' style={{ backgroundColor: '#e94f37', color: '#fff' }}>Submit</button>
                            </div>
                        </form>
                    </div>
                </section>

                {/* Search by week or between week */}
                <section className='row mt-5 d-flex justify-content-between gap-3'>
                    {/* Statistical Revenue By Week */}
                    <div className='col rounded p-3 border bg-white'>
                        <h6>Statistical revenue by week</h6>
                        <form onSubmit={handleSingleDateSubmit} className='p-3'>
                            <div className='mt-3'>
                                <label className='form-label'>Choose 1 day of the week</label>
                                <input
                                    type="date"
                                    className='form-control'
                                    value={selectedWeek}
                                    onChange={(e) => setSelectedWeek(e.target.value)}
                                />
                            </div>
                            <div className='mt-3'>
                                <button type='submit' className='btn border' style={{ backgroundColor: '#e94f37', color: '#fff' }}>Submit</button>
                            </div>
                        </form>
                    </div>

                    {/* Statistical Revenue Between Weeks */}
                    <div className='col border rounded bg-white'>
                        <h6>Statistical revenue between weeks</h6>
                        <form onSubmit={handleBetweenDatesSubmit} className='p-3'>
                            <div className='mt-3'>
                                <label className='form-label'>From:</label>
                                <input
                                    type="date"
                                    className='form-control'
                                    value={startDateWeek}
                                    onChange={(e) => setStartDateWeek(e.target.value)}
                                />
                            </div>
                            <div className='mt-3'>
                                <label className='form-label'>To:</label>
                                <input
                                    type="date"
                                    className='form-control'
                                    value={endDateWeek}
                                    onChange={(e) => setEndDateWeek(e.target.value)}
                                />
                            </div>
                            <div className='mt-3'>
                                <button type='submit' className='btn border' style={{ backgroundColor: '#e94f37', color: '#fff' }}>Submit</button>
                            </div>
                        </form>
                    </div>
                </section>

                {/* Search by month or between month */}
                <section className='row mt-5 d-flex justify-content-between gap-3'>
                    {/* Search by month */}
                    <div className='col border rounded bg-white'>
                        <h6>Statistical revenue by month</h6>
                        <form onSubmit={handleSingleMonthSubmit} className='p-3'>
                            <div className='mt-3'>
                                <label className='form-label'>Year</label>
                                <input
                                    type="text"
                                    className='form-control'
                                    placeholder='Enter the year you want'
                                    value={selectYearOfMonth}
                                    onChange={handleYearChange} 
                                />
                            </div>
                            <div className='mt-3'>
                                <label className='form-label'>Choose a month</label>
                                <select
                                    className='form-control'
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                >
                                    <option value=''>Select Month</option>
                                    {months.map((month) => (
                                        <option key={month.value} value={month.value}>{month.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='mt-3'>
                                <button type='submit' className='btn border' style={{ backgroundColor: '#e94f37', color: '#fff' }}>Submit</button>
                            </div>
                        </form>
                    </div>

                    {/* Statistical Revenue Between Months */}
                    <div className='col border rounded bg-white'>
                        <h6>Statistical revenue between months</h6>
                        <form onSubmit={handleBetweenMonthsSubmit} className='p-3'>
                            <div className='mt-3'>
                                <label className='form-label'>Year</label>
                                <input
                                    type="text"
                                    className='form-control'
                                    placeholder='Enter the year you want'
                                    value={selectYearOfMonth}
                                    onChange={handleYearChange} 
                                />
                                
                            </div>
                            <div className='mt-3'>
                            <label className='form-label'>Choose a month</label>
                                <label className='form-label'>From:</label>
                                 <select
                                    className='form-control'
                                    value={startDateMonth}
                                    onChange={(e) => setStartDateMonth(e.target.value)}
                                >
                                    <option value=''>Select Month</option>
                                    {months.map((month) => (
                                        <option key={month.value} value={month.value}>{month.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='mt-3'>
                                <label className='form-label'>To:</label>
                                 <select
                                    className='form-control'
                                    value={endDateMonth}
                                    onChange={(e) => setEndDateMonth(e.target.value)}
                                >
                                    <option value=''>Select Month</option>
                                    {months.map((month) => (
                                        <option key={month.value} value={month.value}>{month.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='mt-3'>
                                <button type='submit' className='btn border' style={{ backgroundColor: '#e94f37', color: '#fff' }}>Submit</button>
                            </div>
                        </form>
                    </div>
                </section>

                {/* Search by year or between years */}
                <section className='row mt-5 d-flex justify-content-between gap-3'>
                    {/* Search by year */}
                    <div className='col border rounded bg-white'>
                        <h6>Statistical revenue by year</h6>
                        <form onSubmit={handleSingleYearSubmit} className='p-3'>
                            <div className='mt-3'>
                                <label className='form-label'>Choose a year</label>
                                <input
                                    type="text"
                                    className='form-control'
                                    placeholder='Enter the year you want'
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)} 
                                />
                            </div>
                            <div className='mt-3'>
                                <button type='submit' className='btn border' style={{ backgroundColor: '#e94f37', color: '#fff' }}>Submit</button>
                            </div>
                        </form>
                    </div>

                    {/* Statistical Revenue Between Years */}
                    <div className='col border rounded bg-white'>
                        <h6>Statistical revenue between years</h6>
                        <form onSubmit={handleBetweenYearsSubmit} className='p-3'>
                            <div className='mt-3'>
                                <label className='form-label'>From:</label>
                                <input
                                    type="text"
                                    className='form-control'
                                    placeholder='Enter start year'
                                    value={startDateYear}
                                    onChange={(e) => setStartDateYear(e.target.value)} 
                                />
                            </div>
                            <div className='mt-3'>
                                <label className='form-label'>To:</label>
                                <input
                                    type="text"
                                    className='form-control'
                                    placeholder='Enter end year'
                                    value={endDateYear}
                                    onChange={(e) => setEndDateYear(e.target.value)} 
                                />
                            </div>
                            <div className='mt-3'>
                                <button type='submit' className='btn border' style={{ backgroundColor: '#e94f37', color: '#fff' }}>Submit</button>
                            </div>
                        </form>
                    </div>
                </section>


                {/* Chart revenue statistical */}
                <section className='row mt-5 justify-content-between gap-3'>
                    <div className='d-flex'>
                        <div className='col-6'>
                            <h6 className='pb-0'>Total revenue of the day: {(currentRevenue.revenueOfDay || 0).toLocaleString('vi')} VND</h6>
                            <h6 className='pb-0'>Total revenue before of the day: {(previousRevenue.revenueBeforeOfDay || 0).toLocaleString('vi')} VND</h6>
                            <Line className='mt-5' data={createChartData(currentRevenue.revenueOfDay, previousRevenue.revenueBeforeOfDay, 'Doanh thu Ngày')} />
                        </div>
                        <div className='col-6'>
                            <h6 className='pb-0'>Total revenue of the week: {(currentRevenue.revenueOfWeek || 0).toLocaleString('vi')} VND</h6>
                            <h6 className='pb-0'>Total revenue before of the week: {(previousRevenue.revenueBeforeOfWeek || 0).toLocaleString('vi')} VND</h6>
                            <Line className='mt-5' data={createChartData(currentRevenue.revenueOfWeek, previousRevenue.revenueBeforeOfWeek, 'Doanh thu Tuần')} />
                        </div>
                    </div>
                    <div className='d-flex'>
                        <div className='col-6'>
                            <h6 className='pb-0'>Total revenue of the month: {(currentRevenue.revenueOfMonth || 0).toLocaleString('vi')} VND</h6>
                            <h6 className='pb-0'>Total revenue before of the month: {(previousRevenue.revenueBeforeOfMonth || 0).toLocaleString('vi')} VND</h6>
                            <Line className='mt-5' data={createChartData(currentRevenue.revenueOfMonth, previousRevenue.revenueBeforeOfMonth, 'Doanh thu Tháng')} />
                        </div>
                        <div className='col-6'>
                            <h6 className='pb-0'>Total revenue of the year: {(currentRevenue.revenueOfYear || 0).toLocaleString('vi')} VND</h6>
                            <h6 className='pb-0'>Total revenue of the year: {(previousRevenue.revenueBeforeOfYear || 0).toLocaleString('vi')} VND</h6>
                            <Line className='mt-5' data={createChartData(currentRevenue.revenueOfYear, previousRevenue.revenueBeforeOfYear, 'Doanh thu Năm')} />
                        </div>
                    </div>
                </section>

                {/* Statistical order */}
                <section className='row mt-5 d-flex justify-content-between gap-3'>
                    <div className='col-2 border rounded bg-white d-flex align-items-center' style={{ height: '100%' }}>
                        <div className='row d-flex align-items-center'>
                            <div className='col-3 m-0 d-flex justify-content-center align-items-center'>
                                <i className="fa-solid fa-file-invoice-dollar" style={{ color: '#e94f37', fontSize: '1.2rem' }}></i>
                            </div>
                            <div className='col-9 m-0'>
                                <h6 className='ps-0'>Unpaid invoice </h6>
                            </div>
                        </div>
                    </div>
                    <div className='col-2 border rounded bg-white d-flex align-items-center' style={{ height: '100%' }}>
                        <div className='row d-flex align-items-center'>
                            <div className='col-3 m-0 d-flex justify-content-center align-items-center'>
                                <i className="fa-solid fa-file-invoice-dollar" style={{ color: '#e94f37', fontSize: '1.2rem' }}></i>
                            </div>
                            <div className='col-9 m-0'>
                                <h6 className='ps-0'>Paid invoice </h6>
                            </div>
                        </div>
                    </div>
                    <div className='col-2 border rounded bg-white d-flex align-items-center' style={{ height: '100%' }}>
                        <div className='row d-flex align-items-center'>
                            <div className='col-3 m-0 d-flex justify-content-center align-items-center'>
                                <i className="fa-solid fa-file-invoice-dollar" style={{ color: '#e94f37', fontSize: '1.2rem' }}></i>
                            </div>
                            <div className='col-9 m-0'>
                                <h6 className='ps-0'>Bill in transit </h6>
                            </div>
                        </div>
                    </div>
                    <div className='col-2 border rounded bg-white d-flex align-items-center' style={{ height: '100%' }}>
                        <div className='row d-flex align-items-center'>
                            <div className='col-3 m-0 d-flex justify-content-center align-items-center'>
                                <i className="fa-solid fa-file-invoice-dollar" style={{ color: '#e94f37', fontSize: '1.2rem' }}></i>
                            </div>
                            <div className='col-9 m-0'>
                                <h6 className='ps-0'>COD invoice </h6>
                            </div>
                        </div>
                    </div>
                    <div className='col-2 border rounded bg-white d-flex align-items-center' style={{ height: '100%' }}>
                        <div className='row d-flex align-items-center'>
                            <div className='col-3 m-0 d-flex justify-content-center align-items-center'>
                                <i className="fa-solid fa-file-invoice-dollar" style={{ color: '#e94f37', fontSize: '1.2rem' }}></i>
                            </div>
                            <div className='col-9 m-0'>
                                <h6 className='ps-0'>Paypal invoice </h6>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Statistical
