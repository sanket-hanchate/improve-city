import React, { useEffect, useState } from "react";
import './index.css';

function PublicDashboard() {
  const [resolved, setResolved] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResolvedIssues = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:5000/api/complaints");
        if (!res.ok) throw new Error("Network response was not ok.");
        const data = await res.json();

        const resolvedIssues = data.filter((c) => c.status === "Resolved");
        
        setResolved(resolvedIssues.map((item, index) => ({
            ...item,
            id: item.id || `mock-${index}`
        })));

      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Could not load public issue data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchResolvedIssues();
  }, []);

  return (
    <>
      <div className="public-dashboard-container">
        <h2>Resolved Issues Tracker</h2>

        {isLoading && <div className="loading">Checking for resolved issues...</div>}
        {error && <div className="error-message">Error: {error}</div>}

        {!isLoading && !error && resolved.length === 0 && (
          <div className="loading">
            No issues have been marked as Resolved yet.
          </div>
        )}

        {!isLoading && !error && resolved.length > 0 && (
          <ul className="resolved-list">
            {resolved.map((c) => (
              <li key={c.id} className="resolved-item">
                <span className="resolved-icon">✓</span>
                <div className="issue-content">
                  <div className="issue-title">{c.title || 'Untitled Issue'}</div>
                  <div className="issue-location">Location: {c.location || 'Not Specified'}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default PublicDashboard;
