import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const NonMedicalStaffItem = ({ staff, setEditingStaff, handleDeleteStaff }) => {
    // Edit the staff item
    const handleEdit = () => {
        console.log("Editing staff member:", staff);
        setEditingStaff(staff);
        // Scroll to the form
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // Delete the staff item
    const onDelete = () => {
        // Using the passed handleDeleteStaff function which includes confirmation
        handleDeleteStaff(staff._id);
    };

    return (
        <tr>
            <td>{staff.name}</td>
            <td>{staff.role}</td>
            <td>{staff.department}</td>
            <td>{staff.email}</td>
            <td>{staff.phone}</td>
            <td>
                <div className="action-buttons">
                    <button className="edit-btn" onClick={handleEdit}>
                        <FaEdit /> Edit
                    </button>
                    <button className="delete-btn" onClick={onDelete}>
                        <FaTrash /> Delete
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default NonMedicalStaffItem;
