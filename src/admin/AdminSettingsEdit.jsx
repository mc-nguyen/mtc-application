// src/admin/SettingsEdit.jsx - COMPONENT CHỈ ĐỂ CHỈNH SỬA
import React from 'react';

const RegistrationTeamMemberEdit = ({ member, index, updateHandler, removeHandler, isRemovable }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateHandler(index, name, value);
  };

  return (
    <div className="settings-grid registration-member-row">
      <div className="settings-field">
        <input
          type="text"
          name="name"
          value={member.name || ''}
          onChange={handleInputChange}
          className="settings-input"
          placeholder="Tên Thành Viên"
        />
      </div>
      <div className="settings-field">
        <input
          type="text"
          name="phone"
          value={member.phone || ''}
          onChange={handleInputChange}
          className="settings-input"
          placeholder="Số Điện Thoại"
        />
      </div>
      {isRemovable && (
        <button
          type="button"
          onClick={() => removeHandler(member.id)}
          className="remove-btn"
          title="Xóa thành viên này"
        >
          &times;
        </button>
      )}
    </div>
  );
};

const AdminSettingsEdit = ({ 
  settings, 
  loading, 
  hasLocalChanges, 
  onSave, 
  onCancel, 
  onUpdateSetting, 
  onUpdateRegistrationTeam, 
  onAddRegistrationTeamMember, 
  onRemoveRegistrationTeamMember 
}) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;
    
    if (type === 'number') {
        newValue = value === '' ? '' : Number(value); 
    }
    
    onUpdateSetting(name, newValue);
  };

  const handleSave = () => {
    const annualFee = Number(settings.annualFee);
    const uniformShirtPrice = Number(settings.uniformShirtPrice);
    
    if (annualFee < 0 || uniformShirtPrice < 0) {
      alert('❌ Phí không thể là số âm!');
      return;
    }

    const settingsToSave = {
        ...settings,
        annualFee: annualFee,
        uniformShirtPrice: uniformShirtPrice,
        uniformSkortPrice: Number(settings.uniformSkortPrice),
        scarfPrice: Number(settings.scarfPrice),
    };

    onSave(settingsToSave);
  };

  const fullWidthStyle = { gridColumn: '1 / -1' };

  return (
    <div className="admin-settings">
      <div className="settings-header">
        <h3 className="settings-title">✏️ Chỉnh Sửa Cài Đặt</h3>
        <div className="edit-actions">
          <button onClick={onCancel} className="cancel-btn">
            ❌ Hủy
          </button>
          <button 
            onClick={handleSave} 
            className="save-btn"
            disabled={loading || !hasLocalChanges}
          >
            {loading ? '💾 Đang lưu...' : '💾 Lưu Cài Đặt'}
          </button>
        </div>
      </div>

      {/* Thông báo có thay đổi */}
      {hasLocalChanges && (
        <div className="changes-notice">
          ⚠️ Bạn có thay đổi chưa lưu
        </div>
      )}

      {/* 1. Phí Thành Viên & Đồng Phục */}
      <div className="settings-section">
        <h4 className="section-subtitle">Phí Thành Viên & Đồng Phục</h4>
        <div className="settings-grid">
          <div className="settings-field">
            <label>Phí Thường Niên ($)</label>
            <input type="number" name="annualFee" value={settings.annualFee || ''} onChange={handleChange} className="settings-input" />
          </div>
          <div className="settings-field">
            <label>Giá Áo Đồng Phục ($)</label>
            <input type="number" name="uniformShirtPrice" value={settings.uniformShirtPrice || ''} onChange={handleChange} className="settings-input" />
          </div>
          <div className="settings-field">
            <label>Giá Váy/Quần Đồng Phục ($)</label>
            <input type="number" name="uniformSkortPrice" value={settings.uniformSkortPrice || ''} onChange={handleChange} className="settings-input" />
          </div>
          <div className="settings-field">
            <label>Giá Khăn ($)</label>
            <input type="number" name="scarfPrice" value={settings.scarfPrice || ''} onChange={handleChange} className="settings-input" />
          </div>
        </div>
      </div>

      {/* 2. Cài Đặt Trại */}
      <div className="settings-section">
        <h4 className="section-subtitle">Thông Tin Trại & Đăng Ký</h4>
        <div className="settings-grid">
          <div className="settings-field">
            <label>Tên Trại</label>
            <input type="text" name="campName" value={settings.campName || ''} onChange={handleChange} className="settings-input" />
          </div>
          <div className="settings-field">
            <label>Địa Điểm</label>
            <input type="text" name="campLocation" value={settings.campLocation || ''} onChange={handleChange} className="settings-input" />
          </div>
          <div className="settings-field">
            <label>Chi Phí</label>
            <input type="text" name="campCost" value={settings.campCost || ''} onChange={handleChange} className="settings-input" />
          </div>
          <div className="settings-field checkbox-field">
            <label>
              <input type="checkbox" name="isRegistrationOpen" checked={!!settings.isRegistrationOpen} onChange={handleChange} />
              Mở Đăng Ký
            </label>
          </div>
        </div>
      </div>
      
      {/* 3. THÔNG TIN LÃNH ĐẠO */}
      <div className="settings-section">
        <h4 className="section-subtitle">Thông Tin Lãnh Đạo</h4>
        <div className="settings-grid">
          <div className="settings-field" style={fullWidthStyle}>
            <label>Tên Cha Tuyên Úy</label>
            <input type="text" name="chaplainName" value={settings.chaplainName || ''} onChange={handleChange} className="settings-input" />
          </div>

          <div className="settings-field" style={fullWidthStyle}>
            <label>Đoàn Trưởng</label>
            <div className="settings-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <input type="text" name="troopLeaderName" value={settings.troopLeaderName || ''} onChange={handleChange} className="settings-input" placeholder="Tên Đoàn Trưởng" />
              <input type="text" name="troopLeaderPhone" value={settings.troopLeaderPhone || ''} onChange={handleChange} className="settings-input" placeholder="Số Điện Thoại" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. BAN GHI DANH */}
      <div className="settings-section">
        <h4 className="section-subtitle">Ban Ghi Danh (Tên & SĐT)</h4>
        
        {Array.isArray(settings.registrationTeam) && settings.registrationTeam.map((member, index) => (
          <RegistrationTeamMemberEdit
            key={member.id}
            member={member}
            index={index}
            updateHandler={onUpdateRegistrationTeam}
            removeHandler={onRemoveRegistrationTeamMember}
            isRemovable={settings.registrationTeam.length > 1}
          />
        ))}

        <button
          type="button"
          onClick={onAddRegistrationTeamMember}
          className="add-member-btn"
        >
          + Thêm Thành Viên Ban Ghi Danh
        </button>
      </div>
      
      {/* 5. BLACKLIST */}
      <div className="settings-section">
        <h4 className="section-subtitle">Danh Sách Chặn (Blacklist)</h4>
        <div className="settings-grid full-grid">
          <div className="settings-field" style={fullWidthStyle}>
            <label>SĐT Chặn (Ngăn cách bằng dấu phẩy)</label>
            <textarea
              name="blacklistPhones"
              value={settings.blacklistPhones || ''}
              onChange={handleChange}
              rows="4"
              className="settings-input"
              placeholder="Ví dụ: 1234567890, 0987654321"
            ></textarea>
          </div>
          <div className="settings-field" style={fullWidthStyle}>
            <label>Email Chặn (Ngăn cách bằng dấu phẩy)</label>
            <textarea
              name="blacklistEmails"
              value={settings.blacklistEmails || ''}
              onChange={handleChange}
              rows="4"
              className="settings-input"
              placeholder="Ví dụ: user@example.com, block@test.net"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsEdit;