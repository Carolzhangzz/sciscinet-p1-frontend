# SciSciNet Frontend

Interactive visualization of UCSD Computer Science research networks using React, TypeScript, and D3.js.

## Features

### Task 1 (T1): Interactive Network Graphs
- ✅ **Author Collaboration Network**: Shows collaborations between 1,134 authors
- ✅ **Paper Citation Network**: Shows citations between 69 CS papers
- ✅ **Interactive Features**:
  - Draggable nodes (force-directed layout)
  - Hoverable nodes and edges with tooltips
  - Zoom and pan capabilities
  - Node size based on paper count/citations
  - Edge thickness based on collaboration count
  - Color coding by year

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **D3.js v7** - Data visualization
- **Create React App** - Build tooling

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
│   │   └── NetworkGraph.tsx      # D3.js network visualization
│   ├── services/
│   │   └── api.ts                # Backend API calls
│   └── types/
│       └── network.ts            # TypeScript interfaces
├── package.json
├── tsconfig.json
└── README.md
```

## Setup

### Prerequisites

- Node.js 16+ installed
- Backend API running on `http://localhost:5001`

### Installation

```bash
# Navigate to frontend directory
cd sciscinet-p1-frontend

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

## Usage

### 1. Start the Backend First

Make sure your backend is running:

```bash
# In the backend directory
cd ../sciscinet-p1-backend/p1-backend
python app.py
```

### 2. Start the Frontend

```bash
# In the frontend directory
npm start
```

### 3. Interact with the Visualization

- **Switch Views**: Click buttons to toggle between Author and Citation networks
- **Drag Nodes**: Click and drag any node to reposition it
- **Hover**: Hover over nodes/edges to see detailed information
- **Zoom**: Scroll to zoom in/out
- **Pan**: Drag the background to pan around

## API Integration

The frontend connects to these backend endpoints:

- `GET /api/author-network` - Author collaboration data
- `GET /api/citation-network` - Paper citation data
- `GET /api/stats` - Network statistics

API base URL is configured in `src/services/api.ts`

## Customization

### Changing Network Layout Parameters

Edit `src/components/NetworkGraph.tsx`:

```typescript
const simulation = d3.forceSimulation(nodes)
  .force('link', d3.forceLink(links)
    .distance(50))              // Link distance
  .force('charge', d3.forceManyBody()
    .strength(-100))            // Repulsion strength
  .force('center', d3.forceCenter(width / 2, height / 2))
  .force('collision', d3.forceCollide()
    .radius(20));               // Collision radius
```

### Changing Node Colors

In `NetworkGraph.tsx`, modify the color scale:

```typescript
.attr('fill', (d: any) => {
  const colorScale = d3.scaleSequential(d3.interpolateViridis)
    .domain([2020, 2024]);
  return colorScale(d.year);
})
```

### Changing Node Sizes

Modify the radius calculation:

```typescript
.attr('r', (d: any) => {
  const size = d.paperCount || d.citationCount || 1;
  return Math.min(5 + Math.sqrt(size) * 3, 30);  // Adjust multiplier
})
```

## Building for Production

```bash
# Create optimized production build
npm run build

# The build folder will contain the production-ready files
# Deploy the contents of the build/ folder to your web server
```

## Troubleshooting

### "Failed to fetch" Error

**Problem**: Frontend can't connect to backend

**Solution**:
1. Ensure backend is running on port 5001
2. Check the API URL in `src/services/api.ts`
3. Verify CORS is enabled in backend

### Port 3000 Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm start
```

### TypeScript Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Performance Considerations

For large networks (>1000 nodes):

1. **Limit visible nodes**: Filter to top N nodes by importance
2. **Reduce link count**: Show only strong connections
3. **Optimize rendering**: Use canvas instead of SVG for very large graphs
4. **Add pagination**: Load network data incrementally

## Browser Support

- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅

## Assignment Completion

### Task 1 (T1) ✅
- [x] Author collaboration network with force-directed layout
- [x] Paper citation network with force-directed layout
- [x] Draggable nodes
- [x] Hoverable nodes and edges with tooltips
- [x] Clear titles and legends
- [x] Responsive design

### Scalability Solution
For the large number of data points (1,134 authors, 36,623 collaborations):
- Implemented force simulation with collision detection
- Node size varies based on importance (paper count)
- Edge thickness represents collaboration strength
- Zoom/pan functionality for exploring dense areas
- Tooltip on demand to reduce visual clutter

## Author

Carol Zhang - UCSD MS in Computer Science

## License

This project is for educational purposes as part of a coding assignment.
