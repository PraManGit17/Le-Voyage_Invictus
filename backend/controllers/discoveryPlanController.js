const groq = require("../services/groqClient");

const heritagePrompt = require("../prompts/heritagePrompt");
const foodPrompt = require("../prompts/foodPrompt");
const adventurePrompt = require("../prompts/adventurePrompt");
const naturePrompt = require("../prompts/naturePrompt");
const culturePrompt = require("../prompts/culturePrompt");
const nightlifePrompt = require("../prompts/nightlifePrompt");

const generateDiscoveryPlan = async (req, res) => {

  try {

    const { destination, title, description, theme } = req.body;

    if (!destination || !theme) {
      return res.status(400).json({
        message: "Destination and theme required"
      });
    }

    let prompt;

    switch (theme.toLowerCase()) {

      case "heritage":
        prompt = heritagePrompt(destination, title, description);
        break;

      case "food":
        prompt = foodPrompt(destination, title, description);
        break;

      case "adventure":
        prompt = adventurePrompt(destination, title, description);
        break;

      case "nature":
        prompt = naturePrompt(destination, title, description);
        break;

      case "culture":
        prompt = culturePrompt(destination, title, description);
        break;

      case "nightlife":
        prompt = nightlifePrompt(destination, title, description);
        break;

      default:
        prompt = heritagePrompt(destination, title, description);

    }

    const completion = await groq.chat.completions.create({

      messages: [{ role: "user", content: prompt }],

      model: "llama-3.3-70b-versatile",
      

      temperature: 0.6,

      response_format: { type: "json_object" }

    });

    const response = completion.choices[0].message.content;

    const parsed = JSON.parse(response);

    res.status(200).json(parsed);

  } catch (error) {

    console.error("Discovery Plan Error:", error);

    res.status(500).json({
      message: "Failed to generate discovery plan",
      error: error.message
    });

  }
};

module.exports = {
  generateDiscoveryPlan
};