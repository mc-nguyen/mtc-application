import React, { useState } from 'react';
import PDFGenerator from './PDFGenerator';
import './AdminForms.css';

export const AdminCamp = ({ camps, handleDelete, handleCampPaidToggle }) => {
    const [selectedCamp, setSelectedCamp] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Now 'members' is the array passed from the parent, so .slice() will work.
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // FIX APPLIED HERE: This line now correctly calls .slice() on an array.
    const currentCamps = camps.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(camps.length / itemsPerPage);

    const handleCampClick = (camp) => {
        if (selectedCamp && selectedCamp.id === camp.id) {
            setSelectedCamp(null);
        } else {
            setSelectedCamp(camp);
        }
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
                    <PDFGenerator formData={camp} isCamp={true} />
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

    return (
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
    );
};