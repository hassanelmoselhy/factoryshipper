import { useState } from "react";
import BranchesFilterBar from "../components/BranchesFilterBar";
import BranchesHeader from "../components/BranchesHeader";
import BranchesTable from "../components/BranchesTable";
import AddHubModal from "../components/AddHubModal"; 
import './css/BranchesPage.css';

const BranchesPage = () => {
  const [branches, setBranches] = useState([
    {
      branch: 'فرع رئيسي',
      data: { name: 'المعادى 2', id: 'HUB-001' },
      city: 'القاهرة',
      managerName: 'أحمد محمد',
      managerPhone: '20123456789',
      area: '100 * 200 م²',
      employees: '30',
      status: 'نشط',
    },
    {
      branch: 'فرع رئيسي',
      data: { name: 'مدينة نصر', id: 'HUB-002' },
      city: 'القاهرة',
      managerName: 'علي محمد',
      managerPhone: '20123456789',
      area: '100 * 200 م²',
      employees: '20',
      status: 'نشط',
    },
    {
      branch: 'مخزن فرعي',
      data: { name: 'الزمالك الفرعي', id: 'HUB-003' },
      city: 'القاهرة',
      managerName: 'أحمد محمد',
      managerPhone: '20123456789',
      area: '100 * 200 م²',
      employees: '30',
      status: 'معطل',
    },
  ]);


  const [showModal, setShowModal] = useState(false);


  const handleAddBranch = (newBranch) => {
    console.log(newBranch)
    setBranches([...branches, newBranch]);
    setShowModal(false);
  };


  const [selectedBranch, setSelectedBranch] = useState(null);
  const openModal = (branch) => setSelectedBranch(branch);
  const closeModal = () => setSelectedBranch(null);

  const [filters, setFilters] = useState({
    branches: 'All Branches',
    status: 'All Status',
    search: '',
  });

  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

 
  const filteredBranches = branches.filter((branch) => {
    const matchesBranch =
      filters.branches === 'All Branches' ||
      branch.branch.includes(filters.branches);

    const matchesStatus =
      filters.status === 'All Status' || branch.status === filters.status;

    const matchesSearch =
      !filters.search ||
      Object.values(branch).some((value) =>
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
      />


<AddHubModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onAdd={handleAddBranch}
/>

    </div>
  );
};

export default BranchesPage;
