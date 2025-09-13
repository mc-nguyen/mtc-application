import React, { useState, forwardRef, useImperativeHandle } from 'react';
import SignaturePad from './SignaturePad';
import { useLanguage } from '../LanguageContext';
import { useNganh } from '../hooks/useNganh'; // Import hook mới

const MainInfo = forwardRef(({ formData, setFormData }, ref) => {
  const { t } = useLanguage();
  const [showErrors, setShowErrors] = useState(false);
  
  // Sử dụng custom hook để lấy tuổi và ngành
  const { nganh: participantNganh } = useNganh(formData.dob);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      mainInfo: {
        ...prev.mainInfo,
        [name]: value,
      },
    }));
  };

  const handleParticipantSignature = (dataUrl) => {
    setFormData(prev => ({
      ...prev,
      mainInfo: {
        ...prev.mainInfo,
        participantSignature: dataUrl,
      },
    }));
  };

  const handleParentSignature = (dataUrl) => {
    setFormData(prev => ({
      ...prev,
      mainInfo: {
        ...prev.mainInfo,
        parentSignature: dataUrl,
      },
    }));
  };

  useImperativeHandle(ref, () => ({
    validate: () => {
      const isParticipantSigned = !!formData.mainInfo.participantSignature;
      const isParentSigned = formData.isAdult || !!formData.mainInfo.parentSignature;
      
      const isValid = isParticipantSigned && isParentSigned;
      if (!isValid) {
        setShowErrors(true);
      } else {
        setShowErrors(false);
      }
      return isValid;
    }
  }));

  return (
    <div className="form-section">
      <h2>{t('main_info_title')}</h2>
      
      {/* 1. Thông tin cá nhân */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        <div>
          <label>{t('main_info_sacred_name')}</label>
          <input type="text" name="sacredName" value={formData.mainInfo.sacredName || ''} onChange={handleChange} required />
        </div>
        <div>
          <label>{t('main_info_last_name')}</label>
          <input type="text" name="lastName" value={formData.mainInfo.lastName || ''} onChange={handleChange} required />
        </div>
        <div>
          <label>{t('main_info_middle_name')}</label>
          <input type="text" name="middleName" value={formData.mainInfo.middleName || ''} onChange={handleChange} required />
        </div>
        <div>
          <label>{t('main_info_given_name')}</label>
          <input type="text" name="givenName" value={formData.mainInfo.givenName || ''} onChange={handleChange} required />
        </div>
      </div>
      
      <hr style={{ margin: '30px 0' }} />

      {/* 2. Thông tin cha mẹ (chỉ hiện thị cho vị thành niên) */}
      {!formData.isAdult && (
        <>
          <div>
            <label>{t('main_info_father_name')}</label>
            <input type="text" name="fatherName" value={formData.mainInfo.fatherName || ''} onChange={handleChange} required />
            <label style={{ marginTop: '10px' }}>{t('main_info_mother_name')}</label>
            <input type="text" name="motherName" value={formData.mainInfo.motherName || ''} onChange={handleChange} required />
          </div>
          <hr style={{ margin: '30px 0' }} />
        </>
      )}

      {/* 3. Địa chỉ và số điện thoại */}
      <div>
        <label>{t('main_info_street_address')}</label>
        <input type="text" name="streetAddress" value={formData.mainInfo.streetAddress || ''} onChange={handleChange} required />
      </div>

      <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        <div>
          <label>{t('main_info_city')}</label>
          <input type="text" name="city" value={formData.mainInfo.city || ''} onChange={handleChange} required />
        </div>
        <div>
          <label>{t('main_info_state')}</label>
          <input type="text" name="state" value={formData.mainInfo.state || ''} onChange={handleChange} required />
        </div>
        <div>
          <label>{t('main_info_zip')}</label>
          <input type="text" name="zip" value={formData.mainInfo.zip || ''} onChange={handleChange} required />
        </div>
      </div>
      
      <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        <div>
          <label>{t('main_info_home_phone')}</label>
          <input type="tel" name="homePhone" value={formData.mainInfo.homePhone || ''} onChange={handleChange} />
        </div>
        <div>
          <label>{t('main_info_cell_phone')}</label>
          <input type="tel" name="cellPhone" value={formData.mainInfo.cellPhone || ''} onChange={handleChange} required />
        </div>
        <div>
          <label>{t('main_info_work_phone')}</label>
          <input type="tel" name="workPhone" value={formData.mainInfo.workPhone || ''} onChange={handleChange} />
        </div>
      </div>

      {/* 4. Thông tin liên hệ khẩn cấp và email */}
      <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        <div>
          <label>{t('main_info_emergency_contact_name')}</label>
          <input type="text" name="emergencyContactName" value={formData.mainInfo.emergencyContactName || ''} onChange={handleChange} required />
        </div>
        <div>
          <label>{t('main_info_emergency_contact_phone')}</label>
          <input type="tel" name="emergencyContactPhone" value={formData.mainInfo.emergencyContactPhone || ''} onChange={handleChange} required />
        </div>
      </div>
      
      <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        <div>
          <label>{t('main_info_dob')}</label>
          <input type="date" name="dob" value={formData.dob} disabled />
        </div>
        <div>
          <label>{t('main_info_email')}</label>
          <input type="email" name="email" value={formData.mainInfo.email || ''} onChange={handleChange} required />
        </div>
      </div>

      {/* Thêm phần hiển thị Ngành ngay trước chữ ký */}
      <hr style={{ margin: '30px 0' }} />
      <div style={{ marginBottom: '20px' }}>
        <label>{t('nganh_label')}</label>
        {formData.isAdult ? (
          <select 
            name="nganh" 
            value={formData.mainInfo.nganh || ''} 
            onChange={handleChange}
            className="nganh-select"
            required
          >
            <option value="">{t('select_option')}</option>
            <option value="Hiệp Sĩ Trưởng Thành">{t('nganh_adult_option1')}</option>
            <option value="Huynh Trưởng">{t('nganh_adult_option2')}</option>
            <option value="Trợ Tá">{t('nganh_adult_option3')}</option>
            <option value="Huấn Luyện Viên">{t('nganh_adult_option4')}</option>
          </select>
        ) : (
          <input type="text" value={participantNganh} disabled className="nganh-input" />
        )}
      </div>

      {/* 5. Chữ ký */}
      <SignaturePad
        content={<div dangerouslySetInnerHTML={{ __html: t('main_info_participant_signature_content') }} />}
        signerName={formData.mainInfo.givenName}
        onSign={handleParticipantSignature}
        existingSignature={formData.mainInfo.participantSignature}
      />
      {showErrors && !formData.mainInfo.participantSignature && (
        <p className="required-message">{t('participant_signature_required')}</p>
      )}
      
      {!formData.isAdult && (
        <>
          <SignaturePad
            content={<div dangerouslySetInnerHTML={{ __html: t('main_info_parent_signature_content')}} />}
            signerName={formData.mainInfo.fatherName || formData.mainInfo.motherName}
            onSign={handleParentSignature}
            existingSignature={formData.mainInfo.parentSignature}
          />
          {showErrors && !formData.mainInfo.parentSignature && (
            <p className="required-message">{t('parent_signature_required')}</p>
          )}
        </>
      )}
    </div>
  );
});

export default MainInfo;