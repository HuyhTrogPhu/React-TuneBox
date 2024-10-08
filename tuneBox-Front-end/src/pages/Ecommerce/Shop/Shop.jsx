import React, { useEffect, useState } from 'react'
import '../../../pages/Ecommerce/Shop/Shop.css'
import { images } from '../../../assets/images/images'
import { listCategories, listInstruments, listBrands } from '../../../service/InstrumentServiceCus'
import { useNavigate } from 'react-router-dom';
const Shop = () => {

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Số sản phẩm hiển thị trên mỗi trang
  const imageBase64Prefix = "data:image/png;base64,";


  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOrder, setSortOrder] = useState(''); // 'asc' cho giá thấp nhất, 'desc' cho giá cao nhất

  const [filteredInstruments, setFilteredInstruments] = useState([]);

  const navigate = useNavigate();
  // Fetch dữ liệu từ API khi component được mount
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const brandsResponse = await listBrands();
      const categoriesResponse = await listCategories();
      const instrumentsResponse = await listInstruments();

      console.log("Brands Data:", brandsResponse); // Kiểm tra lại dữ liệu
      console.log("Instruments Data:", instrumentsResponse.data);
      // Truy cập vào thuộc tính data của phản hồi
      setBrands(Array.isArray(brandsResponse.data) ? brandsResponse.data : []);
      setCategories(Array.isArray(categoriesResponse.data) ? categoriesResponse.data.filter(cate => cate.status === false) : []);
      setInstruments(Array.isArray(instrumentsResponse.data) ? instrumentsResponse.data : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };



  // Tạo số trang
  const totalPages = Math.ceil(instruments.length / itemsPerPage);

  // Hàm để chuyển trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  //lọc theo sản phẩm và loại
  const handleBrandChange = (brandName) => {
    setSelectedBrands(prev => {
      const updatedBrands = prev.includes(brandName) ? prev.filter(b => b !== brandName) : [...prev, brandName];
      console.log("Updated Selected Brands:", updatedBrands);
      return updatedBrands;
    });
  };

  const handleCategoryChange = (categoryName) => {
    setSelectedCategories(prev => {
      const updatedCategories = prev.includes(categoryName) ? prev.filter(c => c !== categoryName) : [...prev, categoryName];
      console.log("Updated Selected Categories:", updatedCategories);
      return updatedCategories;
    });
  };

  //lọc theo giá
  const handlePriceFilter = () => {
    if (minPrice !== '' && maxPrice !== '' && parseFloat(minPrice) > parseFloat(maxPrice)) {
      alert('Giá tối thiểu không được lớn hơn giá tối đa');
      return;
    }


  };
  const handleSort = (order) => {
    setSortOrder(order);
  };
  // Hàm để xác định trạng thái hàng hóa
  const getStockStatus = (quantity) => {
    if (quantity === 0) return 'Hết hàng';
    if (quantity > 0 && quantity <= 5) return 'Sắp hết hàng';
    return 'Còn hàng';
  };
  useEffect(() => {
    const filtered = instruments.filter(instrument => {
      // Lọc theo trạng thái
      if (instrument.status === true) {
        return false;
      }

      // Lọc theo thương hiệu
      if (selectedBrands.length > 0 && !selectedBrands.includes(instrument.brand.name)) {
        console.log(`Filtered out by brand: ${instrument.brand.name}`);
        return false;
      }

      // Lọc theo loại sản phẩm
      if (selectedCategories.length > 0 && !selectedCategories.includes(instrument.categoryIns.name)) {
        console.log(`Filtered out by category: ${instrument.categoryIns.name}`);
        return false;
      }

      // Lọc theo khoảng giá
      if (minPrice !== '' && parseFloat(instrument.costPrice) < parseFloat(minPrice)) {
        return false;
      }
      if (maxPrice !== '' && parseFloat(instrument.costPrice) > parseFloat(maxPrice)) {
        return false;
      }

      return true;
    })
      .sort((a, b) => {
        if (sortOrder === 'asc') {
          return parseFloat(a.costPrice) - parseFloat(b.costPrice);
        }
        if (sortOrder === 'desc') {
          return parseFloat(b.costPrice) - parseFloat(a.costPrice);
        }
        return 0;
      });

    console.log("Filtered Instruments:", filtered);
    setFilteredInstruments(filtered);
  }, [instruments, selectedBrands, selectedCategories, minPrice, maxPrice, sortOrder]);

  // Tính toán sản phẩm hiển thị trên trang hiện tại

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInstruments.slice(indexOfFirstItem, indexOfLastItem);


  return (
    <div>
      <div className='container'>
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
                        {brands.length > 0 ? (
                          brands.map((brand) => (
                            <div className="form-check" key={brand.id}>
                              <input
                                type="checkbox"
                                className="form-check-input"
                                value={brand.name}
                                onChange={() => handleBrandChange(brand.name)}

                              />
                              <label className="form-check-label">{brand.name}</label>
                            </div>
                          ))
                        ) : (
                          <p>Không có thương hiệu nào</p>
                        )}
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
                          <input
                            type="text"
                            className="form-control rounded-3"
                            placeholder="Giá thấp nhất"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                          />
                          <span style={{ marginLeft: 10, marginRight: 10, marginTop: 6 }}>-</span>
                          <input
                            type="text"
                            className="form-control rounded-3"
                            placeholder="Giá cao nhất"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                          />
                        </div>
                        <div className="d-grid">
                          <button className="btn btn-warning" type="button" onClick={handlePriceFilter}>
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
                        {categories.map((cate) => (
                          <div className="form-check" key={cate.id}>
                            <input
                              type="checkbox"
                              className="form-check-input"
                              value={cate.name}
                              onChange={() => handleCategoryChange(cate.name)} // Gọi hàm handleCategoryChange

                            />
                            <label htmlFor className="form-check-label">{cate.name}</label>
                          </div>

                        ))

                        }

                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* sanPham */}
            <div className="col-9 mt-3">

              <div className="row">
                <div class="custom-dropdown">
                  <button class="btn custom-dropdown-toggle   btn-danger" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Sắp xếp
                  </button>
                  <ul class="custom-dropdown-menu">
                    <li>
                      <a class="custom-dropdown-item" href="#" onClick={() => handleSort('desc')}>
                        Giá cao nhất
                      </a>
                    </li>
                    <li>
                      <a class="custom-dropdown-item" href="#" onClick={() => handleSort('asc')}>
                        Giá thấp nhất
                      </a>
                    </li>
                  </ul>
                </div>

              </div>
              <div className="sanPham mt-2">
                <div className="row">
                  {currentItems.map((instrument) => (
                    <div className="col-3 mb-4" key={instrument.id}>
                      <a href={`/product-detail/${instrument.id}`} className="card-link">
                        <div className="card" style={{ width: '100%', border: 'none', cursor: 'pointer' }}>
                          <div className="card-img-wrapper">
                            <img
                              src={instrument.image}
                              className="card-img-top"
                              alt={instrument.name}
                            />
                          </div>
                          <div className="card-body text-center">
                            <p className="card-title">{instrument.name}</p>
                            <p className="card-price">{instrument.costPrice.toLocaleString()}đ</p>
                            <p className="card-status">{getStockStatus(instrument.quantity)}</p>
                          </div>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>



                {/* Pagination */}
                <div className="phantrangdetail">
                  <nav aria-label="Page navigation example">
                    <ul className="pagination justify-content-center text-center">
                      <li className="page-item">
                        <button className="page-link" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                          <span aria-hidden="true">«</span>
                        </button>
                      </li>

                      {Array.from({ length: totalPages }, (_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => paginate(index + 1)}>
                            {index + 1}
                          </button>
                        </li>
                      ))}

                      <li className="page-item">
                        <button className="page-link" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                          <span aria-hidden="true">»</span>
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>




  )
}

export default Shop
