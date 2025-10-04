import React, { useState } from 'react';
import PDFGenerator from './PDFGenerator';
import './AdminForms.css';

// 1. Correct the function signature to accept a single 'props' object
//    and destructure the required values from it.
const AdminRegistration = ({ members, handleDelete, handlePaidToggle }) => {
    const [selectedMember, setSelectedMember] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Now 'members' is the array passed from the parent, so .slice() will work.
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    
    // FIX APPLIED HERE: This line now correctly calls .slice() on an array.
    const currentMembers = members.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(members.length / itemsPerPage);

    // ... (rest of your component logic)

    const renderMemberDetail = (member) => {
        // ... (function body remains the same)
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
                    <PDFGenerator formData={member} isCamp={false} />
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

    const calculateTotal = (paymentInfo, isAdult) => {
        if (!paymentInfo) return 0;
        let total = paymentInfo.annualFee || 0;
        if (paymentInfo.uniformShirt) total += 25;
        if (paymentInfo.uniformSkort) total += 25;
        if (!isAdult && paymentInfo.scarf) total += 10;
        return total;
    };

    const handleMemberClick = (member) => {
        if (selectedMember && selectedMember.id === member.id) {
            setSelectedMember(null);
        } else {
            setSelectedMember(member);
        }
    };

    return (
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
                                    className={member?.id === member.id ? 'selected' : ''}
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
    );
}

export default AdminRegistration;