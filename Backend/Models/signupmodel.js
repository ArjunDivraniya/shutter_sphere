const mongoose=require("mongoose");

const signupschema= new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["client", "photographer"], required: true }

})


module.exports = mongoose.model("signup", signupschema);
