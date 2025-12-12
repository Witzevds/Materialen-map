import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error } = await signIn(email, password);

    if (error) {
      setError("Onjuiste inloggegevens. Probeer opnieuw.");
      setLoading(false);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div className="login-icon" style={{ display: "inline-flex" }}>
            <LogIn
              style={{ width: "1.75rem", height: "1.75rem", color: "white" }}
            />
          </div>
        </div>

        <h2 className="login-title">Materialen Kaart</h2>
        <p className="login-subtitle">Log in om verder te gaan</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="admin@materialen.local"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Wachtwoord
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="alert-error" style={{ marginBottom: "1rem" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: "100%" }}
          >
            {loading ? "Bezig met inloggen..." : "Inloggen"}
          </button>
        </form>

        <div
          style={{
            marginTop: "1.5rem",
            textAlign: "center",
            fontSize: "0.875rem",
            color: "#64748b",
          }}
        >
          <p>Geen account? Neem contact op met de beheerder.</p>
        </div>
      </div>
    </div>
  );
}
