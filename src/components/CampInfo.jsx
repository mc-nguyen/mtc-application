import React, { useState, forwardRef, useImperativeHandle } from 'react';
import SignaturePad from './SignaturePad';
import { useLanguage } from '../LanguageContext';
import { useCampSettings } from '../hooks/useAdminSettings';
import './FormSection.css';

const CampInfo = forwardRef(({ formData, setFormData }, ref) => {
    const { t } = useLanguage();
    const { campInfo, loading } = useCampSettings();
    const [showErrors, setShowErrors] = useState(false);
    const [participantName, setParticipantName] = useState('');
    const isAdult = formData.isAdult;

    // 1. DI CHUYỂN HOOK useImperativeHandle LÊN TRÊN CÙNG
    // Hook này phải luôn được gọi.
    useImperativeHandle(ref, () => ({
        validate: () => {
            // Logic kiểm tra cần thiết cho bước này (tên người ký, chữ ký)
            const isSigned = !!formData.campInfo?.signature;
            const isSignerNamePresent = !!formData.campInfo?.signerName && formData.campInfo.signerName.trim() !== '';

            const isValid = isSigned && isSignerNamePresent;

            if (!isValid) {
                setShowErrors(true);
            } else {
                setShowErrors(false);
            }
            return isValid;
        }
    }));


    // 2. GIỮ NGUYÊN ĐIỀU KIỆN EARLY RETURN
    if (loading) {
        return <section className="form-section loading-section">Đang tải thông tin trại...</section>;
    }

    // 3. CÁC HÀM XỬ LÝ VÀ LOGIC KHÁC VẪN GIỮ NGUYÊN
    const primaryContact = campInfo.contacts[0] || {};
    const secondaryContact = campInfo.contacts[1] || {};

    const handleCampInfoChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            campInfo: {
                ...prev.campInfo,
                [name]: value,
            },
        }));
    };

    const handleSignatureChange = (dataUrl) => {
        setFormData(prev => ({
            ...prev,
            campInfo: {
                ...prev.campInfo,
                signature: dataUrl,
            },
        }));
    };

    const handleSignatureChangeName = (name) => {
        setFormData(prev => ({
            ...prev,
            campInfo: {
                ...prev.campInfo,
                signerName: name,
            },
        }));
    };

    const currentSignerName = formData.campInfo?.signerName || '';

    return (
        <section className="form-section camp-info">
            <h2 className="form-section__title">
                {t('camp_announcement_title')} "{campInfo.name || 'Trại'}"
            </h2>
            <p style={{ marginBottom: '1.5rem', color: '#6c757d' }}>
                Kính thưa Cha Trí, thầy Nam, quý trợ tá, và quý phụ huynh,
            </p>
            <p style={{ marginBottom: '1.5rem', color: '#6c757d' }}>
                Đoàn Thiếu Nhi Thánh Thể Mẹ Thiên Chúa, Riverside rất hân hạnh thông báo về Sa Mạc Đoàn thường niên sắp
                tới của đoàn. Năm nay, Sa Mạc Đoàn sẽ diễn ra tại trung tâm tĩnh tâm nằm trên núi với không khí trong lành và
                yên tĩnh. Đây sẽ là một cơ hội tuyệt vời cho tất cả mọi người, đặc biệt là các em Thiếu Nhi, để kết nối với Chúa
                Giêsu, với gia đình, và với bạn bè. Sa Mạc Đoàn sẽ được tổ chức tại địa điểm và thời gian dưới đây:
            </p>

            <h3 className="form-section__subtitle">📅 {t('event_details_title')} "{campInfo.name || 'Trại'}"</h3>
            <div className="form-section__grid">
                <div className="form-section__field">
                    <label className="form-section__label">📍 {t('event_location_label')}</label>
                    <p className="form-section__input" style={{ backgroundColor: '#e9ecef', fontWeight: 'bold' }}>{campInfo.location}</p>
                </div>
                <div className="form-section__field">
                    <label className="form-section__label">⏰ {t('event_time_label')}</label>
                    <p className="form-section__input" style={{ backgroundColor: '#e9ecef', fontWeight: 'bold' }}>{campInfo.time}</p>
                </div>
            </div>

            {/* ẨN PHẦN GIÁ CẢ */}
            <div className="form-section__field" style={{ marginBottom: '1.5rem' }}>
                <label className="form-section__label">💰 {t('camp_fees_title')}</label>
                <p className="form-section__input required-message" style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>
                    {t('fee_to_be_announced')}
                </p>
            </div>

            {/* --- Thông Tin Sự Kiện (Lấy từ Settings) --- */}
            <p style={{ marginBottom: '1.5rem', color: '#6c757d' }}>
                Chúng con kính mời quý Cha, quý thầy, quý Trợ Tá, quý phụ huynh, và các em cùng ghi danh tham gia Sa Mạc
                Đoàn bổ ích này. Hạn chót ghi danh là <strong>{campInfo.deadline}</strong>. Nguyện xin Chúa Giêsu Thánh Thể và Mẹ Maria
                ban muôn ơn lành trên gia đình quý vị.
            </p>
            <p style={{ marginBottom: '1.5rem', color: '#6c757d' }}>
                Mọi thắc mắc xin liên lạc qua số điện thoại:
            </p>

            <ul style={{ marginBottom: '1.5rem', color: '#6c757d' }}>
                <li>{primaryContact.name}: {primaryContact.phone}</li>
                {secondaryContact.name && <li>{secondaryContact.name}: {secondaryContact.phone}</li>}
            </ul>

            <hr className="divider" />

            <div className="form-section__field">
                <label className="form-section__label">
                    {isAdult ? t('participant_signature_name_label') : t('parent_signature_name_label')}*
                </label>
                <input
                    type="text"
                    name="signerName"
                    value={currentSignerName}
                    onChange={handleCampInfoChange}
                    placeholder={t('enter_full_name_for_signature')}
                    className="form-section__input"
                    required
                />
                {showErrors && (!currentSignerName || currentSignerName.trim() === '') && (
                    <p className="required-message">{t('name_required_text')}</p>
                )}
            </div>

            <br />

            {!isAdult && <div className="form-section__field">
                <label className="form-section__label">
                    {t('participant_name_label')}*
                </label>
                <input
                    type="text"
                    name="participantName"
                    value={participantName}
                    onChange={(e) => setParticipantName(e.target.value)}
                    placeholder={t('enter_participant_full_name')}
                    className="form-section__input"
                    required
                />
                {showErrors && (!currentSignerName || currentSignerName.trim() === '') && (
                    <p className="required-message">{t('name_required_text')}</p>
                )}
            </div>
            }

            <hr className="divider" />

            {/* --- Chữ Ký (Sử dụng SignaturePad) --- */}
            <div className="signature-section">
                <SignaturePad
                    content={isAdult ? t('adult_commitment_text') : t('minor_commitment_text')}
                    // Truyền tên đã nhập thủ công vào SignaturePad
                    signerName={currentSignerName}
                    onSign={handleSignatureChange}
                    changeName={handleSignatureChangeName}
                    existingSignature={formData.campInfo?.signature}
                />
                {showErrors && !formData.campInfo?.signature && (
                    <p className="required-message">{t('signature_required_text')}*</p>
                )}
            </div>
        </section>
    );
});

export default CampInfo;