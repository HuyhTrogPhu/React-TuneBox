import React, { useEffect, useState } from 'react';
import './Brand.css';
import { Link, useNavigate } from 'react-router-dom';
import { listBrands } from '../../service/EcommerceHome';
import { useTranslation } from "react-i18next";
import '../../i18n/i18n'
const Brand = () => {
  const [brandList, setBrandList] = useState([]);
  const [randomBrands, setRandomBrands] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();
  useEffect(() => {
    getAllBrand();
  }, []);

  

function getAllBrand() {
    listBrands()
      .then((response) => {
        const filteredBrands = response.data.filter(brand => brand.status === false); // Lọc brand có status là false
        setBrandList(filteredBrands);
        setRandomBrands(getRandomBrands(filteredBrands, 6)); // Lấy 6 thương hiệu ngẫu nhiên từ danh sách đã lọc
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
  const handleBrandClick = (brand) => {
    console.log("Navigating to brand detail with brand ID:", brand.id);
    navigate('/brand-detail', { state: { brand } });
  };


  return (
    // Start brand 
    <div className='brand-container mt-5'>
    <div className='d-flex justify-content-between align-items-center mb-4'>
      <h4 className='brand-title'>{t('brandTitle')}</h4>
      <Link to={'/BrandPage'} className='view-all'>{t('viewall')}</Link>
    </div>
    <hr className='hr-100' />
    <div className='row'>
      {randomBrands.map((brand, index) => (
        <div className='col-lg-2 col-md-2 col-sm-4 text-center mb-3' key={brand.id}>
          <div onClick={() => handleBrandClick(brand)}  >
            <Link to={''}>
            <img
              key={index}
              src={brand.brandImage ? brand.brandImage : 'default-image-path.jpg'}
              alt={brand.name}
            />
            <p>{brand.name}</p>
            </Link>
            
          </div>
        </div>
      ))}
    </div>
  </div>
    // End brand 
  );
};

export default Brand;
