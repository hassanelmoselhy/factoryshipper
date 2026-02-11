import React, { useState, useEffect } from "react";
import BranchesFilterBar from "../components/BranchesFilterBar";
import BranchesHeader from "../components/BranchesHeader";
import BranchesTable from "../components/BranchesTable";
import AddHubModal from "../components/AddHubModal";
import HubDetailsModal from "../components/HubDetailsModal";
import './css/BranchesPage.css';
import { toast } from "sonner";
import { GetAllHubs } from "../Data/HubsService";

const BranchesPage = () => {
  const [branches, setBranches] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedHubId, setSelectedHubId] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const response = await GetAllHubs();
      console.log("response", response.Data);

      const hubsData = Array.isArray(response.Data) ? response.Data : response.Data?.data;
      if (!Array.isArray(hubsData)) throw new Error("بيانات الفروع غير صالحة");

      const formattedBranches = hubsData.map(hub => ({
        id: hub.id,
        branch: hub.type,
        data: { name: hub.name, id: hub.id },
        managerName: hub.managerName || "غير متاح",
        managerPhone: hub.phoneNumber || "",
        area: `${hub.areaInSquareMeters || 0} م²`,
        employees: hub.courierCount || 0,
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
    setShowAddModal(false);
  };

  const openDetailsModal = (branch) => {
    setSelectedHubId(branch.id || branch.data?.id);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setSelectedHubId(null);
    setShowDetailsModal(false);
  };

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
      <BranchesHeader onAddClick={() => setShowAddModal(true)} />

      <BranchesFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        totalBranchesCount={filteredBranches.length}
      />

      <BranchesTable
        branches={filteredBranches}
        onViewDetails={openDetailsModal}
        loading={loading}
      />

      <AddHubModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAdd}
      />

      <HubDetailsModal
        isOpen={showDetailsModal}
        onClose={closeDetailsModal}
        hubId={selectedHubId}
      />
    </div>
  );
};

export default BranchesPage;
