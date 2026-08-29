const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true
    },
    shortCode: {
        type: String,
        required: true,
        unique: true
    }
});

const Url = mongoose.model("Url", urlSchema);

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
    } catch (error) {
        console.log("MongoDB connection failed");
        console.log(error.message);
    }
}

module.exports = {
    connectDB,
    Url
};