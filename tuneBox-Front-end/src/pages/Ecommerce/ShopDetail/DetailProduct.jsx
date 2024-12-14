import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./DetailProduct.css";
import Footer2 from "../../../components/Footer/Footer2";
import Benefits from "../../../components/Benefits/Benefits";
import { getInstrumentById } from "../../../service/EcommerceHome";
import Cookies from "js-cookie";
import { addToLocalCart } from "../../../service/CartService";

import { useTranslation } from "react-i18next";
import '../../../i18n/i18n'
import ShareProductModal from "../../SocialMedia/Profile/Profile_nav/ShareProductModal";

import Swal from "sweetalert2";
import { Audio } from "react-loader-spinner";

const DetailProduct = () => {
  const { id } = useParams();
  const location = useLocation();
  const [instrument, setInstrument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  const [relatedInstrument, setRelatedInstrumet] = useState([]); // state related instrument by category id and brand id

  const [quantity, setQuantity] = useState(1); // state lưa số lượng sản phẩm

  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState({});
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // share sanpham sang feed
  const handleShareToFeed = () => {
    navigate("/feed", {
      state: { sharedData: instrument, activeComponent: "post" },
    });
    console.log("sharedData: ", instrument);
  };

  const handleClearSharedData = () => {
    navigate("/feed", {
      state: {
        sharedData: null,
        activeComponent: "track",
      },
    });
  };

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  useEffect(() => {
    // Lấy userId từ cookie khi component mount
    const storedUserId = Cookies.get("userId");
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

  // Hiển thị loading hoặc lỗi nếu có
  if (loading) return <p>{t("dnote3")}</p>;
  if (error) return <p>{error}</p>;

  // Nếu không có sản phẩm, hiển thị thông báo 404
  if (!instrument) return <p>{t("dnote4")}.</p>;

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < instrument.quantity) {
      // Kiểm tra xem số lượng có vượt quá số lượng hiện có không
      setQuantity(quantity + 1);
    } else {
      Swal.fire({
        title: t('error'),
        text: t('dnote5'),
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: "btn btn-primary",
        },
        buttonsStyling: false,
      });
    }
  };

  // Cập nhật giá trị trong ô input
  const handleInputChange = (e) => {
    const value = Number(e.target.value);
    if (value >= 1 && value <= instrument.quantity) {
      // Kiểm tra giới hạn
      setQuantity(value);
    } else if (value > instrument.quantity) {
      Swal.fire({
        title: t('error'),
        text: t('dnote5'),
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: "btn btn-primary",
        },
        buttonsStyling: false,
      });
    } else {
      setQuantity(1); // Đặt lại số lượng về 1 nếu nhập số âm hoặc 0
    }
  };

  // Trong phần render
  <input
    type="number"
    value={quantity}
    onChange={handleInputChange} // Sử dụng hàm mới này
    className="soluongSP rounded-2 m-0"
    min={1}
  />;

  // Hàm để xác định trạng thái hàng hóa
  const getStockStatus = (quantity) => {
    if (quantity === 0) return t('hethang');
    if (quantity > 0 && quantity <= 5) return t('saphhet');
    return t('conhang');
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true); // Bắt đầu loading

    // Kiểm tra trạng thái hàng hóa
    if (instrument.quantity === 0) {
      setIsAddingToCart(false); // Kết thúc loading

      // Hiển thị thông báo không thể thêm sản phẩm vào giỏ hàng
      Swal.fire({
        title: t('error'),
        text: t('dnote6'),
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: "btn btn-primary",
        },
        buttonsStyling: false, // Tùy chọn để sử dụng style tùy chỉnh
      });

      return; // Dừng thực hiện nếu không còn hàng
    }

    // Nếu sản phẩm còn hàng, thực hiện thêm vào giỏ hàng
    setTimeout(() => {
      addToLocalCart(instrument, quantity);
      setIsAddingToCart(false); // Kết thúc loading

      // Sử dụng SweetAlert2 để hiển thị thông báo
      Swal.fire({
        title: t('succes'),
        text: t('dnote2'),
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: "btn btn-primary",
        },
        buttonsStyling: false, // Tùy chọn để sử dụng style tùy chỉnh
      });
    }, 1000); // Giả lập thời gian xử lý
  };

  // sản phẩm tương tự
  const handleBrandClick = (brand) => {
    navigate("/brand-detail", { state: { brand } });
  };

  if (loading) return <p>Đang tải sản phẩm...</p>;
  if (error) return <p>{error}</p>;
  if (!instrument)
    return <p>Sản phẩm không tồn tại hoặc không thể tìm thấy.</p>;

  return (
    <div>
      <div className="container" style={{ paddingTop: '100px', backgroundColor: 'white' }}>
        <div className="content" style={{ width: '100%' }}>
          {/* Instrument image */}
          <div className="row">
            <h3 className="text-uppercase">{instrument.name}</h3>
            <div className="col-md-12 d-flex justify-content-center">
              <div className="img">
                <div className="text-center">
                  <img
                    id="main-image"
                    src={instrument.image}
                    width={450}
                    alt="product"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-5">
            {/* Instrument content */}
            <div className="col-6">
              <div className="mt-5">
                <h3>About the product</h3>
                <div className="gioiThieu mt-4 p-3">
                  <p>{instrument.description}</p>
                </div>
              </div>
            </div>
            <div className="col-5">
              <div className="mt-4 mb-3 noidungSP">
                <div className="price d-flex flex-row align-items-center">
                  <span className="price">
                    {instrument.costPrice.toLocaleString()} VND
                  </span>
                </div>
                <div className="cart mt-4 align-items-center">
                  <div className="row">
                    {/* Quantity */}
                    <div className="col-lg-5 col-md-5 col-sm 12 d-flex mt-4">
                      <div>
                        <strong>{t("qty")}</strong>
                      </div>
                      <button
                        className="btn btn-prev"
                        onClick={handleDecrement}
                      >
                        <strong>-</strong>
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={handleInputChange} // Sử dụng hàm mới này
                        className="soluongSP rounded-2 m-0"
                        min={1}
                      />
                      <button
                        className="btn btn-next"
                        onClick={handleIncrement}
                      >
                        <strong>+</strong>
                      </button>
                    </div>

                    {/* Brand */}
                    <div className="col-lg-5 col-md-5 col-sm 12">
                      <div className="instrument-brand">
                        <img
                          src={instrument.brand.brandImage}
                          alt={instrument.brand.name}
                        />
                        <span
                          onClick={() => handleBrandClick(instrument.brand)}
                        >
                          <a href="">
                            {t("brandsame")}
                            <i className="fa-solid fa-arrow-right"></i>
                          </a>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Add to cart */}
                  <div className="btn-cart mt-4">
                    <button
                      className="add-to-cart"
                      onClick={handleAddToCart}
                      disabled={isAddingToCart}
                    >
                      {!isAddingToCart ? t("dnote7") : null}
                    </button>
                    {isAddingToCart && (
                      <div className="loader-overlay">
                        <Audio
                          height="80"
                          width="80"
                          radius="9"
                          color="#e94f37"
                          ariaLabel="three-dots-loading"
                          wrapperStyle
                          wrapperClass
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Service */}
                <div className="service">
                  <div className="buy-service">
                    <i className="fa-solid fa-cart-shopping"></i>
                    <span className="ms-2">{t("but")}</span>
                  </div>
                  <div className="product-service">
                    <i className="fa-solid fa-box"></i>
                    <span className="ms-2">
                      {getStockStatus(instrument.quantity)}
                    </span>{" "}
                    {/* Trạng thái còn hàng và hết hàng  */}
                  </div>
                  <div className="ship-service">
                    <i className="fa-solid fa-truck-fast"></i>
                    <span className="ms-2">{t("ship")}</span>
                  </div>

                  {/* Share */}
                  <div className=" row d-flex align-items-center justify-content-center mt-4">
                    {/* Share via message */}
                    <div className="col-6">
                      <button
                        className="share-message"
                        onClick={() => setIsShareModalOpen(true)}
                      >
                        <i className="fa-solid fa-share"></i> Share via message
                      </button>
                      <ShareProductModal
                        productId={id}
                        isOpen={isShareModalOpen}
                        onClose={() => setIsShareModalOpen(false)}
                      />
                    </div>
                    {/* Share via post */}
                    <div className="col-6">
                      <button className="share-post"
                       onClick={handleShareToFeed}>
                        <i className="fa-solid fa-share"> </i>Share via post
                      </button>
                    </div>
                  </div>
                </div>

                {/* Related products */}

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
