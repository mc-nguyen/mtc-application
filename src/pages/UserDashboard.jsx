// src/pages/UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { useLanguage } from '../LanguageContext';
import { doc, deleteDoc, collection } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

function UserDashboard() {
  const navigate = useNavigate();
  const { currentUser, isAdmin, logout, getUserForms, getAllForms } = useAuth();
  const { t } = useLanguage();
  
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (currentUser) {
      loadForms();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const loadForms = async () => {
    try {
      let userForms;
      if (isAdmin) {
        userForms = await getAllForms();
      } else {
        userForms = await getUserForms();
      }
      setForms(userForms);
    } catch (error) {
      console.error('Error loading forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (formId, formType) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đơn đăng ký này?')) {
      return;
    }

    setDeletingId(formId);
    try {
      const collectionPath = formType === 'membership' 
        ? collection(db, 'artifacts', 'mtc-applications', 'public', 'data', 'formSubmissions')
        : collection(db, 'artifacts', 'mtc-applications', 'public', 'data', 'campSubmissions');

      await deleteDoc(doc(collectionPath, formId));
      setForms(forms.filter(form => form.id !== formId));
      alert('✅ Xóa đơn đăng ký thành công!');
    } catch (error) {
      console.error('Error deleting form:', error);
      alert('❌ Có lỗi xảy ra khi xóa đơn đăng ký!');
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewDetails = (form) => {
    // Có thể phát triển trang chi tiết sau
    alert(`Xem chi tiết đơn ${form.id}`);
  };

  const handlePrintForm = (form) => {
    // Có thể tích hợp PDFGenerator sau
    alert(`In đơn ${form.id}`);
  };

  if (!currentUser) {
    return (
      <div className="thank-you-container">
        <h2>🔒 Vui lòng đăng nhập</h2>
        <p>Bạn cần đăng nhập để xem dashboard.</p>
        <button onClick={() => navigate('/login')} className="primary-btn">
          Đăng nhập ngay
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="thank-you-container">
        <h2>⏳ Đang tải dữ liệu...</h2>
      </div>
    );
  }

  return (
    <div className="registration-container">
      <div className="form-section">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h2>📊 Dashboard của {currentUser.email}</h2>
            <p>Quản lý đơn đăng ký của bạn</p>
            {isAdmin && <span className="admin-badge">👑 Quản trị viên</span>}
          </div>
          <div className="header-actions">
            <button onClick={logout} className="secondary-button">
              🚪 Đăng xuất
            </button>
          </div>
        </div>

        {/* Forms List */}
        <div className="forms-section">
          <div className="section-header">
            <h3>📋 Đơn đăng ký ({forms.length})</h3>
            <button onClick={loadForms} className="secondary-button">
              🔄 Làm mới
            </button>
          </div>

          {forms.length === 0 ? (
            <div className="empty-state">
              <p>📝 Chưa có đơn đăng ký nào.</p>
              <div className="button-group">
                <button 
                  onClick={() => navigate('/registration')}
                  className="primary-btn"
                >
                  🎯 Đăng ký thành viên
                </button>
                <button 
                  onClick={() => navigate('/binh-minh')}
                  className="secondary-button"
                >
                  🏕️ Đăng ký trại Bình Minh
                </button>
              </div>
            </div>
          ) : (
            <div className="forms-grid">
              {forms.map((form, index) => (
                <div key={form.id} className="form-card">
                  <div className="form-card-header">
                    <h4>📄 Đơn #{index + 1}</h4>
                    <span className={`form-type-badge ${form.type}`}>
                      {form.type === 'membership' ? '🎯 Thành viên' : '🏕️ Trại'}
                    </span>
                  </div>
                  
                  <div className="form-info">
                    <p><strong>👤:</strong> {form.mainInfo?.givenName} {form.mainInfo?.lastName}</p>
                    <p><strong>📅 Ngày đăng ký:</strong> {new Date(form.submissionDate).toLocaleDateString('vi-VN')}</p>
                    <p><strong>💰 Trạng thái:</strong> 
                      <span className={form.paid ? 'status-paid' : 'status-unpaid'}>
                        {form.paid ? ' ✅ Đã thanh toán' : ' ❌ Chưa thanh toán'}
                      </span>
                    </p>
                  </div>

                  <div className="form-actions">
                    <button 
                      onClick={() => handleViewDetails(form)}
                      className="action-btn view-btn"
                    >
                      👁️ Xem
                    </button>
                    
                    <button 
                      onClick={() => handlePrintForm(form)}
                      className="action-btn print-btn"
                    >
                      🖨️ In
                    </button>

                    {isAdmin && (
                      <button 
                        onClick={() => handleDelete(form.id, form.type)}
                        disabled={deletingId === form.id}
                        className="action-btn delete-btn"
                      >
                        {deletingId === form.id ? '⏳...' : '🗑️ Xóa'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Admin Stats */}
        {isAdmin && forms.length > 0 && (
          <div className="admin-stats">
            <h3>📊 Thống kê tổng quan</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">{forms.length}</span>
                <span className="stat-label">Tổng đơn</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{forms.filter(f => f.type === 'membership').length}</span>
                <span className="stat-label">Thành viên</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{forms.filter(f => f.type === 'camp').length}</span>
                <span className="stat-label">Trại</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{forms.filter(f => f.paid).length}</span>
                <span className="stat-label">Đã thanh toán</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;