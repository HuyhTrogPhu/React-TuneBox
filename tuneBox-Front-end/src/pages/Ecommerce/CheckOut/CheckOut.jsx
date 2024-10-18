import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../CheckOut/CheckOut.css';
import Benefits from '../../../components/Benefits/Benefits';
import Footer2 from '../../../components/Footer/Footer2';
import Cookies from "js-cookie";
import { getUserById } from '../../../service/CheckoutService';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate()

    const validateForm = () => {
        let valid = true;
        const errorsCopy = { ...errors };

        // Kiểm tra số điện thoại
        if (phoneNumber) {
            const phoneRegex = /^[0-9]{10,11}$/; // Chỉ cho phép 10 đến 11 chữ số
            if (!phoneRegex.test(phoneNumber)) {
                errorsCopy.phoneNumber = 'Số điện thoại phải bao gồm 10 đến 11 chữ số';
                valid = false;
            } else {
                errorsCopy.phoneNumber = ''; // Không có lỗi
            }
        } else {
            errorsCopy.phoneNumber = 'Vui lòng nhập số điện thoại';
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
                    insurance_value:totalPrice,
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
            Swal.fire('Thông báo', 'Vui lòng điền đầy đủ thông tin trước khi đặt hàng!', 'error');
            return;
        }
    
        // Xác định trạng thái thanh toán dựa trên phương thức thanh toán đã chọn
        const paymentStatus = paymentMethod === 'vnpay' ? 'Paid' : 'Not Paid';
    
        const orderData = {
            userId: userId,
            orderDate: new Date().toISOString(),
            deliveryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            totalPrice: totalPrice + deliveryFee,
            tax: 5.0,
            totalItem: cartItems.length,
            paymentMethod: paymentMethod,
            status: 'Pending',
            phoneNumber: phoneNumber,
            address: `${houseNumber}, ${selectedWardName}, ${selectedDistrictName}, ${selectedProvinceName}`,
            shippingMethod: shippingMethod,
            paymentStatus: paymentStatus, // Sử dụng biến paymentStatus ở đây
            orderDetails: cartItems.map(item => ({
                quantity: item.quantity,
                instrumentId: item.instrumentId,
            })),
        };
    
        console.log("Order Data:", JSON.stringify(orderData, null, 2));
    
        try {
            // Gọi API tạo đơn hàng dựa trên phương thức thanh toán
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
                        title: 'Yêu cầu thanh toán',
                        text: 'Bạn sẽ được chuyển hướng đến trang thanh toán VNPay!',
                        icon: 'info',
                    }).then(() => {
                        window.location.href = response.data.url; // Chuyển hướng đến đường dẫn VNPay
                    });
                } else {
                    Swal.fire({
                        title: 'Lỗi',
                        text: 'Không nhận được URL thanh toán từ VNPay. Vui lòng thử lại.',
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
                    title: 'Thành công',
                    text: 'Đơn hàng của bạn đã được đặt thành công!',
                    icon: 'success',
                    showCancelButton: true,
                    confirmButtonText: 'Xem hóa đơn',
                    cancelButtonText: 'Đóng',
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
            Swal.fire('Lỗi', 'Đã có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.', 'error');
        }
    };
    



    // Hàm để gọi API lấy thông tin chi tiết hóa đơn
    const getOrderDetails = async (orderId) => {
        try {
            const response = await axios.get(`http://localhost:8080/customer/checkout/getOrderById/${orderId}`);
            const orderDetails = response.data;

            // Hiển thị thông tin chi tiết hóa đơn (có thể thay đổi theo cách bạn muốn hiển thị)
            Swal.fire({
                title: 'Chi tiết hóa đơn',
                html: `<p>Mã đơn hàng: ${orderDetails.orderId}</p>
                       <p>Tổng giá trị: ${(orderDetails.totalPrice).toLocaleString('vi')} VND</p>
                       <p>Ngày đặt hàng: ${new Date(orderDetails.orderDate).toLocaleString('vi')}</p>
                       <p>Trạng thái: ${orderDetails.status}</p>
                       <p>Địa chỉ: ${orderDetails.address}</p>`,
                icon: 'info',
                confirmButtonText: 'Đóng',
            });

        } catch (error) {
            console.error('Error fetching order details:', error.response ? error.response.data : error.message);
            Swal.fire('Lỗi', 'Không thể lấy thông tin chi tiết hóa đơn. Vui lòng thử lại.', 'error');
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
                            <h1>Thông tin liên hệ</h1>
                            <form>
                                <div className='mt-3'>
                                    <label className='form-label'>Email:</label>
                                    <input
                                        type="email"
                                        className='form-control'
                                        value={user.email || ''}
                                        readOnly
                                    />
                                </div>
                                <div className='mt-3'>
                                    <label className='form-label'>Name:</label>
                                    <input
                                        type="text"
                                        className='form-control'
                                        value={user.userName || ''}
                                        readOnly
                                    />
                                </div>

                            </form>
                        </div>

                        {/* Order information (Giao hàng) */}
                        <div className='order-infor'>

                            <h1>Giao hàng</h1>
                            <div className='mt-3'>
                                <label className='form-label'>Số điện thoại:</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumer(e.target.value)}
                                />
                                {errors.phoneNumber && <div className='invalid-feedback'>{errors.phoneNumber}</div>}
                            </div>
                            <div className='mt-3'>
                                <label className='form-label'>Quốc gia:</label>
                                <input type="text" className='form-control' defaultValue={'Việt Nam'} disabled />
                            </div>
                            <div className='mt-3'>
                                <label className='form-label'>Tỉnh/ Thành</label>
                                <select onChange={handleProvinceChange} className='form-select'>
                                    <option value="">Chọn Tỉnh/Thành phố</option>
                                    {provinces.map(province => (
                                        <option key={province.ProvinceID} value={province.ProvinceID}>
                                            {province.ProvinceName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='mt-3'>
                                <label className='form-label'>Quận, Huyện</label>
                                <select onChange={handleDistrictChange} className='form-select'>
                                    <option value="">Chọn Quận/Huyện</option>
                                    {districts.map(district => (
                                        <option key={district.DistrictID} value={district.DistrictID}>
                                            {district.DistrictName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='mt-3'>
                                <label className=''>Phường, Xã</label>
                                <select className='form-select' onChange={handleWardChange}>
                                    <option value="">Chọn Phường/Xã</option>
                                    {wards.map(ward => (
                                        <option key={ward.WardCode} value={ward.WardCode}>
                                            {ward.WardName}
                                        </option>
                                    ))}
                                </select>

                            </div>
                            <div className='mt-3'>
                                <label className='form-label'>Số nhà:</label>
                                <input
                                    type="text"
                                    className='form-control'
                                    value={houseNumber}
                                    onChange={(e) => setHouseNumber(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* shipping method */}
                        <h1 style={{ fontSize: '22px' }}>Phương thức giao hàng</h1>
                        <div className='mt-3'>
                            <input type="radio" id="normal" name="shipping" value="normal" checked={shippingMethod === 'normal'} onChange={() => handleShippingChange('normal')} />
                            <label htmlFor="normal"> Giao hàng thông thường</label>
                        </div>
                        <div className='mt-3'>
                            <input type="radio" id="fast" name="shipping" value="fast" checked={shippingMethod === 'ghn'} onChange={() => handleShippingChange('fast')} />
                            <label htmlFor="ghn"> Giao hàng nhanh</label>
                        </div>
                        {shippingMethod === 'fast' && (
                            <div className='mt-3'>
                                <strong>Phí giao hàng nhanh: {deliveryFee.toLocaleString('vi-VN')} VND</strong>
                            </div>
                        )}


                        {/* Pay method */}
                        <div className='pay-method'>
                            <h1>Phương thức thanh toán</h1>
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
                                            onClick={() => handlePaymentChange('vnpay')}
                                        >
                                            <input
                                                type="radio"
                                                id="payment-vnpay"
                                                name="paymentMethod"
                                                value="vnpay"
                                                className="me-2"
                                                checked={paymentMethod === 'vnpay'}
                                                onChange={() => handlePaymentChange('vnpay')}
                                            />
                                            VN Pay
                                        </button>
                                    </h2>
                                    <div className={`accordion-collapse collapse ${paymentMethod === 'vnpay' ? 'show' : ''}`}>
                                        <div className="accordion-body">
                                            <p>Sau khi nhấn "Thanh toán ngay", bạn sẽ được chuyển tiếp tới trang thanh toán bằng tài khoản ngân hàng.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Checkout */}
                        <div className='checkout'>
                            <button className='btn border' onClick={handleSubmitOrder} >Thanh toán</button>
                        </div>

                    </div>

                    {/* Order content bên phải */}
                    <div className='shopping-cart col-lg-6 col-md-6 col-sm-12'>
                        <div className='cart-container'>
                            {cartItems.length === 0 ? (
                                <p>Giỏ hàng của bạn đang trống.</p>
                            ) : (
                                cartItems.map((item) => (
                                    <div className='item-cart d-flex' key={item.id}>
                                        <div className='instrument-image col-2'>
                                            <img src={item.image} alt={item.name} />
                                        </div>
                                        <div className='instrument-name col-7'>
                                            <p>{item.name}</p>
                                        </div>
                                        <div className='instrument-price col-3'>
                                            <p>{(item.costPrice * item.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
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
                                <h5>Phí giao hàng:</h5>
                                <p>{deliveryFee.toLocaleString('vi')} VND</p>
                            </div>

                            {/* Sum total */}
                            <div className='sum d-flex'>
                                <h3>Tổng cộng</h3>
                                <strong>{(totalPrice + deliveryFee).toLocaleString('vi')} VND</strong>
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