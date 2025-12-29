const express = require("express");
const axios = require("axios");
const rateLimit = require("express-rate-limit");

const app = express();
app.use(express.static("public"));

/* Rate Limiting */
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: "Too many requests. Try again later."
});

app.use("/weather", limiter);

/* External API Route */
app.get("/weather", async (req, res) => {
  const city = req.query.city;
  const API_KEY = "05a107e42fd47a8d2217eb6ed7fe2d5e";

  if (!city) {
    return res.status(400).json({ error: "City required" });
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    res.json({
      city: response.data.name,
      temp: response.data.main.temp,
      weather: response.data.weather[0].description
    });

  } catch (error) {
    res.status(500).json({ error: "City not found or API error" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
