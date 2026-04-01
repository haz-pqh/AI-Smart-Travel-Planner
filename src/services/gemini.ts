import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ItineraryItem {
  time: string;
  activity: string;
  location: string;
  description: string;
  estimatedCost: number;
  lat: number;
  lng: number;
}

export interface DayPlan {
  day: number;
  title: string;
  items: ItineraryItem[];
}

export interface TripPlan {
  destination: string;
  duration: number;
  budget: string;
  style: string;
  totalEstimatedCost: number;
  itinerary: DayPlan[];
  weatherPreview: string;
}

export async function generateTripPlan(
  destination: string,
  duration: number,
  budget: string,
  style: string
): Promise<TripPlan> {
  const prompt = `Generate a detailed travel itinerary for ${duration} days in ${destination}. 
  Budget level: ${budget}. 
  Travel style: ${style}.
  Include specific locations with latitude and longitude for mapping.
  Provide a weather preview for the destination.
  Return the data in a structured JSON format.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          destination: { type: Type.STRING },
          duration: { type: Type.NUMBER },
          budget: { type: Type.STRING },
          style: { type: Type.STRING },
          totalEstimatedCost: { type: Type.NUMBER },
          weatherPreview: { type: Type.STRING },
          itinerary: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.NUMBER },
                title: { type: Type.STRING },
                items: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      time: { type: Type.STRING },
                      activity: { type: Type.STRING },
                      location: { type: Type.STRING },
                      description: { type: Type.STRING },
                      estimatedCost: { type: Type.NUMBER },
                      lat: { type: Type.NUMBER },
                      lng: { type: Type.NUMBER },
                    },
                    required: ["time", "activity", "location", "description", "estimatedCost", "lat", "lng"],
                  },
                },
              },
              required: ["day", "title", "items"],
            },
          },
        },
        required: ["destination", "duration", "budget", "style", "totalEstimatedCost", "itinerary", "weatherPreview"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as TripPlan;
}
