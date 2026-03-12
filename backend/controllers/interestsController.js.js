const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const saveInterests = async (req, res) => {
  try {
    const { interests } = req.body;

    if (!interests) {
      return res.status(400).json({
        message: "Interests required"
      });
    }

    const { data, error } = await supabase
      .from("user_interests")
      .insert([{ interests }])
      .select();

    if (error) throw error;

    res.json({
      message: "Saved successfully",
      data
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

module.exports = { saveInterests };