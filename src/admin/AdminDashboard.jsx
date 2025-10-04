// src/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { useAdminAuth } from './AdminAuthContext'; // Sử dụng context admin
import './Admin.css'; // Đảm bảo import style
import AdminSettings from './AdminSettings';
import AdminRegistration from './AdminRegistration';
import { AdminCamp } from './AdminCamp';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('members');
  const [members, setMembers] = useState([]);
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedCamp, setSelectedCamp] = useState(null);
  const { currentUser, isAdmin, logout } = useAdminAuth();
  const [currentTab, setCurrentTab] = useState('forms');

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const fetchData = async () => {
    try {
      // Fetch membership registrations
      const membersQuery = query(
        collection(db, 'artifacts', 'mtc-applications', 'public', 'data', 'formSubmissions'),
        orderBy('submissionDate', 'desc')
      );
      const membersSnapshot = await getDocs(membersQuery);
      const membersData = membersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMembers(membersData);

      // Fetch camp registrations
      const campsQuery = query(
        collection(db, 'artifacts', 'mtc-applications', 'public', 'data', 'campSubmissions'),
        orderBy('submissionDate', 'desc')
      );
      const campsSnapshot = await getDocs(campsQuery);
      const campsData = campsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCamps(campsData);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, type) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bản ghi này?')) {
      try {
        const collectionPath = type === 'member'
          ? collection(db, 'artifacts', 'mtc-applications', 'public', 'data', 'formSubmissions')
          : collection(db, 'artifacts', 'mtc-applications', 'public', 'data', 'campSubmissions');

        await deleteDoc(doc(collectionPath, id));
        fetchData();
        alert('Xóa thành công!');

        if (type === 'member' && selectedMember && selectedMember.id === id) {
          setSelectedMember(null);
        } else if (type === 'camp' && selectedCamp && selectedCamp.id === id) {
          setSelectedCamp(null);
        }
      } catch (error) {
        console.error('Lỗi khi xóa:', error);
        alert('Có lỗi xảy ra khi xóa!');
      }
    }
  };

  const handlePaidToggle = async (memberId, currentPaidStatus) => {
    try {
      const memberRef = doc(db, 'artifacts', 'mtc-applications', 'public', 'data', 'formSubmissions', memberId);
      await updateDoc(memberRef, {
        paid: !currentPaidStatus
      });

      // Update local state
      setMembers(members.map(member =>
        member.id === memberId
          ? { ...member, paid: !currentPaidStatus }
          : member
      ));

      if (selectedMember && selectedMember.id === memberId) {
        setSelectedMember({ ...selectedMember, paid: !currentPaidStatus });
      }

      alert('Cập nhật trạng thái thanh toán thành công!');
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error);
      alert('Có lỗi xảy ra khi cập nhật!');
    }
  };

  const handleCampPaidToggle = async (campId, currentPaidStatus) => {
    try {
      const campRef = doc(db, 'artifacts', 'mtc-applications', 'public', 'data', 'campSubmissions', campId);
      await updateDoc(campRef, {
        paid: !currentPaidStatus
      });

      // Update local state
      setCamps(camps.map(camp =>
        camp.id === campId
          ? { ...camp, paid: !currentPaidStatus }
          : camp
      ));

      if (selectedCamp && selectedCamp.id === campId) {
        setSelectedCamp({ ...selectedCamp, paid: !currentPaidStatus });
      }

      alert('Cập nhật trạng thái thanh toán thành công!');
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error);
      alert('Có lỗi xảy ra khi cập nhật!');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    }
  };

  if (!isAdmin) {
    return (
      <div className="access-denied">
        <h2>⚠️ Truy cập bị từ chối</h2>
        <p>Bạn không có quyền truy cập trang quản trị.</p>
        <p>Email hiện tại: {currentUser?.email}</p>
        <p>Vui lòng đăng nhập với tài khoản admin</p>
        <button onClick={logout} className="logout-btn">
          Đăng xuất
        </button>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2>Bảng điều khiển Quản trị</h2>
        <button onClick={handleLogout} className="logout-btn">
          Đăng xuất
        </button>
      </div>

      <div className="admin-tabs">
        <button onClick={() => setCurrentTab('forms')} className={currentTab === 'forms' ? 'active-tab' : ''}>Quản Lý Đăng Ký</button>
        <button onClick={() => setCurrentTab('settings')} className={currentTab === 'settings' ? 'active-tab' : ''}>Cài Đặt</button>
      </div>

      <div className="admin-content">
        {currentTab === 'forms' && (
          <>
            <div className="admin-stats">
              <div className="stat-card">
                <h3>Tổng thành viên</h3>
                <p className="stat-number">{members.length}</p>
              </div>
              <div className="stat-card">
                <h3>Đã thanh toán</h3>
                <p className="stat-number">{members.filter(m => m.paid).length}</p>
              </div>
              <div className="stat-card">
                <h3>Chưa thanh toán</h3>
                <p className="stat-number">{members.filter(m => !m.paid).length}</p>
              </div>
              <div className="stat-card">
                <h3>Tổng đăng ký trại</h3>
                <p className="stat-number">{camps.length}</p>
              </div>
              <div className="stat-card">
                <h3>Trại đã thanh toán</h3>
                <p className="stat-number">{camps.filter(c => c.paid).length}</p>
              </div>
              <div className="stat-card">
                <h3>Trại chưa thanh toán</h3>
                <p className="stat-number">{camps.filter(c => !c.paid).length}</p>
              </div>
            </div>

            <div className="admin-tabs">
              <button
                className={activeTab === 'members' ? 'active' : ''}
                onClick={() => { setActiveTab('members'); }}
              >
                Thành viên ({members.length})
              </button>
              <button
                className={activeTab === 'camps' ? 'active' : ''}
                onClick={() => { setActiveTab('camps'); }}
              >
                Trại Bình Minh ({camps.length})
              </button>
            </div>

            <div className="admin-content">
              {activeTab === 'members' && (
                <AdminRegistration
                  members={members}
                  handleDelete={handleDelete}
                  handlePaidToggle={handlePaidToggle}
                />
              )}

              {activeTab === 'camps' && (
                <AdminCamp
                  camps={camps}
                  handleDelete={handleDelete}
                  handleCampPaidToggle={handleCampPaidToggle}
                />
              )}
            </div>
          </>)}
        {currentTab === 'settings' && (
          <AdminSettings /> // Component cài đặt mới
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;