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
                <section className='row d-flex justify-content-center gap-3'>
                    <div className='col-4 border rounded bg-white d-flex align-items-center' style={{ height: '100%' }}>
                        <Link to={'/socialadmin/Statistical/UserStatic'}>
                            <div className='row d-flex align-items-center'>
                                <div className='col-3 m-0 d-flex justify-content-center align-items-center'>
                                    <i className="fa-solid fa-users" style={{ color: '#e94f37', fontSize: '1.2rem' }}></i>
                                </div>
                                <div className='col-9 m-0 '>
                                    <h6 className='ps-0'>User Static</h6>
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className='col-4 border rounded bg-white d-flex align-items-center' style={{ height: '100%' }}>
                        <Link to={'/socialadmin/Statistical/StaticAlbum'}>
                            <div className='row d-flex align-items-center'>

                                <div className='col-3 m-0 d-flex justify-content-center align-items-center'>
                                    <i className="fa-solid fa-users" style={{ color: '#e94f37', fontSize: '1.2rem' }}></i>
                                </div>
                                <div className='col-9 m-0'>
                                    <h6 className='ps-0'>Album Statics </h6>
                                </div>

                            </div>
                        </Link>
                    </div>
                    <div className='col-3 border rounded bg-white d-flex align-items-center' style={{ height: '100%' }}>
                        <Link to={'/socialadmin/Statistical/StaticPlayList'}>
                            <div className='row d-flex align-items-center'>
                                <div className='col-3 m-0 d-flex justify-content-center align-items-center'>
                                    <i className="fa-solid fa-users" style={{ color: '#e94f37', fontSize: '1.2rem' }}></i>
                                </div>
                                <div className='col-9 m-0'>
                                    <h6 className='ps-0 pe-0'>Static PlayList</h6>
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className='col-3 border rounded bg-white d-flex align-items-center' style={{ height: '100%' }}>
                        <Link to={'/socialadmin/Statistical/StaticTrack'}>
                            <div className='row d-flex align-items-center'>
                                <div className='col-3 m-0 d-flex justify-content-center align-items-center'>
                                    <i className="fa-solid fa-users" style={{ color: '#e94f37', fontSize: '1.2rem' }}></i>
                                </div>
                                <div className='col-9 m-0'>
                                    <h6 className='ps-0 pe-0'>Static Track</h6>
                                </div>
                            </div>
                        </Link>
                    </div>

                </section>



            </div>
        </div>
    )
}

export default Statistical
