import React from 'react';
import { useLanguage } from '../LanguageContext';
import { PRICES, calculateTotal } from '../utils/paymentUtils';
import './FormSection.css';

function PaymentInfo({ formData, setFormData }) {
  const { t } = useLanguage();

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      paymentInfo: {
        ...prev.paymentInfo,
        [name]: checked,
      },
    }));
  };

  const totalAmount = calculateTotal(formData.paymentInfo, formData.isAdult);

  return (
    <section className="form-section payment-info">
      <h2 className="form-section__title">{t('payment_info_title')}</h2>

      <div className="form-section__field">
        <label className="form-section__label">{t('payment_annual_fee')}</label>
        <strong>${PRICES.annualFee.toFixed(2)}</strong>
      </div>

      <div className="form-section__field">
        <label className="form-section__label">
          <input
            className="form-section__input"
            type="checkbox"
            name="uniformShirt"
            checked={formData.paymentInfo.uniformShirt || false}
            onChange={handleChange}
          />
          {t('payment_uniform_shirt')}
        </label>
        <strong>${PRICES.uniformShirt.toFixed(2)}</strong>
      </div>

      <div className="form-section__field">
        <label className="form-section__label">
          <input
            className="form-section__input"
            type="checkbox"
            name="uniformSkort"
            checked={formData.paymentInfo.uniformSkort || false}
            onChange={handleChange}
          />
          {t('payment_uniform_skort')}
        </label>
        <strong>${PRICES.uniformSkort.toFixed(2)}</strong>
      </div>

      {!formData.isAdult && (
        <div className="form-section__field">
          <label className="form-section__label">
            <input
              className="form-section__input"
              type="checkbox"
              name="scarf"
              checked={formData.paymentInfo.scarf || false}
              onChange={handleChange}
            />
            {t('payment_scarf')}
          </label>
          <strong>${PRICES.scarf.toFixed(2)}</strong>
        </div>
      )}

      <hr style={{ margin: '20px 0' }} />

      <div className="form-section__field">
        <label className="form-section__label"><strong>{t('payment_total')}</strong></label>
        <strong>${totalAmount.toFixed(2)}</strong>
      </div>

    </section>
  );
}

export default PaymentInfo;