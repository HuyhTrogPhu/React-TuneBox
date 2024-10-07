import React, { useEffect, useState } from 'react';
import './Brand.css';
import { Link } from 'react-router-dom';
import { listBrands } from '../../service/EcommerceHome';

const Brand = () => {
  const [brandList, setBrandList] = useState([]);
  const [randomBrands, setRandomBrands] = useState([]);

  useEffect(() => {
    getAllBrand();
  }, []);

  function getAllBrand() {
    listBrands()
      .then((response) => {
        setBrandList(response.data);
        setRandomBrands(getRandomBrands(response.data, 6)); // Lấy 6 thương hiệu ngẫu nhiên
      })
      .catch((error) => {
        console.error("Error fetching brands", error);
      });
  }

  // Hàm lấy n thương hiệu ngẫu nhiên từ danh sách
  function getRandomBrands(brands, count) {
    const shuffled = brands.sort(() => 0.5 - Math.random()); // Xáo trộn danh sách
    return shuffled.slice(0, count); // Lấy n thương hiệu đầu tiên
  }

  return (
    // Start brand 
    <div className='brand-container mt-5'>
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h4 className='brand-title'>Brands</h4>
        <Link to={'/BrandPage'} className='view-all'>View all</Link>
      </div>
      <hr className='hr-100' />
      <div className='row'>
        {randomBrands.map((brand, index) => (
          <div className='col-lg-2 col-md-2 col-sm-4 text-center mb-3' key={brand.id}>
            <Link to={'/BrandPage'}>
              <img
                key={index}
                src={brand.brandImage ? `data:image/png;base64, ${brand.brandImage}`
                  : 'default-image-path.jpg'}
                alt={brand.name}
                style={{ width: '50px' }}
              />
              <p>{brand.name}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
    // End brand 
  );
};

export default Brand;
