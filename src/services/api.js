import axios from 'axios';

const generateIdea = async (branch, difficulty) => {
  try {
    const res = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'user',
            content: `Suggest a ${difficulty} level final year project idea for a ${branch} student. Keep it under 5 lines, no markdown or formatting.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 300,
      },
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_GROK_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    let text = res.data.choices[0].message.content.trim();
    text = text.replace(/\*\*/g, '').replace(/#+/g, '').replace(/[`_]/g, '');
    if (text.length > 950) text = text.substring(0, 947) + '...';
    return text;
  } catch (err) {
    console.error('Groq error:', err?.response?.data || err);
    throw new Error('Failed to generate idea');
  }
};

export { generateIdea };