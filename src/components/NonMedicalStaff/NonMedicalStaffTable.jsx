// components/NonMedicalStaffTable.jsx
import React from "react";
import NonMedicalStaffItem from "./NonMedicalStaffItem.jsx";
import "./NonMedicalStaff.css";

const NonMedicalStaffTable = ({ staff, setStaff, setEditingStaff, handleDeleteStaff }) => {
    if (!staff || staff.length === 0) {
        return (
            <div className="empty-table-message">
                No staff members found. Add some staff members to get started.
            </div>
        );
    }

    return (
        <div className="staff-table-container">
            <table className="staff-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Department</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {staff.map((staffMember) => (
                        <NonMedicalStaffItem
                            key={staffMember._id || staffMember.id}
                            staff={staffMember}
                            setStaff={setStaff}
                            setEditingStaff={setEditingStaff}
                            handleDeleteStaff={handleDeleteStaff}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default NonMedicalStaffTable;
