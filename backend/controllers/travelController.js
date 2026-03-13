const Groq = require("groq-sdk");
const UserInterest = require("../models/UserInterest");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

/* Add test data */
const addUserInterest = async (req, res) => {
  try {

    const { userId, city, interests, budget } = req.body;

    const user = new UserInterest({
      userId,
      city,
      interests,
      budget
    });

    const savedUser = await user.save();

    res.json({
      message: "User interest saved",
      data: savedUser
    });

  } catch (error) {

    res.status(500).json({
      message: "Error saving user interest",
      error: error.message
    });

  }
};


/* View all user interests */
const getAllUserInterests = async (req, res) => {
  try {

    const users = await UserInterest.find();

    res.json({
      total: users.length,
      data: users
    });

  } catch (error) {

    res.status(500).json({
      message: "Error fetching data",
      error: error.message
    });

  }
};



/* ---------------- TEST DATABASE ---------------- */

const testDB = async (req, res) => {
  try {

    const data = await UserInterest.find().limit(1);

    res.json({
      message: "MongoDB connected successfully",
      data
    });

  } catch (err) {

    res.status(500).json({
      message: "Database error",
      error: err.message
    });

  }
};


/* ---------------- TOP ATTRACTIONS ---------------- */

const getTopAttractions = async (req, res) => {
  try {

    const { city, interests, userId } = req.body;

    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    const interestText =
      interests && interests.length
        ? interests.join(", ")
        : "general tourism";


    const prompt = `List the top 10 tourist attractions in ${city} based on the user's interests: ${interestText}.

Return JSON:

{
  "city": "${city}",
  "attractions":[
    {
      "name":"",
      "category":"",
      "cost":"",
      "location":"",
      "description":""
    }
  ]
}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const parsed = JSON.parse(
      chatCompletion.choices[0].message.content
    );

    /* Save user interest in MongoDB */

    if (userId) {
      await UserInterest.create({
        userId,
        city,
        interests
      });
    }

    res.json({
      city,
      attractions: parsed.attractions || []
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Groq API error",
      error: error.message
    });

  }
};


/* ---------------- AVERAGE BUDGET ---------------- */

const getAverageBudget = async (req, res) => {
  try {

    const { budgets } = req.body;

    if (!budgets || !Array.isArray(budgets)) {
      return res.status(400).json({
        message: "Budgets array required"
      });
    }

    const total = budgets.reduce((sum, b) => sum + Number(b), 0);

    const average = total / budgets.length;

    res.json({
      totalUsers: budgets.length,
      averageBudget: average
    });

  } catch (error) {

    res.status(500).json({
      message: "Budget calculation error",
      error: error.message
    });

  }
};


/* ---------------- GROUP ATTRACTIONS ---------------- */

const getGroupAttractions = async (req, res) => {
  try {

    const { city, userInterests } = req.body;

    if (!city) {
      return res.status(400).json({
        message: "City required"
      });
    }

    const combinedInterests = [...new Set(userInterests.flat())];

    const prompt = `A group of travelers is visiting ${city}. 
Their combined interests are: ${combinedInterests.join(", ")}.

Return JSON:

{
  "city":"${city}",
  "groupInterests":[${combinedInterests.map(i => `"${i}"`).join(",")}],
  "attractions":[
    {
      "name":"",
      "category":"",
      "cost":"",
      "location":"",
      "description":""
    }
  ]
}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const parsed = JSON.parse(
      chatCompletion.choices[0].message.content
    );

    res.json({
      city,
      groupInterests: combinedInterests,
      attractions: parsed.attractions || []
    });

  } catch (error) {

    res.status(500).json({
      message: "Groq API error",
      error: error.message
    });

  }
};



module.exports = {
  testDB,
  getTopAttractions,
  getAverageBudget,
  getGroupAttractions,
  addUserInterest,
  getAllUserInterests
};