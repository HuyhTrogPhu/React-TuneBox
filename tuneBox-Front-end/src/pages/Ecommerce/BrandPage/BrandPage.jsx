import React, { useEffect, useState } from 'react';
import './BrandPage.css';
import Footer2 from '../../../components/Footer/Footer2';
import { listBrands } from '../../../service/BrandServiceCus';
import { useNavigate } from 'react-router-dom';

const BrandPage = () => {
  const [brands, setBrands] = useState([]); // State để lưu danh sách thương hiệu
  const [selectedLetter, setSelectedLetter] = useState('All');
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await listBrands();
        // Lọc thương hiệu có trạng thái là false
        const filteredBrands = response.data.filter(brand => !brand.status);
        setBrands(filteredBrands); // Lưu danh sách thương hiệu vào state
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, []);

  // Nhóm thương hiệu theo chữ cái đầu tiên
  const groupedBrands = brands.reduce((acc, brand) => {
    const firstLetter = brand.name.charAt(0).toUpperCase(); // Lấy chữ cái đầu tiên
    if (!acc[firstLetter]) {
      acc[firstLetter] = []; // Khởi tạo mảng nếu chưa tồn tại
    }
    acc[firstLetter].push(brand); // Thêm thương hiệu vào mảng tương ứng
    return acc;
  }, {});

  const letters = Object.keys(groupedBrands).sort();

  // Hàm xử lý lọc thương hiệu theo bảng chữ cái
  const filterBrands = () => {
    if (selectedLetter === 'All') return brands;

    return brands.filter(brand => brand.name.startsWith(selectedLetter));
  };

  const handleBrandClick = (brand) => {
    console.log("Navigating to brand detail with brand ID:", brand.id);
    navigate('/brand-detail', { state: { brand } });
  };

  return (
    <div>
      <div className='container mt-5'>
        <div className='fullBrand mt-4'>
          <ul className='listBrand'>
            <li
              key="All"
              className={`fillterBrand ${selectedLetter === 'All' ? 'active' : ''}`}
              onClick={() => setSelectedLetter('All')}
            >
              All
            </li>
            {/* Giả sử bạn đã có danh sách các chữ cái từ A đến Z */}
            {Array.from(Array(26)).map((_, index) => {
              const letter = String.fromCharCode(65 + index); // 65 là mã ASCII của 'A'
              return (
                <li
                  key={letter}
                  className={`fillterBrand ${selectedLetter === letter ? 'active' : ''}`}
                  onClick={() => setSelectedLetter(letter)}
                >
                  {letter}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Danh sách thương hiệu theo chữ cái */}
        {selectedLetter === 'All'
          ? letters.map((letter) => (
            <div key={letter} className='brandA mt-5'>
              <h1>{letter}</h1>
              <ul className='listBrandA row'>
                {groupedBrands[letter].map((brand, index) => (
                  <li key={index} className='col-2'>
                    <span onClick={() => handleBrandClick(brand)} className="brandName"> <a href="">{brand.name}</a></span>
                  </li>
                ))}
              </ul>
            </div>
          ))
          : selectedLetter in groupedBrands && (
            <div className='brandA mt-5'>
              <h1>{selectedLetter}</h1>
              <ul className='listBrandA row'>
                {groupedBrands[selectedLetter].map((brand, index) => (
                  <li key={index} className='col-2'>
                    <span onClick={() => handleBrandClick(brand)} className="brandName"> <a href="">{brand.name}</a></span>
                  </li>
                ))}
              </ul>
            </div>
          )}
      </div>
      <div style={{marginTop: '520px'}}>
      <Footer2 />
      </div>
    
    </div>
  );
};

export default BrandPage;
