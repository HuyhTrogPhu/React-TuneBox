import { useParams, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./DetailProduct.css";
import { images } from "../../../assets/images/images";
import Footer2 from "../../../components/Footer/Footer2";
import Benefits from "../../../components/Benefits/Benefits";
import { getInstrumentById } from '../../../service/EcommerceHome';
import { Link } from "react-router-dom";
import Cookies from 'js-cookie';
import { addToCart, getCart } from "../../../service/CartService";

const DetailProduct = () => {
  const { id } = useParams();
  const location = useLocation();
  const [instrument, setInstrument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [relatedInstrument, setRelatedInstrumet] = useState([]); // state related instrument by category id and brand id

  const [quantity, setQuantity] = useState(1); // state lưa số lượng sản phẩm 

  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState({});


  useEffect(() => {
    // Lấy userId từ cookie khi component mount
    const storedUserId = Cookies.get('userId');
    console.log("userId:", storedUserId);
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);


  useEffect(() => {
    const fetchInstrument = async () => {
      try {
        const response = await getInstrumentById(id); // Gọi API để lấy dữ liệu
        setInstrument(response.data);
        console.log(response.data);
      } catch (err) {
        setError("Sản phẩm không tồn tại hoặc không thể tìm thấy."); // Xử lý lỗi
      } finally {
        setLoading(false); // Đã tải xong (có dữ liệu hoặc lỗi)
      }
    };

    if (location.state && location.state.instrument) {
      setInstrument(location.state.instrument);
      setLoading(false);
    } else {
      fetchInstrument(); // Gọi API nếu không có dữ liệu từ state
    }
  }, [id, location.state]);


  // get list intrument related 
  // useEffect(() => {
  //   if (instrument) {
  //     const fetchRelatedInstruments = async () => {
  //       try {
  //         const response = await getInstrumentByCateIdAndBrandId(instrument.categoryIns.id, instrument.brand.id);
  //         console.log("Category Id:", instrument.categoryIns.id);
  //         console.log("Brand Id", instrument.brand.id);
  //         setRelatedInstrumet(response.data);
  //         console.log(response.data);
  //       } catch (error) {
  //         console.error("Error fetching related instruments", error);
  //       }
  //     };
  //     fetchRelatedInstruments();
  //   }
  // }, [instrument]);



  // Hiển thị loading hoặc lỗi nếu có
  if (loading) return <p>Đang tải sản phẩm...</p>;
  if (error) return <p>{error}</p>;

  // Nếu không có sản phẩm, hiển thị thông báo 404
  if (!instrument) return <p>Sản phẩm không tồn tại hoặc không thể tìm thấy.</p>;

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  // Hàm để xác định trạng thái hàng hóa
  const getStockStatus = (quantity) => {
    if (quantity === 0) return 'Out of stock';
    if (quantity > 0 && quantity <= 5) return 'Almost out of stock';
    return 'In stock';
  };



  // Hàm add to cart
  const handleAddToCart = async () => {
    try {
      const response = await addToCart(instrument.id, quantity);
      alert('Đã thêm vào giỏ hàng thành công.');
  
      // Kiểm tra phản hồi từ API và session lưu trữ
      console.log("API response after adding to cart:", response.data);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.');
    }
  };
  


  return (
    <div>
      <div className="container">
        <div className="content">
          {/* Instrument image */}
          <div className="row">
            <h3 className="text-uppercase">{instrument.name}</h3>
            <div className="col-md-12 d-flex justify-content-center">
              <div className="img">

                <div className="text-center">
                  <img id="main-image" src={instrument.image} width={450} alt="product" />
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-5">
            {/* Instrument content */}
            <div className="col-6">
              <h3>About the product</h3>
              <div className="gioiThieu mt-4 p-3">
                <p>{instrument.description}</p>
              </div>
            </div>
            <div className="col-5">
              <div className="mt-4 mb-3 noidungSP">
                <div className="price d-flex flex-row align-items-center">
                  <span className="price">{instrument.costPrice.toLocaleString()} VND</span>
                </div>
                <div className="cart mt-4 align-items-center">
                  <div className="d-flex">
                    {/* Quantity */}
                    <div className="col-5 d-flex mt-4">
                      <div><strong>Qty:</strong></div>
                      <button className="btn btn-prev" onClick={handleDecrement}><strong>-</strong></button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="soluongSP rounded-2 m-0"
                        min={1}
                      />
                      <button className="btn btn-next" onClick={handleIncrement}><strong>+</strong></button>
                    </div>

                    {/* Brand */}
                    <div className="col-5">
                      <div className="instrument-brand">
                        <img src={instrument.brand.brandImage} alt={instrument.brand.name} />
                        <Link to={'/CategoryPage'}>List brand <i className="fa-solid fa-arrow-right"></i></Link>
                      </div>
                    </div>
                  </div>

                  {/* Add to cart */}
                  <div className="btn-cart mt-4">
                    <button className="add-to-cart" value={instrument.id} onClick={handleAddToCart}>Add to cart</button>
                  </div>
                </div>

                {/* Service */}
                <div className="service">
                  <div className="buy-service">
                    <i className="fa-solid fa-cart-shopping"></i>
                    <span className="ms-2">Buy now, pay later</span>
                  </div>
                  <div className="product-service">
                    <i className="fa-solid fa-box"></i>
                    <span className="ms-2">{getStockStatus(instrument.quantity)}</span> {/* Trạng thái còn hàng và hết hàng  */}
                  </div>
                  <div className="ship-service">
                    <i className="fa-solid fa-truck-fast"></i>
                    <span className="ms-2">Free shipping on all orders</span>
                  </div>
                </div>

                {/* Related products */}
                <div className="carousel slide" id="carouselExample">
                  <h3>Related instruments</h3>
                  <div className="carousel-inner">
                    {/* Chia relatedInstrument thành các nhóm, mỗi nhóm có 2 sản phẩm */}
                    {relatedInstrument.reduce((acc, _, index) => {
                      if (index % 2 === 0) {
                        acc.push(relatedInstrument.slice(index, index + 2));
                      }
                      return acc;
                    }, []).map((group, groupIndex) => (
                      <div className={`carousel-item ${groupIndex === 0 ? 'active' : ''}`} key={groupIndex}>
                        <div className="row">
                          {group.map((ins) => (
                            <div className="col-md-6" key={ins.id}>
                              <Link to={{
                                pathname: `/DetailProduct/${ins.id}`,
                                state: { ins }
                              }} className="card-link">
                                <div className="card" style={{ width: '100%', border: 'none', cursor: 'pointer' }}>
                                  <div className="card-img-wrapper">
                                    <img
                                      src={ins.image}
                                      className="card-img-top"
                                      alt={ins.name}
                                    />
                                  </div>
                                  <div className="card-body text-center">
                                    <p className="card-title">{ins.name}</p>
                                    <p className="card-price">{ins.costPrice.toLocaleString()}đ</p>
                                    <p className="card-status">{getStockStatus(ins.quantity)}</p>
                                  </div>
                                </div>
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Carousel controls */}
                  <button
                    className="carousel-control-prev"
                    data-bs-slide="prev"
                    data-bs-target="#carouselExample"
                    type="button"
                  >
                    <span aria-hidden="true" className="carousel-control-prev-icon" />
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button
                    className="carousel-control-next"
                    data-bs-slide="next"
                    data-bs-target="#carouselExample"
                    type="button"
                  >
                    <span aria-hidden="true" className="carousel-control-next-icon" />
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 110 }}>
        <Benefits />
        <Footer2 />
      </div>
    </div>
  );
};

export default DetailProduct;
