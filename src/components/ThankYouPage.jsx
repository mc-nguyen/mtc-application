// src/components/ThankYouPage.jsx
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

  // Chỉ tính tổng cho membership, không tính cho camp
  const totalAmount = formData && !isCamp ? calculateTotal(formData.paymentInfo, formData.isAdult) : 0;

  const participantName = formData ? [
    formData.mainInfo?.saintName,
    formData.mainInfo?.lastName,
    formData.mainInfo?.middleName,
    formData.mainInfo?.givenName
  ].filter(Boolean).join(' ') : '';

  return (
    <div className="thank-you-container">
      <h1>{t('thank_you_title')}</h1>
      
      {/* HIỂN THỊ THÔNG BÁO KHÁC NHAU CHO CAMP VÀ MEMBERSHIP */}
      {isCamp ? (
        <div className="thank-you-message">
          <p>{t('camp_thank_you_message')}</p>
          <p>Chúng tôi sẽ liên hệ với bạn sớm để thông báo thêm chi tiết về trại.</p>
        </div>
      ) : (
        <div className="thank-you-message">
          <p>{t('thank_you_message')}</p>
        </div>
      )}

      {formData && (
        <>
          <div className="personal-info-summary">
            <h3>Thông tin đăng ký</h3>
            <p><strong>Họ và tên:</strong> {participantName}</p>
            <p><strong>{t('main_info_dob')}:</strong> {formData.dob}</p>
            <p><strong>{t('main_info_email')}:</strong> {formData.mainInfo?.email}</p>
            <p><strong>{t('main_info_cell_phone')}:</strong> {formData.mainInfo?.cellPhone}</p>
            
            {/* CHỈ HIỂN THỊ THÔNG TIN PHỤ HUYNH CHO MEMBERSHIP và không phải adult */}
            {!isCamp && !formData.isAdult && (
              <>
                <p><strong>{t('main_info_father_name')}:</strong> {formData.mainInfo?.fatherName}</p>
                <p><strong>{t('main_info_mother_name')}:</strong> {formData.mainInfo?.motherName}</p>
              </>
            )}
            
            <p><strong>Địa chỉ:</strong> {formData.mainInfo?.streetAddress}, {formData.mainInfo?.city}, {formData.mainInfo?.state}, {formData.mainInfo?.zip}</p>
          </div>

          {/* CHỈ HIỂN THỊ BIÊN LAI CHO MEMBERSHIP */}
          {!isCamp && formData.paymentInfo && (
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
              <div className="payment-instructions">
                <p>Vui lòng thanh toán bằng tiền mặt trong buổi sinh hoạt tiếp theo.</p>
              </div>
            </div>
          )}

          {isCamp && (
            <div className="camp-info">
              <h3>Thông tin trại Bình Minh</h3>
              <p>Địa điểm: [Sẽ thông báo sau]</p>
              <p>Thời gian: [Sẽ thông báo sau]</p>
              <p>Chi phí: [Sẽ thông báo sau]</p>
              <p>Chúng tôi sẽ gửi email chi tiết đến: <strong>{formData.mainInfo?.email}</strong></p>
            </div>
          )}
        </>
      )}

      <div className="action-buttons">
        <button onClick={handleBackToHome} className="btn">
          {t('back_to_home')}
        </button>
        
        {!isCamp && (
          <button onClick={() => window.print()} className="btn">
            In biên lai
          </button>
        )}
      </div>
    </div>
  );
}

export default ThankYouPage;