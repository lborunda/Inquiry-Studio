export enum InquiryStage {
  ProblemSpace = 'Problem Space',
  ConceptualModel = 'Conceptual Model',
  ResearchDesign = 'Research Design',
  AnalysisEvidence = 'Analysis & Evidence',
  ArgumentStructure = 'Argument Structure'
}

export enum InquiryMove {
  GENERATE_POSSIBILITIES = 'Generate Possibilities',
  CLARIFY_CONCEPTS = 'Clarify Concepts',
  SURFACE_ASSUMPTIONS = 'Surface Assumptions',
  STRESS_TEST_CLAIMS = 'Stress-Test Claims',
  REFINE_STRUCTURE = 'Refine Structure'
}

export interface UploadedFile {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'text';
  dataUrl?: string;
  objectUrl?: string;
  summary?: string;
  summaryLoading?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  bookmarked?: boolean;
}

export enum OrbAction {
  SYNONYMS = 'Synonyms',
  POTENTIAL_ISSUES = 'Potential Issues',
  RESEARCH = 'Research',
  DEFINITION = 'Definition'
}

export interface Topic {
  topicName: string;
  researchers: {
    name: string;
    researchGateUrl: string;
    linkedInUrl: string;
  }[];
}

export interface ConceptNode {
  id: string;
  content: string;
  type: 'ai_bookmark' | 'user_selection' | 'user_reference' | 'tension' | 'variable' | 'hypothesis' | 'evidence' | 'assumption';
}
