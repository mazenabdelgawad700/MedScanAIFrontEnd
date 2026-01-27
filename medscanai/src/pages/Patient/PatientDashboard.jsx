import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PatientDashboard.css";
import { API_BASE } from "../../../utils/Constants.ts";

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
const MedicalTag = ({
  item,
  type,
  tagClass,
  onUpdate,
  onDelete,
  isEditing,
  onShowActions,
  onCancelEdit,
}) => {
  const [editValue, setEditValue] = useState(item?.name || "");
  const [isLoading, setIsLoading] = useState(false);
  const tagRef = React.useRef(null);

  const handleTagClick = (e) => {
    e.stopPropagation();
    if (!isEditing) {
      // Calculate position for the popup
      const rect = e.currentTarget.getBoundingClientRect();
      const position = {
        top: rect.top, // Top edge of the tag
        left: rect.left + rect.width / 2, // Center of the tag
      };
      onShowActions(e, item, type, position);
    }
  };

  const handleUpdate = async () => {
    if (!editValue.trim()) return;
    setIsLoading(true);
    await onUpdate(item, editValue);
    setIsLoading(false);
    onCancelEdit();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleUpdate();
    } else if (e.key === "Escape") {
      onCancelEdit();
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
            {isLoading ? (
              <span className="pd-tag-spinner"></span>
            ) : (
              <i className="bi bi-check"></i>
            )}
          </button>
          <button
            className="pd-tag-btn pd-tag-btn-cancel"
            onClick={() => {
              onCancelEdit();
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
        className={`pd-tag ${tagClass} pd-tag-interactive`}
        onClick={handleTagClick}
      >
        {item?.name}
        <span className="pd-tag-tooltip">اضغط للتعديل أو الحذف</span>
      </div>
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

  // Global Delete Modal State
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    type: null,
    item: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Global Action Menu State
  const [actionMenu, setActionMenu] = useState({
    show: false,
    x: 0,
    y: 0,
    item: null,
    type: null,
  });
  const [editingId, setEditingId] = useState(null);
  const dashboardRef = React.useRef(null);

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

      const response = await fetch(`${API_BASE}/patient/GetProfile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ PatientId: userId }),
      });

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
        `${API_BASE}/chronicdisease/UpdateChronicDisease`,
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

      const response = await fetch(`${API_BASE}/allergy/UpdateAllergy`, {
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
      });

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
        `${API_BASE}/currentmedication/UpdateCurrentMedication`,
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
      // Some backends ignore DELETE bodies; include id in query and body for robustness
      const url = `${API_BASE}/chronicdisease/DeleteChronicDisease?id=${encodeURIComponent(
        disease.id
      )}`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: disease.id }),
      });

      if (response.ok) {
        await fetchProfile();
      } else {
        const txt = await response.text();
        console.error("Delete chronic disease failed:", txt || response.status);
        alert("فشل حذف المرض. حاول مرة أخرى.");
      }
    } catch (error) {
      console.error("Failed to delete chronic disease", error);
      alert("حدث خطأ أثناء الحذف. تحقق من الاتصال وحاول مرة أخرى.");
    }
  };

  const handleDeleteAllergy = async (allergy) => {
    try {
      const token = getToken();
      const url = `${API_BASE}/allergy/DeleteAllergy?id=${encodeURIComponent(
        allergy.id
      )}`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: allergy.id }),
      });

      if (response.ok) {
        await fetchProfile();
      } else {
        const txt = await response.text();
        console.error("Delete allergy failed:", txt || response.status);
        alert("فشل حذف الحساسية. حاول مرة أخرى.");
      }
    } catch (error) {
      console.error("Failed to delete allergy", error);
      alert("حدث خطأ أثناء الحذف. تحقق من الاتصال وحاول مرة أخرى.");
    }
  };

  const handleDeleteMedication = async (medication) => {
    try {
      const token = getToken();
      const url = `${API_BASE}/currentmedication/DeleteCurrentMedication?id=${encodeURIComponent(
        medication.id
      )}`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: medication.id }),
      });

      if (response.ok) {
        await fetchProfile();
      } else {
        const txt = await response.text();
        console.error("Delete medication failed:", txt || response.status);
        alert("فشل حذف الدواء. حاول مرة أخرى.");
      }
    } catch (error) {
      console.error("Failed to delete medication", error);
      alert("حدث خطأ أثناء الحذف. تحقق من الاتصال وحاول مرة أخرى.");
    }
  };

  const confirmDelete = (item, type) => {
    setDeleteModal({ show: true, item, type });
  };

  const executeDelete = async () => {
    if (!deleteModal.item) return;
    setIsDeleting(true);

    if (deleteModal.type === "chronicDisease") {
      await handleDeleteChronicDisease(deleteModal.item);
    } else if (deleteModal.type === "allergy") {
      await handleDeleteAllergy(deleteModal.item);
    } else if (deleteModal.type === "medication") {
      await handleDeleteMedication(deleteModal.item);
    }

    setIsDeleting(false);
    setDeleteModal({ show: false, type: null, item: null });
  };

  const handleShowActions = (e, item, type, position) => {
    if (!dashboardRef.current) return;
    
    // Calculate position relative to the dashboard container
    const dashboardRect = dashboardRef.current.getBoundingClientRect();
    // position arg contains viewport-relative coords from render logic? 
    // Wait, the child component sends 'position' which it calculated from rect.top
    // Let's ignore the passed 'position' object partially and re-calculate or adjust
    
    // Actually, let's grab the rect from the event target again for safety/clarity or just trust the child passed raw rect?
    // The child passed: top = rect.top, left = rect.left + width/2.
    // viewport relative.
    
    // We want relative to dashboard:
    const relativeTop = position.top - dashboardRect.top;
    const relativeLeft = position.left - dashboardRect.left;

    setActionMenu({
      show: true,
      x: relativeLeft,
      y: relativeTop,
      item,
      type,
    });
  };

  const startEditing = () => {
    if (actionMenu.item) {
      setEditingId(actionMenu.item.id);
      setActionMenu({ ...actionMenu, show: false });
    }
  };

  const confirmDeleteFromMenu = () => {
    if (actionMenu.item && actionMenu.type) {
      confirmDelete(actionMenu.item, actionMenu.type);
      setActionMenu({ ...actionMenu, show: false });
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
      case "chronicDisease":
        return "مرض مزمن";
      case "allergy":
        return "حساسية";
      case "medication":
        return "دواء";
      default:
        return "";
    }
  };

  // Handle add item submission
  const handleAddItem = async () => {
    if (!newItemName.trim()) return;

    setIsAdding(true);
    try {
      const token = getToken();
      const userId = getUserId();

      let url = "";
      let bodyKey = "";

      switch (addType) {
        case "chronicDisease":
          url = `${API_BASE}/chronicdisease/AddChronicDisease`;
          break;
        case "allergy":
          url = `${API_BASE}/allergy/AddAllergy`;
          break;
        case "medication":
          url = `${API_BASE}/currentmedication/AddCurrentMedication`;
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
    <div className="pd-page" ref={dashboardRef}>
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
              onKeyDown={(e) =>
                e.key === "Enter" && navigate("/patient/update-profile")
              }
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
                      {profile.chronicDiseases &&
                      profile.chronicDiseases.length > 0
                        ? profile.chronicDiseases.map((disease) => (
                            <MedicalTag
                              key={disease?.id}
                              item={disease}
                              type="chronicDisease"
                              tagClass="pd-tag-danger"
                              isEditing={editingId === disease.id}
                              onShowActions={handleShowActions}
                              onCancelEdit={() => setEditingId(null)}
                              onUpdate={handleUpdateChronicDisease}
                              onDelete={(item) =>
                                confirmDelete(item, "chronicDisease")
                              }
                            />
                          ))
                        : null}
                      <button
                        className="pd-tag-add pd-tag-add-danger"
                        onClick={() => openAddModal("chronicDisease")}
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
                      {profile.allergies && profile.allergies.length > 0
                        ? profile.allergies.map((allergy) => (
                            <MedicalTag
                              key={allergy?.id}
                              item={allergy}
                              type="allergy"
                              tagClass="pd-tag-warning"
                              isEditing={editingId === allergy.id}
                              onShowActions={handleShowActions}
                              onCancelEdit={() => setEditingId(null)}
                              onUpdate={handleUpdateAllergy}
                              onDelete={(item) =>
                                confirmDelete(item, "allergy")
                              }
                            />
                          ))
                        : null}
                      <button
                        className="pd-tag-add pd-tag-add-warning"
                        onClick={() => openAddModal("allergy")}
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
                      {profile.currentMedication &&
                      profile.currentMedication.length > 0
                        ? profile.currentMedication.map((med) => (
                            <MedicalTag
                              key={med?.id}
                              item={med}
                              type="medication"
                              tagClass="pd-tag-info"
                              isEditing={editingId === med.id}
                              onShowActions={handleShowActions}
                              onCancelEdit={() => setEditingId(null)}
                              onUpdate={handleUpdateMedication}
                              onDelete={(item) =>
                                confirmDelete(item, "medication")
                              }
                            />
                          ))
                        : null}
                      <button
                        className="pd-tag-add pd-tag-add-info"
                        onClick={() => openAddModal("medication")}
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
        <div
          className="pd-modal-overlay"
          onClick={() => setShowAddModal(false)}
        >
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
                onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
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

      {/* Global Delete Confirmation Modal */}
      {deleteModal.show && (
        <div
          className="pd-modal-overlay"
          onClick={() =>
            setDeleteModal({ show: false, type: null, item: null })
          }
        >
          <div className="pd-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pd-modal-icon">
              <i className="bi bi-exclamation-triangle-fill"></i>
            </div>
            <h3 className="pd-modal-title">تأكيد الحذف</h3>
            <p className="pd-modal-message">
              هل أنت متأكد من حذف <strong>"{deleteModal.item?.name}"</strong>؟
            </p>
            <div className="pd-modal-actions">
              <button
                className="pd-modal-btn pd-modal-btn-cancel"
                onClick={() =>
                  setDeleteModal({ show: false, type: null, item: null })
                }
                disabled={isDeleting}
              >
                إلغاء
              </button>
              <button
                className="pd-modal-btn pd-modal-btn-delete"
                onClick={executeDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
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

      {/* Global Action Menu / Popup */}
      {actionMenu.show && (
        <div
          className="pd-global-popup-overlay"
          onClick={() => setActionMenu({ ...actionMenu, show: false })}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99998,
            cursor: "default",
          }}
        >
          <div
            className="pd-tag-popup"
            style={{
              position: "absolute",
              top: `${actionMenu.y}px`,
              left: `${actionMenu.x}px`,
              transform: "translate(-50%, -100%) translateY(-8px)", // Center horizontally, place above with 8px gap
              margin: 0,
              zIndex: 99999,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="pd-tag-popup-btn pd-tag-popup-edit"
              onClick={startEditing}
            >
              <i className="bi bi-pencil"></i>
              تعديل
            </button>
            <button
              className="pd-tag-popup-btn pd-tag-popup-delete"
              onClick={confirmDeleteFromMenu}
            >
              <i className="bi bi-trash"></i>
              حذف
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
