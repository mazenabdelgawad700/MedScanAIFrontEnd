import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PatientDashboard.css";

const Card = ({ title, subtitle, icon, onClick }) => (
  <div className="pd-card" onClick={onClick} role="button" tabIndex={0}>
    <div className="pd-card-left">
      <div className="pd-card-title">{title}</div>
      <div className="pd-card-sub">{subtitle}</div>
    </div>
    <div className="pd-card-icon">{icon}</div>
  </div>
);

// Interactive Medical Tag Component
const MedicalTag = ({ item, type, tagClass, onUpdate, onDelete }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [editValue, setEditValue] = useState(item?.name || "");
  const [isLoading, setIsLoading] = useState(false);
  const tagRef = React.useRef(null);

  // Close popup when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (tagRef.current && !tagRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };

    if (showPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopup]);

  const handleTagClick = (e) => {
    e.stopPropagation();
    if (!isEditing && !showDeleteConfirm) {
      setShowPopup(!showPopup);
    }
  };

  const handleUpdate = async () => {
    if (!editValue.trim()) return;
    setIsLoading(true);
    await onUpdate(item, editValue);
    setIsLoading(false);
    setIsEditing(false);
    setShowPopup(false);
  };

  const handleDeleteConfirm = async () => {
    setIsLoading(true);
    await onDelete(item);
    setIsLoading(false);
    setShowDeleteConfirm(false);
    setShowPopup(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleUpdate();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditValue(item?.name || "");
    }
  };

  if (isEditing) {
    return (
      <div className={`pd-tag ${tagClass} pd-tag-editing`} ref={tagRef}>
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          className="pd-tag-input"
          disabled={isLoading}
        />
        <div className="pd-tag-edit-actions">
          <button
            className="pd-tag-btn pd-tag-btn-save"
            onClick={handleUpdate}
            disabled={isLoading}
          >
            {isLoading ? <span className="pd-tag-spinner"></span> : <i className="bi bi-check"></i>}
          </button>
          <button
            className="pd-tag-btn pd-tag-btn-cancel"
            onClick={() => {
              setIsEditing(false);
              setEditValue(item?.name || "");
            }}
            disabled={isLoading}
          >
            <i className="bi bi-x"></i>
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={tagRef}
        className={`pd-tag ${tagClass} pd-tag-interactive ${showPopup ? 'pd-tag-active' : ''}`}
        onClick={handleTagClick}
      >
        {item?.name}
        <span className="pd-tag-tooltip">اضغط للتعديل أو الحذف</span>
        {showPopup && (
          <div className="pd-tag-popup" onClick={(e) => e.stopPropagation()}>
            <button
              className="pd-tag-popup-btn pd-tag-popup-edit"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
                setShowPopup(false);
              }}
              disabled={isLoading}
            >
              <i className="bi bi-pencil"></i>
              تعديل
            </button>
            <button
              className="pd-tag-popup-btn pd-tag-popup-delete"
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(true);
                setShowPopup(false);
              }}
              disabled={isLoading}
            >
              <i className="bi bi-trash"></i>
              حذف
            </button>
          </div>
        )}
      </div>

      {/* Custom Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="pd-modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="pd-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pd-modal-icon">
              <i className="bi bi-exclamation-triangle-fill"></i>
            </div>
            <h3 className="pd-modal-title">تأكيد الحذف</h3>
            <p className="pd-modal-message">
              هل أنت متأكد من حذف <strong>"{item?.name}"</strong>؟
            </p>
            <div className="pd-modal-actions">
              <button
                className="pd-modal-btn pd-modal-btn-cancel"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isLoading}
              >
                إلغاء
              </button>
              <button
                className="pd-modal-btn pd-modal-btn-delete"
                onClick={handleDeleteConfirm}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="pd-tag-spinner"></span>
                    جاري الحذف...
                  </>
                ) : (
                  <>
                    <i className="bi bi-trash"></i>
                    نعم، احذف
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState(null); // 'chronicDisease', 'allergy', 'medication'
  const [newItemName, setNewItemName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const getToken = () => localStorage.getItem("token");

  const getUserId = () => {
    const token = getToken();
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.UserId;
  };

  const fetchProfile = async () => {
    try {
      const token = getToken();
      const userId = getUserId();

      const response = await fetch(
        "https://localhost:7196/api/patient/GetProfile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ PatientId: userId }),
        }
      );

      const data = await response.json();
      if (data.succeeded) setProfile(data.data);
    } catch (error) {
      console.error("Failed to load profile", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  // Update handlers
  const handleUpdateChronicDisease = async (disease, newName) => {
    try {
      const token = getToken();
      const userId = getUserId();

      const response = await fetch(
        "https://localhost:7196/api/chronicdisease/UpdateChronicDisease",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            chronicDisease: {
              patientId: userId,
              id: disease.id,
              name: newName,
            },
          }),
        }
      );

      if (response.ok) {
        await fetchProfile();
      }
    } catch (error) {
      console.error("Failed to update chronic disease", error);
    }
  };

  const handleUpdateAllergy = async (allergy, newName) => {
    try {
      const token = getToken();
      const userId = getUserId();

      const response = await fetch(
        "https://localhost:7196/api/allergy/UpdateAllergy",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            allergy: {
              patientId: userId,
              id: allergy.id,
              name: newName,
            },
          }),
        }
      );

      if (response.ok) {
        await fetchProfile();
      }
    } catch (error) {
      console.error("Failed to update allergy", error);
    }
  };

  const handleUpdateMedication = async (medication, newName) => {
    try {
      const token = getToken();
      const userId = getUserId();

      const response = await fetch(
        "https://localhost:7196/api/currentmedication/UpdateCurrentMedication",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentMedication: {
              patientId: userId,
              id: medication.id,
              name: newName,
            },
          }),
        }
      );

      if (response.ok) {
        await fetchProfile();
      }
    } catch (error) {
      console.error("Failed to update medication", error);
    }
  };

  // Delete handlers
  const handleDeleteChronicDisease = async (disease) => {
    try {
      const token = getToken();

      const response = await fetch(
        "https://localhost:7196/api/chronicdisease/DeleteChronicDisease",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: disease.id }),
        }
      );

      if (response.ok) {
        await fetchProfile();
      }
    } catch (error) {
      console.error("Failed to delete chronic disease", error);
    }
  };

  const handleDeleteAllergy = async (allergy) => {
    try {
      const token = getToken();

      const response = await fetch(
        "https://localhost:7196/api/allergy/DeleteAllergy",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: allergy.id }),
        }
      );

      if (response.ok) {
        await fetchProfile();
      }
    } catch (error) {
      console.error("Failed to delete allergy", error);
    }
  };

  const handleDeleteMedication = async (medication) => {
    try {
      const token = getToken();

      const response = await fetch(
        "https://localhost:7196/api/currentmedication/DeleteCurrentMedication",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: medication.id }),
        }
      );

      if (response.ok) {
        await fetchProfile();
      }
    } catch (error) {
      console.error("Failed to delete medication", error);
    }
  };

  // Helper to open add modal with correct type
  const openAddModal = (type) => {
    setAddType(type);
    setNewItemName("");
    setShowAddModal(true);
  };

  // Get label for add modal based on type
  const getAddTypeLabel = () => {
    switch (addType) {
      case 'chronicDisease':
        return 'مرض مزمن';
      case 'allergy':
        return 'حساسية';
      case 'medication':
        return 'دواء';
      default:
        return '';
    }
  };

  // Handle add item submission
  const handleAddItem = async () => {
    if (!newItemName.trim()) return;
    
    setIsAdding(true);
    try {
      const token = getToken();
      const userId = getUserId();
      
      let url = '';
      let bodyKey = '';
      
      switch (addType) {
        case 'chronicDisease':
          url = 'https://localhost:7196/api/chronicdisease/AddChronicDisease';
          break;
        case 'allergy':
          url = 'https://localhost:7196/api/allergy/AddAllergy';
          break;
        case 'medication':
          url = 'https://localhost:7196/api/currentmedication/AddCurrentMedication';
          break;
        default:
          return;
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          patientId: userId,
          name: newItemName.trim(),
        }),
      });

      if (response.ok) {
        await fetchProfile();
        setShowAddModal(false);
        setNewItemName("");
        setAddType(null);
      }
    } catch (error) {
      console.error("Failed to add item", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="pd-page">
      <div className="pd-hero">
        <div className="pd-hero-content">
          <div>
            <h1>مرحبًا بعودتك {profile?.fullName}</h1>
            <p className="pd-sub">كيف يمكننا مساعدتك اليوم؟</p>
          </div>
          <button className="pd-logout-btn" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i>
            تسجيل الخروج
          </button>
        </div>
      </div>

      <div className="pd-grid">
        <Card
          title="مواعيدي"
          subtitle="اعرض مواعيدك القادمة والسابقة"
          icon={<span className="pd-ico">🗓️</span>}
          onClick={() => navigate("/patient/appointments")}
        />
        <Card
          title="حجز موعد"
          subtitle="حدد موعدًا لزيارة أطبائنا"
          icon={<span className="pd-ico">📅</span>}
          onClick={() => navigate("/patient/book")}
        />
        <Card
          title="دليلك الصحي الذكي"
          subtitle="تحدث عن أعراضك واحصل على توصيات"
          icon={<span className="pd-ico">💬</span>}
          onClick={() => navigate("/patient/ai")}
        />
      </div>

      {profile && (
        <div className="pd-profile-summary">
          <h2 className="pd-section-title">ملخص ملفك الطبي</h2>
          
          <div className="pd-profile-grid">
            {/* Personal Info Card - Clickable */}
            <div 
              className="pd-info-card pd-info-card-clickable"
              onClick={() => navigate("/patient/update-profile")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate("/patient/update-profile")}
            >
              <div className="pd-info-header">
                <i className="bi bi-person-circle pd-info-icon"></i>
                <h3>المعلومات الشخصية</h3>
                <i className="bi bi-pencil-square pd-edit-icon"></i>
              </div>
              <div className="pd-info-content">
                <div className="pd-info-item">
                  <i className="bi bi-person-fill"></i>
                  <div>
                    <span className="pd-info-label">الاسم</span>
                    <span className="pd-info-value">{profile.fullName}</span>
                  </div>
                </div>
                <div className="pd-info-item">
                  <i className="bi bi-envelope-fill"></i>
                  <div>
                    <span className="pd-info-label">البريد الإلكتروني</span>
                    <span className="pd-info-value">{profile.email}</span>
                  </div>
                </div>
                <div className="pd-info-item">
                  <i className="bi bi-telephone-fill"></i>
                  <div>
                    <span className="pd-info-label">رقم الهاتف</span>
                    <span className="pd-info-value">{profile.phoneNumber}</span>
                  </div>
                </div>
              </div>
              <div className="pd-edit-hint">
                <i className="bi bi-pencil"></i>
                اضغط للتعديل
              </div>
            </div>

            {/* Medical Info Card */}
            <div className="pd-info-card">
              <div className="pd-info-header">
                <i className="bi bi-heart-pulse pd-info-icon"></i>
                <h3>المعلومات الطبية</h3>
              </div>
              <div className="pd-info-content">
                <div className="pd-info-item">
                  <i className="bi bi-clipboard2-pulse"></i>
                  <div>
                    <span className="pd-info-label">الأمراض المزمنة</span>
                    <div className="pd-tags">
                      {profile.chronicDiseases && profile.chronicDiseases.length > 0 ? (
                        profile.chronicDiseases.map((disease) => (
                          <MedicalTag
                            key={disease?.id}
                            item={disease}
                            type="chronicDisease"
                            tagClass="pd-tag-danger"
                            onUpdate={handleUpdateChronicDisease}
                            onDelete={handleDeleteChronicDisease}
                          />
                        ))
                      ) : null}
                      <button
                        className="pd-tag-add pd-tag-add-danger"
                        onClick={() => openAddModal('chronicDisease')}
                        title="إضافة مرض مزمن"
                      >
                        <i className="bi bi-plus-lg"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="pd-info-item">
                  <i className="bi bi-exclamation-triangle"></i>
                  <div>
                    <span className="pd-info-label">الحساسية</span>
                    <div className="pd-tags">
                      {profile.allergies && profile.allergies.length > 0 ? (
                        profile.allergies.map((allergy) => (
                          <MedicalTag
                            key={allergy?.id}
                            item={allergy}
                            type="allergy"
                            tagClass="pd-tag-warning"
                            onUpdate={handleUpdateAllergy}
                            onDelete={handleDeleteAllergy}
                          />
                        ))
                      ) : null}
                      <button
                        className="pd-tag-add pd-tag-add-warning"
                        onClick={() => openAddModal('allergy')}
                        title="إضافة حساسية"
                      >
                        <i className="bi bi-plus-lg"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="pd-info-item">
                  <i className="bi bi-capsule"></i>
                  <div>
                    <span className="pd-info-label">الأدوية الحالية</span>
                    <div className="pd-tags">
                      {profile.currentMedication && profile.currentMedication.length > 0 ? (
                        profile.currentMedication.map((med) => (
                          <MedicalTag
                            key={med?.id}
                            item={med}
                            type="medication"
                            tagClass="pd-tag-info"
                            onUpdate={handleUpdateMedication}
                            onDelete={handleDeleteMedication}
                          />
                        ))
                      ) : null}
                      <button
                        className="pd-tag-add pd-tag-add-info"
                        onClick={() => openAddModal('medication')}
                        title="إضافة دواء"
                      >
                        <i className="bi bi-plus-lg"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Add Item Modal */}
      {showAddModal && (
        <div className="pd-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="pd-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pd-modal-icon pd-modal-icon-add">
              <i className="bi bi-plus-lg"></i>
            </div>
            <h3 className="pd-modal-title">إضافة {getAddTypeLabel()}</h3>
            <div className="pd-modal-input-group">
              <input
                type="text"
                className="pd-modal-input"
                placeholder={`أدخل اسم ال${getAddTypeLabel()}`}
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
              />
            </div>
            <div className="pd-modal-actions">
              <button
                className="pd-modal-btn pd-modal-btn-cancel"
                onClick={() => setShowAddModal(false)}
                disabled={isAdding}
              >
                إلغاء
              </button>
              <button
                className="pd-modal-btn pd-modal-btn-confirm"
                onClick={handleAddItem}
                disabled={isAdding || !newItemName.trim()}
              >
                {isAdding ? (
                  <>
                    <span className="pd-tag-spinner"></span>
                    جاري الإضافة...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg"></i>
                    إضافة
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;

