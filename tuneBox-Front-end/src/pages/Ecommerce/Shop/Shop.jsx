import React, { useEffect, useState } from 'react'
import '../../../pages/Ecommerce/Shop/Shop.css'
import Footer2 from '../../../components/Footer/Footer2'
import Benefits from '../../../components/Benefits/Benefits'
import { images } from '../../../assets/images/images'
import { listCategories, listInstruments, listBrands } from '../../../service/EcommerceHome'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
const Shop = () => {

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Số sản phẩm hiển thị trên mỗi trang


  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOrder, setSortOrder] = useState(''); // 'asc' cho giá thấp nhất, 'desc' cho giá cao nhất

  const [filteredInstruments, setFilteredInstruments] = useState([]);

  // Tạo trạng thái để lưu trữ trạng thái mở/đóng cho từng accordion
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // Hàm toggle cho các accordion
  const toggleBrandAccordion = () => setIsBrandOpen(!isBrandOpen);
  const togglePriceAccordion = () => setIsPriceOpen(!isPriceOpen);
  const toggleCategoryAccordion = () => setIsCategoryOpen(!isCategoryOpen);


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

      console.log("Brands Data:", brandsResponse); // Check the brand data

      // Filter brands with status === false
      const filteredBrands = Array.isArray(brandsResponse.data)
        ? brandsResponse.data.filter(brand => brand.status === false)
        : [];

      setBrands(filteredBrands); // Set the filtered brands
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
        if (sortOrder === 'priceAsc') {
          return parseFloat(a.costPrice) - parseFloat(b.costPrice);
        }
        if (sortOrder === 'priceDesc') {
          return parseFloat(b.costPrice) - parseFloat(a.costPrice);
        }
        if (sortOrder === 'nameAsc') {
          return a.name.localeCompare(b.name);
        }
        if (sortOrder === 'nameDesc') {
          return b.name.localeCompare(a.name);
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
              {/* Filter */}
              <div className="accordion" id="accordionPanelsStayOpenExample">
                {/* Khung tìm kiếm theo thương hiệu */}
                <div className="accordion" id="accordionExample">
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className={`accordion-button ${isBrandOpen ? '' : 'collapsed'}`}
                        type="button"
                        onClick={toggleBrandAccordion}
                      >
                        Thương hiệu
                      </button>
                    </h2>
                    <div className={`accordion-collapse collapse ${isBrandOpen ? 'show' : ''}`}>
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
                      <button
                        className={`accordion-button ${isPriceOpen ? '' : 'collapsed'}`}
                        type="button"
                        onClick={togglePriceAccordion}
                      >
                        Mức giá
                      </button>
                    </h2>
                    <div className={`accordion-collapse collapse ${isPriceOpen ? 'show' : ''}`}>
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
                      <button
                        className={`accordion-button ${isCategoryOpen ? '' : 'collapsed'}`}
                        type="button"
                        onClick={toggleCategoryAccordion}
                      >
                        Loại sản phẩm
                      </button>
                    </h2>
                    <div className={`accordion-collapse collapse ${isCategoryOpen ? 'show' : ''}`}>
                      <div className="accordion-body">
                        {/* checkbox */}
                        {categories.map((cate) => (
                          <div className="form-check" key={cate.id}>
                            <input
                              type="checkbox"
                              className="form-check-input"
                              value={cate.name}
                              onChange={() => handleCategoryChange(cate.name)} // Gọi hàm handleCategoryChange
                            />
                            <label className="form-check-label">{cate.name}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            {/* sanPham */}
            <div className="col-9 mt-3">

              {/* Sort */}

              <div className="row">
                <div className='col-9'>Total product</div>

                <div className='col-3'>
                  <select className="form-select" onChange={(e) => handleSort(e.target.value)}>
                    <option value="" selected>Default</option>
                    <option value="priceAsc">Price: Low to high</option>
                    <option value="priceDesc">Price: High to low</option>
                    <option value="nameAsc">Name: A to Z</option>
                    <option value="nameDesc">Name: Z to A</option>
                  </select>

                </div>
              </div>

              {/* San pham */}
              <div className="sanPham mt-5">
                <div className="row">
                  {currentItems.map((instrument) => (
                    <div className="col-3 mb-4" key={instrument.id}>

                      <Link to={{
                        pathname: `/DetailProduct/${instrument.id}`,
                        state: { instrument }
                      }} className="card-link">
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
                      </Link>
                    </div>
                  ))}
                </div>



                {/* Pagination */}

                <div className="phantrangdetail ">
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
      <Benefits />
      <Footer2 />
    </div>




  )
}

export default Shop
