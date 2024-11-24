const express = require('express')
const cors = require('cors')
const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config()

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.post('/gemini', async (req, res)=>{
    const message = req.body.message;
    const history = req.body.history;
    console.log(history);
    console.log(message);
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

      const chat = model.startChat({
    history: history,
    generationConfig: {
      maxOutputTokens: 100,
    },
  });

    const msg = message;

  const result = await chat.sendMessage(msg);
  const response = await result.response;
  const text = response.text();
  res.send(text); 
  console.log(text);
});

app.listen(8000, function () {
    console.log('Server running on port 8000');
})