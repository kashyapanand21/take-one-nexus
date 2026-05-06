'use client';

export default function Home() {
  return (
    <main className="hero">
      <div className="hero-content">
        <div className="hero-label">
          <span>NOW IN PRODUCTION</span>
        </div>
        <h1>
          <span className="neon-line">TAKE ONE</span>
          <span className="outline-line">COLLABORATION</span>
        </h1>
        <p className="hero-sub">
          Where every frame matters and every script tells a story. The nexus for modern film professionals.
        </p>
        <div className="hero-actions">
          <button className="btn-primary">START PROJECT</button>
          <button className="btn-secondary">VIEW CREW</button>
        </div>
        <div className="hero-stats">
          <div className="hstat">
            <div className="hstat-num">2.4k<span>+</span></div>
            <div className="hstat-label">CREW MEMBERS</div>
          </div>
          <div className="hstat">
            <div className="hstat-num">850<span>+</span></div>
            <div className="hstat-label">SCRIPTS READY</div>
          </div>
        </div>
      </div>

      <div className="director-monitor">
        <div className="monitor-top">
          <div className="monitor-dot" />
          REC <strong>4K RAW</strong>
        </div>
        <div className="monitor-screen">
          <div className="monitor-grid" />
          <div className="monitor-frame">
            <div className="monitor-kicker">SCENE 01 / TAKE 04</div>
            <h2>NEXUS COLLAB</h2>
            <p>ESTABLISHING SHOT - INTERIOR STUDIO</p>
          </div>
          <div className="monitor-slate">
            <div>
              <small>ROLL</small>
              <span>A01</span>
            </div>
            <div>
              <small>SCENE</small>
              <span>24B</span>
            </div>
            <div>
              <small>TAKE</small>
              <span>12</span>
            </div>
          </div>
        </div>
        <div className="monitor-actions">
          <button>PLAYBACK</button>
          <button>SETTINGS</button>
        </div>
      </div>

      <style jsx>{`
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 10%;
          background: #06080A;
          color: #E8DFC8;
          overflow: hidden;
          position: relative;
        }

        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(255, 77, 26, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 77, 26, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
          mask-image: radial-gradient(circle at center, black, transparent 80%);
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 600px;
        }

        .hero-label {
          font-size: 10px;
          letter-spacing: 0.4em;
          color: #FF4D1A;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .hero-label::before {
          content: '';
          width: 30px;
          height: 1px;
          background: #FF4D1A;
        }

        h1 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(60px, 8vw, 120px);
          line-height: 0.9;
          margin-bottom: 30px;
        }

        .neon-line {
          color: #FF4D1A;
          text-shadow: 0 0 20px rgba(255, 77, 26, 0.4);
          display: block;
        }

        .outline-line {
          color: transparent;
          -webkit-text-stroke: 1px rgba(232, 223, 200, 0.3);
          display: block;
        }

        .hero-sub {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 20px;
          color: #6B7A8D;
          margin-bottom: 40px;
          line-height: 1.6;
        }

        .hero-actions {
          display: flex;
          gap: 20px;
          margin-bottom: 60px;
        }

        .btn-primary {
          background: #FF4D1A;
          color: #06080A;
          border: none;
          padding: 15px 35px;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
          transition: 0.3s;
        }

        .btn-primary:hover {
          background: #FFA620;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(255, 77, 26, 0.2);
        }

        .btn-secondary {
          background: transparent;
          color: #00D4FF;
          border: 1px solid rgba(0, 212, 255, 0.4);
          padding: 15px 35px;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          transition: 0.3s;
        }

        .btn-secondary:hover {
          background: rgba(0, 212, 255, 0.05);
          border-color: #00D4FF;
        }

        .hero-stats {
          display: flex;
          gap: 50px;
          border-top: 1px solid rgba(255, 77, 26, 0.1);
          padding-top: 30px;
        }

        .hstat-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 40px;
          line-height: 1;
        }

        .hstat-num span {
          color: #FF4D1A;
        }

        .hstat-label {
          font-size: 8px;
          letter-spacing: 0.3em;
          color: #6B7A8D;
          margin-top: 5px;
        }

        /* Director Monitor */
        .director-monitor {
          width: 400px;
          background: #0E1218;
          border: 1px solid rgba(255, 77, 26, 0.2);
          position: relative;
          box-shadow: 0 40px 100px rgba(0,0,0,0.6);
        }

        .monitor-top {
          padding: 10px 15px;
          font-size: 9px;
          letter-spacing: 0.2em;
          color: #6B7A8D;
          border-bottom: 1px solid rgba(255, 77, 26, 0.2);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .monitor-dot {
          width: 8px;
          height: 8px;
          background: #FF4D1A;
          border-radius: 50%;
          animation: pulse 1s infinite;
        }

        .monitor-screen {
          padding: 20px;
          position: relative;
          min-height: 300px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }

        .monitor-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px);
          background-size: 20px 20px;
        }

        .monitor-frame {
          position: relative;
          z-index: 2;
          border: 1px solid rgba(0, 212, 255, 0.1);
          padding: 20px;
          background: rgba(6, 8, 10, 0.4);
        }

        .monitor-kicker {
          font-size: 9px;
          color: #FF4D1A;
          margin-bottom: 10px;
          letter-spacing: 0.2em;
        }

        .monitor-frame h2 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 36px;
          margin-bottom: 5px;
        }

        .monitor-frame p {
          font-size: 10px;
          color: #6B7A8D;
        }

        .monitor-slate {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: rgba(255, 77, 26, 0.2);
          margin-top: 15px;
        }

        .monitor-slate div {
          background: #06080A;
          padding: 10px;
          text-align: center;
        }

        .monitor-slate small {
          display: block;
          font-size: 7px;
          color: #6B7A8D;
          letter-spacing: 0.2em;
          margin-bottom: 5px;
        }

        .monitor-slate span {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 24px;
        }

        .monitor-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-top: 1px solid rgba(255, 77, 26, 0.2);
        }

        .monitor-actions button {
          background: transparent;
          border: none;
          border-right: 1px solid rgba(255, 77, 26, 0.2);
          color: #6B7A8D;
          padding: 12px;
          font-size: 8px;
          letter-spacing: 0.2em;
          font-family: 'Space Mono', monospace;
          transition: 0.3s;
        }

        .monitor-actions button:last-child {
          border-right: none;
        }

        .monitor-actions button:hover {
          background: #FF4D1A;
          color: #06080A;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @media (max-width: 1000px) {
          .hero {
            flex-direction: column;
            padding: 100px 5%;
          }
          .director-monitor {
            width: 100%;
            margin-top: 50px;
          }
        }
      `}</style>
    </main>
  );
}
