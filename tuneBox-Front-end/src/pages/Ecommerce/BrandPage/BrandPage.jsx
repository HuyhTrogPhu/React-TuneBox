import React, { useState } from 'react';
import './BrandPage.css';
import Footer2 from '../../../components/Footer/Footer2'

import Instroduce from '../../../components/Instroduce/Instroduce';

const brands = {
  A: ['Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand'],
  B: ['Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand'],
  C: ['Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand'],
  D: ['Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand'],
  E: ['Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand'],
  F: ['Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand'],
  G: ['Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand'],
  H: ['Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand'],
  I: ['Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand'],
  J: ['Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand'],
  K: ['Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand'],
  L: ['Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand'],
  M: ['Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand'],
  N: ['Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand'],
  O: ['Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand'],
  P: ['Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand'],
  R: ['Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand'],
  S: ['Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand'],
  T: ['Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand'],
  V: ['Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand'],
  W: ['Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand'],
  Y: ['Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand'],
  Z: ['Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand', 'Ableton', 'AnotherBrand'],
};

const BrandPage = () => {
  const [selectedLetter, setSelectedLetter] = useState('All');
  const [showMore, setShowMore] = useState(false); // State để kiểm soát hiển thị

  const handleFilterClick = (letter) => {
    setSelectedLetter(letter);
  };

  const handleShowMoreClick = () => {
    setShowMore(true); // Hiển thị toàn bộ các brand khi nhấn nút
  };

  // Lấy tất cả các brand khi 'All' được chọn
  const allBrands = Object.values(brands).flat();

  return (
    <div>

      <div className='container'>
        <Instroduce />

        {/* Filter list */}
        <div className='fullBrand mt-4'>
          <ul className='listBrand'>
            <li
              key="All"
              className={`fillterBrand ${selectedLetter === 'All' ? 'active' : ''}`}
              onClick={() => handleFilterClick('All')}
            >
              All
            </li>
            {Object.keys(brands).map((letter) => (
              <li
                key={letter}
                className={`fillterBrand ${selectedLetter === letter ? 'active' : ''}`}
                onClick={() => handleFilterClick(letter)}
              >
                {letter}
              </li>
            ))}
          </ul>
        </div>

        {/* Brand lists by alphabet */}
        {Object.entries(brands)
          // Lọc để hiển thị chỉ các brand A-E nếu showMore là false
          .filter(([letter]) => showMore || ['A', 'B', 'C', 'D', 'E'].includes(letter))
          .map(([letter, brandList]) => (
            <div key={letter} className='brandA mt-5'>
              <h1>{letter}</h1>
              <ul className='listBrandA row'>
                {brandList.map((brand, index) => (
                  <li key={index} className='col-2'>{brand}</li>
                ))}
              </ul>
            </div>
          ))}

        {/* Nút See More */}
        {!showMore && (
          <button className='brandSeeMore btn mt-5 border' onClick={handleShowMoreClick}>See more brand</button>
        )}
      </div>


    </div>


  );
};

export default BrandPage;
