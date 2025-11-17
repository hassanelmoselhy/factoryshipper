import React, { useEffect, useState } from "react";
import "./css/ShipperProfile.css";
import {
  Building2,
  Mail,
  MapPin,
  Pencil,
  PencilLine,
  Phone,
  Plus,
  Trash,
  User,
  UserPen,
  X,
} from "lucide-react";
import useUserStore from "../../Store/UserStore/userStore";

export default function ShipperProfile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useUserStore((state) => state.user);

  // Modal visibility
  const [isPersonalInfoModalOpen, setIsPersonalInfoModalOpen] = useState(false);
  const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false);
  const [isCompanyInfoModalOpen, setIsCompanyInfoModalOpen] = useState(false);

  // Form states
  const [personalInfoForm, setPersonalInfoForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phones: [],
  });

  const [companyInfoForm, setCompanyInfoForm] = useState({
    companyName: "",
    typeOfProduction: "",
    website: "",
  });

  const [currentAddressBeingEdited, setCurrentAddressBeingEdited] = useState(null);
  const [addressForm, setAddressForm] = useState({
    street: "",
    city: "",
    governorate: "",
    details: "",
    googleMapLink: "",
  });

  // ================= FETCH REAL DATA =================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          "https://stakeexpress.runasp.net/api/Shippers/shipper-profile",
          {
            method: "GET",
            headers: {
              "X-Client-Key": "web api",
              Authorization: `Bearer ${user?.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch profile data");

        const result = await response.json();
        setData(result.data || null); // استخدام result.data
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) fetchProfile();
  }, [user]);

  // ================= UPDATE FORMS =================
  useEffect(() => {
    if (data) {
      setPersonalInfoForm({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        phones: data.phones || [],
      });

      setCompanyInfoForm({
        companyName: data.companyName || "",
        typeOfProduction: data.typeOfProduction || "",
        website: data.companyLink || "",
      });
    }
  }, [data]);

  if (loading) return <p className="loading">Loading...</p>;
  if (!data) return <p className="error">Failed to load profile data.</p>;

  // ================= MODAL HANDLERS =================
  const openPersonalInfoModal = () => setIsPersonalInfoModalOpen(true);
  const closePersonalInfoModal = () => setIsPersonalInfoModalOpen(false);

  const openCompanyInfoModal = () => setIsCompanyInfoModalOpen(true);
  const closeCompanyInfoModal = () => setIsCompanyInfoModalOpen(false);

  const openEditAddressModal = (addressIndex = -1) => {
    setCurrentAddressBeingEdited(addressIndex);
    if (addressIndex !== -1 && data.addresses?.[addressIndex]) {
      const address = data.addresses[addressIndex];
      setAddressForm({
        street: address.street || "",
        city: address.city || "",
        governorate: address.governorate || "",
        details: address.details || "",
        googleMapLink: address.googleMapAddressLink || "",
      });
    } else {
      setAddressForm({ street: "", city: "", governorate: "", details: "", googleMapLink: "" });
    }
    setIsEditAddressModalOpen(true);
  };
  const closeEditAddressModal = () => setIsEditAddressModalOpen(false);

  // ================= FORM HANDLERS =================
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfoForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (index, e) => {
    const newPhones = [...personalInfoForm.phones];
    newPhones[index] = e.target.value;
    setPersonalInfoForm((prev) => ({ ...prev, phones: newPhones }));
  };

  const addPhoneInput = () => {
    setPersonalInfoForm((prev) => ({
      ...prev,
      phones: [...prev.phones, ""],
    }));
  };

  const removePhoneInput = (index) => {
    const newPhones = personalInfoForm.phones.filter((_, i) => i !== index);
    setPersonalInfoForm((prev) => ({ ...prev, phones: newPhones }));
  };

  const handleCompanyInfoChange = (e) => {
    const { name, value } = e.target;
    setCompanyInfoForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  // ================= FORM SUBMIT =================
  const handleSavePersonalInfo = (e) => {
    e.preventDefault();
    setData((prev) => ({
      ...prev,
      firstName: personalInfoForm.firstName,
      lastName: personalInfoForm.lastName,
      email: personalInfoForm.email,
      phones: personalInfoForm.phones.filter((p) => p.trim() !== ""),
    }));
    closePersonalInfoModal();
  };

  const handleSaveCompanyInfo = (e) => {
    e.preventDefault();
    setData((prev) => ({
      ...prev,
      companyName: companyInfoForm.companyName,
      typeOfProduction: companyInfoForm.typeOfProduction,
      companyLink: companyInfoForm.website,
    }));
    closeCompanyInfoModal();
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    const updatedAddresses = [...(data.addresses || [])];
    const newAddress = { ...addressForm };

    if (currentAddressBeingEdited !== -1) {
      updatedAddresses[currentAddressBeingEdited] = newAddress;
    } else {
      updatedAddresses.push(newAddress);
    }

    setData((prev) => ({
      ...prev,
      addresses: updatedAddresses,
    }));
    closeEditAddressModal();
  };

  const handleDeleteAddress = (index) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      const updatedAddresses = (data.addresses || []).filter((_, i) => i !== index);
      setData((prev) => ({
        ...prev,
        addresses: updatedAddresses,
      }));
    }
  };

  // ================= RENDER =================
  return (
    <div className="shipper-profile">
      {/* ================= HEADER ================= */}
      <div className="profile-header">
        <div className="avatar-circle">
          <span>{data.firstName?.[0] || ""}{data.lastName?.[0] || ""}</span>
        </div>
        <div className="header-text">
          <div className="name-id">
            <h1>{data.firstName || ""} {data.lastName || ""}</h1>
            <div className="shipper-id-badge">
              <span>ID:</span> {data.shipperId || "-"}
            </div>
          </div>
          <p className="sub-title">Shipper Account</p>
        </div>
      </div>

      {/* ================= 3 COLUMNS ================= */}
      <div className="cards-grid">
        {/* PERSONAL INFORMATION */}
        <div className="profile-card">
          <div className="card-header">
            <h3><User className="card-icon" /> Personal Information</h3>
            <button className="edit-btn-small" onClick={openPersonalInfoModal}><PencilLine /> Edit</button>
          </div>
          <p className="card-subtitle">Your contact details</p>
          <div className="full-name">
            <UserPen className="icon" />
            <div>
              <strong>First Name</strong>
              <p>{data.firstName || "Not provided"}</p>
            </div>
            <div>
              <strong>Last Name</strong>
              <p>{data.lastName || "Not provided"}</p>
            </div>
          </div>
          <div className="info-row">
            <Mail className="icon" />
            <div>
              <strong>Email</strong>
              <p>{data.email || "Not provided"}</p>
            </div>
          </div>
          <div className="info-row">
            <Phone className="icon" />
            <div>
              <strong>Phone</strong>
              <p>{(data.phones || []).join(", ") || "No phone provided"}</p>
            </div>
          </div>
        </div>

        {/* ADDRESS INFORMATION */}
        <div className="profile-card">
          <div className="card-header">
            <h3><MapPin className="card-icon" /> Addresses</h3>
            <button className="add-btn" onClick={() => openEditAddressModal(-1)}><Plus /> Add</button>
          </div>
          <p className="card-subtitle">Shipping location details</p>
          <div className="addresses-container">
            {(data.addresses || []).map((address, index) => (
              <div className="address-box" key={index}>
                <div className="address-header">
                  <strong>Address {index + 1}</strong>
                  <div className="address-actions">
                    <button className="edit-icon" onClick={() => openEditAddressModal(index)}><Pencil /></button>
                    <button className="delete-icon" onClick={() => handleDeleteAddress(index)}><Trash size={16} /></button>
                  </div>
                </div>
                <p><strong>Street</strong><br />{address.street || "Not provided"}</p>
                <p><strong>City</strong><br />{address.city || "Not provided"}</p>
                <p><strong>Governorate</strong><br />{address.governorate || "Not provided"}</p>
                {address.details && <p><strong>Details</strong><br />{address.details}</p>}
                <p><strong>Google Map</strong><br />
                  {address.googleMapAddressLink ? (
                    <a href={address.googleMapAddressLink} target="_blank" rel="noopener noreferrer">View on Map</a>
                  ) : (
                    <span className="muted">No map link provided</span>
                  )}
                </p>
              </div>
            ))}
            {(data.addresses || []).length === 0 && <p className="muted">No addresses added yet.</p>}
          </div>
        </div>

        {/* COMPANY INFORMATION */}
        <div className="profile-card">
          <div className="card-header">
            <h3><Building2 /> Company Information</h3>
            <button className="edit-btn-small" onClick={openCompanyInfoModal}><PencilLine /> Edit</button>
          </div>
          <p className="card-subtitle">Business details</p>
          <div className="card-body">
            <p><strong>Company Name</strong><br />{data.companyName || "Not provided"}</p>
            <p><strong>Type of Production</strong><br /><span className="muted">{data.typeOfProduction || "Not provided"}</span></p>
            <p><strong>Website</strong><br />
              {data.companyLink ? (
                <a href={data.companyLink} target="_blank" rel="noopener noreferrer">{data.companyLink}</a>
              ) : (
                <span className="muted">No website provided</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* ================= MODALS ================= */}

      {/* Personal Information Edit Modal */}
      {isPersonalInfoModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <X className="close-button" onClick={closePersonalInfoModal} />
              <h4>Edit Personal Information</h4>
            </div>
            <form onSubmit={handleSavePersonalInfo}>
              <p className="modal-subtitle">Update your name, email, and phone numbers</p>
              <div className="form-group inline">
                <div>
                  <label htmlFor="firstName">First Name</label>
                  <input type="text" id="firstName" name="firstName" value={personalInfoForm.firstName} onChange={handlePersonalInfoChange} required />
                </div>
                <div>
                  <label htmlFor="lastName">Last Name</label>
                  <input type="text" id="lastName" name="lastName" value={personalInfoForm.lastName} onChange={handlePersonalInfoChange} required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={personalInfoForm.email} onChange={handlePersonalInfoChange} required />
              </div>
              <div className="form-group">
                <label>Phone Numbers</label>
                <div id="phoneNumbersContainer">
                  {personalInfoForm.phones.map((phone, index) => (
                    <div className="phone-input-group" key={index}>
                      {personalInfoForm.phones.length > 1 ? (
                        <button type="button" className="remove-phone" onClick={() => removePhoneInput(index)}>
                          <Trash  size={20} />
                        </button>
                      ) : (
                        <button type="button" className="add-phone" onClick={addPhoneInput}>
                          <Plus size={20} />
                        </button>
                      )}
                      <input
                        type="text"
                        className="phone-number-input"
                        placeholder="Phone number"
                        value={phone}
                        onChange={(e) => handlePhoneChange(index, e)}
                        required={index === 0}
                      />
                    </div>
                  ))}
                  {personalInfoForm.phones.length === 0 && (
                      <button type="button" className="add-phone-initial" onClick={addPhoneInput}>
                        <Plus size={20} /> Add Phone
                      </button>
                  )}
                </div>
              </div>
              <button type="submit" className="btn-save-changes">Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit/Add Address Modal */}
      {isEditAddressModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <X className="close-button" onClick={closeEditAddressModal} />
              <h4>{currentAddressBeingEdited !== -1 ? "Edit Address" : "Add New Address"}</h4>
            </div>
            <form onSubmit={handleSaveAddress}>
              <p className="modal-subtitle">Update your shipping location details</p>
              <div className="form-group">
                <label htmlFor="addressStreet">Street</label>
                <input type="text" id="addressStreet" name="street" value={addressForm.street} onChange={handleAddressChange} required />
              </div>
              <div className="form-group inline">
                <div>
                  <label htmlFor="addressCity">City</label>
                  <input type="text" id="addressCity" name="city" value={addressForm.city} onChange={handleAddressChange} required />
                </div>
                <div>
                  <label htmlFor="addressGovernorate">Governorate</label>
                  <input type="text" id="addressGovernorate" name="governorate" value={addressForm.governorate} onChange={handleAddressChange} required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="addressDetails">Details (Optional)</label>
                <textarea id="addressDetails" name="details" rows="3" value={addressForm.details} onChange={handleAddressChange}></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="googleMapLink">Google Map Link (Optional)</label>
                <input type="text" id="googleMapLink" name="googleMapLink" value={addressForm.googleMapLink} onChange={handleAddressChange} />
              </div>
              <button type="submit" className="btn-save-changes">Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {/* Company Information Edit Modal */}
      {isCompanyInfoModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <X className="close-button" onClick={closeCompanyInfoModal} />
              <h4>Edit Company Information</h4>
            </div>
            <form onSubmit={handleSaveCompanyInfo}>
              <p className="modal-subtitle">Update your business details</p>
              <div className="form-group">
                <label htmlFor="companyName">Company Name</label>
                <input type="text" id="companyName" name="companyName" value={companyInfoForm.companyName} onChange={handleCompanyInfoChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="typeOfProduction">Type of Production</label>
                <input type="text" id="typeOfProduction" name="typeOfProduction" value={companyInfoForm.typeOfProduction} onChange={handleCompanyInfoChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="website">Website (Optional)</label>
                <input type="text" id="website" name="website" value={companyInfoForm.website} onChange={handleCompanyInfoChange} />
              </div>
              <button type="submit" className="btn-save-changes">Save Changes</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
