import React, { useState, useRef, useEffect } from 'react';
import StepIndicator from '../components/StepIndicator';
import CampInfo from '../components/CampInfo';
import HealthInfo from '../components/HealthInfo';
import WaiverRelease from '../components/WaiverRelease';
import { useLanguage } from '../LanguageContext';
import { useCampRegistrationForm } from '../hooks/useCampRegistrationForm';
import './CampRegistrationForm.css'; // Đảm bảo import file CSS mới

function CampRegistrationForm() {
  const { t } = useLanguage();
  const mainInfoRef = useRef(null);
  const healthInfoRef = useRef(null);
  const waiverReleaseRef = useRef(null);

  const [formData, setFormData] = useState({
    dob: '',
    isAdult: false,
    campInfo: {},
    healthInfo: {
      emergencyContact: {
        name: '',
        phone: '',
        relationship: ''
      }
    },
    waiverRelease: {},
  });

  const refs = { mainInfoRef, healthInfoRef, waiverReleaseRef };
  const {
    currentStep,
    steps,
    handleNext,
    handleBack,
    handleDobChange,
    handleSubmit,
  } = useCampRegistrationForm(formData, setFormData, refs);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const renderStepComponent = () => {
    switch (currentStep) {
      case 0:
        return (
          <section className="form-step-section">
            <h2 className="form-step-title">{t('camp_dob_step_title')}</h2>
            <label className="form-label">{t('dob_label')}</label>
            <input type="date" value={formData.dob} onChange={handleDobChange} className="form-input" required />
          </section>
        );
      case 1:
        return <CampInfo
          ref={mainInfoRef} // Vẫn dùng mainInfoRef cho tiện, nhưng giờ nó trỏ đến CampInfo
          formData={formData}
          setFormData={setFormData}
        />;
      case 2:
        return <HealthInfo
          ref={healthInfoRef}
          formData={formData}
          setFormData={setFormData}
        />;
      case 3:
        return <WaiverRelease
          ref={waiverReleaseRef}
          formData={formData}
          setFormData={setFormData}
        />;
      default:
        return null;
    }
  };

  return (
    <section className="camp-form">
      <h1 className="form-title">Sa Mạc Bình Minh 15</h1>
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

export default CampRegistrationForm;