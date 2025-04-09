import { useState, useEffect } from "react";
import { addMedicine, updateMedicine } from "../../api/pharmacyApi";
import { FiPlus, FiCheck, FiX } from "react-icons/fi";

const PharmacyForm = ({ medicines, setMedicines, editingMedicine, setEditingMedicine }) => {
    const [formData, setFormData] = useState({
        medicineName: "",
        category: "",
        brand: "",
        quantity: 0,
        price: 0,
        expiryDate: "",
        supplier: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const categories = [
        "Antibiotics",
        "Painkillers",
        "Antivirals",
        "Vaccines",
        "Vitamins",
        "Supplements",
        "Dermatological",
        "Cardiovascular",
        "Respiratory",
        "Other"
    ];

    useEffect(() => {
        if (editingMedicine) {
            setFormData({
                medicineName: editingMedicine.medicineName || "",
                category: editingMedicine.category || "",
                brand: editingMedicine.brand || "",
                quantity: editingMedicine.quantity || 0,
                price: editingMedicine.price || 0,
                expiryDate: editingMedicine.expiryDate ? new Date(editingMedicine.expiryDate).toISOString().slice(0, 10) : "",
                supplier: editingMedicine.supplier || ""
            });
        } else {
            resetForm();
        }
    }, [editingMedicine]);

    const resetForm = () => {
        setFormData({
            medicineName: "",
            category: "",
            brand: "",
            quantity: 0,
            price: 0,
            expiryDate: "",
            supplier: ""
        });
        setError(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (error) setError(null);
    };

    const handleCancel = () => {
        setEditingMedicine(null);
        resetForm();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (editingMedicine) {
                const updatedMedicine = await updateMedicine(editingMedicine._id, formData);
                setMedicines(
                    medicines.map((m) => (m._id === editingMedicine._id ? updatedMedicine : m))
                );
                setEditingMedicine(null);
            } else {
                const newMedicine = await addMedicine(formData);
                setMedicines([...medicines, newMedicine]);
            }
            resetForm();
        } catch (err) {
            setError(err.message || "An error occurred while saving the medicine");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pharmacy-card">
            <div className="card-header">
                <h3>{editingMedicine ? "Edit Medicine" : "Add New Medicine"}</h3>
            </div>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit} className="pharmacy-form">
                <div className="form-group">
                    <label htmlFor="medicineName">Medicine Name</label>
                    <input
                        type="text"
                        id="medicineName"
                        name="medicineName"
                        className="form-control"
                        value={formData.medicineName}
                        onChange={handleChange}
                        placeholder="Enter medicine name"
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        name="category"
                        className="form-control"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className="form-group">
                    <label htmlFor="brand">Brand</label>
                    <input
                        type="text"
                        id="brand"
                        name="brand"
                        className="form-control"
                        value={formData.brand}
                        onChange={handleChange}
                        placeholder="Enter brand name"
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="quantity">Quantity</label>
                    <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        className="form-control"
                        value={formData.quantity}
                        onChange={handleChange}
                        min="0"
                        placeholder="Enter quantity"
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        className="form-control"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        placeholder="Enter price"
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="expiryDate">Expiry Date</label>
                    <input
                        type="date"
                        id="expiryDate"
                        name="expiryDate"
                        className="form-control"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="supplier">Supplier</label>
                    <input
                        type="text"
                        id="supplier"
                        name="supplier"
                        className="form-control"
                        value={formData.supplier}
                        onChange={handleChange}
                        placeholder="Enter supplier name"
                    />
                </div>
                
                <div className="form-actions">
                    {editingMedicine && (
                        <button 
                            type="button" 
                            className="cancel-btn" 
                            onClick={handleCancel}
                        >
                            <FiX /> Cancel
                        </button>
                    )}
                    <button 
                        type="submit" 
                        className="submit-btn" 
                        disabled={loading}
                    >
                        {loading ? "Saving..." : 
                            editingMedicine ? 
                                <><FiCheck /> Update Medicine</> : 
                                <><FiPlus /> Add Medicine</>
                        }
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PharmacyForm;
