import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Line } from 'react-chartjs-2';
import { getRevenueBeforeCurrently, getRevenueCurrently } from '../../../service/EcommerceStatistical';
import '../css/Statistical.css';


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
                borderColor: '#fb8500',
                backgroundColor: '#fb8500',
                color: '#000000',
                fill: true,
            },
            {
                label: `${label} - Trước`,
                data: [0, previousData], // chỉ số trước đó
                borderColor: '#00ff87',
                backgroundColor: '#00ff87',
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

    // statistical order 
    const orderTypes = [
        { type: 'unpaid', label: 'Unpaid' },
        { type: 'paid', label: 'Paid' },
        { type: 'confirmed', label: 'Confirmed' },
        { type: 'delivered', label: 'Delivered' },
        { type: 'delivering', label: 'Delivering' },
        { type: 'canceled', label: 'Canceled' },
        { type: 'cod', label: 'COD' },
        { type: 'vnpay', label: 'VNPAY' },
        { type: 'normal', label: 'Normal' },
        { type: 'fast', label: 'Express' }
    ];


    return (
        <div>

            <div className='container'>



                {/* Statistical customer */}
                <section className='row d-flex gap-3 customer'>
                    <div className='col-4 statistical-customer-card rounded d-flex align-items-center'>
                        <Link to={'/ecomadmin/Statistical/sell-the-most'}>
                            <div className='row d-flex align-items-center'>
                                <div className='col-3 m-0 d-flex justify-content-center align-items-center'>
                                    <i className="fa-solid fa-users" style={{ color: '#e94f37', fontSize: '1.2rem' }}></i>
                                </div>
                                <div className='col-9 m-0'>
                                    <h6 className='ps-0'>Top selling customer to date</h6>
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className='col-4 statistical-customer-card rounded d-flex align-items-center'>
                        <Link to={'/ecomadmin/Statistical/sell-the-least'}>
                            <div className='row d-flex align-items-center'>
                                <div className='col-3 m-0 d-flex justify-content-center align-items-center'>
                                    <i className="fa-solid fa-users" style={{ color: '#e94f37', fontSize: '1.2rem' }}></i>
                                </div>
                                <div className='col-9 m-0'>
                                    <h6 className='ps-0'>Least number of buyers to date</h6>
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className='col-4 statistical-customer-card rounded d-flex align-items-center'>
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


                <hr style={{ width: '100%' }} />

                {/* Revenue currently */}
                <section className='container'>
                    {/* Currently day */}
                    <div className='container'>
                        <h6 className='text-center'>Revenue of day: </h6>
                        <div className='row d-flex'>
                            <div className='col-8 '>
                                <h6 className='pb-0 fs-5 text-center'>Total revenue of the day: <span className='text-danger fs-4'>{(currentRevenue.revenueOfDay || 0).toLocaleString('vi')} VND</span></h6>
                                <h6 className='pb-0 fs-5 text-center'>Total revenue before of the day: <span className='text-danger fs-4'>{(previousRevenue.revenueBeforeOfDay || 0).toLocaleString('vi')} VND</span></h6>
                                <div className='mt-5' style={{ backgroundColor: '#bbe6e4' }}>
                                    <Line data={createChartData(currentRevenue.revenueOfDay, previousRevenue.revenueBeforeOfDay, 'Doanh thu Ngày')} />
                                </div>
                            </div>
                            <div className=' col-4 search-of-day '>
                                {/* Search to day */}
                                <div className='border rounded p-2' style={{ backgroundColor: '#5158bb' }}>
                                    <h6 className='p-0 fs-5 text-center'>Revenue by day</h6>
                                    <form onSubmit={handleSubmitDay} className='pe-3 ps-3'>
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
                                {/* Search between day */}
                                <div className='border rounded p-2 mt-4' style={{ backgroundColor: '#5158bb' }}>
                                    <h6 className='p-0 fs-5 text-center'>Revenue between days</h6>
                                    <form onSubmit={handleSubmitBetweenDates} className="pe-5 ps-5">
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
                            </div>
                        </div>
                    </div>
                    <hr style={{ width: '100%' }} />
                    {/* Currently week */}
                    <div className='container'>
                        <h6 className='text-center'>Revenue of week: </h6>
                        <div className='row d-flex'>
                            <div className='col-8'>
                                <h6 className='pb-0 fs-5 text-center'>Total revenue of the week: <span className='text-danger fs-4'>{(currentRevenue.revenueOfWeek || 0).toLocaleString('vi')} VND</span></h6>
                                <h6 className='pb-0 fs-5 text-center'>Total revenue before of the week: <span className='text-danger fs-4'>{(previousRevenue.revenueBeforeOfWeek || 0).toLocaleString('vi')} VND</span></h6>
                                <div className='mt-5' style={{ backgroundColor: '#bbe6e4' }}>
                                    <Line className='mt-5' data={createChartData(currentRevenue.revenueOfWeek, previousRevenue.revenueBeforeOfWeek, 'Doanh thu Tuần')} />
                                </div>
                            </div>
                            <div className='col-4'>
                                {/* Statistical Revenue By Week */}
                                <div className='rounded p-3 border' style={{ backgroundColor: '#5158bb' }}>
                                    <h6 className='p-0 fs-5 text-center'>Revenue by week</h6>
                                    <form onSubmit={handleSingleDateSubmit} className='pe-3 ps-3'>
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
                                <div className='border rounded mt-4 p-2' style={{ backgroundColor: '#5158bb' }}>
                                    <h6 className='p-0 fs-5 text-center'>Revenue between weeks</h6>
                                    <form onSubmit={handleBetweenDatesSubmit} className='pe-3 ps-3'>
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
                            </div>
                        </div>
                    </div>
                    <hr style={{ width: '100%' }} />
                    {/* Currently motnh */}
                    <div className='container'>
                        <h6 className='text-center'>Revenue of month: </h6>
                        <div className='row d-flex'>
                            <div className='col-8'>
                                <h6 className='pb-0 fs-5 text-center'>Total revenue of the month: <span className='text-danger fs-4'>{(currentRevenue.revenueOfMonth || 0).toLocaleString('vi')} VND</span></h6>
                                <h6 className='pb-0. fs-5 text-center'>Total revenue before of the month: <span className='text-danger fs-4'>{(previousRevenue.revenueBeforeOfMonth || 0).toLocaleString('vi')} VND</span></h6>
                                <div className='mt-5' style={{ backgroundColor: '#bbe6e4' }}>
                                    <Line className='mt-5' data={createChartData(currentRevenue.revenueOfMonth, previousRevenue.revenueBeforeOfMonth, 'Doanh thu Tháng')} />
                                </div>
                            </div>
                            <div className='col-4 mt-5'>
                                {/* Search by month */}
                                <div className='border rounded mt-4 p-2' style={{ backgroundColor: '#5158bb' }}>
                                    <h6 className='p-0 fs-5 text-center'>Revenue by month</h6>
                                    <form onSubmit={handleSingleMonthSubmit} className='pe-3 ps-3'>
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
                                <div className='border rounded p-2 mt-4' style={{ backgroundColor: '#5158bb' }}>
                                    <h6 className='text-center p-0 fs-5'>Revenue between months</h6>
                                    <form onSubmit={handleBetweenMonthsSubmit} className='pe-3 ps-3'>
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
                                            <label className='form-label'>Choose a month</label><br />
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
                            </div>
                        </div>
                    </div>
                    <hr style={{ width: '100%' }} />
                    {/* Current year */}
                    <div className='container'>
                        <h6 className='text-center'>Revenue of current year: </h6>
                        <div className='row d-flex'>
                            <div className='col-8'>
                                <h6 className='pb-0 fs-5 text-center'>Total revenue of the year: <span className='text-danger fs-4'>{(currentRevenue.revenueOfYear || 0).toLocaleString('vi')} VND</span></h6>
                                <h6 className='pb-0 fs-5 text-center'>Total revenue of the year: <span className='text-danger fs-4'>{(previousRevenue.revenueBeforeOfYear || 0).toLocaleString('vi')} VND</span></h6>
                                <div className='mt-5' style={{ backgroundColor: '#bbe6e4' }}>
                                    <Line className='mt-5' data={createChartData(currentRevenue.revenueOfYear, previousRevenue.revenueBeforeOfYear, 'Doanh thu Năm')} />
                                </div>
                            </div>
                            <div className='col-4'>
                                {/* Search by year */}
                                <div className='border rounded p-2 mt-4' style={{ backgroundColor: '#5158bb' }}>
                                    <h6 className='text-center fs-5 p-0'>Revenue by year</h6>
                                    <form onSubmit={handleSingleYearSubmit} className='pe-3 ps-3'>
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
                                <div className='border rounded p-2 mt-4' style={{ backgroundColor: '#5158bb' }}>
                                    <h6 className='text-center fs-5 p-0'>Revenue between years</h6>
                                    <form onSubmit={handleBetweenYearsSubmit} className='pe-3 ps-3'>
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
                            </div>
                        </div>
                    </div>
                </section>
                <hr style={{ width: '100%' }} />

                {/* Revenue statistical currently */}
                <section className='row mt-5 d-flex align-items-center justify-content-center'>
                    <div className='col-5 statistical-currently rounded d-flex align-items-center'>
                        <Link to={'/ecomadmin/Statistical/revenue-currently'} style={{width: '100%'}}>
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

                <hr style={{ width: '100%' }} />
                {/* Statistical shop */}
                <section className='row mt-5 d-flex justify-content-center gap-3'>
                    <div className='col-4 statistical-product rounded d-flex align-items-center'>
                        <Link to={'/ecomadmin/Statistical/statistical-instrument'} style={{width: '100%'}}>
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
                    <div className='col-4 statistical-product rounded d-flex align-items-center'>
                        <Link to={'/ecomadmin/Statistical/statistical-brand'} style={{width: '100%'}}>
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
                    <div className='col-4 statistical-product rounded d-flex align-items-center'>
                        <Link to={'/ecomadmin/Statistical/statistical-category'} style={{width: '100%'}}>
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
                                            
                <hr style={{ width: '100%' }} />
                {/* Statistical order */}
                <section className='row mt-5 d-flex justify-content-between gap-3'>
                    {orderTypes.map(order => (
                        <div key={order.type} className='col-2 d-flex align-items-stretch'>
                            <Link to={`/ecomadmin/Statistical/statistical-order/${order.type}`} className='statistical-bill rounded d-flex align-items-center p-2'  style={{width: '100%'}}>
                                <div className='row w-100 align-items-center m-0'>
                                    <div className='col-2 m-0 d-flex justify-content-center align-items-center'>
                                        <i className="fa-solid fa-file-invoice-dollar" style={{ color: '#e94f37', fontSize: '1.2rem' }}></i>
                                    </div>
                                    <div className='col-10 m-0 d-flex align-items-center'>
                                        <h6 className='mb-0 ps-0'>{order.label}</h6>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </section>

            </div>
        </div>
    )
}

export default Statistical
