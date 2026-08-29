const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const { connectDB, Url } = require("./db");

dotenv.config();

const app = express();
const PORT = 3000;

connectDB();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function createShortCode() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";

    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
    }

    return code;
}

function isValidUrl(url) {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
    } catch {
        return false;
    }
}

app.post("/api/shorten", async (req, res) => {
    try {
        const { originalUrl } = req.body;

        if (!originalUrl) {
            return res.status(400).json({
                message: "Please enter a URL"
            });
        }

        if (!isValidUrl(originalUrl)) {
            return res.status(400).json({
                message: "Please enter a valid URL"
            });
        }

        let shortCode;
        let existingUrl;

        do {
            shortCode = createShortCode();
            existingUrl = await Url.findOne({ shortCode });
        } while (existingUrl);

        const newUrl = new Url({
            originalUrl,
            shortCode
        });

        await newUrl.save();

        const shortUrl = `http://localhost:${PORT}/${shortCode}`;

        res.status(201).json({
            originalUrl,
            shortCode,
            shortUrl
        });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong"
        });
    }
});

app.get("/:shortCode", async (req, res) => {
    try {
        const url = await Url.findOne({
            shortCode: req.params.shortCode
        });

        if (!url) {
            return res.status(404).send("Short URL not found");
        }

        res.redirect(url.originalUrl);
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});