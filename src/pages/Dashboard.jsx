import { useState } from "react";
import { useBedrijven } from "../hooks/useBedrijven.js";
import { MapView } from "../components/Map/MapView";
import { BedrijfForm } from "../components/Bedrijven/BedrijfForm";
import { DeleteConfirmation } from "../components/Bedrijven/DeleteConfirmation";
import { Navbar } from "../components/Layout/Navbar";
import {
  Plus,
  Filter,
  List,
  Map,
  Mail,
  Phone,
  Globe,
  Edit,
  Trash2,
} from "lucide-react";

export function Dashboard() {
  const { bedrijven, loading, addBedrijf, updateBedrijf, deleteBedrijf } =
    useBedrijven();
  const [showForm, setShowForm] = useState(false);
  const [editingBedrijf, setEditingBedrijf] = useState(null);
  const [deletingBedrijf, setDeletingBedrijf] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState("map"); // 'map' or 'list'

  const handleAddClick = () => {
    setEditingBedrijf(null);
    setShowForm(true);
  };

  const handleEditClick = (bedrijf) => {
    setEditingBedrijf(bedrijf);
    setShowForm(true);
  };

  const handleDeleteClick = (bedrijf) => {
    setDeletingBedrijf(bedrijf);
  };

  const handleSave = async (formData) => {
    if (editingBedrijf) {
      await updateBedrijf(editingBedrijf.id, formData);
    } else {
      await addBedrijf(formData);
    }
    setShowForm(false);
    setEditingBedrijf(null);
  };

  const handleConfirmDelete = async () => {
    if (deletingBedrijf) {
      await deleteBedrijf(deletingBedrijf.id);
      setDeletingBedrijf(null);
    }
  };

  const filteredBedrijven =
    filterStatus === "all"
      ? bedrijven
      : bedrijven.filter((b) => b.status === filterStatus);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {/* Filter Bar */}
        <div className="filter-bar">
          <div className="filter-container">
            <div className="filter-icon">
              <Filter
                style={{ width: "1rem", height: "1rem", color: "#475569" }}
              />
            </div>
            <span className="filter-label">Filter:</span>
            <div className="filter-pills">
              <button
                onClick={() => setFilterStatus("all")}
                className={`filter-pill ${
                  filterStatus === "all" ? "active-all" : "inactive-all"
                }`}
              >
                Alle ({bedrijven.length})
              </button>
              <button
                onClick={() => setFilterStatus("deal")}
                className={`filter-pill ${
                  filterStatus === "deal" ? "active-deal" : "inactive-deal"
                }`}
              >
                Deal ({bedrijven.filter((b) => b.status === "deal").length})
              </button>
              <button
                onClick={() => setFilterStatus("antwoord")}
                className={`filter-pill ${
                  filterStatus === "antwoord"
                    ? "active-antwoord"
                    : "inactive-antwoord"
                }`}
              >
                Antwoord (
                {bedrijven.filter((b) => b.status === "antwoord").length})
              </button>
              <button
                onClick={() => setFilterStatus("geen-antwoord")}
                className={`filter-pill ${
                  filterStatus === "geen-antwoord"
                    ? "active-geen"
                    : "inactive-geen"
                }`}
              >
                Geen Antwoord (
                {bedrijven.filter((b) => b.status === "geen-antwoord").length})
              </button>
            </div>

            {/* View Toggle */}
            <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => setViewMode("map")}
                className={`filter-pill ${
                  viewMode === "map" ? "active-all" : "inactive-all"
                }`}
                title="Kaartweergave"
              >
                <Map style={{ width: "1rem", height: "1rem" }} />
                <span style={{ marginLeft: "0.375rem" }}>Kaart</span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`filter-pill ${
                  viewMode === "list" ? "active-all" : "inactive-all"
                }`}
                title="Lijstweergave"
              >
                <List style={{ width: "1rem", height: "1rem" }} />
                <span style={{ marginLeft: "0.375rem" }}>Lijst</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Area - Map or List */}
        <div style={{ flex: 1, overflow: "hidden" }}>
          {loading ? (
            <div className="loading-container">
              <div style={{ textAlign: "center" }}>
                <div className="loading-spinner"></div>
                <p style={{ color: "#475569", fontWeight: 500 }}>Laden...</p>
              </div>
            </div>
          ) : filteredBedrijven.length === 0 ? (
            <div className="loading-container">
              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    color: "#475569",
                    marginBottom: "1.5rem",
                    fontSize: "1.125rem",
                  }}
                >
                  {filterStatus === "all"
                    ? "Nog geen bedrijven toegevoegd."
                    : "Geen bedrijven met deze status."}
                </p>
                {filterStatus === "all" && (
                  <button
                    onClick={handleAddClick}
                    className="btn btn-primary"
                    style={{ padding: "0.75rem 1.5rem" }}
                  >
                    Voeg je eerste bedrijf toe
                  </button>
                )}
              </div>
            </div>
          ) : viewMode === "map" ? (
            <MapView
              bedrijven={filteredBedrijven}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ) : (
            <div className="backlog-container">
              <div className="backlog-list">
                {filteredBedrijven.map((bedrijf) => (
                  <div key={bedrijf.id} className="backlog-item">
                    <div className="backlog-item-header">
                      <h3 className="backlog-item-title">{bedrijf.naam}</h3>
                      <span
                        className={`backlog-badge ${
                          bedrijf.status === "deal"
                            ? "backlog-badge-deal"
                            : bedrijf.status === "antwoord"
                            ? "backlog-badge-antwoord"
                            : "backlog-badge-geen"
                        }`}
                      >
                        {bedrijf.status === "deal"
                          ? "Deal Gesloten"
                          : bedrijf.status === "antwoord"
                          ? "Antwoord Gegeven"
                          : "Geen Antwoord"}
                      </span>
                    </div>

                    <div className="backlog-item-content">
                      <div className="backlog-item-info">
                        <p className="backlog-item-text">
                          <strong>Adres:</strong> {bedrijf.adres}
                        </p>

                        {bedrijf.type_materiaal && (
                          <p className="backlog-item-text">
                            <strong>Materiaal:</strong> {bedrijf.type_materiaal}
                          </p>
                        )}

                        {bedrijf.contactpersoon && (
                          <p className="backlog-item-text">
                            <strong>Contactpersoon:</strong>{" "}
                            {bedrijf.contactpersoon}
                          </p>
                        )}

                        <div className="backlog-item-contact">
                          {bedrijf.email && (
                            <a
                              href={`mailto:${bedrijf.email}`}
                              className="backlog-link"
                            >
                              <Mail style={{ width: "1rem", height: "1rem" }} />
                              <span>{bedrijf.email}</span>
                            </a>
                          )}

                          {bedrijf.telefoon && (
                            <a
                              href={`tel:${bedrijf.telefoon}`}
                              className="backlog-link"
                            >
                              <Phone
                                style={{ width: "1rem", height: "1rem" }}
                              />
                              <span>{bedrijf.telefoon}</span>
                            </a>
                          )}

                          {bedrijf.website && (
                            <a
                              href={bedrijf.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="backlog-link"
                            >
                              <Globe
                                style={{ width: "1rem", height: "1rem" }}
                              />
                              <span>Website</span>
                            </a>
                          )}
                        </div>

                        {bedrijf.notities && (
                          <p className="backlog-item-notes">
                            <strong>Notities:</strong> {bedrijf.notities}
                          </p>
                        )}
                      </div>

                      <div className="backlog-item-actions">
                        <button
                          onClick={() => handleEditClick(bedrijf)}
                          className="btn btn-secondary btn-icon"
                          style={{ flex: 1 }}
                        >
                          <Edit style={{ width: "1rem", height: "1rem" }} />
                          <span>Bewerk</span>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(bedrijf)}
                          className="btn btn-danger btn-icon"
                          style={{ flex: 1 }}
                        >
                          <Trash2 style={{ width: "1rem", height: "1rem" }} />
                          <span>Verwijder</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Floating Add Button */}
        <button
          onClick={handleAddClick}
          className="floating-button"
          title="Nieuw bedrijf toevoegen"
        >
          <Plus style={{ width: "1.5rem", height: "1.5rem" }} />
          <span className="floating-button-tooltip">Nieuw Bedrijf</span>
        </button>
      </div>

      {/* Modals */}
      {showForm && (
        <BedrijfForm
          bedrijf={editingBedrijf}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingBedrijf(null);
          }}
        />
      )}

      {deletingBedrijf && (
        <DeleteConfirmation
          bedrijf={deletingBedrijf}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingBedrijf(null)}
        />
      )}
    </div>
  );
}
