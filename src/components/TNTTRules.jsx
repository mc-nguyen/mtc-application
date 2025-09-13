import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { useLanguage } from '../LanguageContext';
import SignaturePad from './SignaturePad';

const TNTTRules = forwardRef(({ formData, setFormData }, ref) => {
  const { t } = useLanguage();
  const [showErrors, setShowErrors] = useState(false);

  const handleSignatureChange = (dataUrl) => {
    setFormData(prev => ({
      ...prev,
      tnttRules: {
        ...prev.tnttRules,
        signature: dataUrl,
      },
    }));
  };

  useImperativeHandle(ref, () => ({
    validate: () => {
      const hasSignature = !!formData.tnttRules.signature;
      if (!hasSignature) {
        setShowErrors(true);
      } else {
        setShowErrors(false);
      }
      return hasSignature;
    }
  }));

  const signerName = `${formData.mainInfo.givenName || ''} ${formData.mainInfo.lastName || ''}`.trim();

  return (
    <div className="form-section">
      <h2>{t('tntt_rules_title')}</h2>
      
      <div dangerouslySetInnerHTML={{ __html: t('tntt_rules_content') }} />

      <SignaturePad
        content={t('tntt_rules_signature_content')}
        signerName={signerName}
        onSign={handleSignatureChange}
        existingSignature={formData.tnttRules.signature}
      />
      {showErrors && !formData.tnttRules.signature && (
        <p className="required-message">{t('rules_signature_required')}</p>
      )}
    </div>
  );
});

export default TNTTRules;