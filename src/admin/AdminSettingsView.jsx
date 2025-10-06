// src/admin/SettingsView.jsx - COMPONENT CHỈ ĐỂ XEM
import React from 'react';

const AdminSettingsView = ({ settings, onEdit }) => {
  const fullWidthStyle = { gridColumn: '1 / -1' };

  return (
    <div className="admin-settings">
      <div className="settings-header">
        <h3 className="settings-title">⚙️ Cài Đặt Ứng Dụng</h3>
        <button onClick={onEdit} className="edit-btn">
          ✏️ Thay Đổi Cài Đặt
        </button>
      </div>

      {/* 1. Phí Thành Viên & Đồng Phục */}
      <div className="settings-section">
        <h4 className="section-subtitle">Phí Thành Viên & Đồng Phục</h4>
        <div className="settings-grid">
          <div className="settings-field">
            <label>Phí Thường Niên ($)</label>
            <div className="view-value">${settings.annualFee || 0}</div>
          </div>
          <div className="settings-field">
            <label>Giá Áo Đồng Phục ($)</label>
            <div className="view-value">${settings.uniformShirtPrice || 0}</div>
          </div>
          <div className="settings-field">
            <label>Giá Váy/Quần Đồng Phục ($)</label>
            <div className="view-value">${settings.uniformSkortPrice || 0}</div>
          </div>
          <div className="settings-field">
            <label>Giá Khăn ($)</label>
            <div className="view-value">${settings.scarfPrice || 0}</div>
          </div>
        </div>
      </div>

      {/* 2. Cài Đặt Trại */}
      <div className="settings-section">
        <h4 className="section-subtitle">Thông Tin Trại & Đăng Ký</h4>
        <div className="settings-grid">
          <div className="settings-field">
            <label>Tên Trại</label>
            <div className="view-value">{settings.campName || 'Chưa có tên trại'}</div>
          </div>
          <div className="settings-field">
            <label>Địa Điểm</label>
            <div className="view-value">{settings.campLocation || 'Chưa có địa điểm'}</div>
          </div>
          <div className="settings-field">
            <label>Chi Phí</label>
            <div className="view-value">{settings.campCost || 'Chưa có thông tin chi phí'}</div>
          </div>
          <div className="settings-field checkbox-field">
            <label>
              <div className={`status-badge ${settings.isRegistrationOpen ? 'open' : 'closed'}`}>
                {settings.isRegistrationOpen ? '✅ Mở Đăng Ký' : '❌ Đóng Đăng Ký'}
              </div>
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
            <div className="view-value">{settings.chaplainName || 'Chưa có tên cha tuyên úy'}</div>
          </div>

          <div className="settings-field" style={fullWidthStyle}>
            <label>Đoàn Trưởng</label>
            <div className="view-value">
              {settings.troopLeaderName || 'Chưa có tên đoàn trưởng'}
              {settings.troopLeaderPhone && ` - ${settings.troopLeaderPhone}`}
            </div>
          </div>
        </div>
      </div>

      {/* 4. BAN GHI DANH */}
      <div className="settings-section">
        <h4 className="section-subtitle">Ban Ghi Danh (Tên & SĐT)</h4>
        
        {Array.isArray(settings.registrationTeam) && settings.registrationTeam.map((member, index) => (
          <div key={member.id} className="settings-grid registration-member-row view-mode">
            <div className="settings-field">
              <span className="view-value">{member.name || '(Chưa có tên)'}</span>
            </div>
            <div className="settings-field">
              <span className="view-value">{member.phone || '(Chưa có SĐT)'}</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* 5. BLACKLIST */}
      <div className="settings-section">
        <h4 className="section-subtitle">Danh Sách Chặn (Blacklist)</h4>
        <div className="settings-grid full-grid">
          <div className="settings-field" style={fullWidthStyle}>
            <label>SĐT Chặn</label>
            <div className="view-value multiline">
              {settings.blacklistPhones || 'Chưa có SĐT nào bị chặn'}
            </div>
          </div>
          <div className="settings-field" style={fullWidthStyle}>
            <label>Email Chặn</label>
            <div className="view-value multiline">
              {settings.blacklistEmails || 'Chưa có email nào bị chặn'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsView;