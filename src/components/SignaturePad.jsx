import React, { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import './FormSection.css';

function SignaturePad({ content, signerName, onSign, changeName, existingSignature }) {
  const sigCanvas = useRef({});
  const [isSigned, setIsSigned] = useState(!!existingSignature);
  const [currentSignerName, setCurrentSignerName] = useState(signerName || '');

  useEffect(() => {
    // Tải chữ ký đã có nếu người dùng quay lại chỉnh sửa
    if (existingSignature && sigCanvas.current) {
      sigCanvas.current.fromDataURL(existingSignature);
      setIsSigned(true);
    }
  }, [existingSignature]);

  // Cập nhật tên người ký nếu prop thay đổi (ví dụ: người dùng nhập tên ở form chính)
  useEffect(() => {
    if (signerName && signerName !== currentSignerName) {
      setCurrentSignerName(signerName);
      changeName(signerName);
    }
  }, [signerName, currentSignerName, changeName]);

  const clearSignature = () => {
    sigCanvas.current.clear();
    setIsSigned(false);
    onSign('');
  };

  const saveSignature = () => {
    if (!sigCanvas.current.isEmpty()) {
      const dataUrl = sigCanvas.current.toDataURL();
      setIsSigned(true);
      onSign(dataUrl);
    }
  };

  const handleNameChange = (e) => {
    changeName(e.target.value);
  };

  return (
    <section className="form-section signature-pad">
      <h2 className="signature-pad__title">{content}</h2>

      <div className="signature-pad__wrapper">
        <SignatureCanvas
          ref={sigCanvas}
          penColor="#d63384"
          backgroundColor="#f8f9fa"
          canvasProps={{
            className: 'signature-pad__canvas',
            width: 400,
            height: 200,
          }}
          onEnd={saveSignature}
        />
      </div>
      <div className="signature-info">
        <label className='form-section__label'>Người ký:</label>
        <input
          type="text"
          value={currentSignerName}
          onChange={handleNameChange}
          placeholder="Nhập tên người ký"
          className='form-section__input'
          required
        />
        <p className='form-section__label'>Ngày ký: **{new Date().toLocaleDateString('vi-VN')}**</p>
      </div>

      <div className="button-group">
        {isSigned && (
          <button className="signature-pad__clear" onClick={clearSignature}>
            Ký lại
          </button>
        )}
      </div>
    </section>
  );
}

export default SignaturePad;