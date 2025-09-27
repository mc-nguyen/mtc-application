import React, { useState, useRef, useEffect } from 'react';
import StepIndicator from '../components/StepIndicator';
import MainInfo from '../components/MainInfo';
import HealthInfo from '../components/HealthInfo';
import WaiverRelease from '../components/WaiverRelease';
import { useLanguage } from '../LanguageContext';
import { useCampRegistrationForm } from '../hooks/useCampRegistrationForm';

function CampRegistrationForm() {
  const { t } = useLanguage();
  const mainInfoRef = useRef(null);
  const healthInfoRef = useRef(null);
  const waiverReleaseRef = useRef(null);

  // FORM DATA RIÊNG CHO CAMP - có thể có field khác
  const [formData, setFormData] = useState({
    dob: '',
    isAdult: false,
    mainInfo: {},
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
          <div className="form-section">
            <h2>{t('camp_dob_step_title')}</h2>
            <label>{t('dob_label')}</label>
            <input type="date" value={formData.dob} onChange={handleDobChange} required />
          </div>
        );
      case 1:
        return <MainInfo
          ref={mainInfoRef}
          formData={formData}
          setFormData={setFormData}
          isCamp={true} // Truyền prop để component biết là camp
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
          isCamp={true} // Truyền prop để component biết là camp
        />;
      default:
        return null;
    }
  };

  return (
    <div className="registration-container">
      <h1>{t('camp_form_title')}</h1>
      <StepIndicator currentStep={currentStep} steps={steps} />
      {renderStepComponent()}

      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
        {currentStep > 0 && <button type="button" onClick={handleBack}>{t('back_btn')}</button>}
        {currentStep < steps.length - 1 ? (
          <button type="button" onClick={handleNext} style={{ marginLeft: 'auto' }}>{t('next_btn')}</button>
        ) : (
          <button type="button" onClick={handleSubmit} style={{ backgroundColor: '#28a745', marginLeft: 'auto' }}>
            {t('submit_btn')}
          </button>
        )}
      </div>
    </div>
  );
}

export default CampRegistrationForm;