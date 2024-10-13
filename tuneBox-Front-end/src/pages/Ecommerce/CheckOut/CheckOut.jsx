import React, { useEffect, useState } from 'react';
import '../CheckOut/CheckOut.css';
import Benefits from '../../../components/Benefits/Benefits';
import Footer2 from '../../../components/Footer/Footer2';
import Cookies from "js-cookie";
import { getUserById } from '../../../service/CheckoutService';

const CheckOut = () => {
    const [userId, setUserId] = useState('');
    const [user, setUser] = useState({});
    const [cartItems, setCartItems] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('cod');

    // Lấy userId từ cookie khi component mount
    useEffect(() => {
        const storedUserId = Cookies.get('userId');
        console.log("userId:", storedUserId);
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);

    // Get user information khi userId có giá trị
    useEffect(() => {
        if (userId) {
            const fetchUser = async () => {
                try {
                    const response = await getUserById(userId);
                    setUser(response.data);
                    console.log(response.data || "Not found user");
                } catch (error) {
                    console.error("Error fetching user:", error);
                }
            };
            fetchUser();
        }
    }, [userId]);

    const fetchCartItems = () => {
        const items = JSON.parse(localStorage.getItem('cart')) || [];
        if (!items || items.length === 0) {
            console.log("Cart undefine");
            setCartItems([]);
        } else {
            setCartItems(items);
        }
    }

    useEffect(() => {
        fetchCartItems();
    }, []);


    const handlePaymentChange = (method) => {
        setPaymentMethod(method);
    };



    return (
        <div>
            <div className='container'>
                <div className='row d-flex justify-content-between'>
                    {/* Order content bên trái */}
                    <div className='order-infor col-lg-6 col-md-6 col-sm-12'>
                        {/* Information user */}
                        <div className='user-infor'>
                            <h1>Thông tin liên hệ</h1>
                            <form>
                                <div className='mt-3'>
                                    <label className='form-label'>Email:</label>
                                    <input
                                        type="email"
                                        className='form-control'
                                        value={user.email || ''} // Giá trị mặc định nếu email undefined
                                        readOnly
                                    />
                                </div>
                                <div className='mt-3'>
                                    <label className='form-label'>Name:</label>
                                    <input
                                        type="text"
                                        className='form-control'
                                        value={user.userName || ''} // Giá trị mặc định nếu userName undefined
                                        readOnly
                                    />
                                </div>
                                <div className='mt-3'>
                                    <label className='form-label'>Phone Number:</label>
                                    <input
                                        type="text"
                                        className='form-control'
                                        value={user.phoneNumber || ''} // Giá trị mặc định nếu phoneNumber undefined
                                        readOnly
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Order information */}
                        <div className='order-infor'>
                            <h1>Giao hàng</h1>
                            <div className='mt-3'>
                                <label className='form-label'>Quốc gia:</label>
                                <input type="text" className='form-control' defaultValue={'Việt Nam'} disabled />
                            </div>
                            <div className='mt-3'>
                                <label className='form-label'>Tỉnh/ Thành</label>
                                <select name="cities" className='form-select'>
                                    <option value="">Chọn Tỉnh/ Thành</option>
                                </select>
                            </div>
                            <div className='mt-3'>
                                <label className='form-label'>Quận, Huyện</label>
                                <select name="tinh" className='form-select'>
                                    <option value=""> Chọn Quận/ Huyện</option>
                                </select>
                            </div>
                            <div className='mt-3'>
                                <label className=''>Phường, Xã</label>
                                <select name="" className='form-select'>
                                    <option value="">Chọn Phường, Xã</option>
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
                                            <p>Sau khi nhấn "Thanh toán ngay", bạn sẽ nhận hàng và thanh toán trực tiếp với nhân viên giao hàng của chúng tôi.</p>
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

                    {/* Instrument belong order bên phải */}
                    <div className='col-lg-6 col-md-6 col-sm-12'>
                        {cartItems.length === 0 ? (
                            <p>Giỏ hàng của bạn đang trống.</p>
                        ) : (
                            cartItems.map((item) => (
                                <div className='item-cart d-flex' key={item.id}>
                                    <div className='instrument-image col-2'>
                                        <img src={item.image} alt="" style={{ width: '50px' }} />
                                    </div>
                                    <div className='instrument-name col-7'>
                                        <p>{item.name}</p>
                                    </div>
                                    <div className='instrument-price col-3'>
                                        <p>{item.costPrice} VND</p>
                                    </div>
                                </div>
                            ))
                        )}

                        {/* Total item */}
                        <div className='total-item d-flex'>
                            <h5>Total items:</h5>
                            <p>{cartItems.length}</p>
                        </div>

                        {/* Total price */}
                        <div className='total-price d-flex'>
                            <h5>Total price:</h5>
                            <p>{cartItems.reduce((total, item) => total + item.costPrice, 0)} VND</p>
                        </div>

                        {/* Tax */}
                        <div className='tax d-flex'>
                            <h5>Tax:</h5>
                            <p>2%</p>
                        </div>

                        {/* Sum total */}
                        <div className='sum d-flex'>
                            <h3>Tổng cộng</h3>
                            <strong>{cartItems.reduce((total, item) => total + item.costPrice, 0) * 1.02} VND</strong>
                        </div>

                        <div className='checkout'>
                            <button className='btn border'>Thanh toán</button>
                        </div>

                    </div>
                </div>
            </div>
            <Benefits />
            <Footer2 />
        </div>
    );

}

export default CheckOut;
