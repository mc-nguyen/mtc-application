// src/hooks/useRegistrationForm.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { saveAllFormDataToFirestore } from '../utils/firestoreUtils';

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

export const useRegistrationForm = (formData, setFormData, refs) => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);

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
            if (refs.mainInfoRef.current && !refs.mainInfoRef.current.validate()) {
                return;
            }
            const { mainInfo, isAdult } = formData;
            const requiredFields = [
                'saintName', 'lastName', 'middleName', 'givenName',
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
        } else if (currentStep === 3) {
            if (refs.healthInfoRef.current && !refs.healthInfoRef.current.validate()) {
                return;
            }
        } else if (currentStep === 4) {
            if (refs.waiverReleaseRef.current && !refs.waiverReleaseRef.current.validate()) {
                return;
            }
        } else if (currentStep === 5) {
            if (refs.tnttRulesRef.current && !refs.tnttRulesRef.current.validate()) {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate the final step before submission
        if (refs.tnttRulesRef.current && !refs.tnttRulesRef.current.validate()) {
            return;
        }
        
        // Call the function to save data to Firestore
        const docId = await saveAllFormDataToFirestore(formData);

        if (docId) {
            console.log('Final Form data saved with ID:', docId);
            // Navigate to the thank-you page after successful save
            navigate('/thank-you', { state: { formData: formData } });
        } else {
            console.error('Failed to save form data to Firestore.');
            // Handle the error (e.g., show an error message to the user)
        }
    };

    return {
        currentStep,
        steps: [
            { name: t('step_dob') },
            { name: t('step_main_info') },
            { name: t('step_payment') },
            { name: t('step_health') },
            { name: t('step_waiver') },
            { name: t('step_rules') }
        ],
        handleNext,
        handleBack,
        handleDobChange,
        handleSubmit
    };
};