const chatWithTripAgent = require("../agents/chatAgent");
const runTravelTools = require("../services/toolService");

const chatWithItinerary = async (req, res) => {

  try {

    const { itinerary, message } = req.body;

    const agentResponse = await chatWithTripAgent(itinerary, message);

    if (agentResponse.tool) {

      const toolResults = await runTravelTools(agentResponse.parameters);

      return res.json({
        type: "tool_result",
        data: toolResults
      });

    }

    return res.json({
      type: "message",
      reply: agentResponse.reply
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Chat failed",
      error: error.message
    });

  }

};

module.exports = { chatWithItinerary };