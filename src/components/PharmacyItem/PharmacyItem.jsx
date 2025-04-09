import { useState } from "react";
import { deleteMedicine } from "../../api/pharmacyApi";
import { FiEdit2, FiTrash2, FiAlertCircle } from "react-icons/fi";

const PharmacyItem = ({ medicine, setMedicines, setEditingMedicine }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString();
        } catch (error) {
            return "Invalid Date";
        }
    };
    
    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) return "N/A";
        
        return `$${Number(amount).toFixed(2)}`;
    };

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${medicine.medicineName}?`)) {
            return;
        }
        
        setIsDeleting(true);
        try {
            // Call the deleteMedicine function from the API file to delete the medicine
            await deleteMedicine(medicine._id || medicine.id); // This will delete the medicine

            // After successful deletion, update the state to remove the deleted item
            setMedicines((prevMedicines) => 
                prevMedicines.filter((m) => (m._id || m.id) !== (medicine._id || medicine.id))
            );
        } catch (error) {
            console.error("Error deleting medicine:", error);
            alert("Failed to delete medicine. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };
    
    // Determine stock status
    const getStockStatus = () => {
        const quantity = Number(medicine.quantity || 0);
        
        if (quantity <= 0) {
            return { label: "Out of Stock", className: "status-out-of-stock" };
        } else if (quantity < 10) {
            return { label: "Low Stock", className: "status-low-stock" };
        } else {
            return { label: "In Stock", className: "status-in-stock" };
        }
    };
    
    const stockStatus = getStockStatus();
    
    // Check if medicine is expiring soon (within 30 days)
    const isExpiringSoon = () => {
        if (!medicine.expiryDate) return false;
        
        const today = new Date();
        const expiryDate = new Date(medicine.expiryDate);
        const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        
        return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    };

    return (
        <tr className={isExpiringSoon() ? "expiring-soon" : ""}>
            <td>{medicine.medicineName || "N/A"}</td>
            <td>{medicine.category || "N/A"}</td>
            <td>{medicine.brand || "N/A"}</td>
            <td>
                <span className={`medicine-status ${stockStatus.className}`}>
                    {medicine.quantity || 0} ({stockStatus.label})
                </span>
            </td>
            <td>{formatCurrency(medicine.price)}</td>
            <td className={isExpiringSoon() ? "expiry-warning" : ""}>
                {isExpiringSoon() && <FiAlertCircle className="warning-icon" title="Expiring Soon" />} 
                {formatDate(medicine.expiryDate)}
            </td>
            <td className="action-buttons">
                <button 
                    className="edit-btn" 
                    onClick={() => setEditingMedicine(medicine)}
                    title="Edit Medicine"
                >
                    <FiEdit2 /> 
                </button>
                <button 
                    className="delete-btn" 
                    onClick={handleDelete}
                    disabled={isDeleting}
                    title="Delete Medicine"
                >
                    <FiTrash2 />
                </button>
            </td>
        </tr>
    );
};

export default PharmacyItem;
