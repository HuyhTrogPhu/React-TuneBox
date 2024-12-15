import React, { useEffect, useState, useRef } from 'react';
import '../MenuShop/MenuShop.css';
import { Link, useNavigate } from 'react-router-dom';
import { listBrands, listCategories } from '../../service/EcommerceHome';
import { searchInstruments } from '../../service/shop'
import { useTranslation } from "react-i18next";
import '../.././i18n/i18n'
const MenuShop = () => {
    const [brands, setBrands] = useState([]);
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearched, setIsSearched] = useState(false);
    const [searchResults, setSearchResults] = useState([]); // Lưu kết quả tìm kiếm
    const { t } = useTranslation();

    useEffect(() => {
        fetchBrands();
        fetchCategories();

        // Close dropdown when clicking outside
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownVisible(false); // Close the dropdown
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const fetchBrands = async () => {
        try {
            const response = await listBrands();
            // Lọc các brand có status là false
            const filteredBrands = response.data.filter(brand => brand.status === false);
            setBrands(filteredBrands);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await listCategories();
            // Lọc các category có status là false
            const filteredCategories = response.data.filter(category => category.status === false);
            setCategories(filteredCategories);
        } catch (error) {
            console.error(error);
        }
    };

    // Function to get 8 random brands
    const getRandomBrands = (brandsArray) => {
        const shuffled = brandsArray.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 8);
    };

    // Function to get 16 random brand names
    const getRandomBrandNames = (brandsArray) => {
        const shuffled = brandsArray.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 16);
    };

    // Navigate to brand-detail page
    const handleBrandClick = (brand) => {
        navigate('/brand-detail', { state: { brand } });
    };

    const randomBrands = getRandomBrands(brands);
    const randomBrandNames = getRandomBrandNames(brands);
    const getRandomCategories = (categoriesArray) => {
        const shuffled = categoriesArray.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 8);
    };

    const randomCategories = getRandomCategories(categories);

    const handleSearch = async (e) => {
        e.preventDefault();
        setIsSearched(true); // Đánh dấu là đã thực hiện tìm kiếm
        try {
            const response = await searchInstruments(searchTerm);
            // Lọc các sản phẩm có status là false
            const filteredResults = response.filter(instrument => instrument.status === false);

            setSearchResults(filteredResults);
        } catch (error) {
            console.error("Error searching instruments:", error);
        }
    };



    const getStockStatus = (quantity) => {
        if (quantity === 0) return t('hethang');
        if (quantity > 0 && quantity <= 5) return t('saphhet');
        return t('conhang');
    };

    return (
        <div>
            <div className='row d-flex'>
                {/* Menu brand */}
                <div className='brand col-6 mt-3' ref={dropdownRef} onMouseEnter={() => setDropdownVisible(true)} onMouseLeave={() => setDropdownVisible(false)}>
                    <div className='mt-3'>
                        <Link className='fw-bold fs-5' to={'/BrandPage'}>{t('brandTitle')}</Link>
                        <Link className='fw-bold fs-5' style={{ marginLeft: '50px' }} to={'/CategoryPage'}>Categories</Link>
                    </div>

                    {dropdownVisible && (
                        <div className='brand-dropdown row'>
                            <div className='top-brand col-5'>
                                <div className='row'>
                                    <div className='col-6 border-end'>
                                        <h6 style={{ fontSize: '16px' }}>Nhãn hiệu</h6>
                                        <div className='row'>
                                            {randomBrands.map((brand) => (
                                                <span key={brand.id} onClick={() => handleBrandClick(brand)} className='col-5 m-2'>
                                                    <img src={brand.brandImage} alt={brand.name} style={{ width: '100px' }} />
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className='col-6'>
                                        <h6 className='pe-0 ps-0' style={{ fontSize: '16px' }}>Loại sản phẩm</h6>

                                        {randomCategories.map((category) => (
                                            <span key={category.id}>
                                                <div className='category-name'>
                                                    <h6>{category.name}</h6>
                                                </div>
                                            </span>
                                        ))}

                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {/* Menu category */}

                {/* Search in shop */}
                <div className='category col-6'>
                    <form onSubmit={handleSearch} className="p-3">
                        <div className="input-group mb-3 mt-3">
                            <input
                                className="form-control m-0"
                                placeholder="Search instrument or brand"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}  // Cập nhật từ khóa tìm kiếm
                            />
                            <button className="btn border" type="submit">
                                <i className="fa-solid fa-magnifying-glass" />
                            </button>
                        </div>
                    </form>
                    <h1>

                    </h1>


                </div>
                <div>
                    <h5>Kết quả tìm kiếm</h5>
                </div>
                <div className="row d-flex justify-content-start">
                    {isSearched ? (
                        searchResults.length > 0 ? (
                            searchResults.map((instrument) => {
                                return (
                                    <div key={instrument.id} className="col-3 mb-4">
                                        <div className="card">
                                            <Link to={{
                                                pathname: `/DetailProduct/${instrument.id}`,
                                                state: { instrument }
                                            }}>
                                                <div style={{ width: '100%', height: '100%', border: 'none', cursor: 'pointer' }}>
                                                    <div className="card-img-wrapper" style={{ height: '250px' }}>
                                                        <img
                                                            src={instrument.image ? instrument.image : 'default-image-path.jpg'}  // Hình ảnh mặc định
                                                            alt={instrument.name}
                                                        />
                                                    </div>
                                                    <div className="card-body text-center">
                                                        <h5 className="card-title">
                                                            {instrument.name}
                                                        </h5>
                                                        <p className="card-price">
                                                            {instrument.costPrice.toLocaleString('vi')}đ
                                                        </p>
                                                        <p className="card-status">{getStockStatus(instrument.quantity)}</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="alert alert-danger">{t('no')}</div> // Hiển thị thông báo nếu không có sản phẩm nào
                        )
                    ) : null}
                </div>

            </div>
        </div>
    );
}

export default MenuShop;
