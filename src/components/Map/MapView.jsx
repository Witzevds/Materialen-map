import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Mail, Phone, Globe, Edit, Trash2 } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom colored markers
const createCustomIcon = (color) => {
  const svgIcon = `
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 9.375 12.5 28.125 12.5 28.125S25 21.875 25 12.5C25 5.596 19.404 0 12.5 0z" fill="${color}"/>
      <circle cx="12.5" cy="12.5" r="6" fill="white"/>
    </svg>
  `;
  return L.divIcon({
    html: svgIcon,
    className: "custom-marker",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
};

const getMarkerIcon = (status) => {
  switch (status) {
    case "deal":
      return createCustomIcon("#22c55e"); // green
    case "antwoord":
      return createCustomIcon("#f59e0b"); // orange
    case "geen-antwoord":
      return createCustomIcon("#ef4444"); // red
    default:
      return createCustomIcon("#3b82f6"); // blue
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case "deal":
      return "Deal Gesloten";
    case "antwoord":
      return "Antwoord Gegeven";
    case "geen-antwoord":
      return "Geen Antwoord";
    default:
      return status;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "deal":
      return "popup-badge-deal";
    case "antwoord":
      return "popup-badge-antwoord";
    case "geen-antwoord":
      return "popup-badge-geen";
    default:
      return "popup-badge-deal";
  }
};

export function MapView({ bedrijven, onEdit, onDelete }) {
  const center = [50.5039, 4.4699]; // België centrum
  const zoom = 7;

  return (
    <div className="h-full w-full">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {bedrijven.map((bedrijf) => (
          <Marker
            key={bedrijf.id}
            position={[bedrijf.lat, bedrijf.lng]}
            icon={getMarkerIcon(bedrijf.status)}
          >
            <Popup className="custom-popup" maxWidth={320}>
              <div className="popup-container">
                <h3 className="popup-title">{bedrijf.naam}</h3>

                <div className="popup-info">
                  <p className="popup-text">
                    <strong>Adres:</strong> {bedrijf.adres}
                  </p>

                  {bedrijf.website && (
                    <a
                      href={bedrijf.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="popup-link"
                    >
                      <Globe style={{ width: "1rem", height: "1rem" }} />
                      <span>Website bezoeken</span>
                    </a>
                  )}

                  {bedrijf.contactpersoon && (
                    <p className="popup-text">
                      <strong>Contact:</strong> {bedrijf.contactpersoon}
                    </p>
                  )}

                  {bedrijf.email && (
                    <a href={`mailto:${bedrijf.email}`} className="popup-link">
                      <Mail style={{ width: "1rem", height: "1rem" }} />
                      <span>{bedrijf.email}</span>
                    </a>
                  )}

                  {bedrijf.telefoon && (
                    <a href={`tel:${bedrijf.telefoon}`} className="popup-link">
                      <Phone style={{ width: "1rem", height: "1rem" }} />
                      <span>{bedrijf.telefoon}</span>
                    </a>
                  )}

                  {bedrijf.type_materiaal && (
                    <p className="popup-text">
                      <strong>Materiaal:</strong> {bedrijf.type_materiaal}
                    </p>
                  )}

                  <div>
                    <span className={getStatusColor(bedrijf.status)}>
                      {getStatusLabel(bedrijf.status)}
                    </span>
                  </div>

                  {bedrijf.notities && (
                    <p className="popup-notes">{bedrijf.notities}</p>
                  )}
                </div>

                <div className="popup-actions">
                  <button
                    onClick={() => onEdit(bedrijf)}
                    className="popup-btn popup-btn-edit"
                  >
                    <Edit style={{ width: "1rem", height: "1rem" }} />
                    <span>Bewerk</span>
                  </button>
                  <button
                    onClick={() => onDelete(bedrijf)}
                    className="popup-btn popup-btn-delete"
                  >
                    <Trash2 style={{ width: "1rem", height: "1rem" }} />
                    <span>Verwijder</span>
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
