import React, { useState, useRef, useEffect } from 'react';
import StepIndicator from '../components/StepIndicator';
import MainInfo from '../components/MainInfo';
import PaymentInfo from '../components/PaymentInfo';
import HealthInfo from '../components/HealthInfo';
import WaiverRelease from '../components/WaiverRelease';
import TNTTRules from '../components/TNTTRules';
import { useLanguage } from '../LanguageContext';
import { useRegistrationForm } from '../hooks/useRegistrationForm';
import './RegistrationForm.css'; // Đảm bảo import file CSS mới

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
          <section className="form-step-section">
            <h2 className="form-step-title">{t('dob_step_title')}</h2>
            <label className="form-label">{t('dob_label')}</label>
            <input type="date" value={formData.dob} onChange={handleDobChange} required className="form-input" />
          </section>
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
    <section className="registration-form">
      <h1 className="form-title">{t('form_title')}</h1>
      <StepIndicator currentStep={currentStep} steps={steps} />
      {renderStepComponent()}

      <div className="form-controls">
        {currentStep > 0 && <button type="button" onClick={handleBack}>{t('back_btn')}</button>}
        {currentStep < steps.length - 1 ? (
          <button type="button" onClick={handleNext} className="next-btn">{t('next_btn')}</button>
        ) : (
          <button type="button" onClick={handleSubmit} className="submit-btn">
            {t('submit_btn')}
          </button>
        )}
      </div>
    </section>
  );
}

export default RegistrationForm;