'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Pusher from 'pusher-js';
import Link from 'next/link';

interface User {
  id: number;
  name: string;
  email: string;
  role: string | null;
  college: string | null;
  city: string | null;
  created_at: string;
}

interface Stats {
  users: number;
  scripts: number;
  requests: number;
  issues?: number;
  openIssues?: number;
  inProgressIssues?: number;
  resolvedIssues?: number;
}

interface DashboardData {
  counts: Stats;
  recentUsers: User[];
}

interface AdminTask {
  id: number;
  title: string;
  description: string | null;
  credits: number;
  category: string;
  active: boolean;
  created_at: string;
}

export default function AdminDashboardOverview() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newUserId, setNewUserId] = useState<number | null>(null);
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskSaving, setTaskSaving] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    credits: '25',
    category: 'profile',
    active: true
  });

  const fetchStats = useCallback(async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('take_one_token') : null;
      const res = await fetch('/api/system/stats', {
        credentials: 'include',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      
      if (res.status === 401) {
        window.location.href = '/?auth=login';
        return;
      }

      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        setError(json.message || 'Failed to sync with Command Center');
      }
    } catch (err) {
      setError('Signal lost: Could not reach Command Center');
    } finally {
      setLoading(false);
    }
  }, []);

  const authHeaders = (): Record<string, string> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('take_one_token') : null;
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch('/api/tasks/admin/definitions', {
        credentials: 'include',
        headers: authHeaders()
      });
      const json = await res.json();
      if (json.success) {
        setTasks(json.data || []);
      }
    } catch (err) {
      console.error('Failed to load admin tasks', err);
    }
  }, []);

  const createTask = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTaskSaving(true);

    try {
      const res = await fetch('/api/tasks/admin/definitions', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders()
        },
        body: JSON.stringify({
          title: taskForm.title,
          description: taskForm.description,
          credits: Number(taskForm.credits),
          category: taskForm.category,
          active: taskForm.active
        })
      });
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message || 'Could not create task');
      }

      setTaskModalOpen(false);
      setTaskForm({ title: '', description: '', credits: '25', category: 'profile', active: true });
      fetchTasks();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Could not create task');
    } finally {
      setTaskSaving(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchTasks();

    // Initialize Pusher
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY || '';
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || '';

    if (!pusherKey || !pusherCluster) {
      console.warn('Pusher configuration missing for real-time updates');
      return;
    }

    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster
    });

    const channel = pusher.subscribe('admin-dashboard');
    
    channel.bind('update', (payload: any) => {

      fetchStats();
      
      if (payload.type === 'USER_CREATED') {
        setNewUserId(payload.user.id);
        setTimeout(() => setNewUserId(null), 5000); // Clear pulse after 5 seconds
      }
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe('admin-dashboard');
      pusher.disconnect();
    };
  }, [fetchStats, fetchTasks]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', color: 'var(--neon)' }}>
        <div className="pulse-ring" style={{ width: '50px', height: '50px' }}></div>
        <span style={{ marginLeft: '20px', fontFamily: 'var(--font-title)', letterSpacing: '4px', textTransform: 'uppercase' }}>Synchronizing Production Data...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ padding: '40px', border: '1px solid var(--border)', textAlign: 'center', color: 'var(--silver)', background: 'rgba(255,0,0,0.05)' }}>
        <h3 style={{ color: 'var(--neon)', marginBottom: '10px' }}>CONNECTION INTERRUPTED</h3>
        <p>{error}</p>
        <button onClick={() => { setLoading(true); fetchStats(); }} className="btn-action" style={{ marginTop: '20px' }}>Retry Sync</button>
      </div>
    );
  }

  const getRoleBadgeClass = (role: string | null) => {
    if (!role) return 'role-badge';
    const r = role.toLowerCase();
    if (r === 'developer') return 'role-badge dev-badge';
    if (r === 'admin') return 'role-badge admin-badge';
    return 'role-badge';
  };

  return (
    <>
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-label">Production Crew</div>
          <div className="stat-value">{data.counts.users}</div>
          <div style={{ marginTop: '10px', fontSize: '9px', color: 'var(--silver)', letterSpacing: '2px' }}>REGISTERED CREATORS</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Scripts Locked</div>
          <div className="stat-value">{data.counts.scripts}</div>
          <div style={{ marginTop: '10px', fontSize: '9px', color: 'var(--silver)', letterSpacing: '2px' }}>SCREENPLAYS ON FILE</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Collabs</div>
          <div className="stat-value">{data.counts.requests}</div>
          <div style={{ marginTop: '10px', fontSize: '9px', color: 'var(--silver)', letterSpacing: '2px' }}>COLLABORATION SIGNALS</div>
        </div>
      </div>

      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '15px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '24px', letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>Tasks</h2>
          <p style={{ margin: '5px 0 0 0', fontSize: '10px', letterSpacing: '3px', color: 'var(--silver)', textTransform: 'uppercase' }}>Credit rewards and creator onboarding signals</p>
        </div>
        <button type="button" className="btn-add" onClick={() => setTaskModalOpen(true)}>
          <span>+ Create Task</span>
        </button>
      </div>

      <div className="admin-table-container" style={{ marginBottom: '40px' }}>
        <table>
          <thead>
            <tr>
              <th>Task Title</th>
              <th>Category</th>
              <th>Credits Reward</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {tasks.slice(0, 6).map(task => (
              <tr key={task.id}>
                <td>
                  <strong>{task.title}</strong>
                  <div style={{ color: 'var(--silver)', fontSize: '10px', marginTop: '6px', maxWidth: '520px' }}>{task.description || 'No description'}</div>
                </td>
                <td><span className="role-badge">{task.category}</span></td>
                <td style={{ color: 'var(--cyan)', fontWeight: 700 }}>{task.credits}</td>
                <td style={{ color: task.active ? '#00ff66' : 'var(--silver)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '10px' }}>{task.active ? 'Active' : 'Inactive'}</td>
                <td style={{ color: 'var(--silver)', fontSize: '10px' }}>{new Date(task.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--silver)' }}>No credit tasks have been staged yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '40px', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '15px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '20px', letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>System Issue Signals</h2>
          <p style={{ margin: '5px 0 0 0', fontSize: '10px', letterSpacing: '3px', color: 'var(--silver)', textTransform: 'uppercase' }}>Live bug reporting & feedback metrics</p>
        </div>
        <Link href="/admin/issues" className="btn-action">Manage Issues →</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="stat-card" style={{ borderLeft: '3px solid var(--neon)', background: 'rgba(255, 77, 26, 0.02)' }}>
          <div className="stat-label">Total Reports</div>
          <div className="stat-value">{data.counts.issues ?? 0}</div>
          <div style={{ marginTop: '10px', fontSize: '9px', color: 'var(--silver)', letterSpacing: '2px' }}>ALL SYSTEM TICKETS</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '3px solid #ffcc00', background: 'rgba(255, 204, 0, 0.02)' }}>
          <div className="stat-label">Open / Unresolved</div>
          <div className="stat-value" style={{ color: '#ffcc00' }}>{data.counts.openIssues ?? 0}</div>
          <div style={{ marginTop: '10px', fontSize: '9px', color: 'var(--silver)', letterSpacing: '2px' }}>AWAITING ACTION</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '3px solid var(--cyan)', background: 'rgba(0, 255, 255, 0.02)' }}>
          <div className="stat-label">In Progress</div>
          <div className="stat-value" style={{ color: 'var(--cyan)' }}>{data.counts.inProgressIssues ?? 0}</div>
          <div style={{ marginTop: '10px', fontSize: '9px', color: 'var(--silver)', letterSpacing: '2px' }}>UNDER INVESTIGATION</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '3px solid #00ff66', background: 'rgba(0, 255, 102, 0.02)' }}>
          <div className="stat-label">Resolved</div>
          <div className="stat-value" style={{ color: '#00ff66' }}>{data.counts.resolvedIssues ?? 0}</div>
          <div style={{ marginTop: '10px', fontSize: '9px', color: 'var(--silver)', letterSpacing: '2px' }}>VERIFIED FIXES</div>
        </div>
      </div>

      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px', borderBottom: '1px solid var(--border)', paddingBottom: '15px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '32px', letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>Recent Transmissions</h2>
          <p style={{ margin: '5px 0 0 0', fontSize: '10px', letterSpacing: '3px', color: 'var(--silver)', textTransform: 'uppercase' }}>Last 5 creators to join the production</p>
        </div>
        <Link href="/admin/users" className="btn-action">View Full Crew List →</Link>
      </div>

      <div className="admin-table-container">
        <table>
          <thead>
            <tr>
              <th>Creator Name</th>
              <th>Channel / Email</th>
              <th>Role Designation</th>
              <th>College / Base</th>
              <th>Sync Date</th>
            </tr>
          </thead>
          <tbody>
            {data.recentUsers.map(user => (
              <tr key={user.id} className={newUserId === user.id ? 'row-pulse' : ''}>
                <td style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {user.name}
                  {newUserId === user.id && <span className="new-pulse">NEW</span>}
                </td>
                <td style={{ color: 'var(--silver)', fontFamily: 'var(--font-main)' }}>{user.email}</td>
                <td>
                  <span className={getRoleBadgeClass(user.role)}>{user.role || 'GHOST'}</span>
                </td>
                <td style={{ color: 'var(--silver)' }}>{user.college || '—'}</td>
                <td style={{ color: 'var(--silver)', fontSize: '10px' }}>
                  {new Date(user.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
              </tr>
            ))}
            {data.recentUsers.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--silver)' }}>No transmissions detected in this sector.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .task-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 2000;
          display: grid;
          place-items: center;
          padding: 24px;
          background: rgba(6, 8, 10, 0.82);
          backdrop-filter: blur(18px);
        }

        .task-modal {
          width: min(620px, 100%);
          background: rgba(14, 18, 24, 0.98);
          border: 1px solid var(--border);
          padding: 32px;
          clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px));
          box-shadow: 0 0 60px rgba(255, 77, 26, 0.16);
        }

        .task-modal h3 {
          margin: 0 0 24px;
          font-family: var(--font-title);
          text-transform: uppercase;
          letter-spacing: 3px;
        }

        .task-form-grid {
          display: grid;
          gap: 16px;
        }

        .task-form-grid label {
          display: grid;
          gap: 8px;
          color: var(--silver);
          font-size: 9px;
          letter-spacing: 3px;
          text-transform: uppercase;
        }

        .task-form-grid input,
        .task-form-grid textarea,
        .task-form-grid select {
          width: 100%;
          box-sizing: border-box;
          background: rgba(6, 8, 10, 0.75);
          border: 1px solid var(--border);
          color: var(--cream);
          padding: 14px 16px;
          font-family: var(--font-main);
          outline: none;
        }

        .task-form-grid textarea {
          min-height: 110px;
          resize: vertical;
        }

        .task-toggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          border: 1px solid var(--border);
          padding: 14px 16px;
        }

        .task-toggle input {
          width: 20px;
          height: 20px;
          accent-color: var(--neon);
        }

        .task-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
        }

        .row-pulse {
          background: rgba(255, 77, 26, 0.1) !important;
          animation: rowHighlight 5s ease-out forwards;
        }

        .new-pulse {
          font-size: 8px;
          background: var(--neon);
          color: var(--void);
          padding: 2px 6px;
          border-radius: 2px;
          animation: pulse 1.5s infinite;
          letter-spacing: 1px;
          font-weight: bold;
        }

        .dev-badge {
          border-color: var(--cyan) !important;
          color: var(--cyan) !important;
          background: rgba(0, 255, 255, 0.1) !important;
        }

        .admin-badge {
          border-color: #ffcc00 !important;
          color: #ffcc00 !important;
          background: rgba(255, 204, 0, 0.1) !important;
        }

        @keyframes rowHighlight {
          0% { background: rgba(255, 77, 26, 0.2); }
          100% { background: transparent; }
        }

        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {taskModalOpen && (
        <div className="task-modal-backdrop" role="dialog" aria-modal="true" aria-label="Create task">
          <form className="task-modal" onSubmit={createTask}>
            <h3>Create Task</h3>
            <div className="task-form-grid">
              <label>
                Task Title
                <input
                  value={taskForm.title}
                  onChange={(event) => setTaskForm(prev => ({ ...prev, title: event.target.value }))}
                  placeholder="Upload first script"
                  required
                />
              </label>
              <label>
                Description
                <textarea
                  value={taskForm.description}
                  onChange={(event) => setTaskForm(prev => ({ ...prev, description: event.target.value }))}
                  placeholder="Creator completes a verified onboarding action."
                />
              </label>
              <label>
                Credits Reward
                <input
                  type="number"
                  min="0"
                  value={taskForm.credits}
                  onChange={(event) => setTaskForm(prev => ({ ...prev, credits: event.target.value }))}
                  required
                />
              </label>
              <label>
                Category
                <select
                  value={taskForm.category}
                  onChange={(event) => setTaskForm(prev => ({ ...prev, category: event.target.value }))}
                >
                  <option value="verification">Verify your email</option>
                  <option value="portfolio">Upload portfolio</option>
                  <option value="profile">Complete profile</option>
                  <option value="script">Upload first script</option>
                  <option value="project">Join a project</option>
                </select>
              </label>
              <div className="task-toggle">
                <span>Active</span>
                <input
                  type="checkbox"
                  checked={taskForm.active}
                  onChange={(event) => setTaskForm(prev => ({ ...prev, active: event.target.checked }))}
                  aria-label="Task active"
                />
              </div>
            </div>
            <div className="task-modal-actions">
              <button type="button" className="btn-action" onClick={() => setTaskModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn-add" disabled={taskSaving}>
                <span>{taskSaving ? 'Creating...' : '+ Create Task'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
