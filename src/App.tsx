// src/App.tsx - OPTIMIZED LAYOUT

import React, { useState, useEffect } from 'react';
import NetworkGraph from './components/NetworkGraph';
import { api } from './services/api';
import { NetworkData, APIStats } from './types/network';
import './App.css';

function App() {
  const [authorNetwork, setAuthorNetwork] = useState<NetworkData | null>(null);
  const [citationNetwork, setCitationNetwork] = useState<NetworkData | null>(null);
  const [stats, setStats] = useState<APIStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'author' | 'citation'>('author');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [authorData, citationData, statsData] = await Promise.all([
        api.getAuthorNetwork(),
        api.getCitationNetwork(),
        api.getStats()
      ]);

      setAuthorNetwork(authorData);
      setCitationNetwork(citationData);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const currentNetwork = activeView === 'author' ? authorNetwork : citationNetwork;

  return (
    <div className="App">
      {/* Compact Header */}
      <header className="App-header">
        <div>
          <h1>🔬 SciSciNet Visualization</h1>
          <p className="subtitle">UCSD Computer Science Research Networks (2020-2024)</p>
        </div>
      </header>

      {/* Main Content - Horizontal Layout */}
      <div className="main-content">
        {/* Left Sidebar - Stats & Controls */}
        <aside className="sidebar">
          {/* Stats Card */}
          {stats && (
            <div className="stat-card">
              <h3>📊 Statistics</h3>
              <div className="stat-grid">
                <div className="stat-item">
                  <span className="stat-label">Papers</span>
                  <span className="stat-value">{stats.author_network.metadata.total_papers}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Authors</span>
                  <span className="stat-value">{stats.author_network.metadata.total_authors}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Collaborations</span>
                  <span className="stat-value">
                    {stats.author_network.metadata.total_collaborations.toLocaleString()}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Year Range</span>
                  <span className="stat-value">{stats.author_network.metadata.year_range}</span>
                </div>
              </div>
            </div>
          )}

          {/* View Selector */}
          <div className="view-selector">
            <button
              className={activeView === 'author' ? 'active' : ''}
              onClick={() => setActiveView('author')}
            >
              👥 Author Collaboration
            </button>
            <button
              className={activeView === 'citation' ? 'active' : ''}
              onClick={() => setActiveView('citation')}
            >
              📄 Paper Citation
            </button>
          </div>

          {/* Network Info */}
          <div className="network-info-card">
            <h3>
              {activeView === 'author' ? '👥 Author Network' : '📄 Citation Network'}
            </h3>
            <p>
              {activeView === 'author' 
                ? `Collaborations between ${authorNetwork?.nodes.length || 0} authors based on ${authorNetwork?.metadata?.total_papers || 0} CS papers from UCSD.`
                : `Citation relationships between ${citationNetwork?.nodes.length || 0} papers. Colors indicate publication year.`
              }
            </p>
            
            <div className="scalability-info">
              <strong>⚙️ Scalability Solution</strong>
              <p>
                Handling {currentNetwork?.nodes.length.toLocaleString() || 0} nodes and{' '}
                {currentNetwork?.links.length.toLocaleString() || 0} edges through optimized 
                force simulation, reduced opacity, and efficient collision detection.
              </p>
            </div>
          </div>
        </aside>

        {/* Main Visualization Area */}
        <main className="visualization-area">
          <div className="viz-header">
            <h2>
              {activeView === 'author' 
                ? 'Author Collaboration Network' 
                : 'Paper Citation Network'}
            </h2>
          </div>

          <div className="viz-content">
            {activeView === 'author' && authorNetwork && (
              <NetworkGraph
                data={authorNetwork}
                title=""
                nodeLabel={(node) => node.name || ''}
                nodeTooltip={(node) => `
                  <strong>${node.name}</strong><br/>
                  Papers: ${node.paperCount || 0}<br/>
                  ID: ${node.id}
                `}
                linkTooltip={(link) => `
                  Collaborations: ${(link as any).weight || 1}
                `}
              />
            )}

            {activeView === 'citation' && citationNetwork && (
              <NetworkGraph
                data={citationNetwork}
                title=""
                nodeLabel={(node) => node.title?.substring(0, 20) + '...' || ''}
                nodeTooltip={(node) => `
                  <strong>${node.title}</strong><br/>
                  Year: ${node.year}<br/>
                  Citations: ${node.citationCount || 0}<br/>
                  ID: ${node.id}
                `}
              />
            )}
          </div>

          <div className="tips-panel">
            <strong>💡 Interaction Tips:</strong>
            <ul>
              <li>Drag nodes to rearrange</li>
              <li>Hover for details</li>
              <li>Scroll to zoom</li>
              <li>Drag background to pan</li>
              <li>Node size = importance</li>
              <li>Edge thickness = strength</li>
            </ul>
          </div>
        </main>
      </div>

      {/* Compact Footer */}
      <footer className="App-footer">
        <p>
          Project 1: Full-Stack Web Development | UCSD Design Lab | 
          Data: OpenAlex (SciSciNet) | Stack: Flask + Python + React + D3.js
        </p>
      </footer>
    </div>
  );
}

export default App;