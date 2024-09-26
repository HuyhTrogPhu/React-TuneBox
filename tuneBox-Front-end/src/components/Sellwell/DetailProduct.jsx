import { Link } from "react-router-dom";
import "./chitietSP.css";
import { images } from "../../assets/images/images";
import Footer2 from "../Footer/Footer2";
const DetailProduct = () => {
  const changeImage = (e) => {
    const mainImage = document.getElementById("main-image");
    mainImage.src = e.target.src;
  };

  return (
    <div>
 <div className="container">
      <div className="content">
        <div className="row">
          <div className="col-md-4 d-flex justify-content-center">
            <div className="img">
              <button className="button1 left ">❮</button>
              <div className="text-center">
                <img id="main-image" src={images.sp2} width={450} alt="product" />
              </div>
              <button className="button right">❯</button>
              <div className="thumbnail text-center mt-5">
                <a href=""> <img onClick={changeImage} src={images.sp1a} width={100} alt="thumbnail" /></a>
                <a href=""> <img onClick={changeImage} src={images.sp1a} width={100} alt="thumbnail" /></a>
                <a href=""> <img onClick={changeImage} src={images.sp1a} width={100} alt="thumbnail" /></a>
                <a href=""> <img onClick={changeImage} src={images.sp1a} width={100} alt="thumbnail" /></a>

              </div>
            </div>
          </div>

          <div className="col-md-8">
            <div className="mt-4 mb-3 noidungSP">
              <h3 className="text-uppercase">
                Squier Paranormal Series 54 Jazz Bass Electric Guitar, Black
              </h3>
              <div className="price d-flex flex-row align-items-center">
                <span className="price">5.950 000 VND</span>
              </div>
              <div className="cart mt-4 align-items-center">
                <input type="number" defaultValue={1} className="soluongSP rounded-2" />
                <button className="btn btn-warning btnCart">
                  <img src={images.car} width="30px" alt="car" /> Add to cart
                </button>
              </div>
              <hr className="hr-100" />
              <div className="gioiThieu mt-4">
                <h5>Về sản phẩm</h5>
                <p>
                  Được giới thiệu lần đầu vào năm 1988, CE đã trở thành một phần
                  thiết yếu của dòng sản phẩm PRS, mang đến sự nhanh nhạy và
                  phản hồi của cấu trúc bu lông...
                </p>
              </div>
              <hr className="hr-100" />
              <div className="mxh">
                <h5>Share:</h5>
                <a href="https://facebook.com" target="_blank" title="Facebook">
                  <i className="fab fa-facebook-f" />
                </a>
                <a href="https://twitter.com" target="_blank" title="Twitter">
                  <i className="fab fa-twitter" />
                </a>
                <a href="https://instagram.com" target="_blank" title="Instagram">
                  <i className="fab fa-instagram" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style={{marginTop: 110}}>
    <Footer2/>
    </div>
    
    </div>
   
  );
};

export default DetailProduct;
