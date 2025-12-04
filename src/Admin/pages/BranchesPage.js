import React, { useState, useEffect } from "react";
import BranchesFilterBar from "../components/BranchesFilterBar";
import BranchesHeader from "../components/BranchesHeader";
import BranchesTable from "../components/BranchesTable";
import AddHubModal from "../components/AddHubModal";
import './css/BranchesPage.css';
import { toast } from "sonner";
import { GetAllHubs } from "../Data/HubsService";

const BranchesPage = () => {
  const [branches, setBranches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const response = await GetAllHubs();
      console.log("response", response.Data);

      const hubsData = Array.isArray(response.Data) ? response.Data : response.Data.data;
      if (!Array.isArray(hubsData)) throw new Error("بيانات الفروع غير صالحة");

      const formattedBranches = hubsData.map(hub => ({
        branch: hub.type,
        data: { name: hub.name, id: hub.id },
        city: hub.city || "غير محدد",
        governorate: hub.governorate || "غير محدد",
        street: hub.street || "",
        details: hub.details || "",
        googleMapAddressLink: hub.googleMapAddressLink || "",
        managerName: hub.managerName || "غير متاح",
        managerPhone: hub.phoneNumber || "",
        area: `${hub.areaInSquareMeters || 0} م²`,
        employees: hub.employeeCount || 0,
        status: hub.hubStatus === 1 ? "نشط" : "معطل"
      }));

      setBranches(formattedBranches);

    } catch (error) {
      console.error("Error fetching hubs:", error);
      toast.error(error.message || "فشل جلب الفروع");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchBranches();
  }, []);

  const handleAdd = () => {

    fetchBranches();
    setShowModal(false);
  };

  const openModal = (branch) => setSelectedBranch(branch);
  const closeModal = () => setSelectedBranch(null);

  const [filters, setFilters] = useState({
    branches: 'All Branches',
    status: 'All Status',
    search: '',
  });

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const filteredBranches = branches.filter(branch => {
    const matchesBranch =
      filters.branches === 'All Branches' || branch.branch.includes(filters.branches);
    const matchesStatus =
      filters.status === 'All Status' || branch.status === filters.status;
    const matchesSearch =
      !filters.search ||
      Object.values(branch).some(value =>
        String(value).toLowerCase().includes(filters.search.toLowerCase())
      );
    return matchesBranch && matchesStatus && matchesSearch;
  });

  return (
    <div className="branches-page-container">
      <BranchesHeader onAddClick={() => setShowModal(true)} />

      <BranchesFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        totalBranchesCount={filteredBranches.length}
      />

      <BranchesTable
        branches={filteredBranches}
        onViewDetails={openModal}
        loading={loading}
      />

      <AddHubModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAdd} 
      />
    </div>
  );
};

export default BranchesPage;
