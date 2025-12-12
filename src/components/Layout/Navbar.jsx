import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { LogOut, MapPin } from "lucide-react";

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="navbar-icon">
            <MapPin
              style={{ width: "1.25rem", height: "1.25rem", color: "white" }}
            />
          </div>
          <div>
            <h1 className="navbar-title">Materialen Kaart</h1>
            <p className="navbar-subtitle">Leveranciers Overzicht</p>
          </div>
        </div>

        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{ textAlign: "right", display: "none" }}
              className="navbar-user-info"
            >
              <p
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#334155",
                }}
              >
                {user.email}
              </p>
              <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Ingelogd</p>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary">
              <LogOut style={{ width: "1rem", height: "1rem" }} />
              <span>Uitloggen</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
