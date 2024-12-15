import React from 'react';
import './Benefits.css';
import { useTranslation } from "react-i18next";
import '../../i18n/i18n';

const Benefits = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <div className='row d-flex benefit-container'>
        
        <div className='col-3 benefit-card'>
          <div className='benefits-icon'>
            <i className="fa-solid fa-headphones"></i>
          </div>
          <h2 className='benefits-text'>
            {t('ben1')}
          </h2>
          <p className='benefits-content'>
            {t('ben2')}
          </p>
        </div>

        <div className='col-3 benefit-card'>
          <div className='benefits-icon'>
            <i className="fa-solid fa-cart-shopping"></i>
          </div>
          <h2 className='benefits-text'>
            {t('ben3')}
          </h2>
          <p className='benefits-content'>
            {t('ben4')}
          </p>
        </div>

        <div className='col-3 benefit-card'>
          <div className='benefits-icon'>
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <h2 className='benefits-text'>
            {t('ben5')}
          </h2>
          <p className='benefits-content'>
            {t('ben6')}
          </p>
        </div>

        <div className='col-3 benefit-card'>
          <div className='benefits-icon'>
            <i className="fa-solid fa-message"></i>
          </div>
          <h2 className='benefits-text'>
            {t('ben7')}
          </h2>
          <p className='benefits-content'>
            {t('ben8')}
          </p>
        </div>

      </div>
    </div>
  );
};

export default Benefits;
