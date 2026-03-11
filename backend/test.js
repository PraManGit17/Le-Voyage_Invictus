const supabase = require("./config/supabaseClient")

async function test() {

  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        name: "Test User",
        email: "test@gmail.com",
        password: "123"
      }
    ])

  console.log(data, error)
}

test()