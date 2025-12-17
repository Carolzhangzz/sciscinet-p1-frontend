// src/components/Timeline.tsx - RESPONSIVE VERSION

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface TimelineData {
  year: number;
  count: number;
}

interface TimelineProps {
  data: TimelineData[];
  onYearClick: (year: number) => void;
  selectedYear: number | null;
}

const Timeline: React.FC<TimelineProps> = ({
  data,
  onYearClick,
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
      .domain(data.map(d => d.year.toString()))
      .range([0, innerWidth])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.count) || 0])
      .nice()
      .range([innerHeight, 0]);

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '500');

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

    // Bars
    g.selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.year.toString()) || 0)
      .attr('y', d => y(d.count))
      .attr('width', x.bandwidth())
      .attr('height', d => innerHeight - y(d.count))
      .attr('fill', d => d.year === selectedYear ? '#667eea' : '#4ECDC4')
      .attr('stroke', d => d.year === selectedYear ? '#5568d3' : '#3ab8b0')
      .attr('stroke-width', 2)
      .attr('rx', 4)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        if (d.year !== selectedYear) {
          d3.select(this)
            .attr('fill', '#45b8b0')
            .attr('opacity', 0.85);
        }
        
        // Tooltip
        d3.select('body')
          .append('div')
          .attr('class', 'chart-tooltip')
          .style('position', 'absolute')
          .style('background', 'rgba(0,0,0,0.85)')
          .style('color', 'white')
          .style('padding', '10px 14px')
          .style('border-radius', '6px')
          .style('font-size', '13px')
          .style('pointer-events', 'none')
          .style('z-index', '10000')
          .html(`
            <strong>Year: ${d.year}</strong><br/>
            Papers: <strong>${d.count}</strong>
          `)
          .style('left', `${event.pageX + 12}px`)
          .style('top', `${event.pageY - 10}px`);
      })
      .on('mouseout', function(event, d) {
        if (d.year !== selectedYear) {
          d3.select(this)
            .attr('fill', '#4ECDC4')
            .attr('opacity', 1);
        }
        d3.selectAll('.chart-tooltip').remove();
      })
      .on('click', function(event, d) {
        onYearClick(d.year);
        d3.selectAll('.chart-tooltip').remove();
      });

    // Value labels on bars
    g.selectAll('.label')
      .data(data)
      .join('text')
      .attr('class', 'label')
      .attr('x', d => (x(d.year.toString()) || 0) + x.bandwidth() / 2)
      .attr('y', d => y(d.count) - 8)
      .attr('text-anchor', 'middle')
      .style('font-size', '13px')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .text(d => d.count);

    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .style('fill', '#2c3e50')
      .text('CS Papers Timeline (2020-2024)');

    // Y-axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '13px')
      .style('fill', '#555')
      .text('Number of Papers');

  }, [data, selectedYear, onYearClick, dimensions]);

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

export default Timeline;