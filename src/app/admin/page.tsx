import React from 'react';
import AnalyticsCharts from '@/components/admin/AnalyticsCharts';
import AdminDashboardOverview from '@/components/admin/AdminDashboardOverview';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  return (
    <div>
      <div className="admin-page-header">
        <h1 className="page-title">Command Center</h1>
        <p className="page-subtitle">Mission Overview & Real-time Production Signal</p>
      </div>

      <AdminDashboardOverview />

      {/* Analytics Section */}
      <div style={{ marginTop: '60px' }}>
        <AnalyticsCharts />
      </div>

      <div style={{ 
        marginTop: '60px', 
        padding: '40px', 
        border: '1px solid var(--border)', 
        textAlign: 'center', 
        background: 'rgba(255,77,26,0.02)',
        clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '20px' }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '8px', color: 'var(--neon)', letterSpacing: '3px', marginBottom: '5px' }}>SIGNAL STRENGTH</div>
            <div style={{ width: '100px', height: '4px', background: 'var(--border)' }}>
              <div style={{ width: '85%', height: '100%', background: 'var(--neon)' }}></div>
            </div>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '8px', color: 'var(--cyan)', letterSpacing: '3px', marginBottom: '5px' }}>ENCRYPTION</div>
            <div style={{ width: '100px', height: '4px', background: 'var(--border)' }}>
              <div style={{ width: '100%', height: '100%', background: 'var(--cyan)' }}></div>
            </div>
          </div>
        </div>
        <p style={{ color: 'var(--text-dim)', fontSize: '9px', letterSpacing: '4px', textTransform: 'uppercase', margin: 0 }}>
          Direct Database Connection Established · Signal 001-A · TAKE ONE Nexus Mission Control
        </p>
      </div>
    </div>
  );
}
