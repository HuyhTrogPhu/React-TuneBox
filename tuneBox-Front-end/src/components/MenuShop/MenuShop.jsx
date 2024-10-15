import React from 'react'
import '../MenuShop/MenuShop.css'
import { Link } from 'react-router-dom'

const MenuShop = () => {
    return (
        <div>
            <div className='row d-flex'>
                {/* Menu brand */}
                <div className='brand col-3'>
                    <Link to={'/BrandPage'}>Brand</Link>
                    <div className='brand-dropdown row'>
                        <div className='top-brand col-5'>
                            <div className='row'>
                                <div className='col-6'>
                                    <h5>Nhãn hiệu hàng đầu</h5>
                                    <div className='row'>
                                        <img src="" alt="" className='col-6'/>
                                    </div>
                                </div>
                                <div className='col-6'>
                                    <h5>Thương hiệu thịnh hành</h5>
                                    <Link to={'/BrandPage'}>Xem từ (A-Z)</Link>
                                    <div className=''></div>
                                </div>
                            </div>
                        </div>
                    </div>
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
    )
}

export default MenuShop
