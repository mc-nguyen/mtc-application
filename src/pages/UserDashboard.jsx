import React, { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "../services/AuthContext";
import { db } from "../config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useLanguage } from "../LanguageContext";
import PDFGenerator from "../admin/PDFGenerator";
// BỔ SUNG CSS
import "./UserDashboard.css";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const { user, loadingUser, logout } = useAuth();
  const { t } = useLanguage();
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [loadingForms, setLoadingForms] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const popupRef = useRef(null); 

  useEffect(() => {
    // START: CẬP NHẬT HÀM fetchForms
    const fetchForms = async () => {
      if (loadingUser) return;
      if (!user?.email) {
        setLoadingForms(false);
        return;
      }

      try {
        const emailRef = doc(
          db,
          "artifacts",
          "mtc-applications",
          "public",
          "data",
          "email",
          user.email
        );
        const emailSnap = await getDoc(emailRef);

        if (!emailSnap.exists()) {
          setForms([]);
          setLoadingForms(false);
          return;
        }

        const formIds = emailSnap.data().forms || [];
        const formDataList = [];

        // DANH SÁCH CÁC COLLECTION CÓ THỂ CHỨA SUBMISSION
        const submissionCollections = ["formSubmissions", "campSubmissions"];

        for (const id of formIds) {
          let formSnap = null;
          let isCampForm = false;

          // Vòng lặp để kiểm tra từng collection
          for (const collectionName of submissionCollections) {
            const formRef = doc(
              db,
              "artifacts",
              "mtc-applications",
              "public",
              "data",
              collectionName, // Dùng tên collection động
              id
            );
            
            formSnap = await getDoc(formRef);
            
            if (formSnap.exists()) {
              isCampForm = collectionName === "campSubmissions";
              
              // Thêm form data cùng với cờ isCampForm để phân biệt loại form
              const data = formSnap.data();
              formDataList.push({ id: formSnap.id, isCamp: isCampForm, ...data });
              
              break; // Đã tìm thấy form, không cần kiểm tra collection khác
            }
          }
        }
        setForms(formDataList);
      } catch (err) {
        console.error("Lỗi khi lấy form:", err);
        setError(t("error.fetchForms"));
      } finally {
        setLoadingForms(false);
      }
    };
    // END: CẬP NHẬT HÀM fetchForms

    fetchForms();
  }, [user, loadingUser, t]);

  const handleView = (form) => setSelectedForm(form);
  const handleClose = useCallback(() => {setSelectedForm(null)}, []);

  useEffect(() => {
    // Hàm xử lý sự kiện click
    const handleClickOutside = (event) => {
      // Nếu popup đang mở VÀ click xảy ra ngoài popup content
      if (selectedForm && popupRef.current && !popupRef.current.contains(event.target)) {
        handleClose();
      }
    };

    // Thêm event listener khi component mount (hoặc selectedForm thay đổi)
    document.addEventListener("mousedown", handleClickOutside);

    // Dọn dẹp: Gỡ bỏ event listener khi component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedForm, handleClose]); // Chạy lại khi selectedForm hoặc handleClose thay đổi

  const handleLogout = async () => {
    await logout(); // Gọi hàm logout từ AuthContext
    navigate("/login"); // Chuyển hướng người dùng về trang /login
  };

  // --- HÀM RENDER CHI TIẾT FORM ---
  const getFormType = (form) => {
    // Kiểm tra cờ isCamp đã được thêm vào lúc fetch
    if (form.isCamp) {
      return t("form_type_camp");
    }
    // Giả định: Đơn đăng ký thành viên có paymentInfo.annualFee (hoặc logic khác)
    if (form.paymentInfo?.annualFee) {
      return t("form_type_registration");
    }
    return t("form_type_unknown");
  };

  const renderFormDetails = (form) => {
    const fullName = [
      form.mainInfo?.saintName + " - ",
      form.mainInfo?.lastName,
      form.mainInfo?.middleName,
      form.mainInfo?.givenName,
    ]
      .filter(Boolean)
      .join(" ");
    const formType = getFormType(form);
    // Định dạng ngày sinh (cần đảm bảo form.dob là chuỗi ngày hợp lệ)
    const dob = form.dob
      ? new Date(form.dob).toLocaleDateString("vi-VN")
      : "N/A";
    const isCampRegistration = form.isCamp; // Dùng cờ mới

    return (
      <div className="form-detail-overlay">
        <div className="form-detail-popup" ref={popupRef}>
          <div className="form-detail-content">
            <h3>{t("form_detail_title")}</h3>
            {/* ... (các chi tiết khác giữ nguyên) ... */}
            <p>
              <strong>ID:</strong> {selectedForm.id}
            </p>
            <p>
              <strong>{t("form_submitted")}:</strong>{" "}
              {selectedForm.submissionDate}
            </p>
            <div className="form-detail-content">
              <div className="detail-section">
                <h4>Thông tin chung</h4>
                <p>
                  <strong>Loại đơn:</strong> {formType}
                </p>
                <p>
                  <strong>Họ & Tên:</strong> {fullName}
                </p>
                <p>
                  <strong>Ngày sinh:</strong> {dob}
                </p>
                <p>
                  <strong>Email:</strong> {form.mainInfo?.email}
                </p>
                <p>
                  <strong>Ngày nộp:</strong> {form.submissionDate || "N/A"}
                </p>
              </div>

              <div className="detail-section">
                <h4>Trạng thái & Thanh toán</h4>
                <p className={`status-label ${form.paid ? "paid" : "unpaid"}`}>
                  <strong>Trạng thái thanh toán:</strong>{" "}
                  {form.paid ? t("form.paid") : t("form.unpaid")}
                </p>

                {/* Chỉ hiển thị chi phí cho form đăng ký thành viên */}
                {!isCampRegistration && form.paymentInfo && (
                  <>
                    <p>
                      <strong>Phí thường niên:</strong> $
                      {form.paymentInfo.annualFee || 0}.00
                    </p>
                    {/* Có thể thêm các mục thanh toán khác (áo, khăn) ở đây */}
                  </>
                )}

                {isCampRegistration && (
                  <p>
                    <strong>Ghi chú:</strong> Chi phí Trại sẽ được thông báo qua
                    email.
                  </p>
                )}
              </div>

              {/* Thông tin Liên hệ khẩn cấp */}
              {form.healthInfo?.emergencyContact && (
                <div className="detail-section">
                  <h4>Liên hệ khẩn cấp</h4>
                  <p>
                    <strong>Tên:</strong>{" "}
                    {form.healthInfo.emergencyContact.name}
                  </p>
                  <p>
                    <strong>Điện thoại:</strong>{" "}
                    {form.healthInfo.emergencyContact.phone}
                  </p>
                  <p>
                    <strong>Quan hệ:</strong>{" "}
                    {form.healthInfo.emergencyContact.relationship}
                  </p>
                </div>
              )}

              <PDFGenerator
                formData={selectedForm}
                isCamp={isCampRegistration} // Dùng cờ mới
              />
            </div>
            <hr />

            {/* Hiển thị chi tiết (ví dụ: Tên, Email, Trạng thái thanh toán) */}
            <h4>{t("main_info_title")}</h4>
            <p>
              Tên: {selectedForm.mainInfo?.givenName}{" "}
              {selectedForm.mainInfo?.lastName}
            </p>
            <p>Email: {selectedForm.mainInfo?.email}</p>
            <p>
              Trạng thái thanh toán:
              <strong>
                {" "}
                {selectedForm.paid ? t("form.paid") : t("form.unpaid")}
              </strong>
            </p>

            {/* Bạn có thể thêm nhiều chi tiết khác của form ở đây */}
            <button
              onClick={handleClose}
              className="btn action-btn-secondary"
              style={{ marginTop: "20px" }}
            >
              {t("close_btn")}
            </button>
          </div>
        </div>
      </div>
    );
  };
  // --- KẾT THÚC HÀM RENDER ---

  if (loadingUser || loadingForms) return <p>{t("loading")}</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="dashboard">
      <h2>{t("dashboard.title")}</h2>
      <p>
        {t("dashboard.welcome")}: {user?.email}
      </p>

      {/* THAY ĐỔI Ở ĐÂY CHO NÚT ĐĂNG XUẤT */}
      <button
        onClick={handleLogout}
        className="action-btn-danger"
        style={{ marginBottom: "20px" }}
      >
        {t("logout")}
      </button>

      <div className="sticky-note-container">
        {forms.length === 0 ? (
          <p>{t("dashboard.noForms")}</p>
        ) : (
          forms.map((form) => (
            <div key={form.id} className="sticky-note">
              <h4>
                {form.mainInfo?.givenName} {form.mainInfo?.lastName}
              </h4>
              <p>
                {t("form_submitted")}: {form.submissionDate || "N/A"}
              </p>
              <p>{form.paid ? t("form.paid") : t("form.unpaid")}</p>

              {/* THAY ĐỔI Ở ĐÂY CHO NÚT XEM */}
              <button
                onClick={() => handleView(form)}
                className="action-btn-secondary"
              >
                {t("form.view")}
              </button>
            </div>
          ))
        )}
      </div>

      {/* POPUP HIỂN THỊ CHI TIẾT */}
      {selectedForm && renderFormDetails(selectedForm)}
    </div>
  );
};

export default UserDashboard;