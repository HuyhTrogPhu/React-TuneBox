import { Link } from "react-router-dom";
import { images } from "../../../assets/images/images"; // Không sử dụng biến này nếu không cần
import Footer2 from "../../../components/Footer/Footer2";
import Benefits from "../../../components/Benefits/Benefits";
import { useEffect, useState } from "react";
import { getCart } from "../../../service/CartService";
import { getInstrumentById } from "../../../service/EcommerceHome";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  const fetchCartItems = async () => {
    try {
      const response = await getCart();
      const itemsObject = response.data.cartItems; 
  
      console.log("Cart data:", itemsObject);
  
      if (!itemsObject || itemsObject.length === 0) {
        console.log("Giỏ hàng đang trống.");
        setCartItems([]); 
      } else {
        // Xử lý dữ liệu nếu giỏ hàng không trống
        const itemsArray = itemsObject.map((item) => {
          return {
            ...item.instrument, // Lấy thông tin từ đối tượng instrument
            quantity: item.quantity, // Số lượng từ cart item
          };
        });
        setCartItems(itemsArray); // Cập nhật giỏ hàng
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };
  
  useEffect(() => {
    fetchCartItems();
  }, []);

  const totalPrice = cartItems.reduce((total, item) => {
    return total + item.costPrice * item.quantity;
  }, 0);

  return (
    <div>
      <div className="container">
        <hr className="hr-100" />
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb" style={{ marginLeft: 70 }}>
            <li className="breadcrumb-item">
              <Link to={"/Ecommerce"}>Trang chủ</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">Giỏ hàng</li>
          </ol>
        </nav>
        <hr className="hr-100" />
        <div className="row content-image-cart">
          <div>
            <section className="h-100 h-custom">
              <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                  <div className="col-12">
                    <div className="card card-registration card-registration-2 card-background" style={{ borderRadius: 15 }}>
                      <div className="card-body p-0">
                        <div className="row g-0">
                          <div className="col-lg-8">
                            <div className="p-5">
                              <div className="d-flex justify-content-between align-items-center mb-5">
                                <h1 className="fw-bold mb-0">Shopping Cart</h1>
                                <h6 className="mb-0 text-muted">{cartItems.length} items</h6>
                              </div>
                              <hr className="hr-100" />
                              {cartItems.map((item) => (
                                <div className="row mb-4 d-flex justify-content-between align-items-center" key={item.instrumentId}>
                                  <div className="col-md-2 col-lg-2 col-xl-2">
                                    <img src={item.image} className="img-fluid rounded-3" alt={item.name} />
                                  </div>
                                  <div className="col-md-3 col-lg-3 col-xl-3">
                                    {/* <h6 className="text-muted">{item.brand?.name} - {item.categoryIns?.name}</h6> */}
                                    <h6 className="mb-0">{item.name}</h6>
                                  </div>
                                  <div className="col-md-3 col-lg-3 col-xl-2 d-flex">
                                    <button className="btn btn-link px-2" onClick={() => {/* Giảm số lượng */ }}>
                                      <i className="fas fa-minus" />
                                    </button>
                                    <input min={0} name="quantity" defaultValue={item.quantity} type="number" className="form-control form-control-sm" />
                                    <button className="btn btn-link px-2" onClick={() => {/* Tăng số lượng */ }}>
                                      <i className="fas fa-plus" />
                                    </button>
                                  </div>
                                  <div className="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                                    <h6 className="mb-0">€ {(item.costPrice * item.quantity).toFixed(2)}</h6>
                                  </div>
                                  <div className="col-md-1 col-lg-1 col-xl-1 text-end">
                                    <a href="#!" className="text-muted"><i className="fas fa-times" /></a>
                                  </div>
                                </div>
                              ))}
                              <hr className="hr-100" />
                              <div className="pt-5">
                                <h6 className="mb-0">
                                  <Link to="#" className="text-body">
                                    <i className="fas fa-long-arrow-alt-left me-2" />Back to shop
                                  </Link>
                                </h6>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4 bg-body-tertiary">
                            <div className="p-5">
                              <h3 className="fw-bold mb-5 mt-2 pt-1">Summary</h3>
                              <hr className="hr-100" />
                              <div className="d-flex justify-content-between mb-4">
                                <h5 className="text-uppercase">items {cartItems.length}</h5>
                                <h5>{totalPrice.toFixed(2)}</h5>
                              </div>

                              <hr className="hr-100" />
                              <div className="d-flex justify-content-between mb-5">
                                <h5 className="text-uppercase">Total price</h5>
                                <h5>{(totalPrice).toFixed(2)}</h5>
                              </div>
                              <button type="button" className="btn btn-dark btn-block btn-lg">Check out</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Benefits />
      <Footer2 />
    </div>
  );
}

export default Cart;
