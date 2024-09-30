import React from 'react'
import './BrandPage.css'
import Instroduce from '../../../components/Instroduce/Instroduce'

const BrandPage = () => {
  return (
    <div className='container-fluid'>
      <Instroduce />

      <div className='mt-4'>
        <ul>
          <li className="fillterBrandTarget" data-target='All'>
            <Link ></Link>
          </li>
          <li className="fillterBrand" data-target='a'>a</li>
          <li className="fillterBrand" data-target='b'>b</li>
          <li className="fillterBrand" data-target='c'>c</li>
          <li className="fillterBrand" data-target='d'>d</li>
          <li className="fillterBrand" data-target='e'>e</li>
          <li className="fillterBrand" data-target='f'>f</li>
          <li className="fillterBrand" data-target='g'>g</li>
          <li className="fillterBrand" data-target='h'>h</li>
          <li className="fillterBrand" data-target='i'>i</li>
          <li className="fillterBrand" data-target='j'>j</li>
          <li className="fillterBrand" data-target='k'>k</li>
          <li className="fillterBrand" data-target='l'>l</li>
          <li className="fillterBrand" data-target='m'>m</li>
          <li className="fillterBrand" data-target='n'>n</li>
          <li className="fillterBrand" data-target='o'>o</li>
          <li className="fillterBrand" data-target='p'>p</li>
          <li className="fillterBrand" data-target='r'>r</li>
          <li className="fillterBrand" data-target='s'>s</li>
          <li className="fillterBrand" data-target='t'>t</li>
          <li className="fillterBrand" data-target='v'>v</li>
          <li className="fillterBrand" data-target='w'>w</li>
          <li className="fillterBrand" data-target='y'>y</li>
          <li className="fillterBrand" data-target='z'>z</li>
        </ul>
      </div>
    </div>
  )
}

export default BrandPage
