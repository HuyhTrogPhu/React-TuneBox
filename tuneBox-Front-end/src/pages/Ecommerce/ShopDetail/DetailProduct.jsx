import { useParams, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./DetailProduct.css";
import { images } from "../../../assets/images/images";
import Footer2 from "../../../components/Footer/Footer2";
import Benefits from "../../../components/Benefits/Benefits";
import { getInstrumentById } from '../../../service/EcommerceHome';

const DetailProduct = () => {
  const { id } = useParams();
  const location = useLocation();
  const [instrument, setInstrument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInstrument = async () => {
      try {
        const response = await getInstrumentById(id); // Gọi API để lấy dữ liệu
        setInstrument(response.data);
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
  if (loading) return <p>Đang tải sản phẩm...</p>;
  if (error) return <p>{error}</p>;

  // Nếu không có sản phẩm, hiển thị thông báo 404
  if (!instrument) return <p>Sản phẩm không tồn tại hoặc không thể tìm thấy.</p>;

  const changeImage = (e) => {
    const mainImage = document.getElementById("main-image");
    mainImage.src = e.target.src;
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
              <h3>Về sản phẩm</h3>
              <div className="gioiThieu mt-4">
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
                    <div className="">
                      <input type="number" defaultValue={1} className="soluongSP rounded-2 m-0" min={1} />
                    </div>
                    <div className="m-0">
                      <button className="btn btn-warning btnCart" style={{ marginLeft: '10px' }}>
                        <img src={images.car} width="30px" alt="car" /> Add to cart
                      </button>
                    </div>
                  </div>
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
