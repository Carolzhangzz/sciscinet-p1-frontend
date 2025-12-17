// src/components/Histogram.tsx - RESPONSIVE VERSION

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface HistogramData {
  patent_count: number;
  frequency: number;
}

interface HistogramProps {
  data: HistogramData[];
  selectedYear: number | null;
}

const Histogram: React.FC<HistogramProps> = ({
  data,
  selectedYear
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  // Responsive sizing
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: 400 // Fixed height for better proportion
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!svgRef.current || !data || data.length === 0) return;

    const { width, height } = dimensions;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const margin = { top: 40, right: 40, bottom: 60, left: 70 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.patent_count.toString()))
      .range([0, innerWidth])
      .padding(0.15);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.frequency) || 0])
      .nice()
      .range([innerHeight, 0]);

    // Axes
    const tickValues = data.length > 15 
      ? data.map(d => d.patent_count.toString()).filter((_, i) => i % 2 === 0)
      : data.map(d => d.patent_count.toString());

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).tickValues(tickValues))
      .selectAll('text')
      .style('font-size', '12px');

    g.append('g')
      .call(d3.axisLeft(y))
      .style('font-size', '13px');

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.15)
      .call(d3.axisLeft(y)
        .tickSize(-innerWidth)
        .tickFormat(() => ''));

    // Color scale - gradient from dark blue to light blue
    const colorScale = d3.scaleSequential()
      .domain([0, d3.max(data, d => d.frequency) || 0])
      .interpolator(d3.interpolateRgb('#1e3a8a', '#93c5fd'));

    // Bars
    g.selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.patent_count.toString()) || 0)
      .attr('y', d => y(d.frequency))
      .attr('width', x.bandwidth())
      .attr('height', d => innerHeight - y(d.frequency))
      .attr('fill', d => colorScale(d.frequency))
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .attr('rx', 3)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('opacity', 0.75)
          .attr('stroke', '#333')
          .attr('stroke-width', 2);
        
        // Show tooltip
        d3.select('body')
          .append('div')
          .attr('class', 'histogram-tooltip')
          .style('position', 'absolute')
          .style('background', 'rgba(0,0,0,0.85)')
          .style('color', 'white')
          .style('padding', '10px 14px')
          .style('border-radius', '6px')
          .style('font-size', '13px')
          .style('pointer-events', 'none')
          .style('z-index', '10000')
          .html(`
            <strong>Patent Citations: ${d.patent_count}</strong><br/>
            Papers: <strong>${d.frequency}</strong>
          `)
          .style('left', `${event.pageX + 12}px`)
          .style('top', `${event.pageY - 10}px`);
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('opacity', 1)
          .attr('stroke', '#fff')
          .attr('stroke-width', 1.5);
        d3.selectAll('.histogram-tooltip').remove();
      });

    // Title
    const titleText = selectedYear 
      ? `Patent Citation Distribution (${selectedYear})`
      : 'Patent Citation Distribution (All Years)';
    
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .style('fill', '#2c3e50')
      .text(titleText);

    // X-axis label
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .attr('text-anchor', 'middle')
      .style('font-size', '13px')
      .style('fill', '#555')
      .text('Number of Patent Citations');

    // Y-axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '13px')
      .style('fill', '#555')
      .text('Frequency (Papers)');

  }, [data, selectedYear, dimensions]);

  return (
    <div 
      ref={containerRef}
      style={{ 
        width: '100%',
        height: '400px',
        background: 'white', 
        borderRadius: '10px', 
        padding: '0',
        boxShadow: '0 3px 12px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}
    >
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{ display: 'block' }}
      />
    </div>
  );
};

export default Histogram;