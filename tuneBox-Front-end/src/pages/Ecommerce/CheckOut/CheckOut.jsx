import React, { useState } from 'react'
import '../CheckOut/CheckOut.css'
import Benefits from '../../../components/Benefits/Benefits'
import Footer2 from '../../../components/Footer/Footer2'
import Cookies from "js-cookie";


const CheckOut = () => {

    const userId = Cookies.get('userId')
    const [user, setUser] = useState("");


    const [paymentMethod, setPaymentMethod] = useState('cod');

    function getUserById() {
        
    }

    const handlePaymentChange = (method) => {
        setPaymentMethod(method);
    };

    return (
        <div>
            <div className='container'>
                <div className='row'>
                    {/* Order content */}
                    <div className='order-infor col-6'>
                        {/* Information user */}
                        <div className='user-infor'>
                            <h1>Thông tin liên hệ</h1>
                            <form action="">
                                <div className='mt-3'>
                                    <label className='form-label'>
                                        Email:
                                    </label>
                                    <input type="email" className='form-control' />
                                </div>

                                <div className='mt-3'>
                                    <label className='fomr-label'>
                                        Name:
                                    </label>
                                    <input type="text" className='form-control' />
                                </div>

                                <div className='mt-3'>
                                    <label className='form-label'>
                                        Phone Number:
                                    </label>
                                    <input type="text" className='form-control' />
                                </div>
                            </form>
                        </div>
                        {/* Order information */}
                        <div className='order-infor'>
                            <h1>Giao hàng</h1>
                            <div className='mt-3'>
                                <label className='form-label'>Quốc gia:</label>
                                <select name="country" className='form-select'>
                                    <form action="" >
                                        <input type="text" className='form-control' placeholder='Search country...' />
                                    </form>
                                    <option value="">Chọn quốc gia</option>
                                </select>
                            </div>

                            <div className='mt-3'>
                                <label className='form-label'>Thành phố/ Tỉnh:</label>
                                <select name="cities" className='form-select'>
                                    <option value="">Chọn thành phố/ Tỉnh</option>
                                </select>
                            </div>

                            <div className='mt-3'>
                                <label className='form-label'>Quận/ Huyện</label>
                                <select name="tinh" className='form-select'>
                                    <option value=""> Chọn Quận/ Huyện</option>
                                </select>
                            </div>

                            <div className='mt-3'>
                                <label className=''>Phường, Xã, Thị Trấn</label>
                                <select name="" className='form-select'>
                                    <option value="">Chọn phường, xã, thị trấn</option>
                                </select>
                            </div>

                            <div className='mt-3'>
                                <label className='form-label'>Số nhà</label>
                                <input type="text" className='form-control' />
                            </div>

                        </div>

                        {/* shipping method */}
                        <h1>Phương thức giao hàng</h1>
                        <div className='shipping-method'>
                            <h5>Giao hàng thông thường</h5>
                            <p>Miễn phí</p>
                        </div>

                        {/* Pay method */}
                        <div className='pay-method'>
                            <div className="accordion" id="accordionExample">
                                <div className="accordion-item">
                                    <h2 className="accordion-header">
                                        <button
                                            className="accordion-button"
                                            type="button"
                                            onClick={() => handlePaymentChange('cod')}
                                        >
                                            <input
                                                type="radio"
                                                id="codRadio"
                                                name="paymentMethod"
                                                value="cod"
                                                className="me-2"
                                                checked={paymentMethod === 'cod'}
                                                onChange={() => handlePaymentChange('cod')}
                                            />
                                            COD
                                        </button>
                                    </h2>
                                    <div className={`accordion-collapse collapse ${paymentMethod === 'cod' ? 'show' : ''}`}>
                                        <div className="accordion-body">
                                            <p>Sao khi nhấn "Thanh toán ngay", bạn sẽ nhận hàng và thanh toán trực tiếp với nhân viên giao hàng của chúng tôi.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="accordion-item">
                                    <h2 className="accordion-header">
                                        <button
                                            className="accordion-button collapsed"
                                            type="button"
                                            onClick={() => handlePaymentChange('paypal')}
                                        >
                                            <input
                                                type="radio"
                                                id="paypalRadio"
                                                name="paymentMethod"
                                                value="paypal"
                                                className="me-2"
                                                checked={paymentMethod === 'paypal'}
                                                onChange={() => handlePaymentChange('paypal')}
                                            />
                                            Paypal
                                        </button>
                                    </h2>
                                    <div className={`accordion-collapse collapse ${paymentMethod === 'paypal' ? 'show' : ''}`}>
                                        <div className="accordion-body">
                                            <p>Sau khi nhấn "Thanh toán ngay", bạn sẽ được chuyển tiếp tới trang thanh toán bằng tài khoản ngân hàng.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                    {/* Instrument belong order*/}
                    <div className='item col-6'>
                        <div className='item-cart'>
                            <div className='instrument-image col-2'>
                                <img src="" alt="" />
                            </div>
                            <div className='instrument-name col-2'>
                                <p></p>
                            </div>
                            <div className='instrument-price col-2'>
                                <p></p>
                            </div>
                        </div>
                        {/* Total item */}
                        <div className='total-item'>
                            <h5>Total items:</h5>
                            <p></p>
                        </div>

                        {/* Total price */}
                        <div className='total-price'>
                            <h5>Total price:</h5>
                            <p></p>
                        </div>

                        {/* Tax */}
                        <div className='tax'>
                            <h5>Tax:</h5>
                            <p>2%</p>
                        </div>

                        {/* Sum total */}
                        <div className='sum'>
                            <h3>Tổng cộng</h3>
                            <strong></strong>
                        </div>
                    </div>
                </div>
            </div>
            <Benefits />
            <Footer2 />
        </div>
    )
}

export default CheckOut
