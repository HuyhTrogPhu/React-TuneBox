import React from 'react'
import './Benefits.css'

const Bebefits = () => {
  return (
    <div>
      <div className='row d-flex benefit-container'>
        {/* content */}

        <div className='col-3 benefit-card'>
          <div className='benefits-icon'>
          <i class="fa-solid fa-headphones"></i>
          </div>
          <h2 className='benefits-text'>
            Ngôi Nhà Âm Nhạc & Cá Tính Âm nhạc
          </h2>
          <p className='benefits-content'>
            Khám phá hơn 9000 items tuyển chọn từ thương hiệu cao cấp.
            Kết nối với hơn 150000 người yêu nhạc trong cộng đồng của chúng tôi từ năm 2013.
          </p>
        </div>

        <div className='col-3 benefit-card'>
          <div className='benefits-icon'>
          <i class="fa-solid fa-cart-shopping"></i>
          </div>
          <h2 className='benefits-text'>
            Giao Hàng Miễn Phí
            & Đảm Bảo Vận Chuyển
          </h2>
          <p className='benefits-content'>
            Giao hàng miễn phí toàn quốc cho mọi đơn hàng.
          </p>
        </div>

        <div className='col-3 benefit-card'>
          <div className='benefits-icon'>
          <i class="fa-solid fa-shield-halved"></i>
          </div>
          <h2 className='benefits-text'>
            Mua Sắm Trực Tuyến
            Đảm Bảo An Toàn
          </h2>
          <p className='benefits-content'>
            Sắm hàng online dễ dàng và bảo mật cùng hệ thống
            thanh toán đáng tin cậy của chúng tôi.
          </p>
        </div>

        <div className='col-3 benefit-card'>
          <div className='benefits-icon'>
          <i class="fa-solid fa-message"></i>
          </div>
          <h2 className='benefits-text'>
            Hỗ Trợ Khách Hàng
          </h2>
          <p className='benefits-content'>
            Đội ngũ chuyên nghiệp của chúng tôi luôn sẵn lòng hỗ trợ trước,
            trong và sau khi mua hàng dù bạn mua online hay tại store.
          </p>
        </div>

      </div>
    </div>
  )
}

export default Bebefits
