// src/hooks/useCampRegistrationForm.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { saveCampDataToFirestore } from '../utils/firestoreUtils'; // Hàm lưu riêng cho camp

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

export const useCampRegistrationForm = (formData, setFormData, refs) => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);

    // Steps khác với form thường (bỏ Payment, Rules)
    const campSteps = [
        { name: t('step_dob') },
        { name: t('step_camp_info') }, 
        { name: t('step_health') }, 
        { name: t('step_waiver') }
    ];

    const handleNext = () => {
        let valid = true;

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
                // validate() trong CampInfo sẽ kiểm tra chữ ký và tên người ký
                return;
            }
        } else if (currentStep === 2) {
            if (refs.healthInfoRef.current && !refs.healthInfoRef.current.validate()) {
                // validate() trong CampInfo sẽ kiểm tra chữ ký và tên người ký
                return;
            }
        } else if (currentStep === 3) {
            if (refs.waiverReleaseRef.current && !refs.waiverReleaseRef.current.validate()) {
                return;
            }
        }

        setCurrentStep(prev => prev + 1);
        // window.scrollTo({ top: 0, behavior: 'auto' });
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
        // Validate final step
        if (refs.waiverReleaseRef.current && !refs.waiverReleaseRef.current.validate()) {
            return;
        }

        // LƯU DATA RIÊNG CHO CAMP
        const docId = await saveCampDataToFirestore(formData);

        if (docId) {
            console.log('Camp registration saved with ID:', docId);
            navigate('/save-form', { state: { formData, isCamp:true } });
        } else {
            console.error('Failed to save camp registration data.');
            alert('Có lỗi xảy ra khi lưu đơn đăng ký trại. Vui lòng thử lại.');
        }
    };

    return {
        currentStep,
        steps: campSteps, // Steps riêng cho camp
        handleNext,
        handleBack,
        handleDobChange,
        handleSubmit
    };
};