import React, { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';

function SignaturePad({ content, signerName, onSign, existingSignature }) {
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
    }
  }, [signerName, currentSignerName]);

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
    setCurrentSignerName(e.target.value);
  };

  return (
    <div className="form-section">
      <div className="signature-content">
        <strong>{content}</strong>
      </div>

      <div className="signature-pad-container">
        <div className="signature-canvas-wrapper">
          <SignatureCanvas
            ref={sigCanvas}
            penColor="black"
            canvasProps={{ className: 'sigCanvas' }}
            onEnd={saveSignature}
          />
        </div>
        <div className="signature-info">
          <label>Người ký:</label>
          <input 
            type="text" 
            value={currentSignerName} 
            onChange={handleNameChange}
            placeholder="Nhập tên người ký"
            style={{ width: 'auto', display: 'inline' }}
            required
          />
          <p>Ngày ký: **{new Date().toLocaleDateString('vi-VN')}**</p>
        </div>
      </div>
      
      <div className="button-group">
        {isSigned && (
          <button onClick={clearSignature} className="secondary-button">
            Ký lại
          </button>
        )}
      </div>
    </div>
  );
}

export default SignaturePad;