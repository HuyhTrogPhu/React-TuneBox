import React from 'react'
import './Sellwell.css'
import { images } from '../../assets/images/images'
import { Link } from 'react-router-dom'

const Sellwell = () => {
    return (
        <div>
            <div className=' mt-5'>
                <div className='sellwell-title'>
                    <h4>Sell well</h4>
                </div>
                <hr className='hr-100' />

                <div className='row'>
                    {/* Instrument 1 */}
                    <div className='card col-lg-3'>
                        <Link to={'/DetailProduct'}>
                            <div className='card-img'>
                                <img src={images.sp1} alt="" className='main-img' />
                                <img src={images.sp1a} alt="" className='hover-img' />
                            </div>
                            <div className='card-body'>
                                <h5 className='card-title'>
                                    Ibanez JEMJR-WH Steve Vai Signature Electric Guitar, White
                                </h5>
                                <p className='card-price'>
                                    20.010.000đ
                                </p>
                            </div>
                        </Link>
                    </div>
                    {/* Instrument 2 */}
                    <div className='card col-lg-3'>
                        <Link to={'/DetailProduct'}>
                            <div className='card-img'>
                                <img src={images.sp1} alt="" className='main-img' />
                                <img src={images.sp1a} alt="" className='hover-img' />
                            </div>
                            <div className='card-body'>
                                <h5 className='card-title'>
                                    Ibanez JEMJR-WH Steve Vai Signature Electric Guitar, White
                                </h5>
                                <p className='card-price'>
                                    20.010.000đ
                                </p>
                            </div>
                        </Link>
                    </div>
                    {/* Instrument 3 */}
                    <div className='card col-lg-3'>
                        <Link to={'/DetailProduct'}>
                            <div className='card-img'>
                                <img src={images.sp1} alt="" className='main-img' />
                                <img src={images.sp1a} alt="" className='hover-img' />
                            </div>
                            <div className='card-body'>
                                <h5 className='card-title'>
                                    Ibanez JEMJR-WH Steve Vai Signature Electric Guitar, White
                                </h5>
                                <p className='card-price'>
                                    20.010.000đ
                                </p>
                            </div>
                        </Link>
                    </div>
                    {/* Instrument 4 */}
                    <div className='card col-lg-3'>
                        <Link to={'/DetailProduct'}>
                            <div className='card-img'>
                                <img src={images.sp1} alt="" className='main-img' />
                                <img src={images.sp1a} alt="" className='hover-img' />
                            </div>
                            <div className='card-body'>
                                <h5 className='card-title'>
                                    Ibanez JEMJR-WH Steve Vai Signature Electric Guitar, White
                                </h5>
                                <p className='card-price'>
                                    20.010.000đ
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Sellwell
