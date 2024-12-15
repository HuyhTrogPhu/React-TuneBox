import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { icons } from '../../assets/icon/icon';
import './Category.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link, useNavigate } from 'react-router-dom';
import { listCategories } from '../../service/EcommerceHome';

import { useTranslation } from "react-i18next";
import '../../i18n/i18n'


const Category = () => {
  const { t } = useTranslation();
  const [categoryList, setCategoryList] = useState([]);
  const navigate = useNavigate();
  const settings = {
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
  };

  useEffect(() => {
    getListCategory();
  }, [])

  function getListCategory() {
    listCategories().then((response) => {
      const filterCate = response.data.filter(category => category.status === false)
      setCategoryList(filterCate);
      console.log(response.data);
    }).catch((error) => {
      console.error("Error fetching category", error);
    })
  }
  const handleCategory = (category) => {
    console.log("Get category with ID:", category.id);
    navigate('/InstrumentBelongCategory', { state: { category } });
  };


  return (
    <div>
      <div className="cotainer slider mt-5">
        <div className='d-flex justify-content-between align-items-center mb-4'>
          <h4 className='category-title'>{t('cateTitle')} </h4>
          <Link to={'/CategoryPage'} className='view-all'>{t('viewall')}</Link>
        </div>
        <hr className='hr-100' />
        <div className="row text-center">
          <div className="col-12">
            <Slider {...settings}>
              {categoryList.map((category) => (
                <div className="item" key={category.id}>
                  <div  onClick={() => handleCategory(category)}> 
                   <a href=''>
                   <img alt={category.name} className=""
                      src={category.image}
                      style={{ width: '50px' }}
                    />
                    <h5>{category.name}</h5>
                   </a>
                    
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
        <hr className='hr-100' />
      </div>
    </div>
  );
};

export default Category;
