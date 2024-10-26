import React from 'react'
import { Link } from 'react-router-dom'
import { Line } from 'react-chartjs-2';

const Statistical = () => {

    const [currentRevenue, setCurrentRevenue] = useState({});
    const [previousRevenue, setPreviousRevenue] = useState({});

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
                                    <h6 className='ps-0'>Customer sell the most</h6>
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
                                    <h6 className='ps-0'>Customer sell the least</h6>
                                </div>

                            </div>
                        </Link>
                    </div>
                    <div className='col-4 border rounded bg-white d-flex align-items-center' style={{ height: '100%' }}>
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

                {/* Search revenue statistical */}
                <section className='row mt-5 d-flex justify-content-between gap-3'>
                    <div className='col d-flex flex-column border rounded bg-white' style={{ flexGrow: 1 }}>
                        <form className='p-3'>
                            <div className='mt-3'>
                                <label className='form-label'>Revenue statistical of day</label>
                                <input type="date" className='form-control' placeholder='select day' />
                            </div>
                            <div className='mt-3'>
                                <button type='submit' className='btn border' style={{ backgroundColor: '#e94f37', color: '#fff' }}>Submit</button>
                            </div>
                        </form>
                    </div>
                    <div className='col d-flex flex-column border rounded bg-white' style={{ flexGrow: 1 }}>
                        <form className='p-3'>
                            <div className='mt-3'>
                                <label className='form-label'>Revenue statistical of week</label>
                                <input type="date" className='form-control' placeholder='select week' />
                            </div>
                            <div className='mt-3'>
                                <button type='submit' className='btn border' style={{ backgroundColor: '#e94f37', color: '#fff' }}>Submit</button>
                            </div>
                        </form>
                    </div>
                    <div className='col d-flex flex-column border rounded bg-white' style={{ flexGrow: 1 }}>
                        <form className='p-3'>
                            <div className='mt-3'>
                                <label className='form-label'>Revenue statistical of month</label>
                                <input type="date" className='form-control' placeholder='select month' />
                            </div>
                            <div className='mt-3'>
                                <button type='submit' className='btn border' style={{ backgroundColor: '#e94f37', color: '#fff' }}>Submit</button>
                            </div>
                        </form>
                    </div>
                    <div className='col d-flex flex-column border rounded bg-white' style={{ flexGrow: 1 }}>
                        <form className='p-3'>
                            <div className='mt-3'>
                                <label className='form-label'>Revenue statistical of year</label>
                                <input type="date" className='form-control' placeholder='select year' />
                            </div>
                            <div className='mt-3'>
                                <button type='submit' className='btn border' style={{ backgroundColor: '#e94f37', color: '#fff' }}>Submit</button>
                            </div>
                        </form>
                    </div>
                </section>

                {/* Chart revenue statistical */}
                <section className='row mt-5 justify-content-between gap-3'>
                    <div className='col-6'>
                        <h6>Total revenue of the day: {(currentRevenue.revenueOfDay || 0).toLocaleString('vi')} VND</h6>
                        <Line data={createChartData(currentRevenue.revenueOfDay, previousRevenue.revenueBeforeOfDay, 'Doanh thu Ngày')} />
                    </div>
                    <div className='col-6'>
                        <h6>Total revenue of the week: {(currentRevenue.revenueOfWeek || 0).toLocaleString('vi')} VND</h6>
                        <Line data={createChartData(currentRevenue.revenueOfWeek, previousRevenue.revenueBeforeOfWeek, 'Doanh thu Tuần')} />
                    </div>
                    <div className='col-6'>
                        <h6>Total revenue of the month: {(currentRevenue.revenueOfMonth || 0).toLocaleString('vi')} VND</h6>
                        <Line data={createChartData(currentRevenue.revenueOfMonth, previousRevenue.revenueBeforeOfMonth, 'Doanh thu Tháng')} />
                    </div>
                    <div className='col-6'>
                        <h6>Total revenue of the year: {(currentRevenue.revenueOfYear || 0).toLocaleString('vi')} VND</h6>
                        <Line data={createChartData(currentRevenue.revenueOfYear, previousRevenue.revenueBeforeOfYear, 'Doanh thu Năm')} />
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
