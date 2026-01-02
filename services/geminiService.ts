
import { GoogleGenAI } from "@google/genai";
import { Motorcycle } from '../types';
import { KYMCO_MODELS } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAIRecommendation = async (userPrompt: string): Promise<string> => {
  try {
    const modelDataString = JSON.stringify(KYMCO_MODELS.map(m => ({
      name: m.name,
      price: m.price,
      category: m.category,
      specs: m.specs,
      desc: m.description
    })));

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `你是一个光阳摩托车(KYMCO)的专家。请根据以下现有车型数据回答用户的咨询：
      车型数据：${modelDataString}
      
      用户咨询：${userPrompt}
      
      要求：
      1. 如果用户寻找推荐，请给出具体的理由并对比不同车型。
      2. 语言要专业且热情。
      3. 重点关注性能、用途（通勤/旅游/复古）和价格。
      4. 如果用户询问参数，请准确告知。`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });

    return response.text || "抱歉，我现在无法提供建议。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "智能助手暂时无法连接，请稍后再试。";
  }
};
