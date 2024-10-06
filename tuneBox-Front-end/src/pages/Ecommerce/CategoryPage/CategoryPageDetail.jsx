import React, { useEffect, useState } from 'react'
import Bebefits from '../../../components/Benefits/Benefits'
import Footer2 from '../../../components/Footer/Footer2'
import { useLocation } from 'react-router-dom';
import { listInstrumentsByCategory } from '../../../service/InstrumentServiceCus';
import Bebefits from '../../../components/Benefits/Benefits';
import Footer2 from '../../../components/Footer/Footer2';

const ITEMS_PER_PAGE = 12;

const CategoryPageDetail = () => {

  const location = useLocation();
  const { category } = location.state;

  const imageBase64Prefix = "date:image/png;base64,";
  const [instruments, setInstruments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortByPrice, setByPrice] = useState('asc');
  const [sortByName, setByName] = useState('desc');

  const categoryId = category.id;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (categoryId) {
          const response = await listInstrumentsByCategory(categoryId);
          setInstruments(response.data);
          setTotalPages(Math.ceil(response.data.length / ITEMS_PER_PAGE));

        } else {
          console.error("Category is undefined");
        }
      } catch (error) {
        console.error("Error fetching instruments:", error);
      }
    };
    fetchCategories();
  }, [categoryId]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  }

  const filterInstruments = () => {
    return instruments.filter((instrument) => {
      const price = instrument.costPrice;
      const min = minPrice ? parseFloat(minPrice) : 0;
      const max = maxPrice ? parseFloat(maxPrice) : Infinity;
      return instrument.status === false && price >= min && price <= max;
    })
  }

  const sortInstruments = (instrumentsToSort) => {
    return instrumentsToSort.sort((a, b) => {
      if (sortByPrice === 'asc') {
        return a.costPrice - b.costPrice;
      } else {
        return b.costPrice - a.costPrice;
      }

      // if (sortByName === 'asc') {
      //   return a.name - b.name;
      // } else {
      //   return b.name - a.name;
      // }


    })
  }

  const getCurrentInstruments = () => {
    const filteredInstruments = filterInstruments();
    const sortedInstruments = sortInstruments(filteredInstruments);
    const indexOfLastInstrument = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstInstrument = indexOfLastInstrument - ITEMS_PER_PAGE;
    return sortedInstruments.slide(indexOfFirstInstrument, indexOfLastInstrument);
  }

  const handleFilter = () => {
    setCurrentPage(1);
  }

  const currentInstruments = getCurrentInstruments();
  const filteredInstruments = filterInstruments();
  const noResults = filteredInstruments.length === 0;


  return (
    <div>

      <div className='container'>
        <div className='gioithieu1'>
          <div className='grid-container'>
            <div className='grid-item image'>
              <img src={`${imageBase64Prefix}${category.image}`}
                alt={category.name}
                className='banner-img'
              />
            </div>
            <div className='grid-item text'>
              <h4 className='categoryTitle'>{category.name}</h4>
              <p>{category.description || "Khám phá bộ sưu tập của chúng tôi."}</p>
            </div>
          </div>
        </div>
      </div>
      <hr className='hr-1001' />

      <div className='content'>
        <div className='row'>

          {/* filter */}
          <div className='col-3 phamloai'>
            <div className="accordion" id="accordionPanelsStayOpenExample">

              <h2 className='accordion-header'>
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

          <div className='col-9'>
            {/* Sort */}
            <div className="row">
              <div className="custom-dropdown">
                <button className="btn custom-dropdown-toggle btn-danger" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Sắp xếp
                </button>
                <ul className="custom-dropdown-menu">
                  <li>
                    <button className="btn custom-dropdown-item" onClick={() => { setSortOrder('asc'); setCurrentPage(1); }}>Price: Low to high</button>
                  </li>
                  <li>
                    <button className="btn custom-dropdown-item" onClick={() => { setSortOrder('desc'); setCurrentPage(1); }}>Price: High to low</button>
                  </li>
                </ul>
              </div>
            </div>

            {/* Instrument */}
            <div className='sanPham mt-2'>
              <div className='row'>
                {noResults ? (
                    <div className='col-12 text-center'>
                      <p>No instruments</p>
                    </div>
                ) : (
                  currentInstruments.map((instrument) => {
                    let stockStatus = '';
                    if(instrument.quantity === 0) {
                      stockStatus == 'Hết hàng';
                    } else if (instrument.quantity > 0 && instrument.quantity <=5) {
                      stockStatus = 'Sắp hết hàng';
                    } else {
                      stockStatus = 'Còn hàng';
                    }

                    return (
                      <div className='col-3 mb-4' key={instrument.id}> 
                        {Array.isArray(instrument.image) && instrument.image.length > 0 ? (
                    <img
                      src={`data:image/png;base64,${instrument.image[0]}`} // Chỉ hiển thị ảnh đầu tiên
                      alt={`${instrument.name} 0`}
                      style={{ width: '100px', margin: '0 5px' }}
                    />
                  ) : (
                    <img
                      src='default-image-url'
                      alt={ins.name}
                      style={{ width: '100px' }}
                    />
                  )}
                        <h5 className='card-title2'>{instrument.name}</h5>
                        <p className='card-price'>
                          {instrument.costPrice.toLocaleString()}đ
                        </p>
                        <p className='cord-stock-status'>{stockStatus}</p>
                        <button className='btn btn-primary mt-3 card-button2'>View detail</button>
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


      <Bebefits/>
      <Footer2/>
    </div>
  )
}

export default CategoryPageDetail
