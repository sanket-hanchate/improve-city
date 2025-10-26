import React, { useEffect, useState } from "react";
import './index.css';

function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to determine the status color class
  const getStatusClass = (status) => {
    switch (status) {
      case 'Resolved':
        return 'status-resolved';
      case 'In Progress':
        return 'status-in-progress';
      case 'Pending':
      default:
        return 'status-pending';
    }
  };

  // Fetch all complaints
  useEffect(() => {
    const fetchComplaints = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // NOTE: Using fetch to replace axios for consistency
        const res = await fetch("http://localhost:5000/api/complaints");
        if (!res.ok) throw new Error("Network response was not ok.");
        const data = await res.json();
        // Assuming the backend returns an array of objects
        setComplaints(data);
      } catch (err) {
        console.error("Failed to fetch complaints:", err);
        setError("Could not load complaints data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  // Update complaint status
  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/complaints/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        // Mocking the status update
        body: JSON.stringify({ status: newStatus, timestamp: new Date().toISOString() }) 
      });

      if (response.ok) {
        // Optimistically update the UI
        setComplaints((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
        );
      } else {
        console.error("Failed to update status:", response.statusText);
        // Handle error feedback to user (e.g., toast message)
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <>
      <div className="dashboard-container">
        <h2>Admin Dashboard</h2>

        {isLoading && <div className="loading">Loading complaints...</div>}
        {error && <div className="error-message">Error: {error}</div>}

        {!isLoading && !error && complaints.length === 0 && (
          <div className="loading">No open issues found.</div>
        )}

        {!isLoading && !error && complaints.length > 0 && (
          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {/* Mock data structure: The complaints array is assumed to have objects like { id, title, location, status } */}
                {complaints.map((c) => (
                  <tr key={c.id}>
                    <td>{c.title || 'N/A'}</td>
                    <td>{c.location || 'Unknown'}</td>
                    <td>
                      <span className={getStatusClass(c.status) + " status-cell"}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <select
                        className="status-select"
                        value={c.status}
                        onChange={(e) => updateStatus(c.id, e.target.value)}
                      >
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Resolved</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default AdminDashboard;
