import React, { useEffect, useState, useRef } from 'react';
import '../MenuShop/MenuShop.css';
import { Link, useNavigate } from 'react-router-dom';
import { listBrands, listCategories } from '../../service/EcommerceHome';

const MenuShop = () => {
    const [brands, setBrands] = useState([]);
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);

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
            setBrands(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await listCategories();
            setCategories(response.data);
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

    return (
        <div>
            <div className='row d-flex'>
                {/* Menu brand */}
                <div className='brand col-3 mt-3' ref={dropdownRef} onMouseEnter={() => setDropdownVisible(true)} onMouseLeave={() => setDropdownVisible(false)}>
                    <Link className='fw-bold fs-5' to={'/BrandPage'}>Brand</Link>
                    {dropdownVisible && (
                        <div className='brand-dropdown row'>
                            <div className='top-brand col-5'>
                                <div className='row'>
                                    <div className='col-6 border-end'>
                                        <h6 style={{ fontSize: '16px' }}>Nhãn hiệu hàng đầu</h6>
                                        <div className='row'>
                                            {randomBrands.map((brand) => (
                                                <span key={brand.id} onClick={() => handleBrandClick(brand)} className='col-5 m-2'>
                                                    <img src={brand.brandImage} alt={brand.name} style={{ width: '100px' }} />
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className='col-6'>
                                        <h6 className='pe-0 ps-0' style={{ fontSize: '16px' }}>Thương hiệu thịnh hành</h6>
                                        <Link to={'/BrandPage'} className='ms-5'>Xem từ (A-Z)</Link>
                                        {randomBrandNames.map((brand) => (
                                            <span key={brand.id} onClick={() => handleBrandClick(brand)}>
                                                <div className='brand-name'>
                                                    <h6>{brand.name}</h6>
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
                <div className='col-3'>
                    <Link to={'/CategoryPage'}>Categories</Link>
                </div>
                {/* Search in shop */}
                <div className='category col-6'>
                    <form action="" className="p-3">
                        <div className="input-group mb-3 mt-3">
                            <input
                                className="form-control m-0"
                                placeholder="Search instrument or brand"
                            />
                            <button className="btn border" type="submit">
                                <i className="fa-solid fa-magnifying-glass" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default MenuShop;
