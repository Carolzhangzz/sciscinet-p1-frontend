// src/types/network.ts

export interface NetworkNode {
  id: string;
  name?: string;
  title?: string;
  paperCount?: number;
  year?: number;
  citationCount?: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface NetworkLink {
  source: string | NetworkNode;
  target: string | NetworkNode;
  weight?: number;
}

export interface NetworkData {
  nodes: NetworkNode[];
  links: NetworkLink[];
  metadata?: {
    total_papers?: number;
    total_authors?: number;
    total_collaborations?: number;
    total_citations?: number;
    year_range?: string;
  };
}

export interface APIStats {
  author_network: {
    nodes: number;
    links: number;
    metadata: {
      total_papers: number;
      total_authors: number;
      total_collaborations: number;
      year_range: string;
    };
  };
  citation_network: {
    nodes: number;
    links: number;
    metadata: {
      total_papers: number;
      total_citations: number;
      year_range: string;
    };
  };
}
