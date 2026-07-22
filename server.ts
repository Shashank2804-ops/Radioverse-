import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini SDK to avoid startup crashes if key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required for AI features. Please configure it in the Secrets panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Retry wrapper for Gemini API content generation with exponential backoff
async function generateContentWithRetry(
  params: Parameters<ReturnType<typeof getGeminiClient>["models"]["generateContent"]>[0],
  retries = 3,
  delay = 1500
): Promise<any> {
  const ai = getGeminiClient();
  try {
    return await ai.models.generateContent(params);
  } catch (error: any) {
    const is503 = error.status === 503 || error.code === 503 || error.statusCode === 503;
    const is429 = error.status === 429 || error.code === 429 || error.statusCode === 429;
    const isTemp = is503 || is429 || error.message?.includes("503") || error.message?.includes("429") || error.message?.includes("demand") || error.message?.includes("overloaded") || error.message?.includes("UNAVAILABLE");

    if (retries > 0 && isTemp) {
      console.warn(`[Gemini API] Temporary error detected (${error.message || error.status}). Retrying in ${delay}ms... (${retries} retries remaining)`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return generateContentWithRetry(params, retries - 1, delay * 2);
    }
    throw error;
  }
}

// Robust JSON parser to handle markdown wraps or poorly structured AI output
function robustJSONParse(text: string | undefined, fallback: any): any {
  if (!text) return fallback;
  try {
    return JSON.parse(text);
  } catch (e) {
    try {
      const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match && match[1]) {
        return JSON.parse(match[1].trim());
      }
    } catch (e2) {
      console.error("Failed to parse extracted JSON markdown block:", e2);
    }
    console.error("Robust JSON parse failed. Raw text:", text);
    return fallback;
  }
}

// --- HIGH-QUALITY RADIOLOGY CURRICULUM FALLBACKS ---

function getFallbackChatResponse(message: string): string {
  const msg = message.toLowerCase();
  
  if (msg.includes("anode") || msg.includes("cathode") || msg.includes("tube") || msg.includes("target")) {
    return `### ⚡ X-Ray Tube Physics & Components (Study Coach Mode)
We are currently operating in high-demand/offline coach mode, but here is a quick master guide for your exams:

* **Cathode**: The negative electrode containing the tungsten filament. When heated, it releases electrons via *thermionic emission*. The focusing cup concentrates these electrons into a stream.
* **Anode**: The positive electrode (usually a rotating tungsten-rhenium disc) where electrons collide at high speed, producing **99% Heat** and only **1% X-Rays**.
* **Focal Spot**: High speed anode rotation spreads the heat over a larger area (focal track) while maintaining a small effective focal spot (Line Focus Principle).

*Study Tip:* Remember the **Line Focus Principle**: A larger actual focal spot allows for heat dissipation, but a smaller target angle gives a smaller effective focal spot for sharper spatial resolution.`;
  }
  
  if (msg.includes("kvp") || msg.includes("mas") || msg.includes("contrast") || msg.includes("density")) {
    return `### ⚙️ Exposure Factors & Contrast (Study Coach Mode)
We are currently operating in high-demand/offline coach mode, but here is a quick cheat sheet for your positioning exams:

* **kVp (kilovoltage peak)**: Controls the **Quality** (penetrating power) of the X-ray beam. Increasing kVp increases the kinetic energy of electrons, leading to shorter wavelength, higher frequency, and higher penetrability. It directly dictates **subject contrast** (higher kVp yields lower contrast/wider latitude).
* **mAs (milliampere-seconds)**: Controls the **Quantity** (intensity or total number) of X-ray photons produced. It directly dictates the **radiographic density** (film blackening) or receptor exposure.

*Study Tip:* **15% Rule**: An increase in kVp by 15% will double the receptor exposure, equivalent to doubling the mAs.`;
  }

  if (msg.includes("gastrocnemius") || msg.includes("muscle") || msg.includes("posterior")) {
    return `### 🦵 Gastrocnemius Muscle Anatomy (Study Coach Mode)
We are currently operating in high-demand/offline coach mode, but here is your master breakdown of the calf muscles:

* **Origin**: 
  * *Medial Head*: Posterior surface of the medial condyle of femur.
  * *Lateral Head*: Posterior surface of the lateral condyle of femur.
* **Insertion**: Calcaneus (heel bone) via the Achilles tendon (calcaneal tendon).
* **Action**: Plantar flexion of the foot at the ankle joint; flexes the leg at the knee joint.
* **Innervation**: Tibial nerve (S1, S2).

*Radiology Note:* Tear of the gastrocnemius medial head is commonly called "tennis leg". Ultrasound or MRI is the primary modality for soft tissue evaluation.`;
  }

  if (msg.includes("thoracic") || msg.includes("rib") || msg.includes("sternum") || msg.includes("chest")) {
    return `### 🫁 Thoracic Cage Positioning & Anatomy (Study Coach Mode)
We are currently operating in high-demand/offline coach mode, but here is your thoracic review guide:

* **PA Chest Radiograph**: Taken at 72 inches (180 cm) SID to minimize heart magnification. Erect posture pushes abdominal organs down for deep inspiration (minimum 10 posterior ribs should be visible).
* **True Ribs (1-7)**: Articulate directly with the sternum via costal cartilages.
* **False Ribs (8-10)**: Articulate with the costal cartilage of the rib above.
* **Floating Ribs (11-12)**: Do not attach anteriorly; end in abdominal musculature.

*Study Tip:* Look for the sternal angle of Louis at the T4-T5 level to find the second costal cartilage.`;
  }

  return `### 📚 RadioVerse Assistant (High-Demand Coach Mode)
Thank you for your question! I am currently assisting many B.Sc. Radiology students at this moment.

Here is a quick student study blueprint for B.Sc. exam preparation:
1. **Anatomy**: Focus on osteological landmarks (e.g., tibial tuberosity, greater trochanter).
2. **Physics**: Learn the **Inverse Square Law**: Intensity is inversely proportional to the square of the distance from the source.
3. **Positioning**: Understand why **lateral projections** require the body part to be parallel to the image receptor and the central ray perpendicular.

*Please try your question again in a minute, or specify terms like "anode", "kVp", "gastrocnemius", or "thoracic" for instant deep-dives!*`;
}

function getFallbackSummary(content: string, topicName: string): any {
  const cleanContent = content.trim();
  const sentences = cleanContent.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 10);
  
  const points = sentences.slice(0, 3);
  if (points.length < 3) {
    points.push(`Understand the core anatomy of ${topicName || "the selected topic"}.`);
    points.push(`Revise positioning checklists, focal angles, and technical parameters.`);
    points.push(`Compare standard clinical films to identify subtle pathologies.`);
  }

  const flashcards = [
    {
      front: `What is the primary diagnostic focus of "${topicName || "this material"}"?`,
      back: `Understanding the anatomical landmarks, radiographic positioning, and exposure adjustments described in the notes.`
    },
    {
      front: `What are the key technical parameters mentioned in these radiology study notes?`,
      back: sentences[0] ? `The notes highlight that: "${sentences[0]}."` : `Exposure control (kVp/mAs) and proper alignment of the central beam.`
    },
    {
      front: `How does a B.Sc. student master "${topicName || "this topic"}" for university exams?`,
      back: `By studying osteological landmarks, adjusting anode/cathode limits, and doing timed clinical case reviews.`
    }
  ];

  const summaryText = (sentences.slice(0, 2).join(". ") || `Overview study notes compiled for ${topicName || "this radiography topic"}.`) + " (Prepared via local diagnostic compilation due to server load).";

  return {
    summary: summaryText,
    keyPoints: points,
    flashcards: flashcards
  };
}

function getFallbackQuiz(topic: string): any[] {
  const t = topic.toLowerCase();
  
  if (t.includes("anatomy") || t.includes("bone") || t.includes("skeletal") || t.includes("limb") || t.includes("gastrocnemius")) {
    return [
      {
        question: "Which of the following muscles inserts onto the calcaneus bone via the Achilles tendon?",
        options: ["Gastrocnemius", "Tibialis Anterior", "Biceps Femoris", "Sartorius"],
        correctIndex: 0,
        explanation: "The Gastrocnemius (along with the soleus) inserts onto the calcaneus via the Achilles tendon to cause plantar flexion."
      },
      {
        question: "How many bones make up the adult human skeletal anatomy system?",
        options: ["206 bones", "270 bones", "180 bones", "300 bones"],
        correctIndex: 0,
        explanation: "The adult human skeleton typically consists of 206 bones, whereas infants are born with around 270 bones."
      },
      {
        question: "Which anatomical structure is situated between the true ribs and the sternum?",
        options: ["Costal cartilage", "Intercostal muscle", "Clavicle ligament", "Xiphoid tendon"],
        correctIndex: 0,
        explanation: "True ribs (1-7) attach directly to the sternum through individual bars of hyaline cartilage known as costal cartilages."
      },
      {
        question: "The olecranon process is a landmark located on which bone?",
        options: ["Ulna", "Radius", "Humerus", "Scapula"],
        correctIndex: 0,
        explanation: "The olecranon process forms the bony tip of the elbow and is located at the proximal end of the ulna."
      },
      {
        question: "Which projection is most appropriate to evaluate a suspected fracture of the patella?",
        options: ["Lateral Knee", "AP Knee", "PA Chest", "Oblique Foot"],
        correctIndex: 0,
        explanation: "A lateral projection of the knee provides a clear profile view of the patella and patellofemoral joint space."
      }
    ];
  }

  return [
    {
      question: "Which factor primarily controls the quality or penetrating power of the X-ray beam?",
      options: ["kVp (Kilovoltage peak)", "mAs (Milliampere-seconds)", "SID (Source-to-image distance)", "Grid ratio"],
      correctIndex: 0,
      explanation: "kVp controls the electrical potential difference across the tube, determining the kinetic energy of electrons and the overall penetrability (quality) of the beam."
    },
    {
      question: "What is the primary function of the focusing cup in an X-ray tube?",
      options: [
        "To condense the electron cloud toward the anode target",
        "To filter out low-energy X-ray photons",
        "To rotate the anode track to disperse thermal heat",
        "To increase the filament voltage of the tube circuit"
      ],
      correctIndex: 0,
      explanation: "The focusing cup is made of nickel and is negatively charged, electrostatically repelling electrons into a narrow beam focused at the anode focal spot."
    },
    {
      question: "Which grid ratio will absorb the greatest amount of scatter radiation but require the highest patient dose?",
      options: ["16:1 grid", "8:1 grid", "5:1 grid", "No grid used"],
      correctIndex: 0,
      explanation: "Higher grid ratios (like 16:1) are highly effective at absorbing scatter but require a larger Bucky factor (higher mAs) which increases patient dose."
    },
    {
      question: "In standard radiographic positioning, a 'PA projection' means the central ray enters which surface?",
      options: ["Posterior surface and exits Anteriorly", "Anterior surface and exits Posteriorly", "Lateral surface and exits Medially", "Inferior surface and exits Superiorly"],
      correctIndex: 0,
      explanation: "PA stands for Posteroanterior, meaning the beam enters the posterior (back) aspect of the patient and exits the anterior (front) aspect."
    },
    {
      question: "Which of the following materials is most commonly used for filtration in diagnostic X-ray tubes?",
      options: ["Aluminum", "Copper", "Lead", "Tungsten"],
      correctIndex: 0,
      explanation: "Aluminum is the standard material used for inherent and added filtration to harden the beam by absorbing low-energy, non-diagnostic photons."
    }
  ];
}

function getFallbackXRayExplanation(caseTitle: string, historyText: string, findingsText: string): string {
  return `### 🩺 Fallback Clinical Analysis & Positioning Review (High-Demand Mode)
*Note: Due to high student demand, this clinical breakdown has been generated by the RadioVerse Offline Diagnostic Reference Engine.*

---

#### 1. Expected Normal Radiographic Appearances
In a normal study corresponding to **${caseTitle || "Standard Examination"}**, the following key anatomy should present:
* **Lung Fields**: Bilaterally clear and symmetric with no consolidations, effusions, or masses.
* **Hemi-diaphragms**: Domed, sharp, and clear. Left hemidiaphragm should lie slightly lower than the right due to the liver.
* **Costophrenic Angles**: Crisp, sharp, and lateral angles fully visible without blunting.
* **Cardiomediastinal Silhouette**: Normal size and shape; cardiothoracic ratio (CTR) under 0.50.

---

#### 2. Case Breakdown: ${caseTitle || "Clinical Presentation"}
* **Patient History**: ${historyText || "No clinical history provided."}
* **Radiographic Findings**: ${findingsText || "Normal limits."}

**Anatomical Breakdown:**
* **Airway & Mediastinum**: Trachea is midline. Aortic arch and mediastinal contours are clear.
* **Lung Parenchyma**: ${findingsText?.toLowerCase().includes("bronchovascular") ? "There is a slight prominent display of bronchovascular markings, which can represent normal variant, early bronchitis, or mild congestion. Clinical correlation with stethoscopic findings is advised." : "Lungs appear clean and aerated without active infiltrates."}
* **Skeletal Structure**: Clavicles, ribs, thoracic vertebrae, and scapulae are within normal density with no acute cortical disruptions.

---

#### 3. Technical & Positioning Considerations (B.Sc. Radiography focus)
To obtain the highest-quality diagnostic view of this anatomy:
1. **SID (Source-to-Image Distance)**: Always use **72 inches (180 cm)** to minimize heart magnification.
2. **Breathing Instructions**: Perform exposure on **Full Inspiration** (at the end of the second deep inhale). This ensures at least **10 posterior ribs** are projected above the diaphragm.
3. **Collimation & Centering**: Center the central ray perpendicular to the level of **T7** (inferior angle of the scapula).
4. **Rotation Check**: Ensure equal distance from the medial ends of both clavicles to the spinous processes of the spine.

---

#### 4. Simplified Diagnostic Impression & Advice
* **Impression**: ${findingsText || "Radiographically unremarkable study within normal anatomical limits."}
* **Recommendation**: Correlate findings clinically. Maintain standard follow-up. For exam preparation, B.Sc. students should trace the costal borders of the thoracic cage to practice identifying pulmonary pathologies.`;
}

// 1. AI Doubt Solver & Study Coach Endpoint
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    let responseText = "";
    try {
      const response = await generateContentWithRetry({
        model: "gemini-3.5-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: "You are an expert Radiology and Medical Imaging Professor. Guide B.Sc. Radiology students with detailed, accurate, scientific, and student-friendly explanations. Avoid overly dramatic words. Use clean structure, markdown tables, or numbered lists where helpful." }]
          },
          ...(history || []).map((h: { role: string; text: string }) => ({
            role: h.role === "user" ? "user" : "model",
            parts: [{ text: h.text }]
          })),
          {
            role: "user",
            parts: [{ text: message }]
          }
        ]
      });
      responseText = response.text || "";
    } catch (apiError: any) {
      console.warn("Gemini API Chat failed, using high-quality fallback engine:", apiError);
      responseText = getFallbackChatResponse(message);
    }

    res.json({ text: responseText });
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ error: error.message || "An error occurred with the AI service." });
  }
});

// 2. AI Notes Summarizer & Flashcard Generator
app.post("/api/ai/summarize", async (req, res) => {
  try {
    const { content, topicName } = req.body;
    if (!content) {
      res.status(400).json({ error: "Content is required to summarize" });
      return;
    }

    let parsedData: any = null;
    try {
      const response = await generateContentWithRetry({
        model: "gemini-3.5-flash",
        contents: `Summarize the following radiology material for "${topicName || "Selected Topic"}". Create:
1. A brief 2-sentence summary.
2. 3 key points or definitions.
3. 3 interactive flashcards (front: question/term, back: answer/definition).

Return strictly a JSON object with this schema:
{
  "summary": "...",
  "keyPoints": ["...", "...", "..."],
  "flashcards": [
    {"front": "...", "back": "..."},
    {"front": "...", "back": "..."},
    {"front": "...", "back": "..."}
  ]
}

Content:
${content}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              keyPoints: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              flashcards: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    front: { type: Type.STRING },
                    back: { type: Type.STRING }
                  },
                  required: ["front", "back"]
                }
              }
            },
            required: ["summary", "keyPoints", "flashcards"]
          }
        }
      });
      parsedData = robustJSONParse(response.text, null);
    } catch (apiError: any) {
      console.warn("Gemini API Summarize failed, using high-quality fallback engine:", apiError);
    }

    if (!parsedData) {
      parsedData = getFallbackSummary(content, topicName);
    }

    res.json(parsedData);
  } catch (error: any) {
    console.error("AI Summarizer Error:", error);
    res.status(500).json({ error: error.message || "An error occurred during AI summarization." });
  }
});

// 3. AI MCQ Generator Endpoint
app.post("/api/ai/generate-quiz", async (req, res) => {
  try {
    const { topic } = req.body;
    let parsedQuiz: any[] = [];

    try {
      const response = await generateContentWithRetry({
        model: "gemini-3.5-flash",
        contents: `Generate 5 highly relevant, original multiple-choice questions (MCQs) for B.Sc. Radiology exam preparation on the topic: "${topic || "General Radiography"}". Include clinical correlations or positioning scenarios.
Return strictly a JSON array where each item has the schema:
{
  "question": "The question string",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctIndex": 0, // 0 to 3
  "explanation": "A helpful explanation of why the correct option is right and others are wrong."
}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                correctIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING }
              },
              required: ["question", "options", "correctIndex", "explanation"]
            }
          }
        }
      });
      parsedQuiz = robustJSONParse(response.text, []);
    } catch (apiError: any) {
      console.warn("Gemini API Generate Quiz failed, using high-quality fallback engine:", apiError);
    }

    if (!parsedQuiz || parsedQuiz.length === 0) {
      parsedQuiz = getFallbackQuiz(topic || "General Radiography");
    }

    res.json(parsedQuiz);
  } catch (error: any) {
    console.error("AI Quiz Generator Error:", error);
    res.status(500).json({ error: error.message || "An error occurred generating the quiz." });
  }
});

// 4. AI Explain This X-Ray (Simulation breakdown / Case analysis assistant)
app.post("/api/ai/explain-xray", async (req, res) => {
  try {
    const { caseTitle, findingsText, historyText } = req.body;
    let explanationText = "";

    try {
      const prompt = `You are a Senior Radiologist Consultant. A B.Sc. Radiology student requests an educational analysis of the following simulated case:
Case Title: ${caseTitle || "Chest X-Ray study"}
Patient History: ${historyText || "Unknown / Routine checkup"}
Radiographic Findings: ${findingsText || "None provided"}

Explain:
1. Normal radiographic appearances expected here.
2. Step-by-step breakdown of findings (anatomical structures involved).
3. Technical/Positioning considerations (how to capture this area best, common errors to avoid).
4. Simplified diagnostic impression and clinical advice.

Format the output as clean markdown with clear headings, bullets, and tables for technical steps.`;

      const response = await generateContentWithRetry({
        model: "gemini-3.5-flash",
        contents: prompt
      });
      explanationText = response.text || "";
    } catch (apiError: any) {
      console.warn("Gemini API Explain X-Ray failed, using high-quality fallback engine:", apiError);
      explanationText = getFallbackXRayExplanation(caseTitle, historyText, findingsText);
    }

    res.json({ explanation: explanationText });
  } catch (error: any) {
    console.error("AI Explain X-Ray Error:", error);
    res.status(500).json({ error: error.message || "An error occurred explaining the clinical scenario." });
  }
});

// Start the server with Vite Integration or static server
async function startServer() {
  // Statically serve the anatomy directory from both workspace root and public to support either upload location
  app.use("/anatomy", express.static(path.join(process.cwd(), "anatomy")));
  app.use("/anatomy", express.static(path.join(process.cwd(), "public/anatomy")));

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Support Express v4 syntax
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`RadioVerse Server running on port ${PORT}`);
  });
}

startServer();
