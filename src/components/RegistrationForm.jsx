import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import StepIndicator from './StepIndicator';
import MainInfo from './MainInfo';
import PaymentInfo from './PaymentInfo';
import HealthInfo from './HealthInfo';
import WaiverRelease from './WaiverRelease';
import TNTTRules from './TNTTRules';
import { useLanguage } from '../LanguageContext';

function RegistrationForm() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const mainInfoRef = useRef(null);
  const healthInfoRef = useRef(null);
  const waiverReleaseRef = useRef(null);
  const tnttRulesRef = useRef(null);

  const [formData, setFormData] = useState({
    dob: '',
    isAdult: false,
    mainInfo: {},
    paymentInfo: {
      annualFee: 50,
    },
    healthInfo: {},
    waiverRelease: {},
    tnttRules: false,
  });

  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { name: t('step_dob') },
    { name: t('step_main_info') },
    { name: t('step_payment') },
    { name: t('step_health') },
    { name: t('step_waiver') },
    { name: t('step_rules') }
  ];

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleNext = () => {
    if (currentStep === 0) {
      if (!formData.dob) {
        alert(t('required_field_alert') + t('dob_label'));
        return;
      }
      const age = calculateAge(formData.dob);
      if (age < 6 || age > 120) {
        alert(t('dob_age_limit'));
        return;
      }
    } else if (currentStep === 1) {
      const { mainInfo, isAdult } = formData;
      const requiredFields = [
        'sacredName', 'lastName', 'middleName', 'givenName',
        'city', 'state', 'zip', 'cellPhone',
        'emergencyContactName', 'emergencyContactPhone', 'email'
      ];
      if (!isAdult) {
        requiredFields.push('fatherName', 'motherName');
      }

      if (isAdult && (!mainInfo.nganh || mainInfo.nganh.trim() === '')) {
        alert(t('required_field_alert') + t('nganh_label'));
        return;
      }

      for (const field of requiredFields) {
        if (!mainInfo[field] || mainInfo[field].trim() === '') {
          alert(t('required_field_alert') + t('main_info_' + field.replace(/([A-Z])/g, '_$1').toLowerCase()));
          return;
        }
      }

      // Kiểm tra chữ ký của MainInfo
      if (mainInfoRef.current && !mainInfoRef.current.validate()) {
        return; // Dừng lại nếu validation thất bại
      }
    } else if (currentStep === 3) {
      if (healthInfoRef.current && !healthInfoRef.current.validate()) {
        return; // Dừng lại nếu validation thất bại
      }
    } else if (currentStep === 4) {
      if (waiverReleaseRef.current && !waiverReleaseRef.current.validate()) {
        return;
      }
    } else if (currentStep === 5) {
      if (tnttRulesRef.current && !tnttRulesRef.current.validate()) { // <-- Thêm logic validation
        return;
      }
    }

    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleDobChange = (e) => {
    const dob = e.target.value;
    const age = calculateAge(dob);

    setFormData(prev => ({
      ...prev,
      dob: dob,
      isAdult: age >= 18,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tnttRulesRef.current && !tnttRulesRef.current.validate()) { // <-- Thêm logic validation
      return;
    }
    console.log('Final Form data:', formData);
    navigate('/thank-you', { state: { formData: formData } });
  };

  const renderStepComponent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="form-section">
            <h2>{t('dob_step_title')}</h2>
            <label>{t('dob_label')}</label>
            <input type="date" value={formData.dob} onChange={handleDobChange} required />
          </div>
        );
      case 1:
        return <MainInfo ref={mainInfoRef} formData={formData} setFormData={setFormData} />;
      case 2:
        return <PaymentInfo formData={formData} setFormData={setFormData} />;
      case 3:
        return <HealthInfo ref={healthInfoRef} formData={formData} setFormData={setFormData} />
      case 4:
        return <WaiverRelease ref={waiverReleaseRef} formData={formData} setFormData={setFormData} />;
      case 5:
        return <TNTTRules ref={tnttRulesRef} formData={formData} setFormData={setFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="registration-container">
      <h1>{t('form_title')}</h1>
      <StepIndicator currentStep={currentStep} steps={steps} />
      {renderStepComponent()}

      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
        {currentStep > 0 && <button type="button" onClick={handleBack}>{t('back_btn')}</button>}
        {currentStep < steps.length - 1 ? (
          <button type="button" onClick={handleNext} style={{ marginLeft: 'auto' }}>{t('next_btn')}</button>
        ) : (
          <button type="button" onClick={handleSubmit} style={{ backgroundColor: '#28a745', marginLeft: 'auto' }}>{t('submit_btn')}</button>
        )}
      </div>
    </div>
  );
}

export default RegistrationForm;