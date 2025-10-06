import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { useLanguage } from '../LanguageContext';
import './FormSection.css';

// Function to calculate if the person is a minor (under 18) based on DOB
const isMinor = (dob) => {
  if (!dob) return true; // Default to true if DOB is missing (safer assumption for a form like this)
  const dobDate = new Date(dob);
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
  return dobDate > eighteenYearsAgo;
};

const HealthInfo = forwardRef(({ formData, setFormData }, ref) => {
  const { t } = useLanguage();
  const [showErrors, setShowErrors] = useState(false);
  const [gender, setGender] = useState(formData.healthInfo.gender || '');

  // SỬA LỖI: Sử dụng useRef để lưu trữ dữ liệu GỐC (initial data) khi component mount.
  // Các trường chỉ bị disabled nếu chúng đã có dữ liệu ngay từ đầu.
  const initialData = useRef({
      mainInfo: formData.mainInfo || {},
      dob: formData.dob || ''
  }).current; // .current để lấy giá trị lần đầu

  // Determine if the participant is a minor
  const isParticipantMinor = isMinor(formData.dob);

  // HÀM MỚI: Kiểm tra disable dựa trên giá trị BAN ĐẦU
  const isFieldDisabled = (fieldName) => {
      if (fieldName === 'dob') {
          return !!initialData.dob;
      }
      return !!initialData.mainInfo[fieldName];
  };

  // Xử lý thay đổi cho các trường thuộc formData.mainInfo và formData.dob
  const handleMainInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (name === 'dob') {
        return {
          ...prev,
          [name]: value,
        };
      }
      return {
        ...prev,
        mainInfo: {
          ...prev.mainInfo,
          [name]: value,
        },
      };
    });
  };
  
  // Xử lý thay đổi cho các trường thuộc formData.healthInfo
  const handleHealthInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      healthInfo: {
        ...prev.healthInfo,
        [name]: value,
      },
    }));
  };

  const handleEmergencyContactChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      healthInfo: {
        ...prev.healthInfo,
        emergencyContact: {
          ...prev.healthInfo.emergencyContact,
          [name]: value,
        }
      },
    }));
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
    setFormData(prev => ({
      ...prev,
      healthInfo: {
        ...prev.healthInfo,
        gender: e.target.value,
      },
    }));
  };

  useImperativeHandle(ref, () => ({
    validate: () => {
      const { mainInfo } = formData;
      const { gender, emergencyContact } = formData.healthInfo;
      let allFieldsValid = true;
      const errors = {};

      // 1. Kiểm tra các trường trong formData.mainInfo và formData.dob
      const mainFields = ['lastName', 'givenName', 'city', 'state', 'zip', 'cellPhone', 'email'];
      
      mainFields.forEach(field => {
        const value = mainInfo?.[field] || '';
        // CHỈ KIỂM TRA LỖI nếu trường KHÔNG bị disabled (tức là ban đầu trống)
        if (!isFieldDisabled(field) && value.trim() === '') {
          allFieldsValid = false;
          errors[field] = t('required_field');
        }
      });
      
      // Kiểm tra DOB riêng
      if (!isFieldDisabled('dob') && !formData.dob) {
        allFieldsValid = false;
        errors.dob = t('required_field');
      }

      // 2. Kiểm tra Gender
      if (!gender) {
        allFieldsValid = false;
        errors.gender = t('gender_required');
      }
      
      // 3. Kiểm tra Emergency Contact (logic này giữ nguyên)
      if (!emergencyContact?.name || emergencyContact.name.trim() === '') {
        allFieldsValid = false;
        errors.emergencyContactName = t('emergency_contact_name_required');
      }
      if (!emergencyContact?.phone || emergencyContact.phone.trim() === '') {
        allFieldsValid = false;
        errors.emergencyContactPhone = t('emergency_contact_phone_required');
      }
      if (!emergencyContact?.relationship || emergencyContact.relationship.trim() === '') {
        allFieldsValid = false;
        errors.emergencyContactRelationship = t('emergency_contact_relationship_required');
      }
      
      if (!allFieldsValid) {
        setShowErrors(true);
      } else {
        setShowErrors(false);
      }
      
      return allFieldsValid;
    },
  }));

  // HÀM MỚI: Dùng để hiển thị lỗi, cần biết tên trường để kiểm tra trạng thái disable ban đầu
  const isRequiredAndEmpty = (fieldValue, fieldName) => {
      // Chỉ hiển thị lỗi nếu showErrors=true VÀ trường đó KHÔNG bị disabled VÀ giá trị hiện tại là trống
      return showErrors && !isFieldDisabled(fieldName) && !fieldValue;
  }

  return (
    <section className="form-section health-info">
      {/* 1. Phần thông tin Đoàn sinh */}
      <h2 className="form-section__title">{t('participant_info_title')}</h2>

      {/* Cập nhật disabled và isRequiredAndEmpty để dùng tên trường */}
      <div className="form-section__grid">
        <div className="form-section__field">
          <label className="form-section__label">{t('main_info_last_name')}*</label>
          <input className="form-section__input" type="text"
            name="lastName"
            value={formData.mainInfo?.lastName || ''}
            disabled={isFieldDisabled('lastName')} // SỬA: dùng tên trường
            onChange={handleMainInfoChange}
          />
          {isRequiredAndEmpty(formData.mainInfo?.lastName, 'lastName') && ( // SỬA: dùng tên trường
            <p className="required-message">{t('required_field')}</p>
          )}
        </div>
        <div className="form-section__field">
          <label className="form-section__label">{t('main_info_given_name')}*</label>
          <input className="form-section__input" type="text"
            name="givenName"
            value={formData.mainInfo?.givenName || ''}
            disabled={isFieldDisabled('givenName')} // SỬA
            onChange={handleMainInfoChange}
          />
          {isRequiredAndEmpty(formData.mainInfo?.givenName, 'givenName') && ( // SỬA
            <p className="required-message">{t('required_field')}</p>
          )}
        </div>
      </div>

      <div className="form-section__grid">
        <div className="form-section__field">
          <label className="form-section__label">{t('main_info_city')}*</label>
          <input className="form-section__input" type="text"
            name="city"
            value={formData.mainInfo?.city || ''}
            disabled={isFieldDisabled('city')} // SỬA
            onChange={handleMainInfoChange}
          />
          {isRequiredAndEmpty(formData.mainInfo?.city, 'city') && ( // SỬA
            <p className="required-message">{t('required_field')}</p>
          )}
        </div>
        <div className="form-section__field">
          <label className="form-section__label">{t('main_info_state')}*</label>
          <input className="form-section__input" type="text"
            name="state"
            value={formData.mainInfo?.state || ''}
            disabled={isFieldDisabled('state')} // SỬA
            onChange={handleMainInfoChange}
          />
          {isRequiredAndEmpty(formData.mainInfo?.state, 'state') && ( // SỬA
            <p className="required-message">{t('required_field')}</p>
          )}
        </div>
        <div className="form-section__field">
          <label className="form-section__label">{t('main_info_zip')}*</label>
          <input className="form-section__input" type="text"
            name="zip"
            value={formData.mainInfo?.zip || ''}
            disabled={isFieldDisabled('zip')} // SỬA
            onChange={handleMainInfoChange}
          />
          {isRequiredAndEmpty(formData.mainInfo?.zip, 'zip') && ( // SỬA
            <p className="required-message">{t('required_field')}</p>
          )}
        </div>
      </div>

      <div className="form-section__grid">
        <div className="form-section__field">
          <label className="form-section__label">{t('main_info_cell_phone')}*</label>
          <input className="form-section__input" type="tel"
            name="cellPhone"
            value={formData.mainInfo?.cellPhone || ''}
            disabled={isFieldDisabled('cellPhone')} // SỬA
            onChange={handleMainInfoChange}
          />
          {isRequiredAndEmpty(formData.mainInfo?.cellPhone, 'cellPhone') && ( // SỬA
            <p className="required-message">{t('required_field')}</p>
          )}
        </div>
        <div className="form-section__field">
          <label className="form-section__label">{t('main_info_email')}*</label>
          <input className="form-section__input" type="email"
            name="email"
            value={formData.mainInfo?.email || ''}
            disabled={isFieldDisabled('email')} // SỬA
            onChange={handleMainInfoChange}
          />
          {isRequiredAndEmpty(formData.mainInfo?.email, 'email') && ( // SỬA
            <p className="required-message">{t('required_field')}</p>
          )}
        </div>
        <div className="form-section__field">
          <label className="form-section__label">{t('main_info_dob')}*</label>
          <input className="form-section__input" type="date"
            name="dob"
            value={formData.dob || ''}
            disabled={isFieldDisabled('dob')} // SỬA
            onChange={handleMainInfoChange}
          />
          {isRequiredAndEmpty(formData.dob, 'dob') && ( // SỬA
            <p className="required-message">{t('required_field')}</p>
          )}
        </div>
      </div>
      
      {/* ... Phần còn lại của component giữ nguyên ... */}

      <div className="form-section__grid">
        <div className="form-section__field minor-check-field">
          <label className="form-section__label">{t('health_minor')}</label>
          <div className="checkbox-display">
            <input type="checkbox" checked={isParticipantMinor} readOnly />
            <span className="checkbox-display__label">{isParticipantMinor ? t('yes') : t('no')}</span>
          </div>
        </div>
        <div className="form-section__field">
          <label className="form-section__label">{t('health_gender')}*</label>
          <div>
            <label>
              <input className="form-section__input" type="radio" name="gender" value="male" checked={gender === 'male'} onChange={handleGenderChange} />
              {t('gender_male')}
            </label>
            <label style={{ marginLeft: '20px' }}>
              <input className="form-section__input" type="radio" name="gender" value="female" checked={gender === 'female'} onChange={handleGenderChange} />
              {t('gender_female')}
            </label>
          </div>
          {showErrors && !gender && (
            <p className="required-message">{t('gender_required')}</p>
          )}
        </div>
      </div>

      <div className="form-section__grid">
        <div className="form-section__field">
          <label className="form-section__label">{t('health_parish')}</label>
          <input className="form-section__input" type="text" value={t('health_parish_value')} disabled />
        </div>
        <div className="form-section__field">
          <label className="form-section__label">{t('health_diocese')}</label>
          <input className="form-section__input" type="text" value={t('health_diocese_value')} disabled />
        </div>
      </div>

      <hr />

      {/* 2. Phần thông tin y tế */}
      <h2 className="form-section__title">{t('health_info_section_title')}</h2>

      <div className="form-section__grid">
        <div className="form-section__field">
          <label className="form-section__label">{t('doctor_label')}</label>
          <input className="form-section__input" type="text" name="doctor" value={formData.healthInfo.doctor || ''} onChange={handleHealthInfoChange} />
        </div>
        <div className="form-section__field">
          <label className="form-section__label">{t('doctor_phone_label')}</label>
          <input className="form-section__input" type="tel" name="doctorPhone" value={formData.healthInfo.doctorPhone || ''} onChange={handleHealthInfoChange} />
        </div>
      </div>

      <div className="form-section__grid">
        <div className="form-section__field">
          <label className="form-section__label">{t('insurance_co_label')}</label>
          <input className="form-section__input" type="text" name="insuranceCo" value={formData.healthInfo.insuranceCo || ''} onChange={handleHealthInfoChange} />
        </div>
        <div className="form-section__field">
          <label className="form-section__label">{t('insurance_id_label')}</label>
          <input className="form-section__input" type="text" name="insuranceId" value={formData.healthInfo.insuranceId || ''} onChange={handleHealthInfoChange} />
        </div>
        <div className="form-section__field">
          <label className="form-section__label">{t('insurance_group_label')}</label>
          <input className="form-section__input" type="text" name="insuranceGroup" value={formData.healthInfo.insuranceGroup || ''} onChange={handleHealthInfoChange} />
        </div>
        <div className="form-section__field">
          <label className="form-section__label">{t('insurance_cardholder_label')}</label>
          <input className="form-section__input" type="text" name="insuranceCardholder" value={formData.healthInfo.insuranceCardholder || ''} onChange={handleHealthInfoChange} />
        </div>
      </div>

      <div className="form-section__field">
        <label className="form-section__label">{t('health_allergies_label')}</label>
        <textarea className="form-section__textarea" name="allergies" value={formData.healthInfo.allergies || ''} onChange={handleHealthInfoChange} rows="4"></textarea>
      </div>

      <div className="form-section__field">
        <label className="form-section__label">{t('health_chronic_concerns_label')}</label>
        <textarea className="form-section__textarea" name="chronicConcerns" value={formData.healthInfo.chronicConcerns || ''} onChange={handleHealthInfoChange} rows="4"></textarea>
      </div>

      <div className="form-section__field">
        <label className="form-section__label">{t('health_physical_restrictions_label')}</label>
        <textarea className="form-section__textarea" name="physicalRestrictions" value={formData.healthInfo.physicalRestrictions || ''} onChange={handleHealthInfoChange} rows="4"></textarea>
      </div>

      <hr />

      {/* 3. Phần liên hệ khẩn cấp */}
      <h2 className="form-section__title">{t('emergency_contact_title')}</h2>

      <div className="form-section__grid">
        <div className="form-section__field">
          <label className="form-section__label">{t('emergency_contact_name_label')}*</label>
          <input className="form-section__input" type="text" name="name" value={formData.healthInfo.emergencyContact?.name || ''} onChange={handleEmergencyContactChange} />
          {showErrors && (!formData.healthInfo.emergencyContact?.name || formData.healthInfo.emergencyContact.name.trim() === '') && (
            <p className="required-message">{t('emergency_contact_name_required')}</p>
          )}
        </div>
        <div className="form-section__field">
          <label className="form-section__label">{t('emergency_contact_phone_label')}*</label>
          <input className="form-section__input" type="tel" name="phone" value={formData.healthInfo.emergencyContact?.phone || ''} onChange={handleEmergencyContactChange} />
          {showErrors && (!formData.healthInfo.emergencyContact?.phone || formData.healthInfo.emergencyContact.phone.trim() === '') && (
            <p className="required-message">{t('emergency_contact_phone_required')}</p>
          )}
        </div>
        <div className="form-section__field">
          <label className="form-section__label">{t('emergency_contact_relationship_label')}*</label>
          <input className="form-section__input" type="text" name="relationship" value={formData.healthInfo.emergencyContact?.relationship || ''} onChange={handleEmergencyContactChange} />
          {showErrors && (!formData.healthInfo.emergencyContact?.relationship || formData.healthInfo.emergencyContact.relationship.trim() === '') && (
            <p className="required-message">{t('emergency_contact_relationship_required')}</p>
          )}
        </div>
      </div>
    </section>
  );
});

export default HealthInfo;