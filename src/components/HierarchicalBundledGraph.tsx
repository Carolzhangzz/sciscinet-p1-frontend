import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { NetworkData } from '../types/network';

interface Props {
  data: NetworkData;
}

const HierarchicalBundledGraph: React.FC<Props> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const width = 900;
    const height = 900;
    const radius = width / 2 - 140;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3
      .select(svgRef.current)
      .attr(
        'viewBox',
        [-width / 2, -height / 2, width, height].join(' ')
      )
      .style('font-family', 'Helvetica, Arial, sans-serif');

    /* =====================
       1. Build hierarchy
       ===================== */

    const clusterMap = d3.group(
      data.nodes,
      (d: any) => (d.id.charCodeAt(0) % 6).toString()
    );

    const rootData = {
      name: 'root',
      children: Array.from(clusterMap.entries()).map(([key, nodes]) => ({
        name: `cluster-${key}`,
        cluster: +key,
        children: nodes.map((n: any) => ({
          name: n.id,
          cluster: +key,
          data: n
        }))
      }))
    };

    const root = d3.hierarchy<any>(rootData);
    d3.cluster<any>().size([2 * Math.PI, radius])(root);

    const leaves = root.leaves();
    const nodeById = new Map(leaves.map(d => [d.data.name, d]));

    /* =====================
       2. Color scale (HSL)
       ===================== */

    const color = d3.scaleOrdinal<number, string>()
      .domain(d3.range(6))
      .range(d3.range(6).map(i =>
        d3.hsl(i * 60, 0.7, 0.45).toString()
      ));

    /* =====================
       3. Bundled edges
       ===================== */

    const radialLine = d3.lineRadial<any>()
      .curve(d3.curveBundle.beta(0.7))
      .radius(d => d.y)
      .angle(d => d.x);

    const bundledLinks = data.links
      .map((l: any) => {
        const s = nodeById.get(l.source);
        const t = nodeById.get(l.target);
        return s && t ? s.path(t) : null;
      })
      .filter(Boolean) as any[];

    svg.append('g')
      .attr('fill', 'none')
      .selectAll('path')
      .data(bundledLinks)
      .join('path')
      .attr('d', radialLine as any)
      .attr('stroke', d => color(d[0].data.cluster))
      .attr('stroke-opacity', 0.35)
      .attr('stroke-width', d =>
        d.length > 4 ? 2.2 : 1
      );

    /* =====================
       4. Nodes
       ===================== */

    svg.append('g')
      .selectAll('circle')
      .data(leaves)
      .join('circle')
      .attr(
        'transform',
        d => `
          rotate(${(d.x * 180) / Math.PI - 90})
          translate(${d.y},0)
        `
      )
      .attr('r', 3)
      .attr('fill', d => color(d.data.cluster));

    /* =====================
       5. Labels (IMPORTANT ONLY)
       ===================== */

    const important = new Set(
      data.nodes
        .filter((n: any) => (n.paperCount || 0) >= 3)
        .map((n: any) => n.id)
    );

    svg.append('g')
      .selectAll('text')
      .data(leaves.filter(d => important.has(d.data.name)))
      .join('text')
      .attr('dy', '0.31em')
      .attr(
        'transform',
        d => `
          rotate(${(d.x * 180) / Math.PI - 90})
          translate(${d.y + 10},0)
          ${d.x >= Math.PI ? 'rotate(180)' : ''}
        `
      )
      .attr('text-anchor', d => (d.x < Math.PI ? 'start' : 'end'))
      .text(d => d.data.name)
      .style('font-size', '11px')
      .style('font-weight', '600')
      .style('fill', '#111');

  }, [data]);

  return (
    <svg
      ref={svgRef}
      style={{
        width: '100%',
        height: '100%',
        background: '#ffffff'
      }}
    />
  );
};

export default HierarchicalBundledGraph;
