'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface IssueUser {
  id: number;
  name: string;
  email: string;
}

interface Issue {
  id: number;
  title: string;
  description: string;
  location: string | null;
  severity: string;
  screenshot: string | null;
  status: string;
  created_at: string;
  platform_source: string;
  issue_type: string | null;
  user: IssueUser | null;
}

export default function AdminIssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');

  const fetchIssues = async () => {
    try {
      const res = await fetch('/api/issues');
      const json = await res.json();
      if (json.success) {
        setIssues(json.data);
      } else {
        setError(json.message || 'Failed to load issues');
      }
    } catch (err) {
      setError('Error fetching issues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/issues/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const json = await res.json();
      if (json.success) {
        setIssues(issues.map(issue => issue.id === id ? { ...issue, status } : issue));
      } else {
        alert(json.message || 'Failed to update issue');
      }
    } catch (err) {
      alert('Error updating issue');
    }
  };

  const deleteIssue = async (id: number) => {
    if (!confirm('Are you sure you want to delete this issue?')) return;
    try {
      const res = await fetch(`/api/issues/${id}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (json.success) {
        setIssues(issues.filter(issue => issue.id !== id));
      } else {
        alert(json.message || 'Failed to delete issue');
      }
    } catch (err) {
      alert('Error deleting issue');
    }
  };

  const filteredIssues = issues.filter(issue => {
    const matchesStatus = filter === 'all' || issue.status === filter;
    const matchesSource = sourceFilter === 'all' || issue.platform_source === sourceFilter;
    return matchesStatus && matchesSource;
  });

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: 'var(--neon)' }}>Loading Issue Matrix...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center', padding: '40px' }}>{error}</div>;
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="page-title">Issues & Bugs</h1>
        <p className="page-subtitle">Platform Diagnostics and User Reports</p>
      </div>

      <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--silver)', marginRight: '8px' }}>Status:</span>
          <button className={`btn-action ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
          <button className={`btn-action ${filter === 'open' ? 'active' : ''}`} onClick={() => setFilter('open')}>Open</button>
          <button className={`btn-action ${filter === 'In Progress' ? 'active' : ''}`} onClick={() => setFilter('In Progress')}>In Progress</button>
          <button className={`btn-action ${filter === 'Resolved' ? 'active' : ''}`} onClick={() => setFilter('Resolved')}>Resolved</button>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--silver)', marginRight: '8px' }}>Source:</span>
          <button className={`btn-action ${sourceFilter === 'all' ? 'active' : ''}`} onClick={() => setSourceFilter('all')}>All Platforms</button>
          <button className={`btn-action ${sourceFilter === 'main-website' ? 'active' : ''}`} onClick={() => setSourceFilter('main-website')}>Main Website</button>
          <button className={`btn-action ${sourceFilter === 'scripts-platform' ? 'active' : ''}`} onClick={() => setSourceFilter('scripts-platform')}>Scripts Platform</button>
        </div>
      </div>

      <div className="admin-table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Platform Source</th>
              <th>Report</th>
              <th>Reporter</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredIssues.map(issue => (
              <tr key={issue.id}>
                <td style={{ color: 'var(--silver)' }}>#{issue.id}</td>
                <td>
                  <span className="role-badge" style={{
                    borderColor: issue.platform_source === 'scripts-platform' ? 'var(--neon)' : 'var(--cyan)',
                    color: issue.platform_source === 'scripts-platform' ? 'var(--neon)' : 'var(--cyan)',
                    boxShadow: issue.platform_source === 'scripts-platform' ? '0 0 8px rgba(255, 77, 26, 0.15)' : 'none'
                  }}>
                    {issue.platform_source === 'scripts-platform' ? 'SCRIPTS PLATFORM' : 'MAIN WEBSITE'}
                  </span>
                </td>
                <td>
                  <div style={{ fontWeight: 'bold' }}>{issue.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--silver)', marginTop: '4px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {issue.description}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px' }}>
                    {issue.issue_type && (
                      <span style={{ fontSize: '10px', color: 'var(--amber)', background: 'rgba(255, 166, 32, 0.1)', padding: '1px 6px', borderRadius: '4px' }}>
                        Type: {issue.issue_type}
                      </span>
                    )}
                    {issue.location && <div style={{ fontSize: '10px', color: 'var(--cyan)' }}>Path: {issue.location}</div>}
                    {issue.screenshot && (
                      <a href={issue.screenshot} target="_blank" rel="noreferrer" style={{ fontSize: '10px', color: 'var(--cyan)', textDecoration: 'underline' }}>
                        View Screenshot
                      </a>
                    )}
                  </div>
                </td>
                <td>
                  {issue.user ? (
                    <>
                      <div>{issue.user.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--silver)' }}>{issue.user.email}</div>
                    </>
                  ) : (
                    <span style={{ color: 'var(--silver)' }}>Anonymous</span>
                  )}
                </td>
                <td>
                  <span className="role-badge" style={{ 
                    borderColor: issue.severity === 'critical' ? '#ff003c' : issue.severity === 'high' ? 'red' : issue.severity === 'medium' ? 'var(--neon)' : 'var(--silver)',
                    color: issue.severity === 'critical' ? '#ff003c' : issue.severity === 'high' ? 'red' : issue.severity === 'medium' ? 'var(--neon)' : 'var(--silver)',
                    boxShadow: issue.severity === 'critical' ? '0 0 8px rgba(255, 0, 60, 0.4)' : 'none',
                    fontWeight: issue.severity === 'critical' ? 'bold' : 'normal'
                  }}>
                    {issue.severity.toUpperCase()}
                  </span>
                </td>
                <td>
                  <span className="role-badge" style={{ borderColor: 'var(--silver)', color: 'var(--silver)' }}>
                    {issue.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ fontSize: '12px', color: 'var(--silver)' }}>
                  {new Date(issue.created_at).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {issue.status !== 'Resolved' && (
                      <button 
                        onClick={() => updateStatus(issue.id, 'Resolved')}
                        style={{ background: 'transparent', border: '1px solid var(--cyan)', color: 'var(--cyan)', padding: '4px 8px', fontSize: '10px', cursor: 'pointer', fontFamily: 'var(--font-main)' }}
                      >
                        RESOLVE
                      </button>
                    )}
                    {issue.status !== 'In Progress' && (
                      <button 
                        onClick={() => updateStatus(issue.id, 'In Progress')}
                        style={{ background: 'transparent', border: '1px solid var(--neon)', color: 'var(--neon)', padding: '4px 8px', fontSize: '10px', cursor: 'pointer', fontFamily: 'var(--font-main)' }}
                      >
                        IN PROGRESS
                      </button>
                    )}
                    <button 
                      onClick={() => deleteIssue(issue.id)}
                      style={{ background: 'transparent', border: '1px solid red', color: 'red', padding: '4px 8px', fontSize: '10px', cursor: 'pointer', fontFamily: 'var(--font-main)' }}
                    >
                      DELETE
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredIssues.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--silver)' }}>No issues found matching the criteria.</div>
        )}
      </div>
    </div>
  );
}
