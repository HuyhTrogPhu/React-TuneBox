import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../CheckOut/CheckOut.css';
import Benefits from '../../../components/Benefits/Benefits';
import Footer2 from '../../../components/Footer/Footer2';
import Cookies from "js-cookie";
import { getUserById } from '../../../service/CheckoutService';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Audio } from 'react-loader-spinner'
const GHN_API_KEY = 'f6a2324b-895f-11ef-a76b-8ef8cf9ed7dc';

import { useTranslation } from "react-i18next";
import '../../../i18n/i18n'
const CheckOut = () => {
    // const [userId, setUserId] = useState('');
    const [user, setUser] = useState({});
    const [cartItems, setCartItems] = useState([]);
    const { t } = useTranslation();
    const userId = Cookies.get("userId");
    console.log("User ID từ cookie:", userId);
    const [errors, setErrors] = useState('');
    //API GHN 
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [deliveryFee, setDeliveryFee] = useState(0);

    const [shippingMethod, setShippingMethod] = useState('');
    const [selectedWard, setSelectedWard] = useState('');

    const [selectedProvinceName, setSelectedProvinceName] = useState('');
    const [selectedDistrictName, setSelectedDistrictName] = useState('');
    const [selectedWardName, setSelectedWardName] = useState('');

    // END
    const [houseNumber, setHouseNumber] = useState('');
    const [phoneNumber, setPhoneNumer] = useState('')
    const [paymentStatus, setPaymentStatus] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate()

    const validateForm = () => {
        let valid = true;
        const errorsCopy = { ...errors };

        // Kiểm tra số điện thoại
        if (phoneNumber) {
            const phoneRegex = /^[0-9]{10,11}$/; // Chỉ cho phép 10 đến 11 chữ số
            if (!phoneRegex.test(phoneNumber)) {
                errorsCopy.phoneNumber = 'Invalid phone number';
                valid = false;
            } else {
                errorsCopy.phoneNumber = ''; // Không có lỗi
            }
        } else {
            errorsCopy.phoneNumber = 'Please enter phone number';
            valid = false;
        }

        setErrors(errorsCopy);
        return valid;
    };


    // Get user information khi userId có giá trị
    useEffect(() => {
        if (userId) {

            const fetchUser = async () => {
                try {
                    const response = await getUserById(userId);

                    setUser(response.data);

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

    //ghn start
    useEffect(() => {
        axios.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/province', {
            headers: {
                'Token': GHN_API_KEY,
            },
        })
            .then(response => {
                setProvinces(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching provinces:', error);
            });
    }, []);

    // Lấy danh sách quận/huyện khi chọn tỉnh
    const handleProvinceChange = (e) => {
        const provinceId = parseInt(e.target.value, 10);  // Chuyển thành số nguyên
        if (!provinceId) {
            console.error('Invalid province ID');
            return;
        }

        const selectedProvince = provinces.find(province => province.ProvinceID === provinceId);
        setSelectedProvince(provinceId);
        setSelectedProvinceName(selectedProvince ? selectedProvince.ProvinceName : ''); // Cập nhật tên tỉnh
        axios.post('https://online-gateway.ghn.vn/shiip/public-api/master-data/district',
            { "province_id": provinceId },  // Gửi province_id dưới dạng số
            {
                headers: {
                    'Token': GHN_API_KEY,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                setDistricts(response.data.data);
                setWards([]); // Reset danh sách phường/xã khi chọn tỉnh mới
            })
            .catch(error => {
                console.error('Error fetching districts:', error);
            });
    };


    // Lấy danh sách phường/xã khi chọn quận/huyện
    const handleDistrictChange = (e) => {
        const districtId = parseInt(e.target.value, 10);
        if (!districtId) {
            console.error('Invalid district ID');
            return;
        }

        const selectedDistrict = districts.find(district => district.DistrictID === districtId);
        setSelectedDistrict(districtId);
        setSelectedDistrictName(selectedDistrict ? selectedDistrict.DistrictName : ''); // Cập nhật tên huyện
        axios.post('https://online-gateway.ghn.vn/shiip/public-api/master-data/ward',
            { "district_id": districtId },
            {
                headers: {
                    'Token': GHN_API_KEY,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                setWards(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching wards:', error);
            });
    };



    // Xử lý chọn phương thức giao hàng
    const handleWardChange = (e) => {
        const wardCode = e.target.value;
        const selectedWard = wards.find(ward => ward.WardCode === wardCode); // Tìm tên phường/xã
        setSelectedWard(wardCode);
        setSelectedWardName(selectedWard ? selectedWard.WardName : ''); // Cập nhật tên xã
    };


    const handleShippingChange = async (method) => {
        setShippingMethod(method);
        if (method === 'fast') {
            try {
                console.log("Gửi yêu cầu đến GHN với các tham số:", {
                    service_type_id: 2,
                    to_district_id: selectedDistrict,
                    to_ward_code: selectedWard,
                    weight: 1000,
                    insurance_value: totalPrice,
                    coupon: null
                });

                const response = await axios.post('https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee', {
                    "service_type_id": 2,
                    "to_district_id": selectedDistrict,
                    "to_ward_code": selectedWard,
                    "from_district_id": 3695,
                    "weight": 1000,
                    "insurance_value": totalPrice,
                    "length": 15,
                    "width": 15,
                    "coupon": null
                }, {
                    headers: {
                        'Token': GHN_API_KEY,
                        'Content-Type': 'application/json'
                    }
                });

                const fee = response.data.data.total;
                setDeliveryFee(fee);
            } catch (error) {
                // Log toàn bộ đối tượng lỗi để xem chi tiết
                console.error("Error fetching fast delivery fee:", error);

                // Kiểm tra xem có phản hồi từ API không
                if (error.response) {
                    console.error("Response data:", error.response.data); // Nội dung chi tiết từ API
                    console.error("Response status:", error.response.status); // Mã trạng thái HTTP
                    console.error("Response headers:", error.response.headers); // Headers của phản hồi
                } else if (error.request) {
                    // Yêu cầu đã được gửi nhưng không nhận được phản hồi
                    console.error("No response received:", error.request);
                } else {
                    // Một lỗi khác xảy ra khi thiết lập yêu cầu
                    console.error("Error setting up request:", error.message);
                }
                console.error("Config:", error.config); // Cấu hình của yêu cầu Axios
            }
        } else {
            setDeliveryFee(0);
        }
    };

    const totalPrice = cartItems.reduce((total, item) => {
        const costPrice = parseFloat(item.costPrice) || 0; // Chuyển đổi sang số và đảm bảo không bị NaN
        const quantity = parseInt(item.quantity) || 0; // Chuyển đổi sang số nguyên
        return total + costPrice * quantity;
    }, 0)


    const handleSubmitOrder = async () => {
        if (!validateForm()) {
            return;
        }
    
        if (!userId || cartItems.length === 0 || !selectedProvince || !selectedDistrict || !selectedWard || !houseNumber) {
            Swal.fire(
                t('c24'), // 'Notification'
                t('c25'), // 'Please fill in all information before ordering!'
                'error'
            );
            return;
        }
    
        const paymentStatus = paymentMethod === 'VNPAY' ? 'Paid' : 'Not Paid';
    
        const orderData = {
            userId,
            orderDate: new Date().toISOString(),
            deliveryDate: null,
            totalPrice: totalPrice + deliveryFee,
            tax: 5.0,
            totalItem: cartItems.length,
            paymentMethod,
            status: 'Pending',
            phoneNumber,
            address: `${houseNumber}, ${selectedWardName}, ${selectedDistrictName}, ${selectedProvinceName}`,
            shippingMethod,
            paymentStatus,
            orderDetails: cartItems.map(item => ({
                quantity: item.quantity,
                instrumentId: item.instrumentId,
            })),
        };
    
        console.log("Order Data:", JSON.stringify(orderData, null, 2));
    
        try {
            setIsLoading(true);
            let response;
            if (paymentMethod === 'VNPAY') {
                response = await axios.post('http://localhost:8080/customer/checkout/create_payment', orderData, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });
    
                if (response.data && response.data.url) {
                    Swal.fire({
                        title: t('c26'), // 'Request payment'
                        text: t('c27'),  // 'You will be redirected to the VNPay payment page!'
                        icon: 'info',
                    }).then(() => {
                        window.location.href = response.data.url;
                    });
                } else {
                    Swal.fire({
                        title: t('c28'), // 'Error'
                        text: t('c29'),  // 'Did not receive payment URL from VNPay. Please try again.'
                        icon: 'error',
                    });
                }
            } else {
                response = await axios.post('http://localhost:8080/customer/checkout/create', orderData, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });
    
                Swal.fire({
                    title: t('c30'), // 'Success'
                    text: t('c31'),  // 'Your order has been placed successfully!'
                    icon: 'success',
                    showCancelButton: true,
                    confirmButtonText: t('c32'), // 'View invoice'
                    cancelButtonText: t('c33'),  // 'Close'
                }).then((result) => {
                    if (result.isConfirmed) {
                        getOrderDetails(response.data.orderId);
                    } else {
                        navigate('/shop');
                    }
                });
            }
    
            localStorage.removeItem('cart');
            setCartItems([]);
        } catch (error) {
            console.error('Error creating order:', error.response ? error.response.data : error.message);
            Swal.fire(
                t('c28'), // 'Error'
                t('c34'), // 'An error occurred while placing the order. Please try again.'
                'error'
            );
        } finally {
            setIsLoading(false);
        }
    };
    




    // Hàm để gọi API lấy thông tin chi tiết hóa đơn
    const getOrderDetails = async (orderId) => {
        try {
            const response = await axios.get(`http://localhost:8080/customer/checkout/getOrderById/${orderId}`);
            const orderDetails = response.data;
    
            Swal.fire({
                title: t('c35'), // 'Invoice Information'
                html: `<p>${t('c36')} ${orderDetails.orderId}</p>
                       <p>${t('c37')} ${(orderDetails.totalPrice).toLocaleString('vi')} VND</p>
                       <p>${t('c38')} ${new Date(orderDetails.orderDate).toLocaleString('vi')}</p>
                       <p>${t('c39')} ${orderDetails.status}</p>
                       <p>${t('c40')} ${orderDetails.address}</p>
                       <p><a href="http://localhost:3000/orderDetail/${orderDetails.orderId}" target="_blank">${t('c32')}</a></p>`,
                icon: 'info',
                confirmButtonText: t('c33'), // 'Close'
            });
        } catch (error) {
            console.error('Error fetching order details:', error.response ? error.response.data : error.message);
            Swal.fire(
                t('c28'), // 'Error'
                t('c41'), // 'Unable to get invoice details. Please try again.'
                'error'
            );
        }
    };


    return (
        <div>
            <div className='container-fluid mt-5' style={{ padding: '50px 100px 50px 100px' }}>
                <div className='row d-flex justify-content-between'>
                    {/* Order content bên trái */}
                    <div className='order-infor col-lg-6 col-md-6 col-sm-12'>
                        {/* Information user */}
                        <div className='user-infor'>
                            <h1>{t('c1')}</h1>
                            <form>
                                <div className='mt-3'>
                                    <label className='form-label'>{t('c2')}</label>
                                    <input
                                        type="email"
                                        className='form-control'
                                        value={user.email || ''}

                                    />
                                </div>
                                <div className='mt-3'>
                                    <label className='form-label'>{t('c3')}</label>
                                    <input
                                        type="text"
                                        className='form-control'
                                        value={user.userName || ''}

                                    />
                                </div>
                                <div className='mt-3'>
                                    <label className='form-label'>{t('c4')}</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumer(e.target.value)}
                                    />
                                    {errors.phoneNumber && <div className='invalid-feedback'>{errors.phoneNumber}</div>}
                                </div>

                            </form>
                        </div>

                        {/* Order information (Giao hàng) */}
                        <div className='order-infor'>

                            <h1>{t('c5')}</h1>

                            <div className='mt-3'>
                                <label className='form-label'>{t('c6')}</label>
                                <input type="text" className='form-control' defaultValue={'Việt Nam'} disabled />
                            </div>
                            <div className='mt-3'>
                                <label className='form-label'>{t('c7')}</label>
                                <select onChange={handleProvinceChange} className='form-select'>
                                    <option value="">{t('c10')}</option>
                                    {provinces.map(province => (
                                        <option key={province.ProvinceID} value={province.ProvinceID}>
                                            {province.ProvinceName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='mt-3'>
                                <label className='form-label'>{t('c8')}</label>
                                <select onChange={handleDistrictChange} className='form-select'>
                                    <option value="">{t('c11')}</option>
                                    {districts.map(district => (
                                        <option key={district.DistrictID} value={district.DistrictID}>
                                            {district.DistrictName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='mt-3'>
                                <label className=''>{t('c9')}</label>
                                <select className='form-select' onChange={handleWardChange}>
                                    <option value="">{t('c12')}</option>
                                    {wards.map(ward => (
                                        <option key={ward.WardCode} value={ward.WardCode}>
                                            {ward.WardName}
                                        </option>
                                    ))}
                                </select>

                            </div>
                            <div className='mt-3'>
                                <label className='form-label'>{t('c13')}</label>
                                <input
                                    type="text"
                                    className='form-control'
                                    value={houseNumber}
                                    onChange={(e) => setHouseNumber(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* shipping method */}
                        <h1 style={{ fontSize: '22px' }}>{t('c14')}</h1>
                        <div className='mt-3'>
                            <input
                                type="radio"
                                id="normal"
                                name="shipping"
                                value="normal"
                                checked={shippingMethod === 'Normal'}
                                onChange={() => handleShippingChange('Normal')}
                                className="me-2"  // thêm khoảng cách giữa radio và label
                            />
                            <label htmlFor="normal">{t('c15')}</label>
                        </div>
                        <div className='mt-3'>
                            <input
                                type="radio"
                                id="fast"
                                name="shipping"
                                value="fast"  // Cập nhật giá trị 'value' cho đúng
                                checked={shippingMethod === 'fast'}  // Điều kiện checked nên là 'fast' thay vì 'ghn'
                                onChange={() => handleShippingChange('fast')}
                                className="me-2"
                            />
                            <label htmlFor="fast">{t('c16')}</label>
                        </div>




                        {/* Pay method */}
                        <div className='pay-method'>
                            <h1>{t('c17')}</h1>
                            <div className="accordion" id="accordionExample">
                                <div className="accordion-item">
                                    <h2 className="accordion-header">
                                        <button
                                            className="accordion-button"
                                            type="button"
                                            onClick={() => handlePaymentChange('COD')}
                                        >
                                            <input
                                                type="radio"
                                                id="codRadio"
                                                name="paymentMethod"
                                                value="COD"
                                                className="me-2"
                                                checked={paymentMethod === 'COD'}
                                                onChange={() => handlePaymentChange('COD')}
                                            />
                                            COD
                                        </button>
                                    </h2>
                                    <div className={`accordion-collapse collapse ${paymentMethod === 'COD' ? 'show' : ''}`}>
                                        <div className="accordion-body">
                                            <p>{t('c18')}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header">
                                        <button
                                            className="accordion-button collapsed"
                                            type="button"
                                            onClick={() => handlePaymentChange('VNPAY')}
                                        >
                                            <input
                                                type="radio"
                                                id="payment-vnpay"
                                                name="paymentMethod"
                                                value="VNPAY"
                                                className="me-2"
                                                checked={paymentMethod === 'VNPAY'}
                                                onChange={() => handlePaymentChange('VNPAY')}
                                            />
                                            VNPAY
                                        </button>
                                    </h2>
                                    <div className={`accordion-collapse collapse ${paymentMethod === 'VNPAY' ? 'show' : ''}`}>
                                        <div className="accordion-body">
                                            <p>{t('c19')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Checkout */}
                        <div className='checkout'>
                            <button className='btn border' onClick={handleSubmitOrder}>{t('c20')}</button>

                        </div>
                        {isLoading && (
                            <div style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 9999,
                            }}>
                                <Audio
                                    height="100"
                                    width="100"
                                    color="#e94f37"
                                    ariaLabel="loading"
                                />
                            </div>
                        )}

                    </div>

                    {/* Order content bên phải */}
                    <div className='shopping-cart col-lg-6 col-md-6 col-sm-12'>
                        <div className='cart-container'>
                            {cartItems.length === 0 ? (
                                <p>{t('no')}</p>
                            ) : (
                                cartItems.map((item) => (
                                    <div className='item-cart d-flex' key={item.id}>
                                        <div className='instrument-image col-2'>
                                            <img src={item.image} alt={item.name} />
                                        </div>
                                        <div className='instrument-name col-7'>
                                            <p>{item.name}</p>
                                        </div>

                                    </div>
                                ))
                            )}

                            {/* Total item */}
                            <div className='total-item d-flexC' >
                                <h5>{t('c21')}</h5>
                                <p  >{cartItems.length} items</p>
                            </div>

                            {/* Total price */}
                            <div className='total-price d-flexC'>
                                <h5>{t('c22')}</h5>
                                <p>{totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                            </div>

                            {/* Tax */}
                            <div className='tax d-flexC'>
                                <h5>{t('c42')}</h5>
                                <p>{deliveryFee.toLocaleString('vi')} VND</p>
                            </div>

                            {/* Sum total */}
                            <div className='sum d-flexC'>
                                <h3>{t('c23')}</h3>
                                <strong style={{ fontSize: '30px' }}>{(totalPrice + deliveryFee).toLocaleString('vi')} VND</strong>
                            </div>
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