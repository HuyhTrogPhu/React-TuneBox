import React from 'react'

import Carousel from '../../../components/Carousel/Carousel'
import Instroduce from '../../../components/Instroduce/Instroduce'
import Category from '../../../components/CustomerExpolreCaterogy/Category'
import Brand from '../../../components/CustomerExploreBrand/Brand'
import Sellwell from '../../../components/Sellwell/Sellwell'
import Header from '../../../components/Header/Header'
import Footer2 from '../../../components/Footer/Footer2'
import Benefit from '../../../components/Benefits/Benefits'
import MenuShop from '../../../components/MenuShop/MenuShop'

const Home = () => {
  return (
    <div>

      <div className='app-container' style={{marginTop: '100px'}}>
        <MenuShop/>
        <Carousel />
        <Instroduce />
        <Brand />
        <Category />
        <Sellwell />
        
      </div>
      <Benefit />
      <Footer2 />
    </div>
  )
}

export default Home
