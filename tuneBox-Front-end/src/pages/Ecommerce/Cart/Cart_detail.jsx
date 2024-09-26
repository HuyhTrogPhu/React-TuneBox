import { Link } from "react-router-dom";
import "./css/chitietGH.css"
import Footer2 from "../../../components/Footer/Footer2";
const CartDetail = () => {
  return (
    
    <div>
    <div className="container">
      <hr className="hr-100" />
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb" style={{ marginLeft: 70 }}>
          <li className="breadcrumb-item">
            <Link to={'/Ecommerce'}>Trang chủ</Link>
          </li>

          <li className="breadcrumb-item active" aria-current="page">
            Guitar &amp; Bass
          </li>
        </ol>
      </nav>
      <hr className="hr-100" />
      {/* noi dung */}
      <div className="row">
        <div className="col-5 ThongTin">
          <div className="mb-3">
            {/* thong tin lien he */}
            <div className="row">
              <div className="col-9">
                <label className="form-label title" htmlFor="contact-info">
                  Thông tin liên hệ
                </label>
              </div>
             
            </div>

            <input
              type="text"
              className="form-control mb-3"
              id="email"
              placeholder="Email"
            />
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                defaultValue
                id="flexCheckDefault"
              />
              <label className="form-check-label" htmlFor="flexCheckDefault">
                Thông báo cho tôi khi có sản phẩm hoặc khuyến mãi mới
              </label>
            </div>
          </div>
          {/* dia chi giao hang */}
          <label htmlFor="ThongTinLienHe" className="form-label title">
            Thông tin địa chỉ giao Hàng
          </label>
 
          <input
            type="text"
            className="form-control mb-3"
            id="quocgia"
            placeholder="Quốc gia"
          />
          <div className="row mb-3">
            <div className="col">
              <input
                type="text"
                className="form-control"
                placeholder="Họ"
                aria-label="ho"
              />
            </div>
            <div className="col">
              <input
                type="text"
                className="form-control"
                placeholder="Tên"
                aria-label="ten"
              />
            </div>
          </div>
          <div>
            <input
              type="text"
              className="form-control mb-3"
              id="sdt"
              placeholder="Số điện thoại"
            />
          </div>
          <div>
            <select class="form-select mb-3" aria-label="Default select example">
              <option selected>Chọn quốc gia</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </select>
          </div>
          <div>
            <select class="form-select mb-3" aria-label="Default select example">
              <option selected>Tỉnh/ Thành phố</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </select>
          </div>
          <div>
            <select class="form-select mb-3" aria-label="Default select example" >
              <option selected>Quận/ Huyện</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </select>
          </div>
          <div>
            <select class="form-select mb-3" aria-label="Default select example" >
              <option selected>Phường/ Xã</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </select>
          </div>

          <input
            type="text"
            className="form-control mb-3"
            id="address"
            placeholder="Địa chỉ chi tiết"
          />
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              defaultValue
              id="flexCheckDefault"
            />
            <label className="form-check-label mb-3" htmlFor="flexCheckDefault">
              Lưu thông tin này cho lần sau
            </label>
          </div>
          {/* Phuong thuc thanh toan */}
          <label htmlFor="ThongTinLienHe" className="form-label title">
            Phương thức thanh toán
          </label>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault1"
            />
            <label className="form-check-label" htmlFor="flexRadioDefault1">
              Thanh toán qua cổng thanh toán
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault2"
            />
            <label className="form-check-label" htmlFor="flexRadioDefault2">
              Thanh toán khi nhận hàng
            </label>
          </div>
          <div className="d-flex justify-content-center mt-3">
            <button className="btn btn-warning">Hoàn tất thanh toán</button>
          </div>
        </div>
        <div className="col-1 cach mt-4" />
        <div className="col-5 donhangchitiet">
          <div className="noidung">
            <h5>Thông tin đơn hàng</h5>
            <table>
              <tbody className="hoadon">
                <tr>
                  <th>
                    Squier Paranormal Series 54 Jazz Bass Electric Guitar, Black
                  </th>
                  <td>1</td>
                  <td>5.000.000</td>
                </tr>
                <tr>
                  <th>
                    Squier Paranormal Series 54 Jazz Bass Electric Guitar, Black
                  </th>
                  <td>1</td>
                  <td>5.000.000</td>
                </tr>
                <tr>
                  <th>
                    Squier Paranormal Series 54 Jazz Bass Electric Guitar, Black
                  </th>
                  <td>1</td>
                  <td>5.000.000</td>
                </tr>
              </tbody>
            </table>
            <hr className="hr-100" />
            <table>
              <tbody className="hoadon">
                <tr>
                  <th>Tổng tiền</th>
                  <td>5.000.000</td>
                </tr>
                <tr>
                  <th>Phí vận chuyển</th>
                  <td>20.000</td>
                </tr>
                <tr>
                  <th>Thanh toán</th>
                  <td>5.020.000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    
    </div>
    <Footer2/>
    </div>

    
   
  );
};
export default CartDetail