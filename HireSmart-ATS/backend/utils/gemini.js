const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeResume(resumeText, jobDescription, jobSkills = []) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3.8-flash' });

    const prompt = `
You are an expert ATS (Applicant Tracking System) analyzer for recruitment.

Job Description:
${jobDescription}

Required Skills (if any): ${jobSkills.join(', ') || 'Not specified'}

Candidate Resume Text:
${resumeText.substring(0, 12000)}

Analyze the resume against the job description and return ONLY a valid JSON object with this exact structure (no markdown, no extra text):
{
  "score": <number between 0 and 100>,
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "summary": "A short 2-3 sentence professional summary of the candidate's fit for this role."
}

Scoring guidelines:
- 80-100: Excellent match, most key requirements met
- 60-79: Good match, some gaps
- 40-59: Moderate match, significant gaps
- 0-39: Poor match

Be realistic and fair. Focus on skills, experience relevance, and keyword matches.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    // Clean possible markdown
    if (text.startsWith('```json')) {
      text = text.replace(/```json\n?/, '').replace(/\n?```$/, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/```\n?/, '').replace(/\n?```$/, '');
    }

    const parsed = JSON.parse(text);
    
    return {
      score: Math.min(100, Math.max(0, Number(parsed.score) || 0)),
      matchedSkills: Array.isArray(parsed.matchedSkills) ? parsed.matchedSkills : [],
      missingSkills: Array.isArray(parsed.missingSkills) ? parsed.missingSkills : [],
      summary: parsed.summary || 'No summary available'
    };
  } catch (error) {
    console.error('Gemini analysis error:', error.message);
    // Fallback if AI fails
    return {
      score: 50,
      matchedSkills: [],
      missingSkills: [],
      summary: 'AI analysis temporarily unavailable. Manual review recommended.'
    };
  }
}

module.exports = { analyzeResume };
