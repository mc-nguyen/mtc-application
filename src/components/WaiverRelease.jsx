import React, { useState, forwardRef, useImperativeHandle } from 'react';
import SignaturePad from './SignaturePad';
import { useLanguage } from '../LanguageContext';
import { generateWaiverInitials, validateWaiver } from '../utils/waiverUtils'; // Import các hàm tiện ích
import './FormSection.css';

const WaiverRelease = forwardRef(({ formData, setFormData }, ref) => {
  const { t } = useLanguage();
  const [initials, setInitials] = useState({});
  const [showErrors, setShowErrors] = useState(false);

  const participantName = `${formData.mainInfo.givenName || ''} ${formData.mainInfo.lastName || ''}`.trim();
  const parentName = formData.mainInfo.parentName || '';

  const handleInitialChange = (key) => {
    const initialSig = generateWaiverInitials(formData);
    setInitials(prev => ({
      ...prev,
      [key]: initialSig,
    }));
  };
  
  const handleParentNameChange = (e) => {
    setFormData(prev => ({
      ...prev,
      mainInfo: {
        ...prev.mainInfo,
        parentName: e.target.value,
      },
    }));
  };

  const handleSignatureChange = (dataUrl) => {
    setFormData(prev => ({
      ...prev,
      waiverRelease: {
        ...prev.waiverRelease,
        signature: dataUrl,
      },
    }));
  };

  const handleSignatureChangeName = (name) => {
    setFormData(prev => ({
      ...prev,
      waiverRelease: {
        ...prev.waiverRelease,
        signatureName: name,
      },
    }));
  };

  const initialSections = t('waiver_sections_with_initials');
  const nameToDisplay = formData.isAdult ? participantName : parentName;

  useImperativeHandle(ref, () => ({
    validate: () => {
      const isValid = validateWaiver(formData, initials, initialSections);
      setShowErrors(!isValid);
      return isValid;
    }
  }));

  return (
    <div className="form-section">
      <h2>{t('waiver_title')}</h2>
      
      {!formData.isAdult && (
        <div className="form-group">
          <label htmlFor="parentName">{t('parent_name_label')}</label>
          <input
            type="text"
            id="parentName"
            name="parentName"
            value={parentName}
            onChange={handleParentNameChange}
            required
            className="form-section__input"
          />
          {showErrors && (!parentName || parentName.trim() === '') && (
            <p className="required-message">{t('parent_name_required')}</p>
          )}
        </div>
      )}

      <div className="waiver-name-section">
        <p>
          {t('waiver_intro_part1')}
          <strong> {nameToDisplay}</strong>
          <span dangerouslySetInnerHTML={{ __html: t('waiver_intro_part2') }} />
        </p>
      </div>

      <div className="waiver-content-container">
        <p>
          {t('waiver_full_text_part1')}
          <strong>{nameToDisplay}</strong>
          {t('waiver_full_text_part2')}
        </p>
        {initialSections.map((section) => (
          <div key={section.initialKey} className="initial-item-container">
            <p><span dangerouslySetInnerHTML={{ __html: section.text }} /></p>
            <div className="initial-item">
              <label>{t('waiver_initial_prompt')}:</label>
              {initials[section.initialKey] ? (
                <span className="initial-box">{initials[section.initialKey]}</span>
              ) : (
                <button type="button" onClick={() => handleInitialChange(section.initialKey)} className="initial-btn">{t('sign_initial_btn')}</button>
              )}
            </div>
            {showErrors && !initials[section.initialKey] && (
              <p className="required-message">{t('initial_required_text')}</p>
            )}
          </div>
        ))}
        <p>{t('waiver_final_section1')}</p>
        <p>{t('waiver_final_section2')}</p>
        <p>{t('waiver_final_section3')}</p>
        <div dangerouslySetInnerHTML={{ __html: t('waiver_final_section4') }} />
      </div>

      <div className="signature-section">
        <SignaturePad
          content={t('waiver_content')}
          signerName={nameToDisplay}
          onSign={handleSignatureChange}
          changeName={handleSignatureChangeName}
          existingSignature={formData.waiverRelease.signature}
        />
        {showErrors && !formData.waiverRelease.signature && (
          <p className="required-message">{t('signature_required_text')}</p>
        )}
      </div>
    </div>
  );
});

export default WaiverRelease;