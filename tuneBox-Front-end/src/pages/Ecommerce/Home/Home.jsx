import React from 'react'

import Carousel from '../../../components/Carousel/Carousel'
import Instroduce from '../../../components/Instroduce/Instroduce'
import Category from '../../../components/CustomerExpolreCaterogy/Category'
import Brand from '../../../components/CustomerExploreBrand/Brand'
import Sellwell from '../../../components/Sellwell/Sellwell'
import Header from '../../../components/Header/Header'
import Footer2 from '../../../components/Footer/Footer2'

const Home = () => {
  return (
    <div>
     
      <div className='app-container'>
      <Carousel/>
      <Instroduce/>
      <Brand/>
      <Category/>
      <Sellwell/>
     
      </div>
      <Footer2/>
    </div>
  )
}

export default Home
