import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ConfirmModal } from "../../components/common";
import { getToken, getUserId } from "../../utils/auth";
import { API_BASE } from "../../utils/constants";
import "./PatientDashboard.css";

/**
 * Configuration for medical item types (chronic diseases, allergies, medications).
 * Enables generic CRUD operations with type-specific endpoints.
 */
const MEDICAL_ITEM_CONFIG = {
  chronicDisease: {
    endpoint: "chronicdisease",
    updateMethod: "UpdateChronicDisease",
    deleteMethod: "DeleteChronicDisease",
    addMethod: "AddChronicDisease",
    bodyKey: "chronicDisease",
    labelAr: "مرض مزمن",
    deleteErrorMsg: "فشل حذف المرض. حاول مرة أخرى.",
    tagClass: "pd-tag-danger",
    addBtnClass: "pd-tag-add-danger",
  },
  allergy: {
    endpoint: "allergy",
    updateMethod: "UpdateAllergy",
    deleteMethod: "DeleteAllergy",
    addMethod: "AddAllergy",
    bodyKey: "allergy",
    labelAr: "حساسية",
    deleteErrorMsg: "فشل حذف الحساسية. حاول مرة أخرى.",
    tagClass: "pd-tag-warning",
    addBtnClass: "pd-tag-add-warning",
  },
  medication: {
    endpoint: "currentmedication",
    updateMethod: "UpdateCurrentMedication",
    deleteMethod: "DeleteCurrentMedication",
    addMethod: "AddCurrentMedication",
    bodyKey: "currentMedication",
    labelAr: "دواء",
    deleteErrorMsg: "فشل حذف الدواء. حاول مرة أخرى.",
    tagClass: "pd-tag-info",
    addBtnClass: "pd-tag-add-info",
  },
};

/** Dashboard quick action card */
const Card = ({ title, subtitle, icon, onClick }) => (
  <div className="pd-card" onClick={onClick} role="button" tabIndex={0}>
    <div className="pd-card-left">
      <div className="pd-card-title">{title}</div>
      <div className="pd-card-sub">{subtitle}</div>
    </div>
    <div className="pd-card-icon">{icon}</div>
  </div>
);

/** Interactive medical tag with edit/delete capabilities */
const MedicalTag = ({
  item,
  type,
  tagClass,
  onUpdate,
  isEditing,
  onShowActions,
  onCancelEdit,
}) => {
  const [editValue, setEditValue] = useState(item?.name || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleTagClick = (e) => {
    e.stopPropagation();
    if (!isEditing) {
      const rect = e.currentTarget.getBoundingClientRect();
      const position = {
        top: rect.top,
        left: rect.left + rect.width / 2,
      };
      onShowActions(e, item, type, position);
    }
  };

  const handleUpdate = async () => {
    if (!editValue.trim()) return;
    setIsLoading(true);
    await onUpdate(item, editValue, type);
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
      <div className={`pd-tag ${tagClass} pd-tag-editing`}>
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
    <div
      className={`pd-tag ${tagClass} pd-tag-interactive`}
      onClick={handleTagClick}
    >
      {item?.name}
      <span className="pd-tag-tooltip">اضغط للتعديل أو الحذف</span>
    </div>
  );
};

const PatientDashboard = () => {
  const navigate = useNavigate();
  const dashboardRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState(null);
  const [newItemName, setNewItemName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    type: null,
    item: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Action menu state
  const [actionMenu, setActionMenu] = useState({
    show: false,
    x: 0,
    y: 0,
    item: null,
    type: null,
  });
  const [editingId, setEditingId] = useState(null);

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

  /**
   * Generic update handler for all medical item types.
   * Replaces 3 separate near-identical functions.
   */
  const handleUpdateMedicalItem = async (item, newName, type) => {
    const config = MEDICAL_ITEM_CONFIG[type];
    if (!config) return;

    try {
      const token = getToken();
      const userId = getUserId();

      const response = await fetch(
        `${API_BASE}/${config.endpoint}/${config.updateMethod}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            [config.bodyKey]: {
              patientId: userId,
              id: item.id,
              name: newName,
            },
          }),
        }
      );

      if (response.ok) {
        await fetchProfile();
      }
    } catch (error) {
      console.error(`Failed to update ${type}`, error);
    }
  };

  /**
   * Generic delete handler for all medical item types.
   * Replaces 3 separate near-identical functions.
   */
  const handleDeleteMedicalItem = async (item, type) => {
    const config = MEDICAL_ITEM_CONFIG[type];
    if (!config) return;

    try {
      const token = getToken();
      const url = `${API_BASE}/${config.endpoint}/${config.deleteMethod}?id=${encodeURIComponent(item.id)}`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: item.id }),
      });

      if (response.ok) {
        await fetchProfile();
      } else {
        const txt = await response.text();
        console.error(`Delete ${type} failed:`, txt || response.status);
        alert(config.deleteErrorMsg);
      }
    } catch (error) {
      console.error(`Failed to delete ${type}`, error);
      alert("حدث خطأ أثناء الحذف. تحقق من الاتصال وحاول مرة أخرى.");
    }
  };

  const confirmDelete = (item, type) => {
    setDeleteModal({ show: true, item, type });
  };

  const executeDelete = async () => {
    if (!deleteModal.item) return;
    setIsDeleting(true);
    await handleDeleteMedicalItem(deleteModal.item, deleteModal.type);
    setIsDeleting(false);
    setDeleteModal({ show: false, type: null, item: null });
  };

  const handleShowActions = (e, item, type, position) => {
    if (!dashboardRef.current) return;

    const dashboardRect = dashboardRef.current.getBoundingClientRect();
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

  const openAddModal = (type) => {
    setAddType(type);
    setNewItemName("");
    setShowAddModal(true);
  };

  const getAddTypeLabel = () => {
    return MEDICAL_ITEM_CONFIG[addType]?.labelAr || "";
  };

  /**
   * Generic add handler for all medical item types.
   * Replaces scattered add logic.
   */
  const handleAddItem = async () => {
    if (!newItemName.trim()) return;

    const config = MEDICAL_ITEM_CONFIG[addType];
    if (!config) return;

    setIsAdding(true);
    try {
      const token = getToken();
      const userId = getUserId();

      const response = await fetch(
        `${API_BASE}/${config.endpoint}/${config.addMethod}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            patientId: userId,
            name: newItemName.trim(),
          }),
        }
      );

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

  /** Renders a list of medical tags with add button */
  const renderMedicalTags = (items, type) => {
    const config = MEDICAL_ITEM_CONFIG[type];
    return (
      <div className="pd-tags">
        {items?.map((item) => (
          <MedicalTag
            key={item?.id}
            item={item}
            type={type}
            tagClass={config.tagClass}
            isEditing={editingId === item.id}
            onShowActions={handleShowActions}
            onCancelEdit={() => setEditingId(null)}
            onUpdate={handleUpdateMedicalItem}
          />
        ))}
        <button
          className={`pd-tag-add ${config.addBtnClass}`}
          onClick={() => openAddModal(type)}
          title={`إضافة ${config.labelAr}`}
        >
          <i className="bi bi-plus-lg"></i>
        </button>
      </div>
    );
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
            {/* Personal Info Card */}
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
                    {renderMedicalTags(profile.chronicDiseases, "chronicDisease")}
                  </div>
                </div>
                <div className="pd-info-item">
                  <i className="bi bi-exclamation-triangle"></i>
                  <div>
                    <span className="pd-info-label">الحساسية</span>
                    {renderMedicalTags(profile.allergies, "allergy")}
                  </div>
                </div>
                <div className="pd-info-item">
                  <i className="bi bi-capsule"></i>
                  <div>
                    <span className="pd-info-label">الأدوية الحالية</span>
                    {renderMedicalTags(profile.currentMedication, "medication")}
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        show={deleteModal.show}
        title="تأكيد الحذف"
        message={
          <>
            هل أنت متأكد من حذف <strong>"{deleteModal.item?.name}"</strong>؟
          </>
        }
        confirmText={
          <>
            <i className="bi bi-trash"></i>
            نعم، احذف
          </>
        }
        cancelText="إلغاء"
        onConfirm={executeDelete}
        onCancel={() => setDeleteModal({ show: false, type: null, item: null })}
        isLoading={isDeleting}
        variant="danger"
      />

      {/* Action Menu Popup */}
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
              transform: "translate(-50%, -100%) translateY(-8px)",
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
