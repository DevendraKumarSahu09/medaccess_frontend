import { useState, useEffect } from "react";
import { FiSearch, FiFilter } from "react-icons/fi";
import PharmacyItem from "../PharmacyItem/PharmacyItem";

const PharmacyTable = ({ medicines, setMedicines, setEditingMedicine }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredMedicines, setFilteredMedicines] = useState(medicines);
    const [sortField, setSortField] = useState('medicineName');
    const [sortDirection, setSortDirection] = useState('asc');
    const [filterCategory, setFilterCategory] = useState('');

    const categories = [...new Set(medicines.map(m => m.category).filter(Boolean))];

    useEffect(() => {
        let filtered = [...medicines];

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter((medicine) => {
                const medicineName = medicine.medicineName ? medicine.medicineName.toLowerCase() : "";
                const category = medicine.category ? medicine.category.toLowerCase() : "";
                const brand = medicine.brand ? medicine.brand.toLowerCase() : "";
                const query = searchQuery.toLowerCase();

                return (
                    medicineName.includes(query) ||
                    category.includes(query) ||
                    brand.includes(query)
                );
            });
        }

        // Apply category filter
        if (filterCategory) {
            filtered = filtered.filter(medicine => medicine.category === filterCategory);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let aValue = a[sortField] || '';
            let bValue = b[sortField] || '';

            // Handle numeric values
            if (sortField === 'price' || sortField === 'quantity') {
                aValue = Number(aValue);
                bValue = Number(bValue);
            }

            // Handle date values
            if (sortField === 'expiryDate') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }

            if (aValue < bValue) {
                return sortDirection === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        });

        setFilteredMedicines(filtered);
    }, [searchQuery, medicines, sortField, sortDirection, filterCategory]);

    const handleSort = (field) => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    return (
        <div className="pharmacy-card">
            <div className="card-header">
                <h3>Medicine Inventory</h3>
            </div>
            
            <div className="table-controls">
                <div className="search-container">
                    <FiSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search medicines..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
                
                <div className="filter-container">
                    <FiFilter className="filter-icon" />
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>
            </div>

            {filteredMedicines.length === 0 ? (
                <div className="empty-table-message">
                    {searchQuery || filterCategory ? 
                        "No medicines found matching your search criteria." : 
                        "No medicines in inventory. Add some medicines to get started."}
                </div>
            ) : (
                <div className="medicine-table-container">
                    <table className="medicine-table">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('medicineName')} className="sortable-header">
                                    Name {sortField === 'medicineName' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th onClick={() => handleSort('category')} className="sortable-header">
                                    Category {sortField === 'category' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th onClick={() => handleSort('brand')} className="sortable-header">
                                    Brand {sortField === 'brand' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th onClick={() => handleSort('quantity')} className="sortable-header">
                                    Quantity {sortField === 'quantity' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th onClick={() => handleSort('price')} className="sortable-header">
                                    Price {sortField === 'price' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th onClick={() => handleSort('expiryDate')} className="sortable-header">
                                    Expiry {sortField === 'expiryDate' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMedicines.map((medicine) => (
                                <PharmacyItem
                                    key={medicine._id || medicine.id}
                                    medicine={medicine}
                                    setMedicines={setMedicines}
                                    setEditingMedicine={setEditingMedicine}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PharmacyTable;
