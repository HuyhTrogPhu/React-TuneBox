import { Link } from "react-router-dom";
import { images } from "../../../assets/images/images";
import Footer2 from "../../../components/Footer/Footer2";
const Cart = () => {
  return (
    <div>

      <div className="container">
        <hr className="hr-100" />
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb" style={{ marginLeft: 70 }}>
            <li className="breadcrumb-item"><Link to={'/Ecommerce'}>Trang chủ</Link></li>
            <li className="breadcrumb-item active" aria-current="page">Giỏ hàng</li>
          </ol>
        </nav>
        <hr className="hr-100" />
        {/* end */}
        <div className="row content-image-cart">
          <style dangerouslySetInnerHTML={{ __html: "\n    @media (min-width: 1025px) {\n.h-custom {\nheight: 100vh !important;\n}\n}\n\n.card-registration .select-input.form-control[readonly]:not([disabled]) {\nfont-size: 1rem;\nline-height: 2.15;\npadding-left: .75em;\npadding-right: .75em;\n}\n\n.card-registration .select-arrow {\ntop: 13px;\n}\n    " }} />

          <div>
            <section classname="h-100 h-custom" >


              <div className="container py-5 h-100" >
                <div className="row d-flex justify-content-center align-items-center h-100" >
                  <div className="col-12">
                    <div className="card card-registration card-registration-2 card-background" style={{ borderRadius: 15 }} >
                      <div className="card-body p-0">
                        <div className="row g-0">
                          <div className="col-lg-8">
                            <div className="p-5">
                              <div className="d-flex justify-content-between align-items-center mb-5">
                                <h1 className="fw-bold mb-0">Shopping Cart</h1>
                                <h6 className="mb-0 text-muted">3 items</h6>
                              </div>
                              <hr className="hr-100" />
                              <div className="row mb-4 d-flex justify-content-between align-items-center">
                                <div className="col-md-2 col-lg-2 col-xl-2">
                                  <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-shopping-carts/img5.webp" className="img-fluid rounded-3" alt="Cotton T-shirt" />
                                </div>
                                <div className="col-md-3 col-lg-3 col-xl-3">
                                  <h6 className="text-muted">Shirt</h6>
                                  <h6 className="mb-0">Cotton T-shirt</h6>
                                </div>

                                <div className="col-md-3 col-lg-3 col-xl-2 d-flex">
                                  <button data-mdb-button-init data-mdb-ripple-init className="btn btn-link px-2" onclick="this.parentNode.querySelector('input[type=number]').stepDown()">
                                    <i className="fas fa-minus" />
                                  </button>
                                  <input id="form1" min={0} name="quantity" defaultValue={1} type="number" className="form-control form-control-sm" />
                                  <button data-mdb-button-init data-mdb-ripple-init className="btn btn-link px-2" onclick="this.parentNode.querySelector('input[type=number]').stepUp()">
                                    <i className="fas fa-plus" />
                                  </button>
                                </div>
                                <div className="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                                  <h6 className="mb-0">€ 44.00</h6>
                                </div>
                                <div className="col-md-1 col-lg-1 col-xl-1 text-end">
                                  <a href="#!" className="text-muted"><i className="fas fa-times" /></a>
                                </div>
                              </div>
                              <hr className="hr-100" />
                              <div className="row mb-4 d-flex justify-content-between align-items-center">
                                <div className="col-md-2 col-lg-2 col-xl-2">
                                  <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-shopping-carts/img6.webp" className="img-fluid rounded-3" alt="Cotton T-shirt" />
                                </div>
                                <div className="col-md-3 col-lg-3 col-xl-3">
                                  <h6 className="text-muted">Shirt</h6>
                                  <h6 className="mb-0">Cotton T-shirt</h6>
                                </div>
                                <div className="col-md-3 col-lg-3 col-xl-2 d-flex">
                                  <button data-mdb-button-init data-mdb-ripple-init className="btn btn-link px-2" onclick="this.parentNode.querySelector('input[type=number]').stepDown()">
                                    <i className="fas fa-minus" />
                                  </button>
                                  <input id="form1" min={0} name="quantity" defaultValue={1} type="number" className="form-control form-control-sm" />
                                  <button data-mdb-button-init data-mdb-ripple-init className="btn btn-link px-2" onclick="this.parentNode.querySelector('input[type=number]').stepUp()">
                                    <i className="fas fa-plus" />
                                  </button>
                                </div>
                                <div className="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                                  <h6 className="mb-0">€ 44.00</h6>
                                </div>
                                <div className="col-md-1 col-lg-1 col-xl-1 text-end">
                                  <a href="#!" className="text-muted"><i className="fas fa-times" /></a>
                                </div>
                              </div>
                              <hr className="hr-100" />
                              <div className="row mb-4 d-flex justify-content-between align-items-center">
                                <div className="col-md-2 col-lg-2 col-xl-2">
                                  <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-shopping-carts/img7.webp" className="img-fluid rounded-3" alt="Cotton T-shirt" />
                                </div>
                                <div className="col-md-3 col-lg-3 col-xl-3">
                                  <h6 className="text-muted">Shirt</h6>
                                  <h6 className="mb-0">Cotton T-shirt</h6>
                                </div>
                                <div className="col-md-3 col-lg-3 col-xl-2 d-flex">
                                  <button data-mdb-button-init data-mdb-ripple-init className="btn btn-link px-2" onclick="this.parentNode.querySelector('input[type=number]').stepDown()">
                                    <i className="fas fa-minus" />
                                  </button>
                                  <input id="form1" min={0} name="quantity" defaultValue={1} type="number" className="form-control form-control-sm" />
                                  <button data-mdb-button-init data-mdb-ripple-init className="btn btn-link px-2" onclick="this.parentNode.querySelector('input[type=number]').stepUp()">
                                    <i className="fas fa-plus" />
                                  </button>
                                </div>
                                <div className="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                                  <h6 className="mb-0">€ 44.00</h6>
                                </div>
                                <div className="col-md-1 col-lg-1 col-xl-1 text-end">
                                  <a href="#!" className="text-muted"><i className="fas fa-times" /></a>
                                </div>
                              </div>
                              <hr className="hr-100" />
                              <div className="pt-5">
                                <h6 className="mb-0"><a href="#!" className="text-body"><i className="fas fa-long-arrow-alt-left me-2" />Back to shop</a></h6>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4 bg-body-tertiary">
                            <div className="p-5">
                              <h3 className="fw-bold mb-5 mt-2 pt-1">Summary</h3>
                              <hr className="hr-100" />
                              <div className="d-flex justify-content-between mb-4">
                                <h5 className="text-uppercase">items 3</h5>
                                <h5>€ 132.00</h5>
                              </div>
                              <h5 className="text-uppercase mb-3">Shipping</h5>
                              <div className="mb-4 pb-2 ">
                                <select data-mdb-select-init className="form-select">
                                  <option value={1}>Standard-Delivery- €5.00</option>
                                  <option value={2}>Two</option>
                                  <option value={3}>Three</option>
                                  <option value={4}>Four</option>
                                </select>
                              </div>
                             
                              <hr className="hr-100" />
                              <div className="d-flex justify-content-between mb-5">
                                <h5 className="text-uppercase">Total price</h5>
                                <h5>€ 137.00</h5>
                              </div>
                              <button type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-dark btn-block btn-lg" data-mdb-ripple-color="dark">Register</button>
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
      <Footer2 />
    </div>
  );
}
export default Cart

