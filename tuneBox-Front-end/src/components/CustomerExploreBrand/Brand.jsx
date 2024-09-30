import React from 'react'
import './Brand.css'
import { Link } from 'react-router-dom'

const Brand = () => {
    return (
        // Start brand 
        <div className='brand-container mt-5'>
            <div className='d-flex justify-content-between align-items-center mb-4'>
                <h4 className='brand-title'>Brands</h4>
                <Link to={'/BrandPage'} className='view-all'>View all</Link>
            </div>
            <hr className='hr-100' />
            <div className='row'>
                {/* Brand 1 */}
                <div className='col-lg-2 col-md-4 text-center mb-3'>
                    <Link to={'/BrandPage'}>
                        <img src="" alt=" Ableton" className='brand-image' />
                        <p>Ableton</p>
                    </Link>
                </div>
                {/* Brand 2 */}
                <div className='col-lg-2 col-md-4 text-center mb-3'>
                    <Link to={'/BrandPage'}>
                        <img src="" alt=" AIAIAi" className='brand-image' />
                        <p>AIAIAi</p>
                    </Link>
                </div>
                {/* Brand 3 */}
                <div className='col-lg-2 col-md-4 text-center mb-3'>
                    <Link to={'/BrandPage'}>
                        <img src="" alt=" Akai" className='brand-image' />
                        <p>Akai</p>
                    </Link>
                </div>
                {/* Brand 4 */}
                <div className='col-lg-2 col-md-4 text-center mb-3'>
                    <Link to={'/BrandPage'}>
                        <img src="" alt=" Alesis" className='brand-image' />
                        <p>Alesis</p>
                    </Link>
                </div>
                {/* Brand 5 */}
                <div className='col-lg-2 col-md-4 text-center mb-3'>
                    <Link to={'/BrandPage'}>
                        <img src="" alt=" Allparts" className='brand-image' />
                        <p>Allparts</p>
                    </Link>
                </div>
                {/* Brand 6 */}
                <div className='col-lg-2 col-md-4 text-center mb-3'>
                    <Link to={'/BrandPage'}>
                        <img src="" alt=" Arturia" className='brand-image' />
                        <p>Arturia</p>
                    </Link>
                </div>
            </div>
        </div>
        // End brand 
    )
}

export default Brand
