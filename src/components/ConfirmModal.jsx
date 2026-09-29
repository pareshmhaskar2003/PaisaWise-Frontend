import "../utils/ConfirmModal.css";

function ConfirmModal({
  isOpen,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  danger = false,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="confirm-modal-overlay"
      onClick={onCancel}
    >
      <div
        className="confirm-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="confirm-modal-icon">
          {danger ? "⚠️" : "❓"}
        </div>

        <h2>{title}</h2>

        <p>{message}</p>

        <div className="confirm-modal-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={onCancel}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className={
              danger
                ? "danger-button"
                : ""
            }
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;