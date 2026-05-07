import React from 'react';

export default function Loading() {
  return (
    <div className="skeleton-container">
      <div className="skeleton-hero"></div>
      <div className="skeleton-main">
        <div className="skeleton-card">
          <div className="skeleton-sidebar">
            <div className="skeleton-avatar"></div>
            <div className="skeleton-line short"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line medium"></div>
            <div className="skeleton-stats">
              <div className="skeleton-stat"></div>
              <div className="skeleton-stat"></div>
              <div className="skeleton-stat"></div>
            </div>
            <div className="skeleton-button"></div>
          </div>
          <div className="skeleton-content">
            <div className="skeleton-tabs">
              <div className="skeleton-tab"></div>
              <div className="skeleton-tab"></div>
              <div className="skeleton-tab"></div>
            </div>
            <div className="skeleton-grid">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="skeleton-item"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .skeleton-container {
          min-height: 100vh;
          background: #06080A;
          overflow: hidden;
        }
        .skeleton-hero {
          height: 120px;
          background: linear-gradient(90deg, #0a0e12 25%, #151b22 50%, #0a0e12 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        .skeleton-main {
          max-width: 1200px;
          margin: -40px auto 0;
          padding: 0 20px;
        }
        .skeleton-card {
          background: #0a0e12;
          border: 1px solid rgba(255, 77, 26, 0.1);
          display: flex;
          min-height: 600px;
        }
        .skeleton-sidebar {
          width: 300px;
          padding: 40px;
          border-right: 1px solid rgba(255, 77, 26, 0.05);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .skeleton-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: #151b22;
          margin-bottom: 24px;
        }
        .skeleton-content {
          flex: 1;
          padding: 40px;
        }
        .skeleton-line {
          height: 12px;
          background: #151b22;
          margin-bottom: 12px;
          width: 100%;
          border-radius: 2px;
        }
        .skeleton-line.short { width: 40%; }
        .skeleton-line.medium { width: 70%; }
        
        .skeleton-stats {
          display: flex;
          gap: 12px;
          width: 100%;
          margin: 24px 0;
        }
        .skeleton-stat {
          flex: 1;
          height: 40px;
          background: #151b22;
        }
        .skeleton-button {
          width: 100%;
          height: 45px;
          background: rgba(255, 77, 26, 0.05);
          margin-top: 20px;
        }
        .skeleton-tabs {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 10px;
        }
        .skeleton-tab {
          width: 80px;
          height: 20px;
          background: #151b22;
        }
        .skeleton-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }
        .skeleton-item {
          height: 150px;
          background: #151b22;
          border: 1px solid rgba(255, 255, 255, 0.02);
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        .skeleton-avatar, .skeleton-line, .skeleton-stat, .skeleton-tab, .skeleton-item {
          background: linear-gradient(90deg, #151b22 25%, #1c252e 50%, #151b22 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
      `}} />
    </div>
  );
}
