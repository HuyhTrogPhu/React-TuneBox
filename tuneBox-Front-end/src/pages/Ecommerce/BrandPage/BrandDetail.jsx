import React, { useEffect, useState } from 'react';
import '../../../pages/Ecommerce/BrandPage/BrandDetail.css';
import { images } from '../../../assets/images/images';
import { useLocation } from 'react-router-dom';
import { listInstrumentsByBrand } from '../../../service/InstrumentServiceCus'
import Footer2 from '../../../components/Footer/Footer2';
import Benefits from '../../../components/Benefits/Benefits';

const ITEMS_PER_PAGE = 12;

const BrandDetail = () => {
  const location = useLocation();
  const { brand } = location.state;

  const imageBase64Prefix = "data:image/png;base64,";
  const [instruments, setInstruments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' hoặc 'desc'
  const [sortByPrice, setSortByPrice] = useState('asc');
  const [sortByName, setSortByName] = useState('desc');

  const brandId = brand.id;
  useEffect(() => {
    const fetchInstruments = async () => {
      try {
        if (brandId) {
          const response = await listInstrumentsByBrand(brandId);
          setInstruments(response.data);
          setTotalPages(Math.ceil(response.data.length / ITEMS_PER_PAGE));
        } else {
          console.error("Brand ID is undefined");
        }
      } catch (error) {
        console.error("Error fetching instruments:", error);
      }
    };

    fetchInstruments();
  }, [brandId]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filterInstruments = () => {
    return instruments.filter((instrument) => {
      const price = instrument.costPrice;
      const min = minPrice ? parseFloat(minPrice) : 0;
      const max = maxPrice ? parseFloat(maxPrice) : Infinity;
      return instrument.status === false && price >= min && price <= max;
    });
  };

  const sortInstruments = (instrumentsToSort) => {
    let sorted = [...instrumentsToSort];

    // Chỉ sắp xếp theo giá nếu được chọn
    if (sortByPrice) {
      sorted = sorted.sort((a, b) => {
        return sortByPrice === 'asc' ? a.costPrice - b.costPrice : b.costPrice - a.costPrice;
      });
    }

    // Chỉ sắp xếp theo tên nếu được chọn
    if (sortByName) {
      sorted = sorted.sort((a, b) => {
        return sortByName === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      });
    }

    return sorted;
  };

  const handleSort = (order) => {
    switch (order) {
      case 'priceAsc':
        setSortByPrice('asc');
        setSortByName('');  // Clear name sorting
        break;
      case 'priceDesc':
        setSortByPrice('desc');
        setSortByName('');  // Clear name sorting
        break;
      case 'nameAsc':
        setSortByPrice('');  // Clear price sorting
        setSortByName('asc');
        break;
      case 'nameDesc':
        setSortByPrice('');  // Clear price sorting
        setSortByName('desc');
        break;
      default:
        setSortByPrice('');
        setSortByName('');
    }
  };

  const getCurrentInstruments = () => {
    const filteredInstruments = filterInstruments();
    const sortedInstruments = sortInstruments(filteredInstruments);
    const indexOfLastInstrument = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstInstrument = indexOfLastInstrument - ITEMS_PER_PAGE;
    return sortedInstruments.slice(indexOfFirstInstrument, indexOfLastInstrument);
  };

  const handleFilter = () => {
    setCurrentPage(1);
  };

  // Sử dụng hàm để lấy sản phẩm hiện tại
  const currentInstruments = getCurrentInstruments();
  const filteredInstruments = filterInstruments();
  const noResults = filteredInstruments.length === 0;

  return (
    <div>
      <div className="container" style={{marginTop: '100px'}}>
        <div>
          <div className="gioithieu1">
            <div className="grid-container">
              <div className="grid-item image">
                <img
                  src={brand.brandImage}
                  className='banner-img'
                  alt={brand.name}
                />
              </div>
              <div className="grid-item text">
                <h4 className='brandTitle'>{brand.name}</h4>
                <p>{brand.description || "Khám phá bộ sưu tập của chúng tôi."}</p>
              </div>
            </div>
          </div>
          <hr className='hr-1001' />
        </div>

        <div className="">
          <div className="row">
            {/* filter */}
            <div className="col-3 phamloai">
              <div className="accordion" id="accordionPanelsStayOpenExample">
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                      Mức giá
                    </button>
                  </h2>

                  <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionPanelsStayOpenExample">
                    <div className="accordion-body">
                      <div className="input-group mb-3">
                        <input
                          type="number"
                          className="form-control rounded-3"
                          placeholder="Giá thấp nhất"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          min="0"
                        />
                        <span style={{ marginLeft: 10, marginRight: 10, marginTop: 6 }}>-</span>
                        <input
                          type="number"
                          className="form-control rounded-3"
                          placeholder="Giá cao nhất"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          min="0"
                        />
                      </div>
                      <div className="d-grid">
                        <button className="btn btn-warning" type="button" onClick={handleFilter}>
                          Áp dụng
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <div className="col-9 mt-3">
              <div className="row">
                <div className='col-9'>Total product: <strong>{currentInstruments.length} instrument</strong></div>
                <div className='col-3'>
                <select className="form-select" onChange={(e) => handleSort(e.target.value)}>
                  <option value="">Default</option>
                  <option value="priceAsc">Price: Low to high</option>
                  <option value="priceDesc">Price: High to low</option>
                  <option value="nameAsc">Name: A to Z</option>
                  <option value="nameDesc">Name: Z to A</option>
                </select>
              </div>

              </div>


              <div className="sanPham mt-2">
                <div className="row">
                  {noResults ? (
                    <div className="col-12 text-center">
                      <p>Không có sản phẩm nào phù hợp với tiêu chí lọc.</p>
                    </div>
                  ) : (
                    currentInstruments.map((instrument) => {
                      // Xác định trạng thái hàng dựa vào số lượng
                      let stockStatus = '';
                      if (instrument.quantity === 0) {
                        stockStatus = 'Hết hàng';
                      } else if (instrument.quantity > 0 && instrument.quantity <= 5) {
                        stockStatus = 'Sắp hết hàng';
                      } else {
                        stockStatus = 'Còn hàng';
                      }

                      return (


                        <div className="col-3 mb-4" key={instrument.id}>
                          <a href={`/DetailProduct/${instrument.id}`} className="card-link">
                            <div className="card card2" style={{ width: '100%', border: 'none', cursor: 'pointer' }}>
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
                                <p className="card-status">{stockStatus}</p>
                              </div>
                            </div>
                          </a>
                        </div>

                      );
                    })
                  )}
                </div>

                {/* Phân trang */}
                <div className="phantrangdetail">
                  <nav aria-label="Page navigation example">
                    <ul className="pagination justify-content-center text-center">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" aria-label="Previous" onClick={() => handlePageChange(currentPage - 1)}>
                          <span aria-hidden="true">«</span>
                        </button>
                      </li>
                      {[...Array(totalPages)].map((_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                            {index + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" aria-label="Next" onClick={() => handlePageChange(currentPage + 1)}>
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

  );
};

export default BrandDetail;
