import React, { useEffect, useState } from 'react';
import '../../../pages/Ecommerce/BrandPage/BrandDetail.css';
import { images } from '../../../assets/images/images';
import { useLocation } from 'react-router-dom';
import { listInstrumentsByBrand } from '../../../service/InstrumentService';

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
      return price >= min && price <= max;
    });
  };

  const sortInstruments = (instrumentsToSort) => {
    return instrumentsToSort.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.costPrice - b.costPrice;
      } else {
        return b.costPrice - a.costPrice;
      }
    });
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
    <div className="container">
      <div>
        <div className="gioithieu1">
          <div className="grid-container">
            <div className="grid-item image">
              <img
                src={`${imageBase64Prefix}${brand.brandImage}`}
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

      <div className="content">
        <div className="row">
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

          <div className="col-9">
            <div className="row">
              <div className="custom-dropdown">
                <button className="btn custom-dropdown-toggle btn-danger" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Sắp xếp
                </button>
                <ul className="custom-dropdown-menu">
                  <li>
                    <button className="btn custom-dropdown-item" onClick={() => { setSortOrder('asc'); setCurrentPage(1); }}>Giá thấp nhất</button>
                  </li>
                  <li>
                    <button className="btn custom-dropdown-item" onClick={() => { setSortOrder('desc'); setCurrentPage(1); }}>Giá cao nhất</button>
                  </li>
                </ul>
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
                        <div className="card shadow-sm card-custom2">
                          <img
                            src={instrument.image ? `data:image/${instrument.image.split('.').pop()};base64,${instrument.image}` : 'default-image-url'}
                            alt={instrument.name}
                            className="card-img2"
                          />
                          <div className="card-body text-center">
                            <h5 className="card-title2">{instrument.name}</h5>
                            <p className="card-price2">
                              {instrument.costPrice.toLocaleString()}đ
                            </p>
                            <p className="card-stock-status">{stockStatus}</p> {/* Hiển thị trạng thái hàng */}
                            <button className="btn btn-primary mt-3 card-button2">Xem chi tiết</button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Phân trang */}
              <nav aria-label="Page navigation example" className="pagination-container">
                <ul className="pagination d-flex justify-content-center align-items-center">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <li className="page-item" key={index + 1}>
                      <button
                        className={`page-link ${currentPage === index + 1 ? 'active' : ''}`}
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandDetail;
