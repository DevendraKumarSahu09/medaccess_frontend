import React, { useState, useEffect } from "react";

const NonMedicalStaffForm = ({ staff, setStaff, editingStaff, setEditingStaff, handleAddStaff, handleUpdateStaff }) => {
    const [formData, setFormData] = useState({
        name: "",
        role: "",
        department: "",
        email: "",
        phone: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});

    // Update form when editing staff changes
    useEffect(() => {
        if (editingStaff) {
            setFormData({
                name: editingStaff.name || '',
                role: editingStaff.role || '',
                department: editingStaff.department || '',
                email: editingStaff.email || '',
                phone: editingStaff.phone || '',
            });
            setError(null); // Clear errors when switching to editing mode
            setFieldErrors({});
        } else {
            // Reset form when not editing
            setFormData({
                name: "",
                role: "",
                department: "",
                email: "",
                phone: "",
            });
        }
    }, [editingStaff]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // Clear errors when user starts typing
        if (error) setError(null);
        if (fieldErrors[name]) {
            setFieldErrors({
                ...fieldErrors,
                [name]: null
            });
        }
    };

    const handleCancel = () => {
        setEditingStaff(null);
        setFormData({
            name: "",
            role: "",
            department: "",
            email: "",
            phone: "",
        });
        setError(null);
        setFieldErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setFieldErrors({});

        try {
            if (editingStaff) {
                // Call the parent component's handleUpdateStaff function
                await handleUpdateStaff(editingStaff._id, formData);
                
                // Clear form and editing state
                setEditingStaff(null);
            } else {
                // Call the parent component's handleAddStaff function
                await handleAddStaff(formData);
            }

            // Reset form data after submission
            setFormData({
                name: "",
                role: "",
                department: "",
                email: "",
                phone: "",
            });
        } catch (error) {
            // Only log unexpected errors, not validation errors
            if (!(error.message && (
                error.message.includes("Email address is already in use") ||
                error.message.includes("required") ||
                error.message.includes("validation")
            ))) {
                console.error("Error in staff form submission:", error);
            }
            
            // Check if this is an email duplicate error
            if (error.message && error.message.includes("Email address is already in use")) {
                setFieldErrors({
                    email: "This email address is already in use by another staff member"
                });
            } else {
                // Set general error message
                setError(error.message || "Failed to process staff data. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="staff-form-container">
            <h3>{editingStaff ? "Edit Staff Member" : "Add New Staff Member"}</h3>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit} className="staff-form">
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        required
                        className={fieldErrors.name ? 'input-error' : ''}
                    />
                    {fieldErrors.name && <div className="field-error">{fieldErrors.name}</div>}
                </div>
                
                <div className="form-group">
                    <label htmlFor="role">Role</label>
                    <input
                        type="text"
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        placeholder="Role (e.g., Receptionist, Nurse)"
                        required
                        className={fieldErrors.role ? 'input-error' : ''}
                    />
                    {fieldErrors.role && <div className="field-error">{fieldErrors.role}</div>}
                </div>
                
                <div className="form-group">
                    <label htmlFor="department">Department</label>
                    <input
                        type="text"
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        placeholder="Department"
                        required
                        className={fieldErrors.department ? 'input-error' : ''}
                    />
                    {fieldErrors.department && <div className="field-error">{fieldErrors.department}</div>}
                </div>
                
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email Address"
                        required
                        className={fieldErrors.email ? 'input-error' : ''}
                    />
                    {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}
                </div>
                
                <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone Number"
                        required
                        className={fieldErrors.phone ? 'input-error' : ''}
                    />
                    {fieldErrors.phone && <div className="field-error">{fieldErrors.phone}</div>}
                </div>
                
                <div className="form-actions">
                    {editingStaff && (
                        <button 
                            type="button" 
                            className="cancel-button" 
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    )}
                    <button 
                        type="submit" 
                        className="submit-button" 
                        disabled={loading}
                    >
                        {loading ? "Processing..." : (editingStaff ? "Update" : "Add")}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NonMedicalStaffForm;
