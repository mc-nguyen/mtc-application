// src/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../services/AuthContext';
import { db } from '../config/firebaseConfig';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import PDFGenerator from './PDFGenerator';
import { useAdminAuth } from './AdminAuthContext'; // Sử dụng context admin

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('members');
  const [members, setMembers] = useState([]);
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { currentUser, isAdmin, logout } = useAdminAuth();

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

  const handleMemberClick = (member) => {
    if (selectedMember && selectedMember.id === member.id) {
      setSelectedMember(null);
    } else {
      setSelectedMember(member);
      setSelectedCamp(null);
    }
  };

  const handleCampClick = (camp) => {
    if (selectedCamp && selectedCamp.id === camp.id) {
      setSelectedCamp(null);
    } else {
      setSelectedCamp(camp);
      setSelectedMember(null);
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

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMembers = members.slice(indexOfFirstItem, indexOfLastItem);
  const currentCamps = camps.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(
    activeTab === 'members' ? members.length / itemsPerPage : camps.length / itemsPerPage
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderMemberDetail = (member) => {
    if (!member) return null;

    return (
      <div className="detail-panel">
        <div className="detail-header">
          <h4>Thông tin chi tiết thành viên</h4>
          <button onClick={() => setSelectedMember(null)} className="toggle-view-btn">
            ← Quay lại danh sách
          </button>
        </div>

        <div className="detail-section">
          <h5>Thông tin cá nhân</h5>
          <p><strong>Tên Thánh:</strong> {member.mainInfo?.saintName || 'N/A'}</p>
          <p><strong>Họ:</strong> {member.mainInfo?.lastName || 'N/A'}</p>
          <p><strong>Tên đệm:</strong> {member.mainInfo?.middleName || 'N/A'}</p>
          <p><strong>Tên gọi:</strong> {member.mainInfo?.givenName || 'N/A'}</p>
          <p><strong>Ngày sinh:</strong> {member.dob || 'N/A'}</p>
          <p><strong>Email:</strong> {member.mainInfo?.email || 'N/A'}</p>
          <p><strong>Ngành:</strong> {member.mainInfo?.nganh || 'N/A'}</p>
        </div>

        {!member.isAdult && (
          <div className="detail-section">
            <h5>Thông tin phụ huynh</h5>
            <p><strong>Tên Bố:</strong> {member.mainInfo?.fatherName || 'N/A'}</p>
            <p><strong>Tên Mẹ:</strong> {member.mainInfo?.motherName || 'N/A'}</p>
          </div>
        )}

        <div className="detail-section">
          <h5>Địa chỉ liên lạc</h5>
          <p><strong>Địa chỉ:</strong> {member.mainInfo?.streetAddress || 'N/A'}</p>
          <p><strong>Thành phố:</strong> {member.mainInfo?.city || 'N/A'}</p>
          <p><strong>Tiểu bang:</strong> {member.mainInfo?.state || 'N/A'}</p>
          <p><strong>Zipcode:</strong> {member.mainInfo?.zip || 'N/A'}</p>
        </div>

        <div className="detail-section">
          <h5>Liên hệ</h5>
          <p><strong>Điện thoại nhà:</strong> {member.mainInfo?.homePhone || 'N/A'}</p>
          <p><strong>Điện thoại di động:</strong> {member.mainInfo?.cellPhone || 'N/A'}</p>
          <p><strong>Điện thoại cơ quan:</strong> {member.mainInfo?.workPhone || 'N/A'}</p>
        </div>

        <div className="detail-section">
          <h5>Liên hệ khẩn cấp</h5>
          <p><strong>Tên:</strong> {member.mainInfo?.emergencyContactName || 'N/A'}</p>
          <p><strong>Số điện thoại:</strong> {member.mainInfo?.emergencyContactPhone || 'N/A'}</p>
        </div>

        {member.paymentInfo && (
          <div className="detail-section">
            <h5>Thanh toán</h5>
            <p><strong>Trạng thái:</strong>
              <span className={member.paid ? 'status-paid' : 'status-unpaid'}>
                {member.paid ? ' Đã thanh toán' : ' Chưa thanh toán'}
              </span>
            </p>
            <p><strong>Niên liễm:</strong> ${member.paymentInfo.annualFee || 0}</p>
            <p><strong>Áo uniform:</strong> {member.paymentInfo.uniformShirt ? 'Có ($25)' : 'Không'}</p>
            <p><strong>Skort uniform:</strong> {member.paymentInfo.uniformSkort ? 'Có ($25)' : 'Không'}</p>
            <p><strong>Khăn:</strong> {member.paymentInfo.scarf ? 'Có ($10)' : 'Không'}</p>
            <p><strong>Tổng cộng:</strong> ${calculateTotal(member.paymentInfo, member.isAdult)}</p>
          </div>
        )}

        <div className="detail-section">
          <h5>Chữ ký</h5>
          {member.mainInfo?.participantSignature && (
            <div>
              <p><strong>Chữ ký đoàn sinh:</strong></p>
              <img
                src={member.mainInfo.participantSignature}
                alt="Chữ ký đoàn sinh"
                className="signature-image"
              />
            </div>
          )}
          {member.mainInfo?.parentSignature && (
            <div>
              <p><strong>Chữ ký phụ huynh:</strong></p>
              <img
                src={member.mainInfo.parentSignature}
                alt="Chữ ký phụ huynh"
                className="signature-image"
              />
            </div>
          )}
        </div>

        <div className="detail-section">
          <h5>Thông tin hệ thống</h5>
          <p><strong>Ngày đăng ký:</strong> {new Date(member.submissionDate).toLocaleString('vi-VN')}</p>
          <p><strong>ID:</strong> {member.id}</p>
        </div>

        <div className="detail-actions">
          <PDFGenerator data={member} type="member" />
          <button
            onClick={() => handleDelete(member.id, 'member')}
            className="delete-btn"
          >
            Xóa đăng ký trại
          </button>
          <button
            onClick={() => handlePaidToggle(member.id, member.paid || false)}
            className={member.paid ? 'paid-btn' : 'unpaid-btn'}
          >
            {member.paid ? 'Đánh dấu chưa thanh toán' : 'Đánh dấu đã thanh toán'}
          </button>
          <button
            onClick={() => handleDelete(member.id, 'member')}
            className="delete-btn"
          >
            Xóa thành viên
          </button>
        </div>
      </div>
    );
  };

  const renderCampDetail = (camp) => {
    if (!camp) return null;

    return (
      <div className="detail-panel">
        <div className="detail-header">
          <h4>Thông tin chi tiết đăng ký trại</h4>
          <button onClick={() => setSelectedCamp(null)} className="toggle-view-btn">
            ← Quay lại danh sách
          </button>
        </div>

        <div className="detail-section">
          <h5>Thông tin cá nhân</h5>
          <p><strong>Tên Thánh:</strong> {camp.mainInfo?.saintName || 'N/A'}</p>
          <p><strong>Họ:</strong> {camp.mainInfo?.lastName || 'N/A'}</p>
          <p><strong>Tên đệm:</strong> {camp.mainInfo?.middleName || 'N/A'}</p>
          <p><strong>Tên gọi:</strong> {camp.mainInfo?.givenName || 'N/A'}</p>
          <p><strong>Ngày sinh:</strong> {camp.dob || 'N/A'}</p>
          <p><strong>Email:</strong> {camp.mainInfo?.email || 'N/A'}</p>
        </div>

        {!camp.isAdult && (
          <div className="detail-section">
            <h5>Thông tin phụ huynh</h5>
            <p><strong>Tên Bố:</strong> {camp.mainInfo?.fatherName || 'N/A'}</p>
            <p><strong>Tên Mẹ:</strong> {camp.mainInfo?.motherName || 'N/A'}</p>
          </div>
        )}

        <div className="detail-section">
          <h5>Địa chỉ liên lạc</h5>
          <p><strong>Địa chỉ:</strong> {camp.mainInfo?.streetAddress || 'N/A'}</p>
          <p><strong>Thành phố:</strong> {camp.mainInfo?.city || 'N/A'}</p>
          <p><strong>Tiểu bang:</strong> {camp.mainInfo?.state || 'N/A'}</p>
          <p><strong>Zipcode:</strong> {camp.mainInfo?.zip || 'N/A'}</p>
        </div>

        <div className="detail-section">
          <h5>Liên hệ</h5>
          <p><strong>Điện thoại nhà:</strong> {camp.mainInfo?.homePhone || 'N/A'}</p>
          <p><strong>Điện thoại di động:</strong> {camp.mainInfo?.cellPhone || 'N/A'}</p>
          <p><strong>Điện thoại cơ quan:</strong> {camp.mainInfo?.workPhone || 'N/A'}</p>
        </div>

        <div className="detail-section">
          <h5>Liên hệ khẩn cấp</h5>
          <p><strong>Tên:</strong> {camp.mainInfo?.emergencyContactName || 'N/A'}</p>
          <p><strong>Số điện thoại:</strong> {camp.mainInfo?.emergencyContactPhone || 'N/A'}</p>
        </div>

        {camp.paymentInfo && (
          <div className="detail-section">
            <h5>Thanh toán</h5>
            <p><strong>Trạng thái:</strong>
              <span className={camp.paid ? 'status-paid' : 'status-unpaid'}>
                {camp.paid ? ' Đã thanh toán' : ' Chưa thanh toán'}
              </span>
            </p>
            <p><strong>Phí trại:</strong> ${camp.paymentInfo.campFee || 0}</p>
            <p><strong>Tổng cộng:</strong> ${camp.paymentInfo.campFee || 0}</p>
          </div>
        )}

        <div className="detail-section">
          <h5>Chữ ký</h5>
          {camp.mainInfo?.participantSignature && (
            <div>
              <p><strong>Chữ ký đoàn sinh:</strong></p>
              <img
                src={camp.mainInfo.participantSignature}
                alt="Chữ ký đoàn sinh"
                className="signature-image"
              />
            </div>
          )}
          {camp.mainInfo?.parentSignature && (
            <div>
              <p><strong>Chữ ký phụ huynh:</strong></p>
              <img
                src={camp.mainInfo.parentSignature}
                alt="Chữ ký phụ huynh"
                className="signature-image"
              />
            </div>
          )}
        </div>

        <div className="detail-section">
          <h5>Thông tin hệ thống</h5>
          <p><strong>Ngày đăng ký:</strong> {new Date(camp.submissionDate).toLocaleString('vi-VN')}</p>
          <p><strong>ID:</strong> {camp.id}</p>
          <p><strong>Loại:</strong> {camp.type || 'Trại Bình Minh'}</p>
        </div>

        <div className="detail-actions">
          <PDFGenerator data={camp} type="camp" />
          <button
            onClick={() => handleCampPaidToggle(camp.id, camp.paid || false)}
            className={camp.paid ? 'paid-btn' : 'unpaid-btn'}
          >
            {camp.paid ? 'Đánh dấu chưa thanh toán' : 'Đánh dấu đã thanh toán'}
          </button>
          <button
            onClick={() => handleDelete(camp.id, 'camp')}
            className="delete-btn"
          >
            Xóa đăng ký trại
          </button>
        </div>
      </div>
    );
  };

  const calculateTotal = (paymentInfo, isAdult) => {
    if (!paymentInfo) return 0;
    let total = paymentInfo.annualFee || 0;
    if (paymentInfo.uniformShirt) total += 25;
    if (paymentInfo.uniformSkort) total += 25;
    if (!isAdult && paymentInfo.scarf) total += 10;
    return total;
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
          onClick={() => { setActiveTab('members'); setCurrentPage(1); setSelectedMember(null); }}
        >
          Thành viên ({members.length})
        </button>
        <button
          className={activeTab === 'camps' ? 'active' : ''}
          onClick={() => { setActiveTab('camps'); setCurrentPage(1); setSelectedCamp(null); }}
        >
          Trại Bình Minh ({camps.length})
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'members' && (
          <div className="data-container">
            {selectedMember ? (
              <div className="detail-view">
                {renderMemberDetail(selectedMember)}
              </div>
            ) : (
              <div className="data-table">
                <h3>Danh sách Thành viên ({members.length})</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Họ tên</th>
                      <th>Ngày sinh</th>
                      <th>Ngành</th>
                      <th>Email</th>
                      <th>Thanh toán</th>
                      <th>Xóa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentMembers.map((member) => (
                      <tr
                        key={member.id}
                        className={selectedMember?.id === member.id ? 'selected' : ''}
                        onClick={() => handleMemberClick(member)}
                      >
                        <td>{member.mainInfo?.givenName} {member.mainInfo?.lastName}</td>
                        <td>{member.dob}</td>
                        <td>{member.mainInfo?.nganh || 'N/A'}</td>
                        <td>{member.mainInfo?.email}</td>
                        <td>
                          <span>
                            {member.paid ? '✅' : '❌'}
                          </span>
                        </td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(member.id, 'member')}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      ←
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => paginate(page)}
                        className={currentPage === page ? 'active' : ''}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'camps' && (
          <div className="data-container">
            {selectedCamp ? (
              <div className="detail-view">
                {renderCampDetail(selectedCamp)}
              </div>
            ) : (
              <div className="data-table">
                <h3>Danh sách Đăng ký Trại ({camps.length})</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Họ tên</th>
                      <th>Ngày sinh</th>
                      <th>Email</th>
                      <th>Thanh toán</th>
                      <th>Xóa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCamps.map((camp) => (
                      <tr
                        key={camp.id}
                        className={selectedCamp?.id === camp.id ? 'selected' : ''}
                        onClick={() => handleCampClick(camp)}
                      >
                        <td>{camp.mainInfo?.givenName} {camp.mainInfo?.lastName}</td>
                        <td>{camp.dob}</td>
                        <td>{camp.mainInfo?.email}</td>
                        <td>
                          <span>
                            {camp.paid ? '✅' : '❌'}
                          </span>
                        </td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(camp.id, 'camp')}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      ←
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => paginate(page)}
                        className={currentPage === page ? 'active' : ''}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;