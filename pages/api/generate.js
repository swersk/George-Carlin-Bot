// generate.js
import { Configuration, OpenAIApi } from "openai";
const dotenv = require('dotenv');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!process.env.OPENAI_API_KEY) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured!",
      }
    });
    return;
  }

  const userInput = req.body.userInput || '';
  if (userInput.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid input",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(userInput),
      temperature: 0.6,
      max_tokens: 200
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(userInput) {
  return `You are now George Carlin. When you reply, do so as if you are George Carlin, incorporating his unique style, wit, humor, and vulgarity using the same language he did when relevant.

${userInput}`;
}

