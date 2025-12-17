// src/components/NetworkGraph.tsx - FOR NEW LAYOUT
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { NetworkData, NetworkNode, NetworkLink } from '../types/network';

interface NetworkGraphProps {
  data: NetworkData;
  title: string;
  nodeLabel: (node: NetworkNode) => string;
  nodeTooltip: (node: NetworkNode) => string;
  linkTooltip?: (link: NetworkLink) => string;
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({
  data,
  nodeLabel,
  nodeTooltip,
  linkTooltip,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    content: string;
  }>({ visible: false, x: 0, y: 0, content: '' });

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || !data) return;

    // Get container dimensions
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const g = svg.append('g');

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 10])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Copy data
    const nodes: any[] = data.nodes.map((d: any) => ({ ...d }));
    const links: any[] = data.links.map((d: any) => ({
      ...d,
      source: typeof d.source === 'string' ? d.source : d.source.id,
      target: typeof d.target === 'string' ? d.target : d.target.id
    }));

    // Color palette
    const colorPalette = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
      '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788',
    ];

    // Calculate degree
    const degreeMap = new Map<string, number>();
    links.forEach((link: any) => {
      degreeMap.set(link.source, (degreeMap.get(link.source) || 0) + 1);
      degreeMap.set(link.target, (degreeMap.get(link.target) || 0) + 1);
    });

    nodes.forEach((node: any) => {
      const hash = node.id.split('').reduce((acc: number, char: string) => 
        acc + char.charCodeAt(0), 0);
      node.cluster = hash % colorPalette.length;
      node.degree = degreeMap.get(node.id) || 0;
    });

    // Force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links)
        .id((d: any) => d.id)
        .distance(30)
        .strength(0.5))
      .force('charge', d3.forceManyBody().strength(-50))
      .force('center', d3.forceCenter(containerWidth / 2, containerHeight / 2))
      .force('collision', d3.forceCollide().radius(15));

    // Links
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#e0e0e0')
      .attr('stroke-opacity', 0.3)
      .attr('stroke-width', (d: any) => Math.sqrt(d.weight || 1) * 0.5);

    // Nodes
    const node = g.append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', (d: any) => {
        const importance = (d.degree || 0) + (d.paperCount || d.citationCount || 0);
        return Math.min(4 + Math.sqrt(importance) * 2, 25);
      })
      .attr('fill', (d: any) => {
        if (d.year) {
          const yearColors = ['#9b59b6', '#3498db', '#1abc9c', '#f39c12', '#e74c3c'];
          const yearIndex = Math.min(d.year - 2020, 4);
          return yearColors[yearIndex] || '#95a5a6';
        }
        return colorPalette[d.cluster] || '#95a5a6';
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .style('cursor', 'pointer')
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Labels - only important nodes
    const labels = g.append('g')
      .selectAll('text')
      .data(nodes.filter((d: any) => d.degree > 3 || (d.paperCount || 0) > 1))
      .join('text')
      .text((d: any) => nodeLabel(d).substring(0, 15))
      .attr('font-size', 8)
      .attr('dx', 8)
      .attr('dy', 3)
      .style('pointer-events', 'none')
      .style('fill', '#333');

    // Tooltips
    node
      .on('mouseover', function(event, d: any) {
        d3.select(this)
          .attr('r', (d: any) => {
            const importance = (d.degree || 0) + (d.paperCount || d.citationCount || 0);
            return Math.min(6 + Math.sqrt(importance) * 2, 30);
          })
          .attr('stroke', '#000')
          .attr('stroke-width', 2);

        setTooltip({
          visible: true,
          x: event.pageX,
          y: event.pageY,
          content: nodeTooltip(d)
        });
      })
      .on('mouseout', function(event, d: any) {
        d3.select(this)
          .attr('r', (d: any) => {
            const importance = (d.degree || 0) + (d.paperCount || d.citationCount || 0);
            return Math.min(4 + Math.sqrt(importance) * 2, 25);
          })
          .attr('stroke', '#fff')
          .attr('stroke-width', 1.5);

        setTooltip(prev => ({ ...prev, visible: false }));
      });

    // Tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);

      labels
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [data, nodeLabel, nodeTooltip, linkTooltip]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <svg
        ref={svgRef}
        style={{ 
          width: '100%', 
          height: '100%',
          display: 'block',
          backgroundColor: '#fafafa'
        }}
      />
      
      {tooltip.visible && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x + 10,
            top: tooltip.y + 10,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            pointerEvents: 'none',
            zIndex: 10000,
            maxWidth: '250px',
            fontSize: '11px',
            lineHeight: '1.4'
          }}
          dangerouslySetInnerHTML={{ __html: tooltip.content }}
        />
      )}
    </div>
  );
};

export default NetworkGraph;