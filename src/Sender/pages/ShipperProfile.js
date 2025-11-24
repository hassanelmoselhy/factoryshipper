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
} from "lucide-react";
import useUserStore from "../../Store/UserStore/userStore";
import Swal from "sweetalert2";

export default function ShipperProfile() {
  // ================= STATE MANAGEMENT =================
  const [data, setData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Track IDs of addresses deleted locally
  const [deletedAddressIds, setDeletedAddressIds] = useState([]);

  const user = useUserStore((state) => state.user);

  // Modals
  const [isPersonalInfoModalOpen, setIsPersonalInfoModalOpen] = useState(false);
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

  const [currentAddressBeingEdited, setCurrentAddressBeingEdited] =
    useState(null);
  const [addressForm, setAddressForm] = useState({
    id: null,
    street: "",
    city: "",
    governorate: "",
    details: "",
    googleMapLink: "",
  });

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

  // ================= 4. GLOBAL SAVE ENGINE =================

  const handleGlobalCancelChanges = () => {
    if (window.confirm("Are you sure you want to discard all changes?")) {
      setData(JSON.parse(JSON.stringify(originalData)));
      setDeletedAddressIds([]);
    }
  };

  const handleGlobalSaveChanges = async () => {
    Swal.fire({
      title: "Saving...",
      text: "Updating database records",
      didOpen: () => Swal.showLoading(),
      allowOutsideClick: false,
    });

    const promises = [];

    // ---------------------------------------------------------
    // 1. PHONE NUMBERS (ADD & DELETE)
    // ---------------------------------------------------------
    const originalPhones = originalData.phones || [];
    const currentPhones = data.phones || [];

    const phonesToAdd = currentPhones.filter((p) => !originalPhones.includes(p));
    const phonesToDelete = originalPhones.filter((p) => !currentPhones.includes(p));

    // A. Add New Phones
    phonesToAdd.forEach((phone) => {
      const url = `https://stakeexpress.runasp.net/api/Shippers/Add-Phone-Number`;
      const promise = fetch(url, {
        method: "POST",
        headers: {
          "X-Client-Key": "web api",
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber: phone }), 
      }).then(async (res) => {
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`Failed to add phone ${phone}: ${txt}`);
        }
        return res;
      });
      promises.push(promise);
    });

    // B. Delete Removed Phones
    phonesToDelete.forEach((phone) => {
      const url = `https://stakeexpress.runasp.net/api/Shippers/Delete-Phone-Number`;
      const promise = fetch(url, {
        method: "DELETE",
        headers: {
          "X-Client-Key": "web api",
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber: phone }),
      }).then(async (res) => {
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`Failed to delete phone ${phone}: ${txt}`);
        }
        return res;
      });
      promises.push(promise);
    });

    // ---------------------------------------------------------
    // 2. ADDRESSES (DELETE, ADD, UPDATE)
    // ---------------------------------------------------------
    
    // DELETE Addresses
    deletedAddressIds.forEach((id) => {
      if (!id) return;
      const url = `https://stakeexpress.runasp.net/api/Shippers/delete-shipper-address/${id}`;
      const promise = fetch(url, {
        method: "DELETE",
        headers: {
          "X-Client-Key": "web api",
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
      }).then(async (res) => {
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`Failed to delete address: ${txt}`);
        }
        return res;
      });
      promises.push(promise);
    });

    // ADD & UPDATE Addresses
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
          const url =
            "https://stakeexpress.runasp.net/api/Shippers/add-shipper-address";
          const promise = fetch(url, {
            method: "POST",
            headers: {
              "X-Client-Key": "web api",
              Authorization: `Bearer ${user?.token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }).then(async (res) => {
            if (!res.ok) {
              const txt = await res.text();
              throw new Error(`Failed to add address: ${txt}`);
            }
            return res;
          });
          promises.push(promise);
        }
        else {
          const originalAddr = originalData.addresses.find(
            (a) => a.id === address.id || a.addressId === address.id
          );

          if (JSON.stringify(originalAddr) !== JSON.stringify(address)) {
            const url = `https://stakeexpress.runasp.net/api/Shippers/update-shipper-address/${address.id}`;
            const promise = fetch(url, {
              method: "PUT",
              headers: {
                "X-Client-Key": "web api",
                Authorization: `Bearer ${user?.token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            }).then(async (res) => {
              if (!res.ok) {
                const txt = await res.text();
                throw new Error(`Failed to update address: ${txt}`);
              }
              return res;
            });
            promises.push(promise);
          }
        }
      });
    }

    // ---------------------------------------------------------
    // 3. PERSONAL & COMPANY INFO CHANGES
    // ---------------------------------------------------------
    const isProfileChanged =
      data.firstName !== originalData.firstName ||
      data.lastName !== originalData.lastName ||
      data.email !== originalData.email ||
      data.companyName !== originalData.companyName ||
      data.typeOfProduction !== originalData.typeOfProduction ||
      data.companyLink !== originalData.companyLink;

    if (isProfileChanged) {
      const profilePayload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        companyName: data.companyName,
        typeOfProduction: data.typeOfProduction,
        companyLink: data.companyLink,
      };

      const url =
        "https://stakeexpress.runasp.net/api/Shippers/edit-shipper-profile";

      const promise = fetch(url, {
        method: "PUT",
        headers: {
          "X-Client-Key": "web api",
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profilePayload),
      }).then(async (res) => {
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || "Failed to update profile info");
        }
        return res;
      });
      promises.push(promise);
    }

    try {
      await Promise.all(promises);

      Swal.fire({
        icon: "success",
        title: "All Changes Saved!",
        timer: 1500,
        showConfirmButton: false,
      });

      fetchProfile();
    } catch (error) {
      console.error("Global Save Error:", error);
      Swal.fire({
        icon: "error",
        title: "Save Incomplete",
        text: "Some changes might not have been saved. Check connection.",
      });
      fetchProfile();
    }
  };

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
      const existingId =
        address.id || address.addressId || address.shipperAddressId || null;

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
        id: null,
        street: "",
        city: "",
        governorate: "",
        details: "",
        googleMapLink: "",
      });
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
    // 1. LIMIT CHECK: Prevent adding if already 3
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

  const handleCompanyInfoChange = (e) => {
    const { name, value } = e.target;
    setCompanyInfoForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  // ================= LOCAL UI UPDATES =================
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
    const newAddressData = {
      street: addressForm.street,
      city: addressForm.city,
      governorate: addressForm.governorate,
      details: addressForm.details,
      googleMapAddressLink: addressForm.googleMapLink,
    };

    if (currentAddressBeingEdited !== -1) {
      const existingAddress = updatedAddresses[currentAddressBeingEdited];
      updatedAddresses[currentAddressBeingEdited] = {
        ...newAddressData,
        id: existingAddress.id,
      };
    } else {
      updatedAddresses.push({
        ...newAddressData,
        id: -Date.now(),
      });
    }

    setData((prev) => ({ ...prev, addresses: updatedAddresses }));
    closeEditAddressModal();
  };

  const handleDeleteAddress = (index) => {
    const addresses = data.addresses || [];
    if (addresses.length <= 1) {
      Swal.fire({
        icon: "error",
        title: "Cannot Delete",
        text: "You must have at least one address.",
      });
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

        {/* BUTTONS */}
        {hasChanges && (
          <div className="header-right-section">
            <button
              className="btn-header-cancel"
              onClick={handleGlobalCancelChanges}
            >
              <RotateCcw size={16} /> Cancel
            </button>
            <button
              className="btn-header-save"
              onClick={handleGlobalSaveChanges}
            >
              <Save size={16} /> Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="cards-grid">
        {/* PERSONAL INFO */}
        <div className="profile-card">
          <div className="card-header">
            <h3>
              <User className="card-icon" /> Personal Information
            </h3>
            <button className="edit-btn-small" onClick={openPersonalInfoModal}>
              <PencilLine /> Edit
            </button>
          </div>
          <p className="card-subtitle">Your contact details</p>
          <div className="full-name">
            <UserPen className="icon" />
            <div>
              <strong>First Name</strong>
              <p>{data.firstName || "Not provided"}</p>
            </div>
          </div>
          <div className="full-name">
            <UserPen className="icon" />
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
          <div className="info-row" style={{ alignItems: 'flex-start' }}>
            <Phone className="icon" style={{ marginTop: '4px' }} />
            <div>
              <strong>Phone(s)</strong>
              {/* FIXED VIEW: Show list if length > 0, NOT > 2 */}
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
                    <p>No phone provided</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ADDRESSES */}
        <div className="profile-card">
          <div className="card-header">
            <h3>
              <MapPin className="card-icon" /> Addresses
            </h3>
            <button
              className="add-btn"
              onClick={() => openEditAddressModal(-1)}
            >
              <Plus /> Add
            </button>
          </div>
          <p className="card-subtitle">Shipping location details</p>
          <div className="addresses-container">
            {(data.addresses || []).map((address, index) => (
              <div className="address-box" key={index}>
                <div className="address-header">
                  <strong>Address {index + 1}</strong>
                  {(!address.id || address.id < 0) && (
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "#e67e22",
                        marginLeft: "5px",
                      }}
                    >
                      (Pending Save)
                    </span>
                  )}
                  <div className="address-actions">
                    <button
                      className="edit-icon"
                      onClick={() => openEditAddressModal(index)}
                    >
                      <Pencil />
                    </button>
                    <button
                      className="delete-icon"
                      onClick={() => handleDeleteAddress(index)}
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
                <p>
                  <strong>Street</strong>
                  <br />
                  {address.street}
                </p>
                <p>
                  <strong>City</strong>
                  <br />
                  {address.city}
                </p>
                <p>
                  <strong>Governorate</strong>
                  <br />
                  {address.governorate}
                </p>
                <p>
                  <strong>Details</strong>
                  <br />
                  {address.details}
                </p>
                <p>
                  <strong>Google Map</strong>
                  <br />
                  {address.googleMapAddressLink}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* COMPANY INFO */}
        <div className="profile-card">
          <div className="card-header">
            <h3>
              <Building2 /> Company Information
            </h3>
            <button className="edit-btn-small" onClick={openCompanyInfoModal}>
              <PencilLine /> Edit
            </button>
          </div>
          <div className="card-body">
            <p>
              <strong>Company Name</strong>
              <br />
              {data.companyName}
            </p>
            <p>
              <strong>Type of Production</strong>
              <br />
              {data.typeOfProduction}
            </p>
            <p>
              <strong>Website</strong>
              <br />
              {data.companyLink}
            </p>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {isPersonalInfoModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <X className="close-button" onClick={closePersonalInfoModal} />
              <h4>Edit Personal Information</h4>
            </div>
            <form onSubmit={handleSavePersonalInfo}>
              <p className="modal-subtitle">
                Update your name, email, and phone numbers
              </p>
              <div className="form-group inline">
                <div>
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={personalInfoForm.firstName}
                    onChange={handlePersonalInfoChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={personalInfoForm.lastName}
                    onChange={handlePersonalInfoChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={personalInfoForm.email}
                  onChange={handlePersonalInfoChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Numbers <small>(Max 3)</small></label>
                <div id="phoneNumbersContainer">
                  {personalInfoForm.phones.map((phone, index) => (
                    <div className="phone-input-group" key={index}>
                      <button
                        type="button"
                        className="remove-phone"
                        onClick={() => removePhoneInput(index)}
                      >
                        <Trash size={20} />
                      </button>
                      <input
                        type="text"
                        className="phone-number-input"
                        placeholder="Phone number"
                        value={phone}
                        onChange={(e) => handlePhoneChange(index, e)}
                        required
                      />
                    </div>
                  ))}
                  
                  {/* 2. LIMIT CHECK: Only show Add button if less than 3 */}
                  {personalInfoForm.phones.length < 3 && (
                    <button
                      type="button"
                      className="add-phone-initial"
                      onClick={addPhoneInput}
                      style={{ marginTop: '10px' }}
                    >
                      <Plus size={20} /> Add Phone
                    </button>
                  )}
                </div>
              </div>
              <button type="submit" className="btn-save-changes">
                Update Personal Info
              </button>
            </form>
          </div>
        </div>
      )}

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
                <input
                  name="street"
                  value={addressForm.street}
                  onChange={handleAddressChange}
                />
              </div>
              <div className="form-group">
                <label>City</label>
                <input
                  name="city"
                  value={addressForm.city}
                  onChange={handleAddressChange}
                />
              </div>
              <div className="form-group">
                <label>Governorate</label>
                <input
                  name="governorate"
                  value={addressForm.governorate}
                  onChange={handleAddressChange}
                />
              </div>
              <div className="form-group">
                <label>Details</label>
                <textarea
                  name="details"
                  value={addressForm.details}
                  onChange={handleAddressChange}
                />
              </div>
              <div className="form-group">
                <label>Map Link</label>
                <input
                  name="googleMapLink"
                  value={addressForm.googleMapLink}
                  onChange={handleAddressChange}
                />
              </div>
              <button type="submit" className="btn-save-changes">
                Update Address Info
              </button>
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
                <input
                  name="companyName"
                  value={companyInfoForm.companyName}
                  onChange={handleCompanyInfoChange}
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <input
                  name="typeOfProduction"
                  value={companyInfoForm.typeOfProduction}
                  onChange={handleCompanyInfoChange}
                />
              </div>
              <div className="form-group">
                <label>Website</label>
                <input
                  name="website"
                  value={companyInfoForm.website}
                  onChange={handleCompanyInfoChange}
                />
              </div>
              <button type="submit" className="btn-save-changes">
                Update Company Info
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}