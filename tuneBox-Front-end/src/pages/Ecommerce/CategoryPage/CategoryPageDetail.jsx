import React, { useEffect, useState } from 'react'
import Bebefits from '../../../components/Benefits/Benefits'
import Footer2 from '../../../components/Footer/Footer2'
import './CategoryPageDetail.css'
import { useLocation } from 'react-router-dom';
import { listBrands, listCategories, listInstrumentsByCategory } from '../../../service/InstrumentServiceCus';
import { Link } from 'react-router-dom';

const ITEMS_PER_PAGE = 12;

const CategoryPageDetail = () => {

  const location = useLocation();
  const { category } = location.state;

  const [searchTerm, setSearchTerm] = useState("");
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  const [instruments, setInstruments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortByPrice, setSortByPrice] = useState('asc');
  const [sortByName, setSortByName] = useState('desc');

  const categoryId = category.id;
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const toggleBrandAccordion = () => setIsBrandOpen(!isBrandOpen);
  const togglePriceAccordion = () => setIsPriceOpen(!isPriceOpen);
  const toggleCategoryAccordion = () => setIsCategoryOpen(!isCategoryOpen);
  
  const [selectedBrands, setSelectedBrands] = useState([]);
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await listBrands();
        setBrands(response); // response đã là danh sách id và name
      } catch (error) {
        console.error("Error fetching brands", error);
      }
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await listCategories();
        setCategories(response); // response đã là danh sách id và name
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };
    fetchCategories();
  }, []);


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


  const getCurrentInstruments = () => {
    const filteredInstruments = filterInstruments();
    const sortedInstruments = sortInstruments(filteredInstruments);
    const indexOfLastInstrument = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstInstrument = indexOfLastInstrument - ITEMS_PER_PAGE;
    return sortedInstruments.slice(indexOfFirstInstrument, indexOfLastInstrument);
  }

  const handleFilter = () => {
    setCurrentPage(1);
  }

  const currentInstruments = getCurrentInstruments();
  const filteredInstruments = filterInstruments();
  const noResults = filteredInstruments.length === 0;

  //lọc theo giá
  const handlePriceFilter = () => {
    if (minPrice !== '' && maxPrice !== '' && parseFloat(minPrice) > parseFloat(maxPrice)) {
      alert('Giá tối thiểu không được lớn hơn giá tối đa');
      return;
    }


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

  //lọc theo sản phẩm và loại
  const handleBrandChange = (brandName) => {
    setSelectedBrands(prev => {
      const updatedBrands = prev.includes(brandName) ? prev.filter(b => b !== brandName) : [...prev, brandName];
      console.log("Updated Selected Brands:", updatedBrands);
      return updatedBrands;
    });
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



      // Lọc theo khoảng giá
      if (minPrice !== '' && parseFloat(instrument.costPrice) < parseFloat(minPrice)) {
        return false;
      }
      if (maxPrice !== '' && parseFloat(instrument.costPrice) > parseFloat(maxPrice)) {
        return false;
      }

      return true;
    })
     

    console.log("Filtered Instruments:", filtered);
  
  }, [instruments, selectedBrands, minPrice, maxPrice]);


  return (
    <div>

      <div className='container'>
        <div className='gioithieu1'>
          <div className='grid-container'>
            <div className='grid-item image'>
              <img src={category.image}
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

      <div className='content container'>
        <div className='row'>

          {/* filter */}
          <div className='col-3 phamloai'>
            <div className="accordion" id="accordionExample">

              


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





            </div>
          </div>

          <div className='col-9 mt-3'>
            {/* Sort */}
            <div className="row">
              <div className='col-9'>Total product</div>

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
                    if (instrument.quantity === 0) {
                      stockStatus = 'Hết hàng';
                    } else if (instrument.quantity > 0 && instrument.quantity <= 5) {
                      stockStatus = 'Sắp hết hàng';
                    } else {
                      stockStatus = 'Còn hàng';
                    }


                    return (
                      <div className="col-3 mb-4" key={instrument.id}>

                      <Link to={{
                        pathname: `/DetailProduct/${instrument.id}`,
                        state: { instrument }
                      }} className="card-link">
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
                      </Link>
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


      <Bebefits />
      <Footer2 />
    </div>
  )
}

export default CategoryPageDetail
