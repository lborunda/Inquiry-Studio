import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { InquiryStage, UploadedFile, ChatMessage, InquiryMove, OrbAction, Topic } from '../types';

if (!process.env.GEMINI_API_KEY2) {
  throw new Error("GEMINI_API_KEY2 environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY2 });
const model = 'gemini-2.5-flash';

export const generateTutorResponse = async (
  prompt: string,
  _history: ChatMessage[],
  _stage: InquiryStage,
  _move: InquiryMove,
  _studentFiles: UploadedFile[],
  _designResearchRatio: number,
  _fundamentalAppliedRatio: number
): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: prompt
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Error generating response from Gemini API:", error);
    return "I seem to be having trouble connecting. Please check the console for details.";
  }
};

export const checkAssumptions = async (text: string): Promise<string> => {
  try {
    const prompt = `Analyze the following text for hidden premises, overgeneralizations, missing variables, and causal leaps. Provide a concise bulleted list of the key assumptions being made.\n\nText:\n"""\n${text.substring(0, 5000)}\n"""`;
    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: prompt
    });
    return response.text || "No assumptions found.";
  } catch (error) {
    console.error("Error checking assumptions:", error);
    return "Could not analyze assumptions.";
  }
};

export const summarizeFile = async (fileName: string): Promise<string> => {
  try {
    const prompt = `Please provide a concise, one-paragraph summary of a document titled "${fileName}". This document is part of a syllabus for an architecture research methods class. Focus on the key concepts and its relevance to a student learning academic writing.`;
    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: prompt
    });
    return response.text || "No summary available.";
  } catch (error) {
    console.error("Error summarizing file:", error);
    return `Could not generate summary for ${fileName}.`;
  }
};

export const generateAcademicTheme = async (idea: string): Promise<string> => {
  try {
    const prompt = `An architecture student has a raw idea: "${idea}". Transform this into a concise, one-sentence academic theme or research question suitable for a thesis. The theme should be formal, clear, and hint at a potential methodology.`;
    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: prompt
    });
    return response.text || "No theme generated.";
  } catch (error) {
    console.error("Error generating academic theme:", error);
    return `Could not generate a theme for "${idea}".`;
  }
};

export const generateTitle = async (text: string): Promise<string> => {
  try {
    const prompt = `Based on the following text, generate a concise title in the format "General: Particular". The title should be short and descriptive. For example, if the text is about using parametric tools to design a new type of chair, a good title would be "Furniture Design: Parametric Chair Study". Do not include quotes or any other formatting in your response. Just the title itself.\n\nText:\n"""\n${text.substring(0, 1000)}\n"""`;
    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: prompt
    });
    return (response.text || "Untitled Document").replace(/["\n]/g, '').trim();
  } catch (error) {
    console.error("Error generating title:", error);
    return "Untitled Document";
  }
};

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
    return response.text || "No response generated.";
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

    let jsonStr = (response.text || "").trim();
    if (jsonStr.startsWith("```json")) {
      jsonStr = jsonStr.substring(7);
    }
    if (jsonStr.endsWith("```")) {
      jsonStr = jsonStr.substring(0, jsonStr.length - 3);
    }
    
    if (!jsonStr) return [];

    const jsonResponse = JSON.parse(jsonStr);
    return jsonResponse.topics || [];

  } catch (error) {
    console.error("Error generating social connections:", error);
    throw new Error("Could not generate researcher connections. The AI may have returned an unexpected format.");
  }
};
