// src/App.tsx - WITH T2 + T3 (Bundled Network)

import React, { useState, useEffect } from 'react';
import NetworkGraph from './components/NetworkGraph';
import HierarchicalBundledGraph from './components/HierarchicalBundledGraph';
import Timeline from './components/Timeline';
import Histogram from './components/Histogram';
import { api, TimelineData, PatentDistribution } from './services/api';
import { NetworkData, APIStats } from './types/network';
import './App.css';

type ViewType = 'author' | 'author-bundled' | 'citation' | 'dashboards';

function App() {
  const [authorNetwork, setAuthorNetwork] = useState<NetworkData | null>(null);
  const [citationNetwork, setCitationNetwork] = useState<NetworkData | null>(null);
  const [stats, setStats] = useState<APIStats | null>(null);
  const [timeline, setTimeline] = useState<TimelineData[]>([]);
  const [patentDist, setPatentDist] = useState<PatentDistribution[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ViewType>('author');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        authorData,
        citationData,
        statsData,
        timelineData,
        patentData
      ] = await Promise.all([
        api.getAuthorNetwork(),
        api.getCitationNetwork(),
        api.getStats(),
        api.getTimeline(),
        api.getPatentDistribution()
      ]);

      setAuthorNetwork(authorData);
      setCitationNetwork(citationData);
      setStats(statsData);
      setTimeline(timelineData);
      setPatentDist(patentData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleYearClick = async (year: number) => {
    setSelectedYear(year);
    try {
      const yearPatentDist = await api.getPatentDistribution(year);
      setPatentDist(yearPatentDist);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= Loading / Error ================= */

  if (loading) {
    return (
      <div className="App">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading network data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <div className="error-container">
          <h2>❌ Error</h2>
          <p>{error}</p>
          <button onClick={loadData}>Retry</button>
          <div className="error-help">
            <p>Make sure the backend is running:</p>
            <code>python app.py</code>
          </div>
        </div>
      </div>
    );
  }

  /* ================= Main App ================= */

  return (
    <div className="App">
      {/* Header */}
      <header className="App-header">
        <div>
          <h1>🔬 SciSciNet Visualization</h1>
          <p className="subtitle">
            UCSD Computer Science Research Networks (2020–2024)
          </p>
        </div>
      </header>

      <div className="main-content">
        {/* ================= Sidebar ================= */}
        <aside className="sidebar">
          {stats && (
            <div className="stat-card">
              <h3>📊 Statistics</h3>
              <div className="stat-grid">
                <div className="stat-item">
                  <span className="stat-label">Papers</span>
                  <span className="stat-value">
                    {stats.author_network.metadata.total_papers}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Authors</span>
                  <span className="stat-value">
                    {stats.author_network.metadata.total_authors}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Collaborations</span>
                  <span className="stat-value">
                    {stats.author_network.metadata.total_collaborations.toLocaleString()}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Year Range</span>
                  <span className="stat-value">
                    {stats.author_network.metadata.year_range}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="view-selector">
            <button
              className={activeView === 'author' ? 'active' : ''}
              onClick={() => setActiveView('author')}
            >
              👥 Author Network
            </button>

            <button
              className={activeView === 'author-bundled' ? 'active' : ''}
              onClick={() => setActiveView('author-bundled')}
            >
              🧩 Author Network (Bundled)
            </button>

            <button
              className={activeView === 'citation' ? 'active' : ''}
              onClick={() => setActiveView('citation')}
            >
              📄 Citation Network
            </button>

            <button
              className={activeView === 'dashboards' ? 'active' : ''}
              onClick={() => setActiveView('dashboards')}
            >
              📊 Dashboards (T2)
            </button>
          </div>

          <div className="network-info-card">
            <h3>
              {activeView === 'author' && '👥 Author Network'}
              {activeView === 'author-bundled' && '🧩 Bundled Author Network'}
              {activeView === 'citation' && '📄 Citation Network'}
              {activeView === 'dashboards' && '📊 Dashboards'}
            </h3>
            <p>
              {activeView === 'author' &&
                `Force-directed collaboration network among ${authorNetwork?.nodes.length} authors.`}
              {activeView === 'author-bundled' &&
                'Radial hierarchical layout with edge bundling to reduce clutter in large networks.'}
              {activeView === 'citation' &&
                `Citation relationships among ${citationNetwork?.nodes.length} papers.`}
              {activeView === 'dashboards' &&
                'Interactive coordinated views for timeline and patent citations.'}
            </p>
          </div>
        </aside>

        {/* ================= Visualization Area ================= */}
        <main className="visualization-area">
          {/* ---------- T1 Author Network ---------- */}
          {activeView === 'author' && authorNetwork && (
            <>
              <div className="viz-header">
                <h2>Author Collaboration Network</h2>
              </div>
              <div className="viz-content">
                <NetworkGraph
                  data={authorNetwork}
                  title=""
                  nodeLabel={node => node.name || ''}
                  nodeTooltip={node => `
                    <strong>${node.name}</strong><br/>
                    Papers: ${node.paperCount || 0}
                  `}
                />
              </div>
            </>
          )}

          {/* ---------- T3 Bundled Network ---------- */}
          {activeView === 'author-bundled' && authorNetwork && (
            <>
              <div className="viz-header">
                <h2>Author Network (Hierarchical Edge Bundling)</h2>
              </div>
              <div className="viz-content">
                <HierarchicalBundledGraph data={authorNetwork} />
              </div>
              <div className="tips-panel">
                <strong>💡 T3 Refinement</strong>
                <ul>
                  <li>Radial hierarchical layout</li>
                  <li>Hierarchical edge bundling</li>
                  <li>Reduced edge crossings</li>
                  <li>Clearer collaboration clusters</li>
                </ul>
              </div>
            </>
          )}

          {/* ---------- T1 Citation Network ---------- */}
          {activeView === 'citation' && citationNetwork && (
            <>
              <div className="viz-header">
                <h2>Paper Citation Network</h2>
              </div>
              <div className="viz-content">
                <NetworkGraph
                  data={citationNetwork}
                  title=""
                  nodeLabel={node => node.title?.slice(0, 20) + '...' || ''}
                  nodeTooltip={node => `
                    <strong>${node.title}</strong><br/>
                    Year: ${node.year}<br/>
                    Citations: ${node.citationCount || 0}
                  `}
                />
              </div>
            </>
          )}

          {/* ---------- T2 Dashboards ---------- */}
          {activeView === 'dashboards' && (
            <>
              <div className="viz-header">
                <h2>Interactive Dashboards</h2>
              </div>
              <div className="dashboards-container">
                <div className="dashboard-row">
                  <Timeline
                    data={timeline}
                    onYearClick={handleYearClick}
                    selectedYear={selectedYear}
                  />
                </div>
                <div className="dashboard-row">
                  <Histogram
                    data={patentDist}
                    selectedYear={selectedYear}
                  />
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      <footer className="App-footer">
        <p>
          Project 1 – Full-Stack Web Development | UCSD Design Lab |
          SciSciNet (OpenAlex) | React + D3 + Flask
        </p>
      </footer>
    </div>
  );
}

export default App;
