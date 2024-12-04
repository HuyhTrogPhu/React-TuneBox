import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Line } from 'react-chartjs-2';

const Statistical = () => {


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
                    <div className='col-3 border rounded bg-white d-flex align-items-center' style={{ height: '100%' }}>
                        <Link to={'/socialadmin/Statistical/StaticPost'}>
                            <div className='row d-flex align-items-center'>
                                <div className='col-3 m-0 d-flex justify-content-center align-items-center'>
                                    <i className="fa-solid fa-users" style={{ color: '#e94f37', fontSize: '1.2rem' }}></i>
                                </div>
                                <div className='col-9 m-0'>
                                    <h6 className='ps-0 pe-0'>Static Post</h6>
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className='col-3 border rounded bg-white d-flex align-items-center' style={{ height: '100%' }}>
                    <Link to={'/socialadmin/Statistical/StaticticalReport'}>
                            <div className='row d-flex align-items-center'>
                                <div className='col-3 m-0 d-flex justify-content-center align-items-center'>
                                    <i className="fa-solid fa-users" style={{ color: '#e94f37', fontSize: '1.2rem' }}></i>
                                </div>
                                <div className='col-9 m-0'>
                                    <h6 className='ps-0 pe-0'>Static Report</h6>
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
