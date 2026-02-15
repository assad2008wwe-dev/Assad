
import { GoogleGenAI, Type } from "@google/genai";
import { Question, Difficulty } from "../types.ts";

// دالة للحصول على المفتاح من التخزين المحلي أو البيئة
export const getStoredApiKey = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('gemini_api_key') || "";
  }
  // @ts-ignore
  return (typeof process !== 'undefined' && process.env?.API_KEY) || "";
};

// دالة مساعدة للحصول على نسخة من AI بأمان
const getAIInstance = () => {
  const apiKey = getStoredApiKey();
  if (!apiKey) {
    throw new Error("API Key is missing. Please add it in settings.");
  }
  return new GoogleGenAI({ apiKey });
};

const difficultyMap = {
  easy: 'مستوى أساسي جداً، أسئلة مباشرة عن التعريفات أو حسابات بسيطة للغاية خطوة واحدة.',
  medium: 'مستوى متوسط للمدرسة الثانوية، يحتاج تفكير بسيط وتطبيق مباشر للقوانين.',
  hard: 'مستوى تحدي للمدرسة الثانوية، يحتاج ربط بين فكرتين (مثلاً pH مع تركيز ضعيف) دون تعقيد رياضي مفرط.'
};

export const generateChemistryQuestions = async (topic: 'Kc' | 'pH', difficulty: Difficulty): Promise<Question[]> => {
  try {
    const ai = getAIInstance();
    const prompt = `أنت معلم كيمياء للمرحلة الثانوية. قم بتوليد 20 سؤال اختيار من متعدد باللغة العربية حول ${topic === 'Kc' ? 'ثابت الاتزان Kc' : 'الأس الهيدروجيني pH'}.
    المستوى المطلوب: ${difficultyMap[difficulty]}.
    
    شروط هامة:
    1. لا تستخدم معادلات رياضية معقدة جداً (مثل المعادلات التربيعية الصعبة في Kc).
    2. اجعل اللغة واضحة ومبسطة جداً.
    3. ركز على المفاهيم الأساسية التي يحتاجها الطالب للنجاح في الامتحانات المدرسية.
    4. قدم تفسيراً تعليمياً بسيطاً لكل إجابة.
    5. أرجع النتيجة بتنسيق JSON حصراً.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              text: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswer: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ["id", "text", "options", "correctAnswer", "explanation"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || "[]");
    return data.map((q: any) => ({ ...q, topic, difficulty }));
  } catch (error) {
    console.error("Error generating chemistry questions:", error);
    throw error; // نمرر الخطأ ليتم التعامل معه في الواجهة
  }
};

export const getChemistryExplanation = async (userQuery: string): Promise<string> => {
  try {
    const ai = getAIInstance();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userQuery,
      config: {
        systemInstruction: "أنت معلم كيمياء للمرحلة الثانوية (طلاب 15-18 سنة). اشرح بتبسيط شديد، استخدم لغة عربية بيضاء سهلة، وتجنب التعقيدات الأكاديمية العميقة."
      }
    });
    return response.text || "عذراً، لم أتمكن من الحصول على إجابة.";
  } catch (error) {
    console.error("Error getting explanation:", error);
    return "حدث خطأ. يرجى التأكد من صحة مفتاح API في الإعدادات.";
  }
};
