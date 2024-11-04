import React from 'react'
import TrendingPostsChart from '../pageContent/TrendingPostsChart'
import PostsWithImagesChart from './PostsWithImagesChart'
import PostsWithoutImagesChart from './PostsWithoutImagesChart'
import LatestPostsChart from './LatestPostsChart'
const Statistical = () => {
  return (
    <div>
      <h3>TrendingChart</h3>
      <TrendingPostsChart/>
      <h3>PostsWithImagesChart</h3>
      <PostsWithImagesChart/>
      <h3>PostsWithoutImagesChart</h3>
      <PostsWithoutImagesChart/>
      <h3>LatestPostsChart</h3>
      <LatestPostsChart/>
    </div>
  )
}

export default Statistical
