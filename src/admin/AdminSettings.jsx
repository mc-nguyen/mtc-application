// src/admin/AdminSettings.jsx - ĐƠN GIẢN HÓA
import React, { useState } from 'react';
import { useAdminSettings } from '../hooks/useAdminSettings';
import './Admin.css'; 
import AdminSettingsEdit from './AdminSettingsEdit';
import AdminSettingsView from './AdminSettingsView';

const AdminSettings = () => {
  const {
    settings,
    loading,
    error,
    saveSettings,
    updateLocalSetting,
    updateRegistrationTeam,
    addRegistrationTeamMember,
    removeRegistrationTeamMember,
    resetToInitial,
    hasLocalChanges,
  } = useAdminSettings();

  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    resetToInitial();
    setIsEditing(false);
  };

  const handleSave = async (settingsToSave) => {
    const result = await saveSettings(settingsToSave); 
    if (result.success) {
      alert('✅ Cài đặt đã được lưu thành công!');
      setIsEditing(false);
    } else {
      alert(`❌ Lỗi khi lưu cài đặt: ${result.error?.message || 'Unknown error'}`);
    }
  };

  // Hiển thị loading
  if (loading) {
    return (
      <div className="admin-settings">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Đang tải cài đặt...</p>
        </div>
      </div>
    );
  }

  // Hiển thị lỗi
  if (error) {
    return (
      <div className="admin-settings">
        <div className="error-state">
          <h3>❌ Lỗi</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Render chính
  return (
    <div className="admin-settings">
      {isEditing ? (
        <AdminSettingsEdit
          settings={settings}
          loading={loading}
          hasLocalChanges={hasLocalChanges}
          onSave={handleSave}
          onCancel={handleCancel}
          onUpdateSetting={updateLocalSetting}
          onUpdateRegistrationTeam={updateRegistrationTeam}
          onAddRegistrationTeamMember={addRegistrationTeamMember}
          onRemoveRegistrationTeamMember={removeRegistrationTeamMember}
        />
      ) : (
        <AdminSettingsView
          settings={settings}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
};

export default AdminSettings;