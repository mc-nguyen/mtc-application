import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { useLanguage } from '../LanguageContext';
import './FormSection.css';

const HealthInfo = forwardRef(({ formData, setFormData }, ref) => {
  const { t } = useLanguage();
  const [showErrors, setShowErrors] = useState(false);
  const [gender, setGender] = useState(formData.healthInfo.gender || '');

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
      const { gender, emergencyContact } = formData.healthInfo;
      const isValid = (
        !!gender &&
        !!emergencyContact?.name && emergencyContact.name.trim() !== '' &&
        !!emergencyContact?.phone && emergencyContact.phone.trim() !== '' &&
        !!emergencyContact?.relationship && emergencyContact.relationship.trim() !== ''
      );

      if (!isValid) {
        setShowErrors(true);
      } else {
        setShowErrors(false);
      }
      return isValid;
    },
    getErrors: () => {
      const { gender, emergencyContact } = formData.healthInfo;
      const errs = {};
      if (!gender) errs.gender = t('gender_required');
      if (!emergencyContact.name) errs.name = t('emergency_contact_name_required');
      // …
      return errs;
    }
  }));

  return (
    <section className="form-section health-info">
      {/* 1. Phần thông tin Đoàn sinh */}
      <h2 className="form-section__title">{t('participant_info_title')}</h2>

      <div className="form-section__grid">
        <div className="form-section__field">
          <label className="form-section__label">{t('main_info_last_name')}</label>
          <input className="form-section__input" type="text" value={formData.mainInfo.lastName || ''} disabled />
        </div>
        <div className="form-section__field">
          <label className="form-section__label">{t('main_info_given_name')}</label>
          <input className="form-section__input" type="text" value={formData.mainInfo.givenName || ''} disabled />
        </div>
      </div>

      <div className="form-section__grid">
        <div className="form-section__field">
          <label className="form-section__label">{t('main_info_city')}</label>
          <input className="form-section__input" type="text" value={formData.mainInfo.city || ''} disabled />
        </div>
        <div className="form-section__field">
          <label className="form-section__label">{t('main_info_state')}</label>
          <input className="form-section__input" type="text" value={formData.mainInfo.state || ''} disabled />
        </div>
        <div className="form-section__field">
          <label className="form-section__label">{t('main_info_zip')}</label>
          <input className="form-section__input" type="text" value={formData.mainInfo.zip || ''} disabled />
        </div>
      </div>

      <div className="form-section__grid">
        <div className="form-section__field">
          <label className="form-section__label">{t('main_info_cell_phone')}</label>
          <input className="form-section__input" type="tel" value={formData.mainInfo.cellPhone || ''} disabled />
        </div>
        <div className="form-section__field">
          <label className="form-section__label">{t('main_info_email')}</label>
          <input className="form-section__input" type="email" value={formData.mainInfo.email || ''} disabled />
        </div>
        <div className="form-section__field">
          <label className="form-section__label">{t('main_info_dob')}</label>
          <input className="form-section__input" type="date" value={formData.dob || ''} disabled />
        </div>
      </div>

      <div className="form-section__grid">
        <div className="form-section__field">
          <label className="form-section__label">{t('health_minor')}</label>
          <input className="form-section__input" type="text" value={formData.isAdult ? t('no') : t('yes')} disabled />
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