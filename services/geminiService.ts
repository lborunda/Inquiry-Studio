
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { InquiryStage, UploadedFile, ChatMessage, InquiryMove, OrbAction, Topic } from '../types';
import { getRagFilesForSection } from './ragService';

if (!process.env.GEMINI_API_KEY2) {
  throw new Error("GEMINI_API_KEY2 environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY2 });
const model = 'gemini-2.5-flash';

const getSystemInstruction = async (
    stage: InquiryStage, 
    move: InquiryMove,
    studentFiles: UploadedFile[], 
    designResearchRatio: number, // 0=design, 100=research
    fundamentalAppliedRatio: number // 0=fundamental, 100=applied
): Promise<string> => {
  let instruction = `You are an AI epistemic scaffold for an architecture/research student. Your role is to support the transition from exploratory problem construction to formal research design and structured validation. You are NOT just a writing tutor; you are a partner in inquiry. Maintain a calm, institutional, grant-ready tone. `;

  const studentFileContext = studentFiles
    .map(f => {
      if (f.summary) {
        return `${f.name} (Summary: ${f.summary.substring(0, 200)}...)`;
      }
      return f.name;
    })
    .join('; ');

  if (studentFileContext) {
    instruction += `The student has uploaded these files for context: ${studentFileContext}. Refer to their summaries when relevant. `;
  }
  
  // Map InquiryStage to old Section for RAG compatibility if needed, or just use the string
  const ragFiles = await getRagFilesForSection(stage as any); 
  const ragFileNames = ragFiles.map(f => f.name).join(', ');

  if (ragFileNames) {
    instruction += `Ground your responses in the instructor's materials: ${ragFileNames}. `;
  }

  instruction += `The student is currently in the '${stage}' stage of inquiry. `;

  // Research Design Recognition (Invisible Classification)
  if (stage === InquiryStage.RESEARCH_DESIGN) {
      instruction += `Silently classify the student's apparent research design (Experimental, Simulation, Case study, Ethnographic, Design research, or Theoretical modeling) and adapt your feedback to be appropriate for that methodology. Do not explicitly state the classification unless asked. `;
  }

  const designResearchFocus = designResearchRatio < 50 ? 'more design-oriented' : 'more research-oriented';
  const fundamentalAppliedFocus = fundamentalAppliedRatio < 50 ? 'more fundamental science-oriented' : 'more applied science-oriented';
  instruction += `Your feedback should be ${designResearchFocus} and ${fundamentalAppliedFocus}. `;

  instruction += `Your current epistemic move is '${move}'. `;

  switch (move) {
    case InquiryMove.GENERATE_POSSIBILITIES:
      instruction += "Goal: Divergence. Generate a wide range of ideas, 'what-if' scenarios, and alternative directions. Focus on expansion and possibility. Connect disparate concepts.";
      break;
    case InquiryMove.CLARIFY_CONCEPTS:
      instruction += "Goal: Definition and Precision. Help the student define their terms clearly. Ask for operational definitions of key variables. Ensure conceptual consistency.";
      break;
    case InquiryMove.SURFACE_ASSUMPTIONS:
      instruction += "Goal: Critical Reflection. Identify hidden premises, unstated beliefs, and causal leaps in the student's reasoning. Ask 'What must be true for this to hold?'";
      break;
    case InquiryMove.STRESS_TEST_CLAIMS:
      instruction += "Goal: Validation. Challenge the student's arguments. Raise potential objections, counter-examples, and alternative explanations. Test the strength of their inferences.";
      break;
    case InquiryMove.REFINE_STRUCTURE:
      instruction += "Goal: Coherence. Focus on the logical flow and structural integrity of the argument. Ensure the research design aligns with the problem statement and the evidence supports the claims.";
      break;
  }

  instruction += ` When providing feedback, structure your response with clear, actionable points. Be concise. Use Markdown for headings and lists. To emphasize key terms (Tensions, Variables, Hypotheses, Evidence, Assumptions), wrap them in asterisks, like *this*.`;

  return instruction;
};


export const generateTutorResponse = async (
  prompt: string,
  history: ChatMessage[],
  stage: InquiryStage,
  move: InquiryMove,
  studentFiles: UploadedFile[],
  designResearchRatio: number,
  fundamentalAppliedRatio: number
): Promise<string> => {
  try {
    const systemInstruction = await getSystemInstruction(
        stage, 
        move,
        studentFiles, 
        designResearchRatio, 
        fundamentalAppliedRatio
    );
    
    const apiHistory = history.map(h => ({
        role: h.role,
        parts: [{ text: h.content }]
    }));
    
    const userContent = prompt;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
        model,
        config: {
            systemInstruction: systemInstruction,
        },
        contents: [...apiHistory, { role: 'user', parts: [{ text: userContent }] }]
    });

    return response.text;

  } catch (error) {
    console.error("Error generating response from Gemini API:", error);
    return "I seem to be having trouble connecting. Please check the console for details.";
  }
};

export const checkAssumptions = async (text: string): Promise<string> => {
    try {
        const prompt = `Analyze the following text for hidden premises, overgeneralizations, missing variables, and causal leaps. Provide a concise bulleted list of the key assumptions being made.
        
        Text:
        """
        ${text.substring(0, 5000)}
        """`;
        
        const response: GenerateContentResponse = await ai.models.generateContent({
            model,
            contents: prompt
        });

        return response.text;
    } catch (error) {
        console.error("Error checking assumptions:", error);
        return "Could not analyze assumptions.";
    }
}

export const summarizeFile = async (fileName: string): Promise<string> => {
    try {
        const prompt = `Please provide a concise, one-paragraph summary of a document titled "${fileName}". This document is part of a syllabus for an architecture research methods class. Focus on the key concepts and its relevance to a student learning academic writing.`;
        
        const response: GenerateContentResponse = await ai.models.generateContent({
            model,
            contents: prompt
        });

        return response.text;
    } catch (error) {
        console.error("Error summarizing file:", error);
        return `Could not generate summary for ${fileName}.`;
    }
}

export const generateAcademicTheme = async (idea: string): Promise<string> => {
    try {
        const prompt = `An architecture student has a raw idea: "${idea}". Transform this into a concise, one-sentence academic theme or research question suitable for a thesis. The theme should be formal, clear, and hint at a potential methodology.`;
        
        const response: GenerateContentResponse = await ai.models.generateContent({
            model,
            contents: prompt
        });

        return response.text;
    } catch (error) {
        console.error("Error generating academic theme:", error);
        return `Could not generate a theme for "${idea}".`;
    }
}

export const generateTitle = async (text: string): Promise<string> => {
    try {
        const prompt = `Based on the following text, generate a concise title in the format "General: Particular". The title should be short and descriptive. For example, if the text is about using parametric tools to design a new type of chair, a good title would be "Furniture Design: Parametric Chair Study". Do not include quotes or any other formatting in your response. Just the title itself.

Text:
"""
${text.substring(0, 1000)}
"""
        `;
        
        const response: GenerateContentResponse = await ai.models.generateContent({
            model,
            contents: prompt
        });

        // Clean up response, remove potential quotes and newlines
        return response.text.replace(/["\n]/g, '').trim();

    } catch (error) {
        console.error("Error generating title:", error);
        return "Untitled Document";
    }
}

export const generateOrbResponse = async (word: string, action: OrbAction, context: string): Promise<string> => {
    try {
        let prompt = "";
        const base = `I am an architecture student writing a research paper. I've highlighted the word "${word}" within the following text I'm writing:\n\n---\n${context}\n---\n\n`;

        switch (action) {
            case OrbAction.SYNONYMS:
                prompt = base + `Please provide a few synonyms or alternative phrases for "${word}" that would fit well within this specific context. For each suggestion, briefly explain its nuance or implication. Structure your response in a list.`;
                break;
            case OrbAction.POTENTIAL_ISSUES:
                prompt = base + `Please identify potential issues, ambiguities, or weaknesses associated with using the word "${word}" in this context. Could it be misinterpreted? Is there a stronger, more precise, or more academically rigorous concept I could use instead?`;
                break;
            case OrbAction.RESEARCH:
                prompt = base + `What are 2-3 key research topics, theorists, or precedent projects in architecture or related fields that are connected to the concept of "${word}"? Provide a brief explanation for each to give me a starting point for further investigation.`;
                break;
            case OrbAction.DEFINITION:
                prompt = base + `Please provide a concise, academic definition for "${word}" specifically as it relates to architecture, design, or critical theory.`;
                break;
        }

        const response: GenerateContentResponse = await ai.models.generateContent({
            model,
            contents: prompt
        });

        return response.text;
    } catch (error) {
        console.error("Error generating orb response:", error);
        return `I had trouble processing the request for "${word}". Please try again.`;
    }
};

export const generateSocialConnections = async (projectText: string): Promise<Topic[]> => {
    try {
        if (!projectText.trim()) {
            return [];
        }

        const prompt = `I am an architecture student. Based on my research text below, please do the following:
1. Identify 5 to 7 distinct, niche research topics present in the text.
2. For each topic, use your search tool to find 2-3 REAL, prominent researchers, academics, or leading practitioners known for their work in that specific area.
3. For each researcher, provide their full name, their professional website (like a university profile, personal academic site, or ResearchGate), and their LinkedIn profile URL. If a specific URL isn't found, provide a plausible Google search URL for them.
4. Structure your entire response as a single JSON object with a key "topics". The value should be an array of objects, where each object represents a topic and has "topicName" (string) and "researchers" (an array of researcher objects). Each researcher object must have "name", "researchGateUrl" (use their professional website URL for this field), and "linkedInUrl".

Your entire output must be ONLY the JSON object, with no extra text or markdown formatting.

Research Text:
"""
${projectText.substring(0, 4000)}
"""`;

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        let jsonStr = response.text.trim();
        if (jsonStr.startsWith("```json")) {
            jsonStr = jsonStr.substring(7);
        }
        if (jsonStr.endsWith("```")) {
            jsonStr = jsonStr.substring(0, jsonStr.length - 3);
        }
        
        const jsonResponse = JSON.parse(jsonStr);
        return jsonResponse.topics || [];

    } catch (error) {
        console.error("Error generating social connections:", error);
        throw new Error("Could not generate researcher connections. The AI may have returned an unexpected format.");
    }
};