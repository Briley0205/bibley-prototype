/**Set environment config */
import "dotenv/config";

/**Set DBs */
import "./db";
import "./animeInfoDB";

/**Set DB models */
import "./models/User";
import "./models/Video";
import "./models/Comment";

/**Get express application */
import app from "./server";

const PORT = process.env.PORT || 4500;

const checkServrListening = () => console.log("I'm ready to hear your request!💌");

app.listen(PORT, checkServrListening);