
export enum InquiryStage {
  PROBLEM_SPACE = "Problem Space",
  CONCEPTUAL_MODEL = "Conceptual Model",
  RESEARCH_DESIGN = "Research Design",
  ANALYSIS_EVIDENCE = "Analysis & Evidence",
  ARGUMENT_STRUCTURE = "Argument Structure",
}

export enum InquiryMove {
  GENERATE_POSSIBILITIES = "Generate Possibilities",
  CLARIFY_CONCEPTS = "Clarify Concepts",
  SURFACE_ASSUMPTIONS = "Surface Assumptions",
  STRESS_TEST_CLAIMS = "Stress-Test Claims",
  REFINE_STRUCTURE = "Refine Structure",
}

export enum InquiryPhase {
  PHASE_I = "Phase I: Problem & Model",
  PHASE_II = "Phase II: Design & Validation",
}

export enum OrbAction {
    SYNONYMS = "Synonyms in Context",
    POTENTIAL_ISSUES = "Potential Issues",
    RESEARCH = "Research Connections",
    DEFINITION = "Definition",
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  bookmarked?: boolean;
}

export interface UploadedFile {
  id:string;
  name: string;
  type: 'pdf' | 'image' | 'doc';
  summary?: string;
  summaryLoading?: boolean;
  dataUrl?: string;
  objectUrl?: string;
}

export interface ConceptNode {
    id: string;
    content: string;
    type: 'tension' | 'variable' | 'hypothesis' | 'evidence' | 'assumption' | 'user_selection' | 'ai_bookmark' | 'user_reference';
}

export interface Project {
  id: string;
  name: string;
  lastModified: number;
  writingText: string;
  chatHistory: ChatMessage[];
  studentFiles: UploadedFile[];
  conceptMapNodes: ConceptNode[];
}

export interface Researcher {
  name: string;
  researchGateUrl: string;
  linkedInUrl: string;
}

export interface Topic {
  topicName: string;
  researchers: Researcher[];
}
