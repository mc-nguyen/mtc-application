import React, { useState, useRef, useEffect } from 'react';
import StepIndicator from '../components/StepIndicator';
import MainInfo from '../components/MainInfo';
import PaymentInfo from '../components/PaymentInfo';
import HealthInfo from '../components/HealthInfo';
import WaiverRelease from '../components/WaiverRelease';
import TNTTRules from '../components/TNTTRules';
import { useLanguage } from '../LanguageContext';
import { useRegistrationForm } from '../hooks/useRegistrationForm'; // Import custom hook mới

function RegistrationForm() {
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

  const refs = { mainInfoRef, healthInfoRef, waiverReleaseRef, tnttRulesRef };
  const {
    currentStep,
    steps,
    handleNext,
    handleBack,
    handleDobChange,
    handleSubmit,
  } = useRegistrationForm(formData, setFormData, refs);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);


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