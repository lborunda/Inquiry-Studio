import { InquiryStage } from '../types';

export interface RagFile {
    name: string;
    url: string;
    focus: string;
}

let manifest: RagFile[] = [];
let manifestLoaded = false;

// Mapping from InquiryStage to CSV focus strings
const stageToCsvFocus: Record<InquiryStage, string[]> = {
    [InquiryStage.PROBLEM_SPACE]: ["Problem Statement", "Literature Review"],
    [InquiryStage.CONCEPTUAL_MODEL]: ["Hypothesis", "Literature Review"],
    [InquiryStage.RESEARCH_DESIGN]: ["Research Methods", "Research Plan"],
    [InquiryStage.ANALYSIS_EVIDENCE]: ["Writing a Paper", "Conclusion"],
    [InquiryStage.ARGUMENT_STRUCTURE]: ["Writing a Paper", "Grant Writing"],
};

const loadManifest = async (): Promise<void> => {
    if (manifestLoaded) return;

    try {
        const response = await fetch('/rag_manifest.csv');
        if (!response.ok) {
            throw new Error(`Failed to load RAG manifest: ${response.statusText}`);
        }
        const csvText = await response.text();
        const rows = csvText.trim().split('\n');
        
        // Skip header
        const dataRows = rows.slice(1);
        
        manifest = dataRows.map(row => {
            const [focus, name, url] = row.split(',');
            return {
                focus: focus ? focus.trim() : '',
                name: name ? name.trim() : '',
                url: url ? url.trim() : '',
            };
        }).filter(item => item.name && item.focus && item.url); // Basic validation

        manifestLoaded = true;

    } catch (error) {
        console.error("Error loading or parsing RAG manifest:", error);
        // Keep manifest empty on error
        manifest = [];
        manifestLoaded = true; // Mark as loaded to prevent retries
    }
};

export const getRagFilesForSection = async (stage: InquiryStage): Promise<RagFile[]> => {
    if (!manifestLoaded) {
        await loadManifest();
    }
    const targetFocuses = stageToCsvFocus[stage] || [];
    return manifest.filter(file => targetFocuses.includes(file.focus));
};

// Pre-load the manifest when the module is imported
loadManifest();
