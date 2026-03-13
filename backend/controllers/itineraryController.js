const generateActivityPlan = require("../agents/activityPlannerAgent");
const generateQuestions = require("../agents/questionAgent");
const generateFinalPlan = require("../agents/finalPlannerAgent");
const runTravelTools = require("../services/toolService");

const createItinerary = async (req,res) => {

try{

const {tripData,answers,activityPlan} = req.body;

if(!answers){

const plan = await generateActivityPlan(tripData);
const questions = await generateQuestions(plan);

return res.json({
 step:"questions",
 activityPlan:plan,
 questions
});

}

const tools = await runTravelTools(answers);

const finalPlan = await generateFinalPlan(activityPlan,tools);

res.json({
 success:true,
 itinerary:finalPlan
});

}catch(error){

console.error(error);

res.status(500).json({
 message:"Failed to generate itinerary",
 error:error.message
});

}

};

module.exports={createItinerary};