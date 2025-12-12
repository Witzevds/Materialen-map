import { AlertTriangle } from "lucide-react";

export function DeleteConfirmation({ bedrijf, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: "28rem" }}>
        <div style={{ padding: "2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <div
              style={{
                background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
                padding: "1rem",
                borderRadius: "1rem",
                display: "inline-flex",
              }}
            >
              <AlertTriangle
                style={{ width: "2rem", height: "2rem", color: "#f43f5e" }}
              />
            </div>
          </div>

          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              textAlign: "center",
              color: "#1e293b",
              marginBottom: "0.75rem",
            }}
          >
            Bedrijf Verwijderen?
          </h2>

          <p
            style={{
              textAlign: "center",
              color: "#475569",
              marginBottom: "1rem",
            }}
          >
            Weet je zeker dat je{" "}
            <strong style={{ color: "#1e293b" }}>{bedrijf.naam}</strong> wil
            verwijderen?
          </p>

          <p
            style={{
              textAlign: "center",
              fontSize: "0.875rem",
              color: "#f43f5e",
              marginBottom: "2rem",
            }}
          >
            Deze actie kan niet ongedaan gemaakt worden.
          </p>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={onCancel}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              Annuleren
            </button>
            <button
              onClick={onConfirm}
              className="btn btn-danger"
              style={{ flex: 1 }}
            >
              Verwijderen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
