import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { calculateTotal } from '../utils/paymentUtils';

function ThankYouPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { formData, isCamp = false } = location.state || {};
  const { t } = useLanguage();

  const handleBackToHome = () => {
    navigate('/');
  };

  const totalAmount = formData ? calculateTotal(formData.paymentInfo, formData.isAdult) : 0;

  const participantName = [
    formData?.mainInfo?.sacredName,
    formData?.mainInfo?.lastName,
    formData?.mainInfo?.middleName,
    formData?.mainInfo?.givenName
  ].filter(Boolean).join(' ');

  return (
    <div className="thank-you-container">
      <h1>{t('thank_you_title')}</h1>
      
      {/* HIỂN THỊ THÔNG BÁO KHÁC NHAU CHO CAMP VÀ MEMBERSHIP */}
      {isCamp ? (
        <p>{t('camp_thank_you_message')}</p>
      ) : (
        <p>{t('thank_you_message')}</p>
      )}

      {formData && (
        <>
          <div className="personal-info-summary">
            <h3>{t('main_info_title')}</h3>
            <p><strong>Họ và tên:</strong> {participantName}</p>
            <p><strong>{t('main_info_dob')}:</strong> {formData.dob}</p>
            <p><strong>{t('main_info_email')}:</strong> {formData.mainInfo.email}</p>
            <p><strong>{t('main_info_cell_phone')}:</strong> {formData.mainInfo.cellPhone}</p>
            
            {/* CHỈ HIỂN THỊ THÔNG TIN PHỤ HUYNH CHO MEMBERSHIP */}
            {!isCamp && !formData.isAdult && (
              <>
                <p><strong>{t('main_info_father_name')}:</strong> {formData.mainInfo.fatherName}</p>
                <p><strong>{t('main_info_mother_name')}:</strong> {formData.mainInfo.motherName}</p>
              </>
            )}
            
            <p><strong>{t('main_info_city')}:</strong> {formData.mainInfo.streetAddress}, {formData.mainInfo.city}, {formData.mainInfo.state}, {formData.mainInfo.zip}</p>
          </div>

          {/* CHỈ HIỂN THỊ BIÊN LAI CHO MEMBERSHIP */}
          {!isCamp && (
            <div className="receipt">
              <h3>Biên lai thanh toán</h3>
              <table>
                <thead>
                  <tr>
                    <th>Mục</th>
                    <th>Số tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{t('payment_annual_fee')}</td>
                    <td>$50.00</td>
                  </tr>
                  {formData.paymentInfo.uniformShirt && (
                    <tr>
                      <td>{t('payment_uniform_shirt')}</td>
                      <td>$25.00</td>
                    </tr>
                  )}
                  {formData.paymentInfo.uniformSkort && (
                    <tr>
                      <td>{t('payment_uniform_skort')}</td>
                      <td>$25.00</td>
                    </tr>
                  )}
                  {formData.paymentInfo.scarf && (
                    <tr>
                      <td>{t('payment_scarf')}</td>
                      <td>$10.00</td>
                    </tr>
                  )}
                  <tr className="total-row">
                    <td><strong>Tổng cộng</strong></td>
                    <td><strong>${totalAmount}.00</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <button onClick={handleBackToHome}>{t('back_to_home')}</button>
    </div>
  );
}

export default ThankYouPage;