import React from 'react';
import Slider from 'react-slick';
import { icons } from '../../assets/icon/icon';
import './Category.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom';




const Category = () => {

  const settings = {
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
  };

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
              {/* Item 1 */}
              <div className="item">
                <Link to={'/CategoryPage'}>
                  <img alt="" className="" src={icons.guitar} />
                  <h5>Guitar & Bass</h5>
                </Link>
              </div>

              {/* Item 2 */}
              <div className="item">
                <Link to={'/CategoryPage'}>
                  <img alt="" className="" src={icons.giutar_amplifier} />
                  <h5>Amplifiers & Monitors</h5>
                </Link>
              </div>

              {/* Item 3 */}
              <div className="item">
                <Link to={'/CategoryPage'}>
                  <img alt="" className="" src={icons.guitar_pedal} />
                  <h5>Pedals & Pedalboards</h5>
                </Link>
              </div>

              {/* Item 4 */}
              <div className="item">
                <Link to={'/CategoryPage'}>
                  <img alt="" className="" src={icons.usb} />
                  <h5>Phụ kiện</h5>
                </Link>
              </div>

              {/* Item 5 */}
              <div className="item">
                <Link to={'/CategoryPage'}>
                  <img alt="" className="" src={icons.music} />
                  <h5>Trống & Bộ gõ</h5>
                </Link>
              </div>

              {/* Item 6 */}
              <div className="item">
                <Link to={'/CategoryPage'}>
                  <img alt="" className="" src={icons.key} />
                  <h5>Keyboards & Pianos</h5>
                </Link>
              </div>

              {/* Item 7 */}
              <div className="item">
                <Link to={'/CategoryPage'}>
                  <img alt="" className="" src={icons.earphone} />
                  <h5>Lifestyle & Gifts</h5>
                </Link>
              </div>

              {/* Item 8 */}
              <div className="item">
                <Link to={'/CategoryPage'}>
                  <img alt="" className="" src={icons.mic} />
                  <h5>Vocals & Microphones</h5>
                </Link>
              </div>

              {/* Item 9 */}
              <div className="item">
                <Link to={'/CategoryPage'}>
                  <img alt="" className="" src={icons.vocals} />
                  <h5>DJ & Production</h5>
                </Link>
              </div>

              {/* Item 10 */}
              <div className="item">
                <Link to={'/CategoryPage'}>
                  <img alt="" className="" src={icons.DJ} />
                  <h5>Âm thanh</h5>
                </Link>
              </div>
            </Slider>
          </div>
        </div>
        <hr className='hr-100' />
      </div>
    </div>
  );
};

export default Category;
