import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { icons } from '../../assets/icon/icon';
import './Category.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom';
import { listCategories } from '../../service/EcommerceHome';




const Category = () => {

  const [categoryList, setCategoryList] = useState([]);

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
      setCategoryList(response.data);
    }).catch((error) => {
      console.error("Error fetching category", error);
    })
  }


  return (
    <div>
      <div className="cotainer slider mt-5">
        <div className='d-flex justify-content-between align-items-center mb-4'>
          <h4 className='category-title'>Category </h4>
          <Link to={'/CategoryPage'} className='view-all'>View all</Link>
        </div>
        <hr className='hr-100' />
        <div className="row text-center">
          <div className="col-12">
            <Slider {...settings}>
              {categoryList.map((category) => (
                <div className="item" key={category.id}>
                  <Link to={`/CategoryPage/${category.id}`}> {/* Thay đổi đường dẫn đến chi tiết danh mục */}
                    <img alt={category.name} className=""
                      src={category.image ? category.image : 'default-image-path.jpg' }
                      style={{ width: '50px' }}
                    />
                    <h5>{category.name}</h5>
                  </Link>
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
