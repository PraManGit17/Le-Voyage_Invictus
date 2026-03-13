const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const generateQuestions = async (activityPlan) => {

const prompt = `
You are a travel assistant.

Based on this activity plan ask questions needed before booking travel.

Activity Plan:
${JSON.stringify(activityPlan)}

Return JSON:

{
 "questions":[
   {
     "type":"transport",
     "question":"",
     "options":["train","bus","car","flight"]
   },
   {
     "type":"accommodation",
     "question":"",
     "options":["hostel","budget","luxury","homestay"]
   },
   {
     "type":"restaurants",
     "question":"Do you want restaurant suggestions?"
   }
 ]
}
`;

const completion = await groq.chat.completions.create({
  model:"llama-3.3-70b-versatile",
  messages:[{role:"user",content:prompt}],
  response_format:{type:"json_object"}
});

return JSON.parse(completion.choices[0].message.content);

};

module.exports = generateQuestions;