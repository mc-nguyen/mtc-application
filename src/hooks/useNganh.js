import { useLanguage } from '../LanguageContext';

export const useNganh = (dob) => {
    const { t } = useLanguage();

    const calculateAge = () => {
        if (!dob) return null;
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const getNganhByAge = (age) => {
        if (age === 6) return t('nganh_aunhi_du_bi');
        if (age === 7) return t('nganh_aunhi_cap_1');
        if (age === 8) return t('nganh_aunhi_cap_2');
        if (age === 9) return t('nganh_aunhi_cap_3');
        if (age === 10) return t('nganh_thieunhi_cap_1');
        if (age === 11) return t('nganh_thieunhi_cap_2');
        if (age === 12) return t('nganh_thieunhi_cap_3');
        if (age === 13) return t('nganh_nghiasi_cap_1');
        if (age === 14) return t('nganh_nghiasi_cap_2');
        if (age === 15) return t('nganh_nghiasi_cap_3');
        if (age === 16) return t('nganh_hiepsi_cap_1');
        if (age === 17) return t('nganh_hiepsi_cap_2');
        return t('nganh_invalid');
    };

    const age = calculateAge();
    const nganh = age !== null ? getNganhByAge(age) : '';

    return { age, nganh };
};