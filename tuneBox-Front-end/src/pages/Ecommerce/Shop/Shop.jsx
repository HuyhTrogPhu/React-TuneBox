import React from 'react'
import '../../../pages/Ecommerce/Shop/Shop.css'
import { images } from '../../../assets/images/images'
const Shop = () => {

  const brands = {

  }

  return (


      <div className="content">
        <div className="row">
          <div className="col-3 phamloai">
            <div className="accordion" id="accordionPanelsStayOpenExample">
              {/* Khung tim kiem theo thuong hieu */}
              <div className="accordion" id="accordionExample">
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                      Thương hiệu
                    </button>
                  </h2>
                  <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                      {/* check box */}
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" defaultValue="fender" name="thuonghieu" />
                        <label htmlFor className="form-check-label">fender</label>
                      </div>
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" defaultValue="ibanez" name="thuonghieu" />
                        <label htmlFor className="form-check-label">Ibanez</label>
                      </div>
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" defaultValue="squier" name="thuonghieu" />
                        <label htmlFor className="form-check-label">Squier</label>
                      </div>
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" defaultValue="jackson" name="thuonghieu" />
                        <label htmlFor className="form-check-label">Jackson</label>
                      </div>
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" defaultValue="prs" name="thuonghieu" />
                        <label htmlFor className="form-check-label">PRS</label>
                      </div>
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" defaultValue="gretsch" name="thuonghieu" />
                        <label htmlFor className="form-check-label">Gretsch</label>
                      </div>
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" defaultValue="sterling" name="thuonghieu" />
                        <label htmlFor className="form-check-label">Sterling</label>
                      </div>
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" defaultValue="charvel" name="thuonghieu" />
                        <label htmlFor className="form-check-label">harvel</label>
                      </div>
                    </div>

                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                      Mức giá
                    </button>
                  </h2>
                  <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                      <div className="input-group mb-3">
                        <input type="text" className="form-control rounded-3" placeholder="Giá thấp nhất" />
                        <span style={{ marginLeft: 10, marginRight: 10, marginTop: 6 }}>-</span>
                        <input type="text" className="form-control rounded-3" placeholder="Giá cao nhất" />
                      </div>
                      <div className="d-grid">
                        <button className="btn btn-warning" type="button">
                          Áp dụng
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                      Loại sản phẩm
                    </button>
                  </h2>
                  <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                      {/* check box */}
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" defaultValue="guitardien" name="loai" />
                        <label htmlFor className="form-check-label">Guitar Điện Solid Body</label>
                      </div>
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" defaultValue="ibanez" name="thuonghieu" />
                        <label htmlFor className="form-check-label">Ibanez</label>
                      </div>
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" defaultValue="bass4" name="thuonghieu" />
                        <label htmlFor className="form-check-label">Bass 4 dây</label>
                      </div>
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" defaultValue="acoustic" name="thuonghieu" />
                        <label htmlFor className="form-check-label">Đàn Guitar Acoustic</label>
                      </div>
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" defaultValue="bass5" name="thuonghieu" />
                        <label htmlFor className="form-check-label">Bass 5 Dây</label>
                      </div>
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" defaultValue="classic" name="thuonghieu" />
                        <label htmlFor className="form-check-label">Đàn Guitar Classic</label>
                      </div>
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" defaultValue="ukulele" name="thuonghieu" />
                        <label htmlFor className="form-check-label">Ukulele</label>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* sanPham */}
          <div className="col-9">
            <div className="row">
              <div class="custom-dropdown">
                <button class="btn custom-dropdown-toggle   btn-danger" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Sắp xếp
                </button>
                <ul class="custom-dropdown-menu">
                  <li><a class="custom-dropdown-item" href="#">Sản phẩm cùng loại</a></li>
                  <li><a class="custom-dropdown-item" href="#">Giá cao nhất</a></li>
                  <li><a class="custom-dropdown-item" href="#">Giá thấp nhất</a></li>
                </ul>
              </div>

            </div>
            <div className="sanPham mt-2">
              <div className="row">
                <div className="col-3 mb-4">
                  <div className="card" style={{ width: '100%', border: 'none' }}>
                    <img src="/img/sp1.png" className="card-img-top" alt="..." />
                    <div className="card-body">
                      <p className="card-title">
                        Ibanez JEMJR-WH Steve Vai Signature Electric Guitar,
                        White
                      </p>
                      <p className="card-price">20.010.000đ</p>
                    </div>
                  </div>
                </div>
                <div className="col-3 mb-4">
                  <div className="card" style={{ width: '100%', border: 'none' }}>
                    <img src="/img/sp1.png" className="card-img-top" alt="..." />
                    <div className="card-body">
                      <p className="card-title">
                        Ibanez JEMJR-WH Steve Vai Signature Electric Guitar,
                        White
                      </p>
                      <p className="card-price">20.010.000đ</p>
                    </div>
                  </div>
                </div>
                <div className="col-3 mb-4">
                  <div className="card" style={{ width: '100%', border: 'none' }}>
                    <img src="/img/sp1.png" className="card-img-top" alt="..." />
                    <div className="card-body">
                      <p className="card-title">
                        Ibanez JEMJR-WH Steve Vai Signature Electric Guitar,
                        White
                      </p>
                      <p className="card-price">20.010.000đ</p>
                    </div>
                  </div>
                </div>
                <div className="col-3 mb-4">
                  <div className="card" style={{ width: '100%', border: 'none' }}>
                    <img src="/img/sp1.png" className="card-img-top" alt="..." />
                    <div className="card-body">
                      <p className="card-title">
                        Ibanez JEMJR-WH Steve Vai Signature Electric Guitar,
                        White
                      </p>
                      <p className="card-price">20.010.000đ</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-3 mb-4">
                  <div className="card" style={{ width: '100%', border: 'none' }}>
                    <img src="/img/sp1.png" className="card-img-top" alt="..." />
                    <div className="card-body">
                      <p className="card-title">
                        Ibanez JEMJR-WH Steve Vai Signature Electric Guitar,
                        White
                      </p>
                      <p className="card-price">20.010.000đ</p>
                    </div>
                  </div>
                </div>
                <div className="col-3 mb-4">
                  <div className="card" style={{ width: '100%', border: 'none' }}>
                    <img src="img/sp1.png" className="card-img-top" alt="..." />
                    <div className="card-body">
                      <p className="card-title">
                        Ibanez JEMJR-WH Steve Vai Signature Electric Guitar,
                        White
                      </p>
                      <p className="card-price">20.010.000đ</p>
                    </div>
                  </div>
                </div>
                <div className="col-3 mb-4">
                  <div className="card" style={{ width: '100%', border: 'none' }}>
                    <img src="img/sp1.png" className="card-img-top" alt="..." />
                    <div className="card-body">
                      <p className="card-title">
                        Ibanez JEMJR-WH Steve Vai Signature Electric Guitar,
                        White
                      </p>
                      <p className="card-price">20.010.000đ</p>
                    </div>
                  </div>
                </div>
                <div className="col-3 mb-4">
                  <div className="card" style={{ width: '100%', border: 'none' }}>
                    <img src="/images/sp1.png" className="card-img-top" alt="..." />
                    <div className="card-body">
                      <p className="card-title">
                        Ibanez JEMJR-WH Steve Vai Signature Electric Guitar,
                        White
                      </p>
                      <p className="card-price">20.010.000đ</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-3 mb-4">
                  <div className="card" style={{ width: '100%', border: 'none' }}>
                    <img src="img/sp1.png" className="card-img-top" alt="..." />
                    <div className="card-body">
                      <p className="card-title">
                        Ibanez JEMJR-WH Steve Vai Signature Electric Guitar,
                        White
                      </p>
                      <p className="card-price">20.010.000đ</p>
                    </div>
                  </div>
                </div>
                <div className="col-3 mb-4">
                  <div className="card" style={{ width: '100%', border: 'none' }}>
                    <img src="img/sp1.png" className="card-img-top" alt="..." />
                    <div className="card-body">
                      <p className="card-title">
                        Ibanez JEMJR-WH Steve Vai Signature Electric Guitar,
                        White
                      </p>
                      <p className="card-price">20.010.000đ</p>
                    </div>
                  </div>
                </div>
                <div className="col-3 mb-4">
                  <div className="card" style={{ width: '100%', border: 'none' }}>
                    <img src="img/sp1.png" className="card-img-top" alt="..." />
                    <div className="card-body">
                      <p className="card-title">
                        Ibanez JEMJR-WH Steve Vai Signature Electric Guitar,
                        White
                      </p>
                      <p className="card-price">20.010.000đ</p>
                    </div>
                  </div>
                </div>
                <div className="col-3 mb-4">
                  <div className="card" style={{ width: '100%', border: 'none' }}>
                    <img src="img/sp1.png" className="card-img-top" alt="..." />
                    <div className="card-body">
                      <p className="card-title">
                        Ibanez JEMJR-WH Steve Vai Signature Electric Guitar,
                        White
                      </p>
                      <p className="card-price">20.010.000đ</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-3 mb-4">
                  <div className="card" style={{ width: '100%', border: 'none' }}>
                    <img src="img/sp1.png" className="card-img-top" alt="..." />
                    <div className="card-body">
                      <p className="card-title">
                        Ibanez JEMJR-WH Steve Vai Signature Electric Guitar,
                        White
                      </p>
                      <p className="card-price">20.010.000đ</p>
                    </div>
                  </div>
                </div>
                <div className="col-3 mb-4">
                  <div className="card" style={{ width: '100%', border: 'none' }}>
                    <img src="img/sp1.png" className="card-img-top" alt="..." />
                    <div className="card-body">
                      <p className="card-title">
                        Ibanez JEMJR-WH Steve Vai Signature Electric Guitar,
                        White
                      </p>
                      <p className="card-price">20.010.000đ</p>
                    </div>
                  </div>
                </div>
                <div className="col-3 mb-4">
                  <div className="card" style={{ width: '100%', border: 'none' }}>
                    <img src="img/sp1.png" className="card-img-top" alt="..." />
                    <div className="card-body">
                      <p className="card-title">
                        Ibanez JEMJR-WH Steve Vai Signature Electric Guitar,
                        White
                      </p>
                      <p className="card-price">20.010.000đ</p>
                    </div>
                  </div>
                </div>
                <div className="col-3 mb-4">
                  <div className="card" style={{ width: '100%', border: 'none' }}>
                    <img src="img/sp1.png" className="card-img-top" alt="..." />
                    <div className="card-body">
                      <p className="card-title">
                        Ibanez JEMJR-WH Steve Vai Signature Electric Guitar,
                        White
                      </p>
                      <p className="card-price">20.010.000đ</p>
                    </div>
                  </div>
                </div>
              </div>
              <nav aria-label="Page navigation example" className="pagination-container">
                <ul className="pagination d-flex justify-content-center align-items-center">
                  <li className="page-item"><a className="page-link" href="#">1</a></li>
                  <li className="page-item"><a className="page-link" href="#">2</a></li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

  )
}

export default Shop
