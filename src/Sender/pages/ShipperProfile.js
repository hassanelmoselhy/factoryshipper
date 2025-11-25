import React, { useEffect, useState, useCallback } from "react";
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
  Save,
  RotateCcw,
  Check,
} from "lucide-react";
import useUserStore from "../../Store/UserStore/userStore";
import Swal from "sweetalert2";

export default function ShipperProfile() {
  // ================= STATE MANAGEMENT =================
  const [data, setData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Track which field is currently being edited inline
  const [editingField, setEditingField] = useState(null);

  // Track IDs of addresses deleted locally
  const [deletedAddressIds, setDeletedAddressIds] = useState([]);

  const user = useUserStore((state) => state.user);

  // Modals
  const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false);
  const [isCompanyInfoModalOpen, setIsCompanyInfoModalOpen] = useState(false);

  // Forms
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

  const [addressForm, setAddressForm] = useState({
    id: null,
    street: "",
    city: "",
    governorate: "",
    details: "",
    googleMapLink: "",
  });
  
  const [currentAddressBeingEdited, setCurrentAddressBeingEdited] = useState(null);

  // ================= 1. FETCH DATA =================
  const fetchProfile = useCallback(async () => {
    if (!user?.token) return;

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
      const fetchedData = result.data || null;

      setData(fetchedData);
      setOriginalData(JSON.parse(JSON.stringify(fetchedData)));
      setDeletedAddressIds([]);
    } catch (error) {
      console.error("Error fetching profile:", error);
      Swal.fire("Error", "Failed to load profile data", "error");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // ================= 2. SYNC FORMS =================
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

  // ================= 3. CHANGE DETECTION =================
  const hasChanges =
    JSON.stringify(data) !== JSON.stringify(originalData) ||
    deletedAddressIds.length > 0;

  // ================= 4. INLINE EDIT HANDLERS =================

  const startEditing = (field) => {
    // Reset form to current data state before editing
    setPersonalInfoForm({
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: data.email || "",
      phones: data.phones ? [...data.phones] : [],
    });
    setEditingField(field);
  };

  const cancelEditing = () => {
    setEditingField(null);
  };

  // ----------------------------------------------------------------
  // NEW: AUTOMATIC SAVE HANDLER FOR INLINE FIELDS (TICK ICON)
  // ----------------------------------------------------------------
  const handleInlineSave = async () => {
    const headers = { 
        "X-Client-Key": "web api", 
        Authorization: `Bearer ${user?.token}`, 
        "Content-Type": "application/json" 
    };

    Swal.fire({
      title: "Saving...",
      didOpen: () => Swal.showLoading(),
      allowOutsideClick: false,
      background: 'transparent',
      color: '#fff',
      backdrop: 'rgba(0,0,0,0.5)',
      showConfirmButton: false, 
    });

    try {
      // === CASE 1: NAMES (First or Last) ===
      if (editingField === 'firstName' || editingField === 'lastName') {
        const payload = {
            firstName: personalInfoForm.firstName,
            lastName: personalInfoForm.lastName
        };
        
        const response = await fetch("https://stakeexpress.runasp.net/api/Shippers/update-shipper-name", {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Failed to update name");

        // Update local state and original state to reflect saved changes
        const newData = { ...data, firstName: payload.firstName, lastName: payload.lastName };
        setData(newData);
        setOriginalData(prev => ({ ...prev, firstName: payload.firstName, lastName: payload.lastName }));
      }

      // === CASE 2: EMAIL ===
      else if (editingField === 'email') {
        // The endpoint edits the whole profile, so we need to include existing company data
        const payload = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: personalInfoForm.email,
          companyName: data.companyName, 
          typeOfProduction: data.typeOfProduction,
          companyLink: data.companyLink,
        };

        const response = await fetch("https://stakeexpress.runasp.net/api/Shippers/edit-shipper-profile", {
          method: "PUT",
          headers: headers,
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Failed to update email");

        const newData = { ...data, email: personalInfoForm.email };
        setData(newData);
        setOriginalData(prev => ({ ...prev, email: personalInfoForm.email }));
      }

      // === CASE 3: PHONES ===
      else if (editingField === 'phones') {
        const originalPhones = data.phones || [];
        const currentPhones = personalInfoForm.phones.filter((p) => p.trim() !== "");
        
        const phonesToAdd = currentPhones.filter((p) => !originalPhones.includes(p));
        const phonesToDelete = originalPhones.filter((p) => !currentPhones.includes(p));
        
        const promises = [];

        // Additions
        phonesToAdd.forEach((phone) => {
          const url = `https://stakeexpress.runasp.net/api/Shippers/Add-Phone-Number`;
          promises.push(fetch(url, { method: "POST", headers: headers, body: JSON.stringify({ phoneNumber: phone }) }));
        });

        // Deletions
        phonesToDelete.forEach((phone) => {
          const url = `https://stakeexpress.runasp.net/api/Shippers/Delete-Phone-Number`;
          promises.push(fetch(url, { method: "DELETE", headers: headers, body: JSON.stringify({ phoneNumber: phone }) }));
        });

        await Promise.all(promises);

        const newData = { ...data, phones: currentPhones };
        setData(newData);
        setOriginalData(prev => ({ ...prev, phones: currentPhones }));
      }

      Swal.close();
      Swal.fire({
        icon: 'success',
        title: 'Saved!',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500
      });
      
      setEditingField(null);

    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Could not save changes.", "error");
    }
  };


  // ================= 5. GLOBAL SAVE ENGINE (Still used for Addresses/Company) =================

  const handleGlobalCancelChanges = () => {
    if (window.confirm("Are you sure you want to discard all changes?")) {
      setData(JSON.parse(JSON.stringify(originalData)));
      setDeletedAddressIds([]);
      setEditingField(null);
    }
  };

  const handleGlobalSaveChanges = async () => {
    setEditingField(null);

    Swal.fire({
      title: "Saving...",
      text: "Updating database records",
      didOpen: () => Swal.showLoading(),
      allowOutsideClick: false,
    });

    const promises = [];
    const headers = { 
        "X-Client-Key": "web api", 
        Authorization: `Bearer ${user?.token}`, 
        "Content-Type": "application/json" 
    };

    // Note: Names, Email, and Phone logic is also here as a fallback, 
    // but the inline edit now handles them immediately.
    
    // --- ADDRESSES ---
    deletedAddressIds.forEach((id) => {
      if (!id) return;
      const url = `https://stakeexpress.runasp.net/api/Shippers/delete-shipper-address/${id}`;
      const promise = fetch(url, { method: "DELETE", headers: headers });
      promises.push(promise);
    });

    if (data.addresses) {
      data.addresses.forEach((address) => {
        const payload = {
          street: address.street,
          city: address.city,
          governorate: address.governorate,
          details: address.details,
          googleMapAddressLink: address.googleMapAddressLink,
        };

        if (!address.id || address.id < 0) {
          const url = "https://stakeexpress.runasp.net/api/Shippers/add-shipper-address";
          const promise = fetch(url, { method: "POST", headers: headers, body: JSON.stringify(payload) });
          promises.push(promise);
        } else {
          // Check if this specific address changed
          const originalAddr = originalData.addresses?.find((a) => a.id === address.id || a.addressId === address.id);
          
          // Only update if it actually changed to save bandwidth
          const hasAddrChanged = !originalAddr || 
            originalAddr.street !== address.street ||
            originalAddr.city !== address.city ||
            originalAddr.governorate !== address.governorate ||
            originalAddr.details !== address.details ||
            originalAddr.googleMapAddressLink !== address.googleMapAddressLink;

          if (hasAddrChanged) {
            const url = `https://stakeexpress.runasp.net/api/Shippers/update-shipper-address/${address.id}`;
            const promise = fetch(url, { method: "PUT", headers: headers, body: JSON.stringify(payload) });
            promises.push(promise);
          }
        }
      });
    }

    // --- COMPANY INFORMATION ---
    const isCompanyChanged = 
      data.companyName !== originalData.companyName ||
      data.typeOfProduction !== originalData.typeOfProduction ||
      data.companyLink !== originalData.companyLink;

    if (isCompanyChanged) {
      const companyPayload = {
        companyName: data.companyName,
        companyLink: data.companyLink,
        typeOfProduction: data.typeOfProduction
      };
      const url = "https://stakeexpress.runasp.net/api/Shippers/update-company-information";
      promises.push(fetch(url, { method: "PUT", headers: headers, body: JSON.stringify(companyPayload) }));
    }

    try {
      await Promise.all(promises);
      Swal.fire({ icon: "success", title: "All Changes Saved!", timer: 1500, showConfirmButton: false });
      fetchProfile();
    } catch (error) {
      console.error("Global Save Error:", error);
      Swal.fire({ icon: "error", title: "Save Incomplete", text: "Some changes might not have been saved." });
      fetchProfile();
    }
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (!data) return <p className="error">Failed to load profile data.</p>;

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
    if (personalInfoForm.phones.length < 3) {
      setPersonalInfoForm((prev) => ({ ...prev, phones: [...prev.phones, ""] }));
    } else {
      Swal.fire("Limit Reached", "Maximum 3 phone numbers allowed.", "warning");
    }
  };

  const removePhoneInput = (index) => {
    const newPhones = personalInfoForm.phones.filter((_, i) => i !== index);
    setPersonalInfoForm((prev) => ({ ...prev, phones: newPhones }));
  };

  const openCompanyInfoModal = () => setIsCompanyInfoModalOpen(true);
  const closeCompanyInfoModal = () => setIsCompanyInfoModalOpen(false);

  const openEditAddressModal = (addressIndex = -1) => {
    setCurrentAddressBeingEdited(addressIndex);
    if (addressIndex !== -1 && data.addresses?.[addressIndex]) {
      const address = data.addresses[addressIndex];
      const existingId = address.id || address.addressId || address.shipperAddressId || null;
      setAddressForm({
        id: existingId,
        street: address.street || "",
        city: address.city || "",
        governorate: address.governorate || "",
        details: address.details || "",
        googleMapLink: address.googleMapAddressLink || "",
      });
    } else {
      setAddressForm({
        id: null, street: "", city: "", governorate: "", details: "", googleMapLink: "",
      });
    }
    setIsEditAddressModalOpen(true);
  };
  const closeEditAddressModal = () => setIsEditAddressModalOpen(false);

  const handleCompanyInfoChange = (e) => {
    const { name, value } = e.target;
    setCompanyInfoForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
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
    const newAddressData = {
      street: addressForm.street,
      city: addressForm.city,
      governorate: addressForm.governorate,
      details: addressForm.details,
      googleMapAddressLink: addressForm.googleMapLink,
    };

    if (currentAddressBeingEdited !== -1) {
      const existingAddress = updatedAddresses[currentAddressBeingEdited];
      updatedAddresses[currentAddressBeingEdited] = { ...newAddressData, id: existingAddress.id };
    } else {
      updatedAddresses.push({ ...newAddressData, id: -Date.now() });
    }
    setData((prev) => ({ ...prev, addresses: updatedAddresses }));
    closeEditAddressModal();
  };

  const handleDeleteAddress = (index) => {
    const addresses = data.addresses || [];
    if (addresses.length <= 1) {
      Swal.fire({ icon: "error", title: "Cannot Delete", text: "You must have at least one address." });
      return;
    }
    const addressToDelete = addresses[index];
    const id = addressToDelete.id || addressToDelete.addressId;
    if (id && id > 0) {
      setDeletedAddressIds((prev) => [...prev, id]);
    }
    const newAddresses = addresses.filter((_, i) => i !== index);
    setData((prev) => ({ ...prev, addresses: newAddresses }));
  };

  // ================= RENDER =================
  return (
    <div className="shipper-profile">
      
      <div className="profile-header">
        <div className="header-left-section">
          <div className="avatar-circle">
            <span>
              {data.firstName?.[0] || ""}
              {data.lastName?.[0] || ""}
            </span>
          </div>
          <div className="header-text">
            <div className="name-id">
              <h1>
                {data.firstName || ""} {data.lastName || ""}
              </h1>
              <div className="shipper-id-badge">
                <span>ID:</span> {data.shipperId || "-"}
              </div>
            </div>
            <p className="sub-title">Shipper Account</p>
          </div>
        </div>

        {/* HEADER BUTTONS (Only shown if Addresses/Company info are modified but not saved) */}
        {hasChanges && (
          <div className="header-right-section">
            <button className="btn-header-cancel" onClick={handleGlobalCancelChanges}>
              <RotateCcw size={16} /> Cancel
            </button>
            <button className="btn-header-save" onClick={handleGlobalSaveChanges}>
              <Save size={16} /> Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="cards-grid">
        
        {/* ============ PERSONAL INFO SECTION ============ */}
        <div className="profile-card">
          <div className="card-header">
            <h3><User className="card-icon" style={{ marginRight: '8px' }} /> Personal Information</h3>
          </div>

          {/* --- FIRST NAME --- */}
          <div className="isolated-field">
            <div className="field-content" style={{ width: '100%' }}>
              <UserPen className="icon" />
              <div className="field-info" style={{ width: '100%' }}>
                <strong>First Name</strong>
                {editingField === 'firstName' ? (
                  <div className="inline-edit-wrapper">
                    <input
                      className="inline-input"
                      name="firstName"
                      value={personalInfoForm.firstName}
                      onChange={handlePersonalInfoChange}
                      autoFocus
                    />
                    <button className="btn-inline-action btn-inline-save" onClick={handleInlineSave} title="Save">
                      <Check size={18} />
                    </button>
                    <button className="btn-inline-action btn-inline-cancel" onClick={cancelEditing} title="Cancel">
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <p>{data.firstName || "Not provided"}</p>
                )}
              </div>
            </div>

            {editingField !== 'firstName' && (
              <button className="edit-btn-small" title="Edit First Name" onClick={() => startEditing('firstName')}>
                <PencilLine size={20} />
              </button>
            )}
          </div>

          {/* --- LAST NAME --- */}
          <div className="isolated-field">
            <div className="field-content" style={{ width: '100%' }}>
              <UserPen className="icon" />
              <div className="field-info" style={{ width: '100%' }}>
                <strong>Last Name</strong>
                {editingField === 'lastName' ? (
                  <div className="inline-edit-wrapper">
                    <input
                      className="inline-input"
                      name="lastName"
                      value={personalInfoForm.lastName}
                      onChange={handlePersonalInfoChange}
                      autoFocus
                    />
                    <button className="btn-inline-action btn-inline-save" onClick={handleInlineSave}>
                      <Check size={18} />
                    </button>
                    <button className="btn-inline-action btn-inline-cancel" onClick={cancelEditing}>
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <p>{data.lastName || "Not provided"}</p>
                )}
              </div>
            </div>

            {editingField !== 'lastName' && (
              <button className="edit-btn-small" title="Edit Last Name" onClick={() => startEditing('lastName')}>
                <PencilLine size={20} />
              </button>
            )}
          </div>

          {/* --- EMAIL --- */}
          <div className="isolated-field">
            <div className="field-content" style={{ width: '100%' }}>
              <Mail className="icon" />
              <div className="field-info" style={{ width: '100%' }}>
                <strong>Email</strong>
                {editingField === 'email' ? (
                  <div className="inline-edit-wrapper">
                    <input
                      className="inline-input"
                      type="email"
                      name="email"
                      value={personalInfoForm.email}
                      onChange={handlePersonalInfoChange}
                      autoFocus
                    />
                    <button className="btn-inline-action btn-inline-save" onClick={handleInlineSave}>
                      <Check size={18} />
                    </button>
                    <button className="btn-inline-action btn-inline-cancel" onClick={cancelEditing}>
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <p>{data.email || "Not provided"}</p>
                )}
              </div>
            </div>

            {editingField !== 'email' && (
              <button className="edit-btn-small" title="Edit Email" onClick={() => startEditing('email')}>
                <PencilLine size={20} />
              </button>
            )}
          </div>

          {/* --- PHONES --- */}
          <div className="isolated-field" style={{ alignItems: 'flex-start' }}>
            <div className="field-content" style={{ alignItems: 'flex-start', width: '100%' }}>
              <Phone className="icon" style={{ marginTop: '4px' }} />
              <div className="field-info" style={{ width: '100%' }}>
                <strong>Phone(s)</strong>

                {editingField === 'phones' ? (
                  <div className="phone-inline-list">
                    {personalInfoForm.phones.map((phone, idx) => (
                      <div key={idx} className="phone-inline-row">
                        <input
                          className="inline-input"
                          value={phone}
                          onChange={(e) => handlePhoneChange(idx, e)}
                          placeholder="Enter phone number"
                        />
                        <button className="remove-phone" onClick={() => removePhoneInput(idx)} type="button">
                          <Trash size={16} />
                        </button>
                      </div>
                    ))}

                    {personalInfoForm.phones.length < 3 && (
                      <button type="button" className="add-phone-initial" onClick={addPhoneInput} style={{ padding: '5px 0' }}>
                        <Plus size={16} /> Add Phone
                      </button>
                    )}

                    <div className="inline-edit-wrapper" style={{ marginTop: '10px' }}>
                      <button className="btn-inline-action btn-inline-save" onClick={handleInlineSave} style={{ flex: 1 }}>
                        <Check size={18} /> Save Phones
                      </button>
                      <button className="btn-inline-action btn-inline-cancel" onClick={cancelEditing} style={{ flex: 1 }}>
                        <X size={18} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="phones-list-vertical" style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '5px' }}>
                    {(data.phones && data.phones.length > 0) ? (
                      data.phones.map((phone, idx) => (
                        <span key={idx} className="phone-badge" style={{
                          background: '#f3f4f6',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          width: 'fit-content',
                          fontSize: '0.9rem'
                        }}>
                          {phone}
                        </span>
                      ))
                    ) : (
                      <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>No phone provided</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {editingField !== 'phones' && (
              <button className="edit-btn-small" title="Edit Phones" onClick={() => startEditing('phones')}>
                <PencilLine size={20} />
              </button>
            )}
          </div>
        </div>

        {/* ADDRESSES */}
        <div className="profile-card">
          <div className="card-header">
            <h3><MapPin className="card-icon" /> Addresses</h3>
            <button className="add-btn" onClick={() => openEditAddressModal(-1)}>
              <Plus /> Add
            </button>
          </div>
          <div className="addresses-container">
            {(data.addresses || []).map((address, index) => (
              <div className="address-box" key={index}>
                <div className="address-header">
                  <strong>Address {index + 1}</strong>
                  {(!address.id || address.id < 0) && (
                    <span style={{ fontSize: "0.75rem", color: "#e67e22", marginLeft: "5px" }}>
                      (Pending Save)
                    </span>
                  )}
                  <div className="address-actions">
                    <button className="edit-icon" onClick={() => openEditAddressModal(index)}><Pencil /></button>
                    <button className="delete-icon" onClick={() => handleDeleteAddress(index)}><Trash size={16} /></button>
                  </div>
                </div>
                <p><strong>Street</strong><br />{address.street}</p>
                <p><strong>City</strong><br />{address.city}</p>
                <p><strong>Governorate</strong><br />{address.governorate}</p>
                <p><strong>Details</strong><br />{address.details}</p>
                <p><strong>Google Map</strong><br />{address.googleMapAddressLink}</p>
              </div>
            ))}
          </div>
        </div>

        {/* COMPANY INFO */}
        <div className="profile-card">
          <div className="card-header">
            <h3><Building2 /> Company Information</h3>
            <button className="edit-btn-small" onClick={openCompanyInfoModal}>
              <PencilLine /> Edit
            </button>
          </div>
          <div className="card-body">
            <p><strong>Company Name</strong><br />{data.companyName}</p>
            <p><strong>Type of Production</strong><br />{data.typeOfProduction}</p>
            <p><strong>Website</strong><br />{data.companyLink}</p>
          </div>
        </div>
      </div>

      {/* MODALS (ADDRESS & COMPANY) */}
      {isEditAddressModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <X className="close-button" onClick={closeEditAddressModal} />
              <h4>Edit Address</h4>
            </div>
            <form onSubmit={handleSaveAddress}>
              <div className="form-group">
                <label>Street</label>
                <input name="street" value={addressForm.street} onChange={handleAddressChange} />
              </div>
              <div className="form-group">
                <label>City</label>
                <input name="city" value={addressForm.city} onChange={handleAddressChange} />
              </div>
              <div className="form-group">
                <label>Governorate</label>
                <input name="governorate" value={addressForm.governorate} onChange={handleAddressChange} />
              </div>
              <div className="form-group">
                <label>Details</label>
                <textarea name="details" value={addressForm.details} onChange={handleAddressChange} />
              </div>
              <div className="form-group">
                <label>Map Link</label>
                <input name="googleMapLink" value={addressForm.googleMapLink} onChange={handleAddressChange} />
              </div>
              <button type="submit" className="btn-save-changes">Update Address Info</button>
            </form>
          </div>
        </div>
      )}

      {isCompanyInfoModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <X className="close-button" onClick={closeCompanyInfoModal} />
              <h4>Edit Company Info</h4>
            </div>
            <form onSubmit={handleSaveCompanyInfo}>
              <div className="form-group">
                <label>Company Name</label>
                <input name="companyName" value={companyInfoForm.companyName} onChange={handleCompanyInfoChange} />
              </div>
              <div className="form-group">
                <label>Type</label>
                <input name="typeOfProduction" value={companyInfoForm.typeOfProduction} onChange={handleCompanyInfoChange} />
              </div>
              <div className="form-group">
                <label>Website</label>
                <input name="website" value={companyInfoForm.website} onChange={handleCompanyInfoChange} />
              </div>
              <button type="submit" className="btn-save-changes">Update Company Info</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


// import React, { useEffect, useState, useCallback } from "react";
// import "./css/ShipperProfile.css";
// import {
//   Building2,
//   Mail,
//   MapPin,
//   Pencil,
//   PencilLine,
//   Phone,
//   Plus,
//   Trash,
//   User,
//   UserPen,
//   X,
//   Save,
//   RotateCcw,
//   Check,
// } from "lucide-react";
// import useUserStore from "../../Store/UserStore/userStore";
// import Swal from "sweetalert2";

// export default function ShipperProfile() {
//   // ================= STATE MANAGEMENT =================
//   const [data, setData] = useState(null);
//   const [originalData, setOriginalData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Track which field is currently being edited inline
//   const [editingField, setEditingField] = useState(null);

//   // Track IDs of addresses deleted locally
//   const [deletedAddressIds, setDeletedAddressIds] = useState([]);

//   const user = useUserStore((state) => state.user);

//   // Modals
//   const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false);
//   const [isCompanyInfoModalOpen, setIsCompanyInfoModalOpen] = useState(false);

//   // Forms
//   const [personalInfoForm, setPersonalInfoForm] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phones: [],
//   });

//   const [companyInfoForm, setCompanyInfoForm] = useState({
//     companyName: "",
//     typeOfProduction: "",
//     website: "",
//   });

//   const [addressForm, setAddressForm] = useState({
//     id: null,
//     street: "",
//     city: "",
//     governorate: "",
//     details: "",
//     googleMapLink: "",
//   });
  
//   const [currentAddressBeingEdited, setCurrentAddressBeingEdited] = useState(null);

//   // ================= 1. FETCH DATA =================
//   const fetchProfile = useCallback(async () => {
//     if (!user?.token) return;

//     try {
//       const response = await fetch(
//         "https://stakeexpress.runasp.net/api/Shippers/shipper-profile",
//         {
//           method: "GET",
//           headers: {
//             "X-Client-Key": "web api",
//             Authorization: `Bearer ${user?.token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!response.ok) throw new Error("Failed to fetch profile data");

//       const result = await response.json();
//       const fetchedData = result.data || null;

//       setData(fetchedData);
//       setOriginalData(JSON.parse(JSON.stringify(fetchedData)));
//       setDeletedAddressIds([]);
//     } catch (error) {
//       console.error("Error fetching profile:", error);
//       Swal.fire("Error", "Failed to load profile data", "error");
//     } finally {
//       setLoading(false);
//     }
//   }, [user]);

//   useEffect(() => {
//     fetchProfile();
//   }, [fetchProfile]);

//   // ================= 2. SYNC FORMS =================
//   useEffect(() => {
//     if (data) {
//       setPersonalInfoForm({
//         firstName: data.firstName || "",
//         lastName: data.lastName || "",
//         email: data.email || "",
//         phones: data.phones || [],
//       });

//       setCompanyInfoForm({
//         companyName: data.companyName || "",
//         typeOfProduction: data.typeOfProduction || "",
//         website: data.companyLink || "",
//       });
//     }
//   }, [data]);

//   // ================= 3. CHANGE DETECTION =================
//   const hasChanges =
//     JSON.stringify(data) !== JSON.stringify(originalData) ||
//     deletedAddressIds.length > 0;

//   // ================= 4. INLINE EDIT HANDLERS =================

//   const startEditing = (field) => {
//     setPersonalInfoForm({
//       firstName: data.firstName || "",
//       lastName: data.lastName || "",
//       email: data.email || "",
//       phones: data.phones ? [...data.phones] : [],
//     });
//     setEditingField(field);
//   };

//   const cancelEditing = () => {
//     setEditingField(null);
//   };

//   const saveInlineChanges = () => {
//     // FIX: Just update the LOCAL state. Do not call API here.
//     // The API will be called when "Save Changes" is clicked at the top.
//     setData((prev) => ({
//       ...prev,
//       firstName: personalInfoForm.firstName,
//       lastName: personalInfoForm.lastName,
//       email: personalInfoForm.email,
//       phones: personalInfoForm.phones.filter((p) => p.trim() !== ""),
//     }));
//     setEditingField(null);
//   };

//   // ================= 5. GLOBAL SAVE ENGINE =================

//   const handleGlobalCancelChanges = () => {
//     if (window.confirm("Are you sure you want to discard all changes?")) {
//       setData(JSON.parse(JSON.stringify(originalData)));
//       setDeletedAddressIds([]);
//       setEditingField(null);
//     }
//   };

//   const handleGlobalSaveChanges = async () => {
//     setEditingField(null);

//     Swal.fire({
//       title: "Saving...",
//       text: "Updating database records",
//       didOpen: () => Swal.showLoading(),
//       allowOutsideClick: false,
//     });

//     const promises = [];
//     const headers = { 
//         "X-Client-Key": "web api", 
//         Authorization: `Bearer ${user?.token}`, 
//         "Content-Type": "application/json" 
//     };

//     // --- 1. NAMES (First & Last) ---
//     // We explicitly check if names changed and use the specific 'update-shipper-name' endpoint
//     if (data.firstName !== originalData.firstName || data.lastName !== originalData.lastName) {
//         const namePayload = {
//             firstName: data.firstName,
//             lastName: data.lastName
//         };
//         const promise = fetch("https://stakeexpress.runasp.net/api/Shippers/update-shipper-name", {
//             method: "PUT",
//             headers: headers,
//             body: JSON.stringify(namePayload)
//         });
//         promises.push(promise);
//     }

//     // --- 2. PHONE NUMBERS ---
//     const originalPhones = originalData.phones || [];
//     const currentPhones = data.phones || [];
//     const phonesToAdd = currentPhones.filter((p) => !originalPhones.includes(p));
//     const phonesToDelete = originalPhones.filter((p) => !currentPhones.includes(p));

//     phonesToAdd.forEach((phone) => {
//       const url = `https://stakeexpress.runasp.net/api/Shippers/Add-Phone-Number`;
//       const promise = fetch(url, { method: "POST", headers: headers, body: JSON.stringify({ phoneNumber: phone }) });
//       promises.push(promise);
//     });

//     phonesToDelete.forEach((phone) => {
//       const url = `https://stakeexpress.runasp.net/api/Shippers/Delete-Phone-Number`;
//       const promise = fetch(url, { method: "DELETE", headers: headers, body: JSON.stringify({ phoneNumber: phone }) });
//       promises.push(promise);
//     });

//     // --- 3. ADDRESSES ---
//     deletedAddressIds.forEach((id) => {
//       if (!id) return;
//       const url = `https://stakeexpress.runasp.net/api/Shippers/delete-shipper-address/${id}`;
//       const promise = fetch(url, { method: "DELETE", headers: headers });
//       promises.push(promise);
//     });

//     if (data.addresses) {
//       data.addresses.forEach((address) => {
//         const payload = {
//           street: address.street,
//           city: address.city,
//           governorate: address.governorate,
//           details: address.details,
//           googleMapAddressLink: address.googleMapAddressLink,
//         };

//         if (!address.id || address.id < 0) {
//           const url = "https://stakeexpress.runasp.net/api/Shippers/add-shipper-address";
//           const promise = fetch(url, { method: "POST", headers: headers, body: JSON.stringify(payload) });
//           promises.push(promise);
//         } else {
//           const originalAddr = originalData.addresses.find((a) => a.id === address.id || a.addressId === address.id);
//           if (JSON.stringify(originalAddr) !== JSON.stringify(address)) {
//             const url = `https://stakeexpress.runasp.net/api/Shippers/update-shipper-address/${address.id}`;
//             const promise = fetch(url, { method: "PUT", headers: headers, body: JSON.stringify(payload) });
//             promises.push(promise);
//           }
//         }
//       });
//     }

//     // --- 4. OTHER PROFILE INFO (Email, Company) ---
//     // Only call edit-shipper-profile if email or company info changed.
//     const isProfileChanged =
//       data.email !== originalData.email ||
//       data.companyName !== originalData.companyName ||
//       data.typeOfProduction !== originalData.typeOfProduction ||
//       data.companyLink !== originalData.companyLink;

//     if (isProfileChanged) {
//       const profilePayload = {
//         firstName: data.firstName, // Including names just in case, but rely on update-shipper-name
//         lastName: data.lastName,
//         email: data.email,
//         companyName: data.companyName,
//         typeOfProduction: data.typeOfProduction,
//         companyLink: data.companyLink,
//       };
//       const url = "https://stakeexpress.runasp.net/api/Shippers/edit-shipper-profile";
//       const promise = fetch(url, {
//         method: "PUT",
//         headers: headers,
//         body: JSON.stringify(profilePayload),
//       });
//       promises.push(promise);
//     }

//     try {
//       const responses = await Promise.all(promises);
      
//       // Check for errors in the batched responses
//       const failed = responses.some(r => !r.ok);
//       if(failed) {
//          console.warn("Some requests failed");
//       }

//       Swal.fire({ icon: "success", title: "All Changes Saved!", timer: 1500, showConfirmButton: false });
//       fetchProfile();
//     } catch (error) {
//       console.error("Global Save Error:", error);
//       Swal.fire({ icon: "error", title: "Save Incomplete", text: "Some changes might not have been saved." });
//       fetchProfile();
//     }
//   };

//   if (loading) return <p className="loading">Loading...</p>;
//   if (!data) return <p className="error">Failed to load profile data.</p>;

//   // ================= FORM HANDLERS =================
//   const handlePersonalInfoChange = (e) => {
//     const { name, value } = e.target;
//     setPersonalInfoForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handlePhoneChange = (index, e) => {
//     const newPhones = [...personalInfoForm.phones];
//     newPhones[index] = e.target.value;
//     setPersonalInfoForm((prev) => ({ ...prev, phones: newPhones }));
//   };

//   const addPhoneInput = () => {
//     if (personalInfoForm.phones.length < 3) {
//       setPersonalInfoForm((prev) => ({ ...prev, phones: [...prev.phones, ""] }));
//     } else {
//       Swal.fire("Limit Reached", "Maximum 3 phone numbers allowed.", "warning");
//     }
//   };

//   const removePhoneInput = (index) => {
//     const newPhones = personalInfoForm.phones.filter((_, i) => i !== index);
//     setPersonalInfoForm((prev) => ({ ...prev, phones: newPhones }));
//   };

//   const openCompanyInfoModal = () => setIsCompanyInfoModalOpen(true);
//   const closeCompanyInfoModal = () => setIsCompanyInfoModalOpen(false);

//   const openEditAddressModal = (addressIndex = -1) => {
//     setCurrentAddressBeingEdited(addressIndex);
//     if (addressIndex !== -1 && data.addresses?.[addressIndex]) {
//       const address = data.addresses[addressIndex];
//       const existingId = address.id || address.addressId || address.shipperAddressId || null;
//       setAddressForm({
//         id: existingId,
//         street: address.street || "",
//         city: address.city || "",
//         governorate: address.governorate || "",
//         details: address.details || "",
//         googleMapLink: address.googleMapAddressLink || "",
//       });
//     } else {
//       setAddressForm({
//         id: null, street: "", city: "", governorate: "", details: "", googleMapLink: "",
//       });
//     }
//     setIsEditAddressModalOpen(true);
//   };
//   const closeEditAddressModal = () => setIsEditAddressModalOpen(false);

//   const handleCompanyInfoChange = (e) => {
//     const { name, value } = e.target;
//     setCompanyInfoForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAddressChange = (e) => {
//     const { name, value } = e.target;
//     setAddressForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSaveCompanyInfo = (e) => {
//     e.preventDefault();
//     setData((prev) => ({
//       ...prev,
//       companyName: companyInfoForm.companyName,
//       typeOfProduction: companyInfoForm.typeOfProduction,
//       companyLink: companyInfoForm.website,
//     }));
//     closeCompanyInfoModal();
//   };

//   const handleSaveAddress = (e) => {
//     e.preventDefault();
//     const updatedAddresses = [...(data.addresses || [])];
//     const newAddressData = {
//       street: addressForm.street,
//       city: addressForm.city,
//       governorate: addressForm.governorate,
//       details: addressForm.details,
//       googleMapAddressLink: addressForm.googleMapLink,
//     };

//     if (currentAddressBeingEdited !== -1) {
//       const existingAddress = updatedAddresses[currentAddressBeingEdited];
//       updatedAddresses[currentAddressBeingEdited] = { ...newAddressData, id: existingAddress.id };
//     } else {
//       updatedAddresses.push({ ...newAddressData, id: -Date.now() });
//     }
//     setData((prev) => ({ ...prev, addresses: updatedAddresses }));
//     closeEditAddressModal();
//   };

//   const handleDeleteAddress = (index) => {
//     const addresses = data.addresses || [];
//     if (addresses.length <= 1) {
//       Swal.fire({ icon: "error", title: "Cannot Delete", text: "You must have at least one address." });
//       return;
//     }
//     const addressToDelete = addresses[index];
//     const id = addressToDelete.id || addressToDelete.addressId;
//     if (id && id > 0) {
//       setDeletedAddressIds((prev) => [...prev, id]);
//     }
//     const newAddresses = addresses.filter((_, i) => i !== index);
//     setData((prev) => ({ ...prev, addresses: newAddresses }));
//   };

//   // ================= RENDER =================
//   return (
//     <div className="shipper-profile">
      
//       <div className="profile-header">
//         <div className="header-left-section">
//           <div className="avatar-circle">
//             <span>
//               {data.firstName?.[0] || ""}
//               {data.lastName?.[0] || ""}
//             </span>
//           </div>
//           <div className="header-text">
//             <div className="name-id">
//               <h1>
//                 {data.firstName || ""} {data.lastName || ""}
//               </h1>
//               <div className="shipper-id-badge">
//                 <span>ID:</span> {data.shipperId || "-"}
//               </div>
//             </div>
//             <p className="sub-title">Shipper Account</p>
//           </div>
//         </div>

//         {/* HEADER BUTTONS */}
//         {hasChanges && (
//           <div className="header-right-section">
//             <button className="btn-header-cancel" onClick={handleGlobalCancelChanges}>
//               <RotateCcw size={16} /> Cancel
//             </button>
//             <button className="btn-header-save" onClick={handleGlobalSaveChanges}>
//               <Save size={16} /> Save Changes
//             </button>
//           </div>
//         )}
//       </div>

//       <div className="cards-grid">
        
//         {/* ============ PERSONAL INFO SECTION ============ */}
//         <div className="profile-card">
//           <div className="card-header">
//             <h3><User className="card-icon" style={{ marginRight: '8px' }} /> Personal Information</h3>
//           </div>

//           {/* --- FIRST NAME --- */}
//           <div className="isolated-field">
//             <div className="field-content" style={{ width: '100%' }}>
//               <UserPen className="icon" />
//               <div className="field-info" style={{ width: '100%' }}>
//                 <strong>First Name</strong>
//                 {editingField === 'firstName' ? (
//                   <div className="inline-edit-wrapper">
//                     <input
//                       className="inline-input"
//                       name="firstName"
//                       value={personalInfoForm.firstName}
//                       onChange={handlePersonalInfoChange}
//                       autoFocus
//                     />
//                     <button className="btn-inline-action btn-inline-save" onClick={saveInlineChanges} title="Save">
//                       <Check size={18} />
//                     </button>
//                     <button className="btn-inline-action btn-inline-cancel" onClick={cancelEditing} title="Cancel">
//                       <X size={18} />
//                     </button>
//                   </div>
//                 ) : (
//                   <p>{data.firstName || "Not provided"}</p>
//                 )}
//               </div>
//             </div>

//             {editingField !== 'firstName' && (
//               <button className="edit-btn-small" title="Edit First Name" onClick={() => startEditing('firstName')}>
//                 <PencilLine size={20} />
//               </button>
//             )}
//           </div>

//           {/* --- LAST NAME --- */}
//           <div className="isolated-field">
//             <div className="field-content" style={{ width: '100%' }}>
//               <UserPen className="icon" />
//               <div className="field-info" style={{ width: '100%' }}>
//                 <strong>Last Name</strong>
//                 {editingField === 'lastName' ? (
//                   <div className="inline-edit-wrapper">
//                     <input
//                       className="inline-input"
//                       name="lastName"
//                       value={personalInfoForm.lastName}
//                       onChange={handlePersonalInfoChange}
//                       autoFocus
//                     />
//                     <button className="btn-inline-action btn-inline-save" onClick={saveInlineChanges}>
//                       <Check size={18} />
//                     </button>
//                     <button className="btn-inline-action btn-inline-cancel" onClick={cancelEditing}>
//                       <X size={18} />
//                     </button>
//                   </div>
//                 ) : (
//                   <p>{data.lastName || "Not provided"}</p>
//                 )}
//               </div>
//             </div>

//             {editingField !== 'lastName' && (
//               <button className="edit-btn-small" title="Edit Last Name" onClick={() => startEditing('lastName')}>
//                 <PencilLine size={20} />
//               </button>
//             )}
//           </div>

//           {/* --- EMAIL --- */}
//           <div className="isolated-field">
//             <div className="field-content" style={{ width: '100%' }}>
//               <Mail className="icon" />
//               <div className="field-info" style={{ width: '100%' }}>
//                 <strong>Email</strong>
//                 {editingField === 'email' ? (
//                   <div className="inline-edit-wrapper">
//                     <input
//                       className="inline-input"
//                       type="email"
//                       name="email"
//                       value={personalInfoForm.email}
//                       onChange={handlePersonalInfoChange}
//                       autoFocus
//                     />
//                     <button className="btn-inline-action btn-inline-save" onClick={saveInlineChanges}>
//                       <Check size={18} />
//                     </button>
//                     <button className="btn-inline-action btn-inline-cancel" onClick={cancelEditing}>
//                       <X size={18} />
//                     </button>
//                   </div>
//                 ) : (
//                   <p>{data.email || "Not provided"}</p>
//                 )}
//               </div>
//             </div>

//             {editingField !== 'email' && (
//               <button className="edit-btn-small" title="Edit Email" onClick={() => startEditing('email')}>
//                 <PencilLine size={20} />
//               </button>
//             )}
//           </div>

//           {/* --- PHONES --- */}
//           <div className="isolated-field" style={{ alignItems: 'flex-start' }}>
//             <div className="field-content" style={{ alignItems: 'flex-start', width: '100%' }}>
//               <Phone className="icon" style={{ marginTop: '4px' }} />
//               <div className="field-info" style={{ width: '100%' }}>
//                 <strong>Phone(s)</strong>

//                 {editingField === 'phones' ? (
//                   <div className="phone-inline-list">
//                     {personalInfoForm.phones.map((phone, idx) => (
//                       <div key={idx} className="phone-inline-row">
//                         <input
//                           className="inline-input"
//                           value={phone}
//                           onChange={(e) => handlePhoneChange(idx, e)}
//                           placeholder="Enter phone number"
//                         />
//                         <button className="remove-phone" onClick={() => removePhoneInput(idx)} type="button">
//                           <Trash size={16} />
//                         </button>
//                       </div>
//                     ))}

//                     {personalInfoForm.phones.length < 3 && (
//                       <button type="button" className="add-phone-initial" onClick={addPhoneInput} style={{ padding: '5px 0' }}>
//                         <Plus size={16} /> Add Phone
//                       </button>
//                     )}

//                     <div className="inline-edit-wrapper" style={{ marginTop: '10px' }}>
//                       <button className="btn-inline-action btn-inline-save" onClick={saveInlineChanges} style={{ flex: 1 }}>
//                         <Check size={18} /> Save Phones
//                       </button>
//                       <button className="btn-inline-action btn-inline-cancel" onClick={cancelEditing} style={{ flex: 1 }}>
//                         <X size={18} /> Cancel
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="phones-list-vertical" style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '5px' }}>
//                     {(data.phones && data.phones.length > 0) ? (
//                       data.phones.map((phone, idx) => (
//                         <span key={idx} className="phone-badge" style={{
//                           background: '#f3f4f6',
//                           padding: '4px 8px',
//                           borderRadius: '4px',
//                           width: 'fit-content',
//                           fontSize: '0.9rem'
//                         }}>
//                           {phone}
//                         </span>
//                       ))
//                     ) : (
//                       <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>No phone provided</p>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {editingField !== 'phones' && (
//               <button className="edit-btn-small" title="Edit Phones" onClick={() => startEditing('phones')}>
//                 <PencilLine size={20} />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* ADDRESSES */}
//         <div className="profile-card">
//           <div className="card-header">
//             <h3><MapPin className="card-icon" /> Addresses</h3>
//             <button className="add-btn" onClick={() => openEditAddressModal(-1)}>
//               <Plus /> Add
//             </button>
//           </div>
//           <div className="addresses-container">
//             {(data.addresses || []).map((address, index) => (
//               <div className="address-box" key={index}>
//                 <div className="address-header">
//                   <strong>Address {index + 1}</strong>
//                   {(!address.id || address.id < 0) && (
//                     <span style={{ fontSize: "0.75rem", color: "#e67e22", marginLeft: "5px" }}>
//                       (Pending Save)
//                     </span>
//                   )}
//                   <div className="address-actions">
//                     <button className="edit-icon" onClick={() => openEditAddressModal(index)}><Pencil /></button>
//                     <button className="delete-icon" onClick={() => handleDeleteAddress(index)}><Trash size={16} /></button>
//                   </div>
//                 </div>
//                 <p><strong>Street</strong><br />{address.street}</p>
//                 <p><strong>City</strong><br />{address.city}</p>
//                 <p><strong>Governorate</strong><br />{address.governorate}</p>
//                 <p><strong>Details</strong><br />{address.details}</p>
//                 <p><strong>Google Map</strong><br />{address.googleMapAddressLink}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* COMPANY INFO */}
//         <div className="profile-card">
//           <div className="card-header">
//             <h3><Building2 /> Company Information</h3>
//             <button className="edit-btn-small" onClick={openCompanyInfoModal}>
//               <PencilLine /> Edit
//             </button>
//           </div>
//           <div className="card-body">
//             <p><strong>Company Name</strong><br />{data.companyName}</p>
//             <p><strong>Type of Production</strong><br />{data.typeOfProduction}</p>
//             <p><strong>Website</strong><br />{data.companyLink}</p>
//           </div>
//         </div>
//       </div>

//       {/* MODALS (ADDRESS & COMPANY) */}
//       {isEditAddressModalOpen && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <div className="modal-header">
//               <X className="close-button" onClick={closeEditAddressModal} />
//               <h4>Edit Address</h4>
//             </div>
//             <form onSubmit={handleSaveAddress}>
//               <div className="form-group">
//                 <label>Street</label>
//                 <input name="street" value={addressForm.street} onChange={handleAddressChange} />
//               </div>
//               <div className="form-group">
//                 <label>City</label>
//                 <input name="city" value={addressForm.city} onChange={handleAddressChange} />
//               </div>
//               <div className="form-group">
//                 <label>Governorate</label>
//                 <input name="governorate" value={addressForm.governorate} onChange={handleAddressChange} />
//               </div>
//               <div className="form-group">
//                 <label>Details</label>
//                 <textarea name="details" value={addressForm.details} onChange={handleAddressChange} />
//               </div>
//               <div className="form-group">
//                 <label>Map Link</label>
//                 <input name="googleMapLink" value={addressForm.googleMapLink} onChange={handleAddressChange} />
//               </div>
//               <button type="submit" className="btn-save-changes">Update Address Info</button>
//             </form>
//           </div>
//         </div>
//       )}

//       {isCompanyInfoModalOpen && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <div className="modal-header">
//               <X className="close-button" onClick={closeCompanyInfoModal} />
//               <h4>Edit Company Info</h4>
//             </div>
//             <form onSubmit={handleSaveCompanyInfo}>
//               <div className="form-group">
//                 <label>Company Name</label>
//                 <input name="companyName" value={companyInfoForm.companyName} onChange={handleCompanyInfoChange} />
//               </div>
//               <div className="form-group">
//                 <label>Type</label>
//                 <input name="typeOfProduction" value={companyInfoForm.typeOfProduction} onChange={handleCompanyInfoChange} />
//               </div>
//               <div className="form-group">
//                 <label>Website</label>
//                 <input name="website" value={companyInfoForm.website} onChange={handleCompanyInfoChange} />
//               </div>
//               <button type="submit" className="btn-save-changes">Update Company Info</button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// import React, { useEffect, useState, useCallback } from "react";
// import "./css/ShipperProfile.css";
// import {
//   Building2,
//   Mail,
//   MapPin,
//   Pencil,
//   PencilLine,
//   Phone,
//   Plus,
//   Trash,
//   User,
//   UserPen,
//   X,
//   Save,
//   RotateCcw,
//   Check,
// } from "lucide-react";
// import useUserStore from "../../Store/UserStore/userStore";
// import Swal from "sweetalert2";

// export default function ShipperProfile() {
//   // ================= STATE MANAGEMENT =================
//   const [data, setData] = useState(null);
//   const [originalData, setOriginalData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Track which field is currently being edited inline
//   const [editingField, setEditingField] = useState(null);

//   // Track IDs of addresses deleted locally
//   const [deletedAddressIds, setDeletedAddressIds] = useState([]);

//   const user = useUserStore((state) => state.user);

//   // Modals
//   const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false);
//   const [isCompanyInfoModalOpen, setIsCompanyInfoModalOpen] = useState(false);

//   // Forms
//   const [personalInfoForm, setPersonalInfoForm] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phones: [],
//   });

//   const [companyInfoForm, setCompanyInfoForm] = useState({
//     companyName: "",
//     typeOfProduction: "",
//     website: "",
//   });

//   const [addressForm, setAddressForm] = useState({
//     id: null,
//     street: "",
//     city: "",
//     governorate: "",
//     details: "",
//     googleMapLink: "",
//   });
  
//   const [currentAddressBeingEdited, setCurrentAddressBeingEdited] = useState(null);

//   // ================= 1. FETCH DATA =================
//   const fetchProfile = useCallback(async () => {
//     if (!user?.token) return;

//     try {
//       const response = await fetch(
//         "https://stakeexpress.runasp.net/api/Shippers/shipper-profile",
//         {
//           method: "GET",
//           headers: {
//             "X-Client-Key": "web api",
//             Authorization: `Bearer ${user?.token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!response.ok) throw new Error("Failed to fetch profile data");

//       const result = await response.json();
//       const fetchedData = result.data || null;

//       setData(fetchedData);
//       setOriginalData(JSON.parse(JSON.stringify(fetchedData)));
//       setDeletedAddressIds([]);
//     } catch (error) {
//       console.error("Error fetching profile:", error);
//       Swal.fire("Error", "Failed to load profile data", "error");
//     } finally {
//       setLoading(false);
//     }
//   }, [user]);

//   useEffect(() => {
//     fetchProfile();
//   }, [fetchProfile]);

//   // ================= 2. SYNC FORMS =================
//   useEffect(() => {
//     if (data) {
//       setPersonalInfoForm({
//         firstName: data.firstName || "",
//         lastName: data.lastName || "",
//         email: data.email || "",
//         phones: data.phones || [],
//       });

//       setCompanyInfoForm({
//         companyName: data.companyName || "",
//         typeOfProduction: data.typeOfProduction || "",
//         website: data.companyLink || "",
//       });
//     }
//   }, [data]);

//   // ================= 3. CHANGE DETECTION =================
//   const hasChanges =
//     JSON.stringify(data) !== JSON.stringify(originalData) ||
//     deletedAddressIds.length > 0;

//   // ================= 4. INLINE EDIT HANDLERS =================

//   const startEditing = (field) => {
//     setPersonalInfoForm({
//       firstName: data.firstName || "",
//       lastName: data.lastName || "",
//       email: data.email || "",
//       phones: data.phones ? [...data.phones] : [],
//     });
//     setEditingField(field);
//   };

//   const cancelEditing = () => {
//     setEditingField(null);
//   };

//   const saveInlineChanges = () => {
//     setData((prev) => ({
//       ...prev,
//       firstName: personalInfoForm.firstName,
//       lastName: personalInfoForm.lastName,
//       email: personalInfoForm.email,
//       phones: personalInfoForm.phones.filter((p) => p.trim() !== ""),
//     }));
//     setEditingField(null);
//   };

//   // ================= 5. GLOBAL SAVE ENGINE =================

//   const handleGlobalCancelChanges = () => {
//     if (window.confirm("Are you sure you want to discard all changes?")) {
//       setData(JSON.parse(JSON.stringify(originalData)));
//       setDeletedAddressIds([]);
//       setEditingField(null);
//     }
//   };

//   const handleGlobalSaveChanges = async () => {
//     setEditingField(null);

//     Swal.fire({
//       title: "Saving...",
//       text: "Updating database records",
//       didOpen: () => Swal.showLoading(),
//       allowOutsideClick: false,
//     });

//     const promises = [];
//     const headers = { 
//         "X-Client-Key": "web api", 
//         Authorization: `Bearer ${user?.token}`, 
//         "Content-Type": "application/json" 
//     };

//     // --- 1. NAMES ---
//     if (data.firstName !== originalData.firstName || data.lastName !== originalData.lastName) {
//         const namePayload = {
//             firstName: data.firstName,
//             lastName: data.lastName
//         };
//         const promise = fetch("https://stakeexpress.runasp.net/api/Shippers/update-shipper-name", {
//             method: "PUT",
//             headers: headers,
//             body: JSON.stringify(namePayload)
//         });
//         promises.push(promise);
//     }

//     // --- 2. EMAIL CHANGE REQUEST (INTEGRATED) ---
//     let emailChangeRequested = false;

//     if (data.email !== originalData.email) {
//       emailChangeRequested = true;
      
//       // Calculate the return URL dynamically based on current domain.
//       // Make sure you have a route in your App.js for "/confirm-changed-email"
//       const confirmUrl = `${window.location.origin}/confirm-changed-email`;

//       const emailPayload = { 
//         newEmail: data.email,
//         confirmNewEmailUrl: confirmUrl 
//       }; 
      
//       const emailPromise = fetch("https://stakeexpress.runasp.net/api/Shippers/change-email-request", {
//         method: "POST",
//         headers: headers,
//         body: JSON.stringify(emailPayload),
//       }).then(async (res) => {
//         if (!res.ok) {
//           const errorText = await res.text();
//           throw new Error(`Email Request Failed: ${errorText}`);
//         }
//         return res;
//       });
//       promises.push(emailPromise);
//     }

//     // --- 3. PHONE NUMBERS ---
//     const originalPhones = originalData.phones || [];
//     const currentPhones = data.phones || [];
//     const phonesToAdd = currentPhones.filter((p) => !originalPhones.includes(p));
//     const phonesToDelete = originalPhones.filter((p) => !currentPhones.includes(p));

//     phonesToAdd.forEach((phone) => {
//       const url = `https://stakeexpress.runasp.net/api/Shippers/Add-Phone-Number`;
//       const promise = fetch(url, { method: "POST", headers: headers, body: JSON.stringify({ phoneNumber: phone }) });
//       promises.push(promise);
//     });

//     phonesToDelete.forEach((phone) => {
//       const url = `https://stakeexpress.runasp.net/api/Shippers/Delete-Phone-Number`;
//       const promise = fetch(url, { method: "DELETE", headers: headers, body: JSON.stringify({ phoneNumber: phone }) });
//       promises.push(promise);
//     });

//     // --- 4. ADDRESSES ---
//     deletedAddressIds.forEach((id) => {
//       if (!id) return;
//       const url = `https://stakeexpress.runasp.net/api/Shippers/delete-shipper-address/${id}`;
//       const promise = fetch(url, { method: "DELETE", headers: headers });
//       promises.push(promise);
//     });

//     if (data.addresses) {
//       data.addresses.forEach((address) => {
//         const payload = {
//           street: address.street,
//           city: address.city,
//           governorate: address.governorate,
//           details: address.details,
//           googleMapAddressLink: address.googleMapAddressLink,
//         };

//         if (!address.id || address.id < 0) {
//           const url = "https://stakeexpress.runasp.net/api/Shippers/add-shipper-address";
//           const promise = fetch(url, { method: "POST", headers: headers, body: JSON.stringify(payload) });
//           promises.push(promise);
//         } else {
//           const originalAddr = originalData.addresses.find((a) => a.id === address.id || a.addressId === address.id);
//           if (JSON.stringify(originalAddr) !== JSON.stringify(address)) {
//             const url = `https://stakeexpress.runasp.net/api/Shippers/update-shipper-address/${address.id}`;
//             const promise = fetch(url, { method: "PUT", headers: headers, body: JSON.stringify(payload) });
//             promises.push(promise);
//           }
//         }
//       });
//     }

//     // --- 5. OTHER PROFILE INFO ---
//     const isProfileChanged =
//       data.companyName !== originalData.companyName ||
//       data.typeOfProduction !== originalData.typeOfProduction ||
//       data.companyLink !== originalData.companyLink;

//     if (isProfileChanged) {
//       const profilePayload = {
//         firstName: data.firstName,
//         lastName: data.lastName,
//         // Send OLD verified email to general update so it doesn't get overwritten by unverified one
//         email: originalData.email, 
//         companyName: data.companyName,
//         typeOfProduction: data.typeOfProduction,
//         companyLink: data.companyLink,
//       };
//       const url = "https://stakeexpress.runasp.net/api/Shippers/edit-shipper-profile";
//       const promise = fetch(url, {
//         method: "PUT",
//         headers: headers,
//         body: JSON.stringify(profilePayload),
//       });
//       promises.push(promise);
//     }

//     try {
//       const responses = await Promise.all(promises);
//       const failed = responses.some(r => !r.ok);
      
//       if(failed) {
//          throw new Error("One or more updates failed to save.");
//       }

//       if (emailChangeRequested) {
//         Swal.fire({ 
//             icon: "info", 
//             title: "Verification Sent", 
//             text: `We have sent a confirmation link to ${data.email}. Please check your inbox.`,
//             confirmButtonText: "OK",
//             timer: 5000 
//         });
        
//         // Revert displayed email to original until they click the link
//         // The email in the database hasn't changed yet, only a request was made.
//         setData(prev => ({...prev, email: originalData.email}));
//       } else {
//         Swal.fire({ 
//             icon: "success", 
//             title: "Saved!", 
//             text: "Profile updated successfully.", 
//             timer: 1500 
//         });
//         fetchProfile();
//       }

//     } catch (error) {
//       console.error("Global Save Error:", error);
      
//       // Extract specific message if available
//       let errorMsg = error.message;
//       if(errorMsg.includes("Email Request Failed")) {
//           errorMsg = "We couldn't send the verification email. Please ensure the new email format is correct.";
//       }

//       Swal.fire({ icon: "error", title: "Save Error", text: errorMsg });
//       // Reload profile to ensure consistency
//       fetchProfile();
//     }
//   };

//   if (loading) return <p className="loading">Loading...</p>;
//   if (!data) return <p className="error">Failed to load profile data.</p>;

//   // ================= FORM HANDLERS =================
//   const handlePersonalInfoChange = (e) => {
//     const { name, value } = e.target;
//     setPersonalInfoForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handlePhoneChange = (index, e) => {
//     const newPhones = [...personalInfoForm.phones];
//     newPhones[index] = e.target.value;
//     setPersonalInfoForm((prev) => ({ ...prev, phones: newPhones }));
//   };

//   const addPhoneInput = () => {
//     if (personalInfoForm.phones.length < 3) {
//       setPersonalInfoForm((prev) => ({ ...prev, phones: [...prev.phones, ""] }));
//     } else {
//       Swal.fire("Limit Reached", "Maximum 3 phone numbers allowed.", "warning");
//     }
//   };

//   const removePhoneInput = (index) => {
//     const newPhones = personalInfoForm.phones.filter((_, i) => i !== index);
//     setPersonalInfoForm((prev) => ({ ...prev, phones: newPhones }));
//   };

//   const openCompanyInfoModal = () => setIsCompanyInfoModalOpen(true);
//   const closeCompanyInfoModal = () => setIsCompanyInfoModalOpen(false);

//   const openEditAddressModal = (addressIndex = -1) => {
//     setCurrentAddressBeingEdited(addressIndex);
//     if (addressIndex !== -1 && data.addresses?.[addressIndex]) {
//       const address = data.addresses[addressIndex];
//       const existingId = address.id || address.addressId || address.shipperAddressId || null;
//       setAddressForm({
//         id: existingId,
//         street: address.street || "",
//         city: address.city || "",
//         governorate: address.governorate || "",
//         details: address.details || "",
//         googleMapLink: address.googleMapAddressLink || "",
//       });
//     } else {
//       setAddressForm({
//         id: null, street: "", city: "", governorate: "", details: "", googleMapLink: "",
//       });
//     }
//     setIsEditAddressModalOpen(true);
//   };
//   const closeEditAddressModal = () => setIsEditAddressModalOpen(false);

//   const handleCompanyInfoChange = (e) => {
//     const { name, value } = e.target;
//     setCompanyInfoForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAddressChange = (e) => {
//     const { name, value } = e.target;
//     setAddressForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSaveCompanyInfo = (e) => {
//     e.preventDefault();
//     setData((prev) => ({
//       ...prev,
//       companyName: companyInfoForm.companyName,
//       typeOfProduction: companyInfoForm.typeOfProduction,
//       companyLink: companyInfoForm.website,
//     }));
//     closeCompanyInfoModal();
//   };

//   const handleSaveAddress = (e) => {
//     e.preventDefault();
//     const updatedAddresses = [...(data.addresses || [])];
//     const newAddressData = {
//       street: addressForm.street,
//       city: addressForm.city,
//       governorate: addressForm.governorate,
//       details: addressForm.details,
//       googleMapAddressLink: addressForm.googleMapLink,
//     };

//     if (currentAddressBeingEdited !== -1) {
//       const existingAddress = updatedAddresses[currentAddressBeingEdited];
//       updatedAddresses[currentAddressBeingEdited] = { ...newAddressData, id: existingAddress.id };
//     } else {
//       updatedAddresses.push({ ...newAddressData, id: -Date.now() });
//     }
//     setData((prev) => ({ ...prev, addresses: updatedAddresses }));
//     closeEditAddressModal();
//   };

//   const handleDeleteAddress = (index) => {
//     const addresses = data.addresses || [];
//     if (addresses.length <= 1) {
//       Swal.fire({ icon: "error", title: "Cannot Delete", text: "You must have at least one address." });
//       return;
//     }
//     const addressToDelete = addresses[index];
//     const id = addressToDelete.id || addressToDelete.addressId;
//     if (id && id > 0) {
//       setDeletedAddressIds((prev) => [...prev, id]);
//     }
//     const newAddresses = addresses.filter((_, i) => i !== index);
//     setData((prev) => ({ ...prev, addresses: newAddresses }));
//   };

//   // ================= RENDER =================
//   return (
//     <div className="shipper-profile">
      
//       <div className="profile-header">
//         <div className="header-left-section">
//           <div className="avatar-circle">
//             <span>
//               {data.firstName?.[0] || ""}
//               {data.lastName?.[0] || ""}
//             </span>
//           </div>
//           <div className="header-text">
//             <div className="name-id">
//               <h1>
//                 {data.firstName || ""} {data.lastName || ""}
//               </h1>
//               <div className="shipper-id-badge">
//                 <span>ID:</span> {data.shipperId || "-"}
//               </div>
//             </div>
//             <p className="sub-title">Shipper Account</p>
//           </div>
//         </div>

//         {/* HEADER BUTTONS */}
//         {hasChanges && (
//           <div className="header-right-section">
//             <button className="btn-header-cancel" onClick={handleGlobalCancelChanges}>
//               <RotateCcw size={16} /> Cancel
//             </button>
//             <button className="btn-header-save" onClick={handleGlobalSaveChanges}>
//               <Save size={16} /> Save Changes
//             </button>
//           </div>
//         )}
//       </div>

//       <div className="cards-grid">
        
//         {/* ============ PERSONAL INFO SECTION ============ */}
//         <div className="profile-card">
//           <div className="card-header">
//             <h3><User className="card-icon" style={{ marginRight: '8px' }} /> Personal Information</h3>
//           </div>
//           {/* --- FIRST NAME --- */}
//           <div className="isolated-field">
//             <div className="field-content" style={{ width: '100%' }}>
//               <UserPen className="icon" />
//               <div className="field-info" style={{ width: '100%' }}>
//                 <strong>First Name</strong>
//                 {editingField === 'firstName' ? (
//                   <div className="inline-edit-wrapper">
//                     <input
//                       className="inline-input"
//                       name="firstName"
//                       value={personalInfoForm.firstName}
//                       onChange={handlePersonalInfoChange}
//                       autoFocus
//                     />
//                     <button className="btn-inline-action btn-inline-save" onClick={saveInlineChanges} title="Save">
//                       <Check size={18} />
//                     </button>
//                     <button className="btn-inline-action btn-inline-cancel" onClick={cancelEditing} title="Cancel">
//                       <X size={18} />
//                     </button>
//                   </div>
//                 ) : (
//                   <p>{data.firstName || "Not provided"}</p>
//                 )}
//               </div>
//             </div>

//             {editingField !== 'firstName' && (
//               <button className="edit-btn-small" title="Edit First Name" onClick={() => startEditing('firstName')}>
//                 <PencilLine size={20} />
//               </button>
//             )}
//           </div>

//           {/* --- LAST NAME --- */}
//           <div className="isolated-field">
//             <div className="field-content" style={{ width: '100%' }}>
//               <UserPen className="icon" />
//               <div className="field-info" style={{ width: '100%' }}>
//                 <strong>Last Name</strong>
//                 {editingField === 'lastName' ? (
//                   <div className="inline-edit-wrapper">
//                     <input
//                       className="inline-input"
//                       name="lastName"
//                       value={personalInfoForm.lastName}
//                       onChange={handlePersonalInfoChange}
//                       autoFocus
//                     />
//                     <button className="btn-inline-action btn-inline-save" onClick={saveInlineChanges}>
//                       <Check size={18} />
//                     </button>
//                     <button className="btn-inline-action btn-inline-cancel" onClick={cancelEditing}>
//                       <X size={18} />
//                     </button>
//                   </div>
//                 ) : (
//                   <p>{data.lastName || "Not provided"}</p>
//                 )}
//               </div>
//             </div>

//             {editingField !== 'lastName' && (
//               <button className="edit-btn-small" title="Edit Last Name" onClick={() => startEditing('lastName')}>
//                 <PencilLine size={20} />
//               </button>
//             )}
//           </div>

//           {/* --- EMAIL --- */}
//           <div className="isolated-field">
//             <div className="field-content" style={{ width: '100%' }}>
//               <Mail className="icon" />
//               <div className="field-info" style={{ width: '100%' }}>
//                 <strong>Email</strong>
//                 {editingField === 'email' ? (
//                   <div className="inline-edit-wrapper">
//                     <input
//                       className="inline-input"
//                       type="email"
//                       name="email"
//                       value={personalInfoForm.email}
//                       onChange={handlePersonalInfoChange}
//                       autoFocus
//                     />
//                     <button className="btn-inline-action btn-inline-save" onClick={saveInlineChanges}>
//                       <Check size={18} />
//                     </button>
//                     <button className="btn-inline-action btn-inline-cancel" onClick={cancelEditing}>
//                       <X size={18} />
//                     </button>
//                   </div>
//                 ) : (
//                   <p>{data.email || "Not provided"}</p>
//                 )}
//               </div>
//             </div>

//             {editingField !== 'email' && (
//               <button className="edit-btn-small" title="Edit Email" onClick={() => startEditing('email')}>
//                 <PencilLine size={20} />
//               </button>
//             )}
//           </div>

//           {/* --- PHONES --- */}
//           <div className="isolated-field" style={{ alignItems: 'flex-start' }}>
//             <div className="field-content" style={{ alignItems: 'flex-start', width: '100%' }}>
//               <Phone className="icon" style={{ marginTop: '4px' }} />
//               <div className="field-info" style={{ width: '100%' }}>
//                 <strong>Phone(s)</strong>

//                 {editingField === 'phones' ? (
//                   <div className="phone-inline-list">
//                     {personalInfoForm.phones.map((phone, idx) => (
//                       <div key={idx} className="phone-inline-row">
//                         <input
//                           className="inline-input"
//                           value={phone}
//                           onChange={(e) => handlePhoneChange(idx, e)}
//                           placeholder="Enter phone number"
//                         />
//                         <button className="remove-phone" onClick={() => removePhoneInput(idx)} type="button">
//                           <Trash size={16} />
//                         </button>
//                       </div>
//                     ))}

//                     {personalInfoForm.phones.length < 3 && (
//                       <button type="button" className="add-phone-initial" onClick={addPhoneInput} style={{ padding: '5px 0' }}>
//                         <Plus size={16} /> Add Phone
//                       </button>
//                     )}

//                     <div className="inline-edit-wrapper" style={{ marginTop: '10px' }}>
//                       <button className="btn-inline-action btn-inline-save" onClick={saveInlineChanges} style={{ flex: 1 }}>
//                         <Check size={18} /> Save Phones
//                       </button>
//                       <button className="btn-inline-action btn-inline-cancel" onClick={cancelEditing} style={{ flex: 1 }}>
//                         <X size={18} /> Cancel
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="phones-list-vertical" style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '5px' }}>
//                     {(data.phones && data.phones.length > 0) ? (
//                       data.phones.map((phone, idx) => (
//                         <span key={idx} className="phone-badge" style={{
//                           background: '#f3f4f6',
//                           padding: '4px 8px',
//                           borderRadius: '4px',
//                           width: 'fit-content',
//                           fontSize: '0.9rem'
//                         }}>
//                           {phone}
//                         </span>
//                       ))
//                     ) : (
//                       <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>No phone provided</p>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {editingField !== 'phones' && (
//               <button className="edit-btn-small" title="Edit Phones" onClick={() => startEditing('phones')}>
//                 <PencilLine size={20} />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* ADDRESSES */}
//         <div className="profile-card">
//           <div className="card-header">
//             <h3><MapPin className="card-icon" /> Addresses</h3>
//             <button className="add-btn" onClick={() => openEditAddressModal(-1)}>
//               <Plus /> Add
//             </button>
//           </div>
//           <div className="addresses-container">
//             {(data.addresses || []).map((address, index) => (
//               <div className="address-box" key={index}>
//                 <div className="address-header">
//                   <strong>Address {index + 1}</strong>
//                   {(!address.id || address.id < 0) && (
//                     <span style={{ fontSize: "0.75rem", color: "#e67e22", marginLeft: "5px" }}>
//                       (Pending Save)
//                     </span>
//                   )}
//                   <div className="address-actions">
//                     <button className="edit-icon" onClick={() => openEditAddressModal(index)}><Pencil /></button>
//                     <button className="delete-icon" onClick={() => handleDeleteAddress(index)}><Trash size={16} /></button>
//                   </div>
//                 </div>
//                 <p><strong>Street</strong><br />{address.street}</p>
//                 <p><strong>City</strong><br />{address.city}</p>
//                 <p><strong>Governorate</strong><br />{address.governorate}</p>
//                 <p><strong>Details</strong><br />{address.details}</p>
//                 <p><strong>Google Map</strong><br />{address.googleMapAddressLink}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* COMPANY INFO */}
//         <div className="profile-card">
//           <div className="card-header">
//             <h3><Building2 /> Company Information</h3>
//             <button className="edit-btn-small" onClick={openCompanyInfoModal}>
//               <PencilLine /> Edit
//             </button>
//           </div>
//           <div className="card-body">
//             <p><strong>Company Name</strong><br />{data.companyName}</p>
//             <p><strong>Type of Production</strong><br />{data.typeOfProduction}</p>
//             <p><strong>Website</strong><br />{data.companyLink}</p>
//           </div>
//         </div>
//       </div>

//       {/* MODALS (ADDRESS & COMPANY) */}
//       {isEditAddressModalOpen && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <div className="modal-header">
//               <X className="close-button" onClick={closeEditAddressModal} />
//               <h4>Edit Address</h4>
//             </div>
//             <form onSubmit={handleSaveAddress}>
//               <div className="form-group">
//                 <label>Street</label>
//                 <input name="street" value={addressForm.street} onChange={handleAddressChange} />
//               </div>
//               <div className="form-group">
//                 <label>City</label>
//                 <input name="city" value={addressForm.city} onChange={handleAddressChange} />
//               </div>
//               <div className="form-group">
//                 <label>Governorate</label>
//                 <input name="governorate" value={addressForm.governorate} onChange={handleAddressChange} />
//               </div>
//               <div className="form-group">
//                 <label>Details</label>
//                 <textarea name="details" value={addressForm.details} onChange={handleAddressChange} />
//               </div>
//               <div className="form-group">
//                 <label>Map Link</label>
//                 <input name="googleMapLink" value={addressForm.googleMapLink} onChange={handleAddressChange} />
//               </div>
//               <button type="submit" className="btn-save-changes">Update Address Info</button>
//             </form>
//           </div>
//         </div>
//       )}

//       {isCompanyInfoModalOpen && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <div className="modal-header">
//               <X className="close-button" onClick={closeCompanyInfoModal} />
//               <h4>Edit Company Info</h4>
//             </div>
//             <form onSubmit={handleSaveCompanyInfo}>
//               <div className="form-group">
//                 <label>Company Name</label>
//                 <input name="companyName" value={companyInfoForm.companyName} onChange={handleCompanyInfoChange} />
//               </div>
//               <div className="form-group">
//                 <label>Type</label>
//                 <input name="typeOfProduction" value={companyInfoForm.typeOfProduction} onChange={handleCompanyInfoChange} />
//               </div>
//               <div className="form-group">
//                 <label>Website</label>
//                 <input name="website" value={companyInfoForm.website} onChange={handleCompanyInfoChange} />
//               </div>
//               <button type="submit" className="btn-save-changes">Update Company Info</button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }