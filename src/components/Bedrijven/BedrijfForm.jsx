import { useState, useEffect } from "react";
import { X, MapPin, Loader2 } from "lucide-react";
import axios from "axios";

export function BedrijfForm({ bedrijf, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    naam: "",
    adres: "",
    lat: "",
    lng: "",
    website: "",
    contactpersoon: "",
    email: "",
    telefoon: "",
    status: "geen-antwoord",
    type_materiaal: "",
    notities: "",
  });
  const [geocoding, setGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    if (bedrijf) {
      setFormData({
        naam: bedrijf.naam || "",
        adres: bedrijf.adres || "",
        lat: bedrijf.lat || "",
        lng: bedrijf.lng || "",
        website: bedrijf.website || "",
        contactpersoon: bedrijf.contactpersoon || "",
        email: bedrijf.email || "",
        telefoon: bedrijf.telefoon || "",
        status: bedrijf.status || "geen-antwoord",
        type_materiaal: bedrijf.type_materiaal || "",
        notities: bedrijf.notities || "",
      });
    }
  }, [bedrijf]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear geocode error when address changes
    if (name === "adres") {
      setGeocodeError("");

      // Clear previous timeout
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      // Only search if user has typed at least 3 characters
      if (value.length >= 3) {
        // Set a timeout to avoid too many API calls
        const timeout = setTimeout(() => {
          searchAddressSuggestions(value);
        }, 500); // Wait 500ms after user stops typing

        setSearchTimeout(timeout);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }
  };

  // Search for address suggestions as user types
  const searchAddressSuggestions = async (query) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&countrycodes=be&limit=5&addressdetails=1`,
        {
          headers: {
            "User-Agent": "Materialen-Kaart-App",
          },
        }
      );

      if (response.data && response.data.length > 0) {
        setSuggestions(response.data);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Suggestion search error:", error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Select a suggestion from the dropdown
  const selectSuggestion = (suggestion) => {
    setFormData((prev) => ({
      ...prev,
      adres: suggestion.display_name,
      lat: suggestion.lat,
      lng: suggestion.lon,
    }));
    setSuggestions([]);
    setShowSuggestions(false);
    setGeocodeError("");
  };

  // Geocode address to get lat/lng using Nominatim (OpenStreetMap)
  const handleGeocodeAddress = async () => {
    if (!formData.adres) {
      setGeocodeError("Vul eerst een adres in");
      return;
    }

    setGeocoding(true);
    setGeocodeError("");

    try {
      // Use Nominatim API (free, no API key needed)
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          formData.adres
        )}&countrycodes=be&limit=1`,
        {
          headers: {
            "User-Agent": "Materialen-Kaart-App",
          },
        }
      );

      if (response.data && response.data.length > 0) {
        const result = response.data[0];
        setFormData((prev) => ({
          ...prev,
          lat: result.lat,
          lng: result.lon,
        }));
        setGeocodeError("");
      } else {
        setGeocodeError(
          "Adres niet gevonden. Probeer een specifiekere locatie (bijv. 'Industrieweg 12, 9000 Gent, België')"
        );
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      setGeocodeError("Fout bij het opzoeken van de locatie");
    } finally {
      setGeocoding(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert lat/lng to numbers
    const dataToSave = {
      ...formData,
      lat: parseFloat(formData.lat),
      lng: parseFloat(formData.lng),
    };

    await onSave(dataToSave);

    // Reload page after save
    window.location.reload();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">
            {bedrijf ? "Bedrijf Bewerken" : "Nieuw Bedrijf Toevoegen"}
          </h2>
          <button onClick={onCancel} className="modal-close">
            <X style={{ width: "1.5rem", height: "1.5rem" }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-grid">
            <div className="form-grid-full">
              <label className="form-label">
                Bedrijfsnaam <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <input
                type="text"
                name="naam"
                value={formData.naam}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-grid-full">
              <label className="form-label">
                Adres <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    type="text"
                    name="adres"
                    value={formData.adres}
                    onChange={handleChange}
                    onFocus={() =>
                      suggestions.length > 0 && setShowSuggestions(true)
                    }
                    className="form-input"
                    style={{ flex: 1 }}
                    placeholder="Typ bijv. 'Gent' of 'Industrieweg 12, Gent'"
                    required
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={handleGeocodeAddress}
                    disabled={geocoding || !formData.adres}
                    className="btn btn-primary btn-icon"
                    title="Zoek locatie op basis van adres"
                    style={{
                      background:
                        "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.3)",
                    }}
                  >
                    {geocoding ? (
                      <Loader2
                        style={{
                          width: "1.25rem",
                          height: "1.25rem",
                          animation: "spin 1s linear infinite",
                        }}
                      />
                    ) : (
                      <MapPin style={{ width: "1.25rem", height: "1.25rem" }} />
                    )}
                    <span style={{ display: "none" }} className="btn-text-sm">
                      Zoek Locatie
                    </span>
                  </button>
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="suggestion-dropdown">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => selectSuggestion(suggestion)}
                        className="suggestion-item"
                      >
                        <MapPin
                          style={{
                            width: "1rem",
                            height: "1rem",
                            color: "#3b82f6",
                            marginTop: "0.25rem",
                            flexShrink: 0,
                          }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p
                            style={{
                              fontSize: "0.875rem",
                              fontWeight: 500,
                              color: "#111827",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {suggestion.display_name}
                          </p>
                          {suggestion.address && (
                            <p
                              style={{
                                fontSize: "0.75rem",
                                color: "#6b7280",
                                marginTop: "0.25rem",
                              }}
                            >
                              {[
                                suggestion.address.road,
                                suggestion.address.house_number,
                                suggestion.address.city ||
                                  suggestion.address.town ||
                                  suggestion.address.village,
                                suggestion.address.postcode,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {geocodeError && (
                <p
                  style={{
                    marginTop: "0.25rem",
                    fontSize: "0.875rem",
                    color: "#dc2626",
                  }}
                >
                  {geocodeError}
                </p>
              )}
            </div>

            <div className="form-grid-full info-box">
              <p className="info-box-title">
                💡 Tip: Begin met typen voor suggesties
              </p>
              <p>
                Typ een stad, straat of adres in België en selecteer een
                suggestie uit de lijst. De coördinaten worden automatisch
                ingevuld!
              </p>
            </div>

            <div>
              <label className="form-label">
                Latitude{" "}
                {!formData.lat && <span style={{ color: "#dc2626" }}>*</span>}
              </label>
              <input
                type="number"
                step="any"
                name="lat"
                value={formData.lat}
                onChange={handleChange}
                className="form-input"
                placeholder="51.0543"
                required
              />
            </div>

            <div>
              <label className="form-label">
                Longitude{" "}
                {!formData.lng && <span style={{ color: "#dc2626" }}>*</span>}
              </label>
              <input
                type="number"
                step="any"
                name="lng"
                value={formData.lng}
                onChange={handleChange}
                className="form-input"
                placeholder="3.7174"
                required
              />
            </div>

            <div className="form-grid-full">
              <label className="form-label">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="form-input"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="form-label">Contactpersoon</label>
              <input
                type="text"
                name="contactpersoon"
                value={formData.contactpersoon}
                onChange={handleChange}
                className="form-input"
                placeholder="Jan Janssens"
              />
            </div>

            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="jan@example.com"
              />
            </div>

            <div>
              <label className="form-label">Telefoon</label>
              <input
                type="tel"
                name="telefoon"
                value={formData.telefoon}
                onChange={handleChange}
                className="form-input"
                placeholder="+32 9 123 45 67"
              />
            </div>

            <div>
              <label className="form-label">
                Status <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="deal">Deal Gesloten</option>
                <option value="antwoord">Antwoord Gegeven</option>
                <option value="geen-antwoord">Geen Antwoord</option>
              </select>
            </div>

            <div className="form-grid-full">
              <label className="form-label">Type Materiaal</label>
              <input
                type="text"
                name="type_materiaal"
                value={formData.type_materiaal}
                onChange={handleChange}
                className="form-input"
                placeholder="Hout, Steen, Metaal, etc."
              />
            </div>

            <div className="form-grid-full">
              <label className="form-label">Notities</label>
              <textarea
                name="notities"
                value={formData.notities}
                onChange={handleChange}
                rows="3"
                className="form-textarea"
                placeholder="Extra informatie over dit bedrijf..."
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              paddingTop: "1rem",
              borderTop: "1px solid #e2e8f0",
            }}
          >
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              Annuleren
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              {bedrijf ? "Bijwerken" : "Toevoegen"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
