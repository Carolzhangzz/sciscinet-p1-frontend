
# SciSciNet Frontend

Interactive visualization of UCSD Computer Science research networks using **React, TypeScript, and D3.js**.

This project demonstrates multiple visualization techniques to explore **research collaboration and citation patterns**, with a focus on **scalability and visual clarity for large networks**.

---

## Features Overview

### Task 1 (T1): Interactive Network Graphs

* ✅ **Author Collaboration Network**

  * Force-directed layout for 1,134 authors
  * Edges represent co-authorship relationships
* ✅ **Paper Citation Network**

  * Force-directed layout for 69 CS papers
  * Directed citation relationships
* ✅ **Interactive Exploration**

  * Drag nodes to adjust layout
  * Hover nodes and edges for tooltips
  * Zoom and pan for dense regions
  * Node size encodes importance (paper count / citation count)
  * Edge thickness encodes collaboration strength
  * Color coding by year

---

### Task 2 (T2): Interactive Dashboards (Coordinated Views)

* ✅ **Timeline View**

  * Displays number of papers published per year (2020–2024)
* ✅ **Histogram View**

  * Shows patent citation distribution
* ✅ **Linked Interaction**

  * Clicking a year in the timeline filters the histogram
  * Supports overview + detail exploration

These dashboards provide **temporal and distributional context** that complements the network views.

---

### Task 3 (T3): Network Refinement with Hierarchical Edge Bundling

* ✅ **Author Network Refinement**

  * Refines the author collaboration network to improve readability at scale
* ✅ **Radial Hierarchical Layout**

  * Authors are arranged around a circle using a hierarchical clustering structure
* ✅ **Hierarchical Edge Bundling**

  * Individual collaboration edges are bundled into smooth flows
  * Reduces edge crossings and visual clutter
* ✅ **Purpose of This View**

  * This visualization is designed as an **overview** of collaboration patterns
  * Emphasizes **group-level structure and inter-cluster relationships**
  * Complements the force-directed network used for detailed inspection (T1)

> This view intentionally sacrifices individual-level detail in favor of revealing global structure, following the hierarchical edge bundling technique discussed in class.

---

## Tech Stack

* **React 18** – UI framework
* **TypeScript** – Type safety and maintainability
* **D3.js v7** – Data-driven visualizations
* **Create React App** – Build tooling

---

## Project Structure

```
sciscinet-p1-frontend/
├── public/
│   └── index.html
├── src/
│   ├── App.tsx                    # Main application component
│   ├── App.css                    # Application styles
│   ├── index.tsx                  # Entry point
│   ├── index.css                  # Global styles
│   ├── components/
│   │   ├── NetworkGraph.tsx       # Force-directed network (T1)
│   │   ├── HierarchicalBundledGraph.tsx  # Bundled network (T3)
│   │   ├── Timeline.tsx           # Timeline chart (T2)
│   │   └── Histogram.tsx          # Histogram chart (T2)
│   ├── services/
│   │   └── api.ts                 # Backend API calls
│   └── types/
│       └── network.ts             # TypeScript interfaces
├── package.json
├── tsconfig.json
└── README.md
```

---

## Setup

### Prerequisites

* Node.js 16+
* Backend API running at `http://localhost:5001`

### Installation

```bash
cd sciscinet-p1-frontend
npm install
npm start
```

The app will open at `http://localhost:3000`.

---

## Usage

### 1. Start the Backend

```bash
cd ../sciscinet-p1-backend/p1-backend
python app.py
```

### 2. Start the Frontend

```bash
npm start
```

### 3. Explore the Visualizations

* **Switch Views**

  * Author Network (T1)
  * Author Network (Bundled, T3)
  * Citation Network (T1)
  * Dashboards (T2)
* **Interact**

  * Drag nodes in force-directed views
  * Hover for details
  * Zoom and pan
  * Click timeline years to filter histogram

---

## API Integration

The frontend consumes the following endpoints:

* `GET /api/author-network`
* `GET /api/citation-network`
* `GET /api/stats`
* `GET /api/timeline`
* `GET /api/patent-distribution`

API configuration is defined in `src/services/api.ts`.

---

## Performance & Scalability Considerations

To handle large networks (1,134 authors, 36,623 collaborations):

* Force-directed layout with collision detection (T1)
* Visual encoding of importance via node size and edge thickness
* Zoom and pan for dense regions
* Hierarchical edge bundling (T3) to reduce clutter and reveal structure
* Overview + detail design across multiple coordinated views

---

## Assignment Completion Summary

### Task 1 (T1) ✅

* [x] Author collaboration network (force-directed)
* [x] Citation network (force-directed)
* [x] Interactive exploration (drag, hover, zoom, pan)

### Task 2 (T2) ✅

* [x] Timeline view
* [x] Histogram view
* [x] Coordinated interaction between views

### Task 3 (T3) ✅

* [x] Refined author network using hierarchical edge bundling
* [x] Radial hierarchical layout
* [x] Reduced edge crossings and improved scalability
* [x] Clear distinction between overview (T3) and detail (T1)

---

## Author

**Carol Zhang**
M.S. in Computer Science, UC San Diego

---

## License

This project is for educational purposes as part of a course assignment.

