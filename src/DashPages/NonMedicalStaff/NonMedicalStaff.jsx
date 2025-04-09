// dashpages/NonMedicalStaff/NonMedicalStaff.jsx
import React, { useState, useEffect } from 'react';
import NonMedicalStaffForm from '../../components/NonMedicalStaff/NonMedicalStaffForm';
import NonMedicalStaffTable from '../../components/NonMedicalStaff/NonMedicalStaffTable';
import { fetchNonMedicalStaff, addNonMedicalStaff, updateNonMedicalStaff, deleteNonMedicalStaff } from '../../api/nonMedicalStaffApi';
import './NonMedicalStaff.css';

const NonMedicalStaff = () => {
    const [staff, setStaff] = useState([]);
    const [editingStaff, setEditingStaff] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Clear success message after 3 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    // Fetch the staff data when the component mounts
    useEffect(() => {
        const getStaffData = async () => {
            try {
                setLoading(true);
                const staffData = await fetchNonMedicalStaff();
                setStaff(staffData);
                setError(null);
            } catch (err) {
                console.error('Error fetching staff:', err);
                setError('Failed to load staff data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        getStaffData();
    }, []);

    const handleAddStaff = async (staffData) => {
        try {
            const newStaff = await addNonMedicalStaff(staffData);
            setStaff([...staff, newStaff]);
            setSuccessMessage('Staff member added successfully!');
            return newStaff; // Return data so the form knows it was successful
        } catch (err) {
            // Only log unexpected errors
            if (!err.response || err.response.status !== 400) {
                console.error('Error adding staff:', err);
            }
            
            // Extract error message
            const errorMessage = err.response?.data?.message || 'Failed to add staff member. Please try again.';
            throw new Error(errorMessage);
        }
    };

    const handleUpdateStaff = async (staffId, staffData) => {
        try {
            const updatedStaff = await updateNonMedicalStaff(staffId, staffData);
            setStaff(staff.map((s) => (s._id === updatedStaff._id ? updatedStaff : s)));
            setEditingStaff(null);
            setSuccessMessage('Staff member updated successfully!');
            return updatedStaff; // Return data so the form knows it was successful
        } catch (err) {
            // Only log unexpected errors
            if (!err.response || err.response.status !== 400) {
                console.error('Error updating staff:', err);
            }
            
            // Extract error message
            const errorMessage = err.response?.data?.message || 'Failed to update staff member. Please try again.';
            throw new Error(errorMessage);
        }
    };

    const handleDeleteStaff = async (staffId) => {
        if (!window.confirm('Are you sure you want to delete this staff member?')) {
            return;
        }
        
        try {
            await deleteNonMedicalStaff(staffId);
            setStaff(staff.filter((s) => s._id !== staffId));
            setSuccessMessage('Staff member deleted successfully!');
            
            // If we were editing the staff member that was deleted, clear the editing state
            if (editingStaff && editingStaff._id === staffId) {
                setEditingStaff(null);
            }
        } catch (err) {
            console.error('Error deleting staff:', err);
            const errorMessage = err.response?.data?.message || 'Failed to delete staff member. Please try again.';
            alert(errorMessage);
        }
    };

    return (
        <div className="non-medical-staff-container">
            <h2 className="non-medical-staff-title">Non-Medical Staff Management</h2>
            
            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            
            {loading ? (
                <div className="loading">Loading staff data...</div>
            ) : (
                <>
                    <NonMedicalStaffForm
                        staff={staff}
                        setStaff={setStaff}
                        editingStaff={editingStaff}
                        setEditingStaff={setEditingStaff}
                        handleAddStaff={handleAddStaff}
                        handleUpdateStaff={handleUpdateStaff}
                    />
                    <NonMedicalStaffTable
                        staff={staff}
                        setStaff={setStaff}
                        handleDeleteStaff={handleDeleteStaff}
                        setEditingStaff={setEditingStaff}
                    />
                </>
            )}
        </div>
    );
};

export default NonMedicalStaff;
