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
const CheckOut = () => {
    // const [userId, setUserId] = useState('');
    const [user, setUser] = useState({});
    const [cartItems, setCartItems] = useState([]);

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

        // Kiểm tra thông tin đầu vào
        if (!userId || cartItems.length === 0 || !selectedProvince || !selectedDistrict || !selectedWard || !houseNumber) {
            Swal.fire('Notification', 'Please fill in all information before ordering!', 'error');
            return;
        }

        // Xác định trạng thái thanh toán dựa trên phương thức thanh toán đã chọn
        const paymentStatus = paymentMethod === 'vnpay' ? 'Paid' : 'Not Paid';

        const orderData = {
            userId: userId,
            orderDate: new Date().toISOString(),
            deliveryDate: null,
            totalPrice: totalPrice + deliveryFee,
            tax: 5.0,
            totalItem: cartItems.length,
            paymentMethod: paymentMethod,
            status: 'Pending',
            phoneNumber: phoneNumber,
            address: `${houseNumber}, ${selectedWardName}, ${selectedDistrictName}, ${selectedProvinceName}`,
            shippingMethod: shippingMethod,
            paymentStatus: paymentStatus,
            orderDetails: cartItems.map(item => ({
                quantity: item.quantity,
                instrumentId: item.instrumentId,
            })),
        };

        console.log("Order Data:", JSON.stringify(orderData, null, 2));

        try {
            // Gọi API tạo đơn hàng dựa trên phương thức thanh toán
            setIsLoading(true);
            let response;
            if (paymentMethod === 'vnpay') {
                response = await axios.post('http://localhost:8080/customer/checkout/create_payment', orderData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true
                });


                // Đảm bảo rằng đơn hàng đã được lưu ở đây
                if (response.data && response.data.url) {
                    Swal.fire({
                        title: 'Request payment',
                        text: 'You will be redirected to the VNPay payment page!',
                        icon: 'info',
                    }).then(() => {
                        window.location.href = response.data.url; // Chuyển hướng đến đường dẫn VNPay
                    });
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'Did not receive payment URL from VNPay. Please try again.',
                        icon: 'error',
                    });
                }
            } else {
                response = await axios.post('http://localhost:8080/customer/checkout/create', orderData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true
                });


                Swal.fire({
                    title: 'Success',
                    text: 'Your order has been placed successfully!',
                    icon: 'success',
                    showCancelButton: true,
                    confirmButtonText: 'View invoice',
                    cancelButtonText: 'Close',
                }).then((result) => {
                    if (result.isConfirmed) {
                        getOrderDetails(response.data.orderId); // Lấy orderId từ response
                    } else {
                        navigate('/shop');
                    }
                });
            }

            // Reset giỏ hàng
            localStorage.removeItem('cart');
            setCartItems([]);
        } catch (error) {
            console.error('Error creating order:', error.response ? error.response.data : error.message);
            Swal.fire('Error', 'An error occurred while placing the order. Please try again.', 'error');
        } finally {
            setIsLoading(false);// Kết thúc hiển thị biểu tượng xoay
        }
    };




    // Hàm để gọi API lấy thông tin chi tiết hóa đơn
    const getOrderDetails = async (orderId) => {
        try {
            const response = await axios.get(`http://localhost:8080/customer/checkout/getOrderById/${orderId}`);
            const orderDetails = response.data;

            // Hiển thị thông tin chi tiết hóa đơn kèm đường link đến trang chi tiết
            Swal.fire({
                title: 'Invoice Information',
                html: `<p>Order code: ${orderDetails.orderId}</p>
                       <p>Total value: ${(orderDetails.totalPrice).toLocaleString('vi')} VND</p>
                       <p>Order date: ${new Date(orderDetails.orderDate).toLocaleString('vi')}</p>
                       <p>Status: ${orderDetails.status}</p>
                       <p>Address: ${orderDetails.address}</p>
                       <p><a href="http://localhost:3000/orderDetail/${orderDetails.orderId}" target="_blank">View Detailed Invoice</a></p>`,
                icon: 'info',
                confirmButtonText: 'Close',
            });

        } catch (error) {
            console.error('Error fetching order details:', error.response ? error.response.data : error.message);
            Swal.fire('Error', 'Unable to get invoice details. Please try again.', 'error');
        }
    };



    return (
        <div>
            <div className='container-fluid' style={{ padding: '50px 100px 50px 100px' }}>
                <div className='row d-flex justify-content-between'>
                    {/* Order content bên trái */}
                    <div className='order-infor col-lg-6 col-md-6 col-sm-12'>
                        {/* Information user */}
                        <div className='user-infor'>
                            <h1>Customer information</h1>
                            <form>
                                <div className='mt-3'>
                                    <label className='form-label'>Email:</label>
                                    <input
                                        type="email"
                                        className='form-control'
                                        value={user.email || ''}

                                    />
                                </div>
                                <div className='mt-3'>
                                    <label className='form-label'>Name:</label>
                                    <input
                                        type="text"
                                        className='form-control'
                                        value={user.userName || ''}

                                    />
                                </div>
                                <div className='mt-3'>
                                    <label className='form-label'>Phone number:</label>
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

                            <h1>Delivery address</h1>

                            <div className='mt-3'>
                                <label className='form-label'>Nation:</label>
                                <input type="text" className='form-control' defaultValue={'Việt Nam'} disabled />
                            </div>
                            <div className='mt-3'>
                                <label className='form-label'>Province/City</label>
                                <select onChange={handleProvinceChange} className='form-select'>
                                    <option value="">Select Province/City</option>
                                    {provinces.map(province => (
                                        <option key={province.ProvinceID} value={province.ProvinceID}>
                                            {province.ProvinceName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='mt-3'>
                                <label className='form-label'>District</label>
                                <select onChange={handleDistrictChange} className='form-select'>
                                    <option value="">Select district</option>
                                    {districts.map(district => (
                                        <option key={district.DistrictID} value={district.DistrictID}>
                                            {district.DistrictName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='mt-3'>
                                <label className=''>Ward, Commune</label>
                                <select className='form-select' onChange={handleWardChange}>
                                    <option value="">Select Ward/Commune</option>
                                    {wards.map(ward => (
                                        <option key={ward.WardCode} value={ward.WardCode}>
                                            {ward.WardName}
                                        </option>
                                    ))}
                                </select>

                            </div>
                            <div className='mt-3'>
                                <label className='form-label'>House number:</label>
                                <input
                                    type="text"
                                    className='form-control'
                                    value={houseNumber}
                                    onChange={(e) => setHouseNumber(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* shipping method */}
                        <h1 style={{ fontSize: '22px' }}>Delivery Method</h1>
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
                            <label htmlFor="normal">Regular Delivery</label>
                        </div>
                        <div className='mt-3'>
                            <input
                                type="radio"
                                id="fast"
                                name="shipping"
                                value="fast"  // Cập nhật giá trị 'value' cho đúng
                                checked={shippingMethod === 'Fast'}  // Điều kiện checked nên là 'fast' thay vì 'ghn'
                                onChange={() => handleShippingChange('Fast')}
                                className="me-2"
                            />
                            <label htmlFor="fast">Fast Delivery</label>
                        </div>




                        {/* Pay method */}
                        <div className='pay-method'>
                            <h1>Payment method</h1>
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
                                            <p>After clicking "Pay", you will receive the goods and pay directly with our delivery staff.</p>
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
                                            <p>After clicking "Pay", you will be forwarded to the payment page using VNPAY.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Checkout */}
                        <div className='checkout'>
                            <button className='btn border' onClick={handleSubmitOrder}>Pay</button>

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
                                <p>Your shopping cart is empty.</p>
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
                            <div className='total-item d-flex'>
                                <h5>Total items:</h5>
                                <p>{cartItems.length} items</p>
                            </div>

                            {/* Total price */}
                            <div className='total-price d-flex'>
                                <h5>Total price:</h5>
                                <p>{totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                            </div>

                            {/* Tax */}
                            <div className='tax d-flex'>
                                <h5>Delivery fee:</h5>
                                <p>{deliveryFee.toLocaleString('vi')} VND</p>
                            </div>

                            {/* Sum total */}
                            <div className='sum d-flex'>
                                <h3>Total order value</h3>
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