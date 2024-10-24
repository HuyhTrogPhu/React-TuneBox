import React from 'react'

const Statistical = () => {
    return (
        <div>

            <div className='container'>
                {/* Statistical customer */}
                <section className='row d-flex justify-content-center gap-3'>
                    <div className='col-3 border rounded bg-white d-flex align-items-center' style={{ height: '100%' }}>
                        <div className='row d-flex align-items-center'>
                            <div className='col-3 m-0 d-flex justify-content-center align-items-center'>
                                <i className="fa-solid fa-users" style={{ color: '#e94f37', fontSize: '1.2rem' }}></i>
                            </div>
                            <div className='col-9 m-0 '>
                                <h6 className='ps-0'>Customer sell the most</h6>
                            </div>
                        </div>
                    </div>
                    <div className='col-3 border rounded bg-white d-flex align-items-center' style={{ height: '100%' }}>
                        <div className='row d-flex align-items-center'>
                            <div className='col-3 m-0 d-flex justify-content-center align-items-center'>
                                <i className="fa-solid fa-users" style={{ color: '#e94f37', fontSize: '1.2rem' }}></i>
                            </div>
                            <div className='col-9 m-0'>
                                <h6 className='ps-0'>Customer sell the least</h6>
                            </div>
                        </div>
                    </div>
                    <div className='col-3 border rounded bg-white d-flex align-items-center' style={{ height: '100%' }}>
                        <div className='row d-flex align-items-center'>
                            <div className='col-3 m-0 d-flex justify-content-center align-items-center'>
                                <i className="fa-solid fa-users" style={{ color: '#e94f37', fontSize: '1.2rem' }}></i>
                            </div>
                            <div className='col-9 m-0'>
                                <h6 className='ps-0 pe-0'>The customer who bought the most</h6>
                            </div>
                        </div>
                    </div>
                    <div className='col-3 border rounded bg-white d-flex align-items-center' style={{ height: '100%' }}>
                        <div className='row d-flex align-items-center'>
                            <div className='col-3 m-0 d-flex justify-content-center align-items-center'>
                                <i className="fa-solid fa-users" style={{ color: '#e94f37', fontSize: '1.2rem' }}></i>
                            </div>
                            <div className='col-9 m-0'>
                                <h6 className='ps-0 pe-0'>Customer do not buy the least</h6>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Revenue statistical currently */}
                <section className='row mt-5'>
                    <div className='col-5 border rounded bg-white d-flex align-items-center' style={{ height: '100%' }}>
                        <div className='row d-flex align-items-center'>
                            <div className='col-2 m-0 d-flex justify-content-center align-items-center'>
                                <i className="fa-solid fa-money-bill" style={{ color: '#e94f37', fontSize: '1.2rem' }}></i>
                            </div>
                            <div className='col-10 m-0'>
                                <h6 className='ps-0'>Revenue statistical currently</h6>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Statistical instrument */}
                <section className='row mt-5 d-flex justify-content-center gap-3'>
                    <div className='col-4 border rounded bg-white d-flex align-items-center' style={{ height: '100%' }}>
                        <div className='row d-flex align-items-center'>
                            <div className='col-3 m-0 d-flex justify-content-center align-items-center'>
                                <i className="fa-solid fa-music" style={{ color: '#e94f37', fontSize: '1.2rem' }}></i>
                            </div>
                            <div className='col-9 m-0'>
                                <h6 className='ps-0'>Best selling musical instruments in the month</h6>
                            </div>
                        </div>
                    </div>
                    <div className='col-4 border rounded bg-white d-flex align-items-center' style={{ height: '100%' }}>
                        <div className='row d-flex align-items-center'>
                            <div className='col-3 m-0 d-flex justify-content-center align-items-center'>
                                <i className="fa-solid fa-music" style={{ color: '#e94f37', fontSize: '1.2rem' }}></i>
                            </div>
                            <div className='col-9 m-0'>
                                <h6 className='ps-0'>Least sold musical instruments in the month </h6>
                            </div>
                        </div>
                    </div>
                    <div className='col-4 border rounded bg-white d-flex align-items-center' style={{ height: '100%' }}>
                        <div className='row d-flex align-items-center'>
                            <div className='col-3 m-0 d-flex justify-content-center align-items-center'>
                                <i className="fa-solid fa-music" style={{ color: '#e94f37', fontSize: '1.2rem' }}></i>
                            </div>
                            <div className='col-9 m-0'>
                                <h6 className='ps-0'>Instruments for sale not for sale in the month</h6>
                            </div>
                        </div>
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
                total revenue of the day-chart<br />
                total revenue of the week-chart <br />
                total revenue of the month-chart <br />
                total revenue of the year-chart <br />

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
