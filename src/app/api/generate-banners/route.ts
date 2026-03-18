import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const PROMPTS = [
  "Premium restaurant food photography, crispy golden calamari on dark slate plate with lemon aioli, dramatic side lighting, shallow depth of field, michelin star plating, 16:9 banner",
  "Luxury Indian restaurant food photography, rich butter chicken in copper bowl, warm amber lighting, rose petals garnish, dark moody background, professional food shoot, 16:9 banner",
  "Elegant dessert platter, dark chocolate lava cake with vanilla ice cream melting, gold leaf garnish, black marble surface, dramatic spotlight, fine dining restaurant, 16:9 banner"
]

export async function GET() {
  if (!process.env.GEMINI_API_KEY) {
    return Response.json({ error: "GEMINI_API_KEY is not set" }, { status: 500 })
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "imagen-3.0-generate-001" 
    })
    
    const images = await Promise.all(
      PROMPTS.map(async (prompt) => {
        const result = await model.generateContent(prompt)
        // Returns base64 image
        // Based on SDK: candidates[0].content.parts[0].inlineData.data
        const part = result.response.candidates?.[0]?.content?.parts?.[0]
        if (part?.inlineData?.data) {
          return part.inlineData.data
        }
        return ""
      })
    )
    
    return Response.json({ images })
  } catch (error: any) {
    console.error("Banner generation error:", error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
