// Netlify Function: AI-Powered Answer Evaluation
// Uses Claude API to provide immediate feedback and M-STEP scoring

const Anthropic = require('@anthropic-ai/sdk');

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { question, studentAnswer, correctAnswer, standard, gradeLevel } = JSON.parse(event.body);

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });

    const systemPrompt = `You are an encouraging 4th grade tutor for a homeschool student named Emory.
Your job is to evaluate his answer and provide helpful feedback.

ALWAYS be encouraging first, then constructive. Emory has ADHD, so keep feedback concise and actionable.

You will evaluate against M-STEP standards using this rubric:
- ADVANCED (4): Shows deep understanding, makes connections, exceeds expectations
- PROFICIENT (3): Meets grade-level expectations, demonstrates solid understanding
- DEVELOPING (2): Shows partial understanding, on the right track but needs more practice
- NOT_PROFICIENT (1): Significant gaps, needs reteaching of core concepts

Respond in this exact JSON format:
{
  "score": <1-4>,
  "level": "<ADVANCED|PROFICIENT|DEVELOPING|NOT_PROFICIENT>",
  "feedback": "<2-3 sentences of encouraging, specific feedback>",
  "hint": "<if score < 3, provide a helpful hint without giving away the answer>",
  "correct": <true if substantially correct, false otherwise>
}`;

    const userPrompt = `
Standard: ${standard}
Grade Level: ${gradeLevel || '4th Grade'}

Question: ${question}

Correct/Expected Answer: ${correctAnswer}

Emory's Answer: ${studentAnswer}

Evaluate Emory's answer against the M-STEP standard. Be encouraging!`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    });

    const aiResponse = response.content[0].text;

    // Parse the JSON response
    let evaluation;
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      evaluation = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(aiResponse);
    } catch (parseError) {
      // If parsing fails, create a default response
      evaluation = {
        score: 2,
        level: 'DEVELOPING',
        feedback: aiResponse.substring(0, 200),
        hint: 'Try reviewing the passage again.',
        correct: false
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        evaluation,
        standard
      })
    };

  } catch (error) {
    console.error('Evaluation error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Unable to evaluate answer. Please try again.',
        details: error.message
      })
    };
  }
};
