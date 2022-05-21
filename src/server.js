/**Get express */
import express from "express";

/**Session */
import session from "express-session";
import MongoStore from "connect-mongo";

/**Set global middleware */
import morgan from "morgan";

/**Set routers */
import rootRouter from "./routers/rootRouter";
import authRouter from "./routers/authRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import apiRouter from "./routers/apiRouter";

/**Set middleware */
import flash from "express-flash";
import { localsMiddleware } from "./middleware";
const cors = require('cors');

const app = express();
const logger = morgan("dev");

/**Set Pug engine as view helper*/
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views/templates");

app.use(logger);
app.use(express.urlencoded({ extended:true }));
app.use(express.json());

app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
}));
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", 'GET,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
})
app.use(cors())

app.use(flash());
app.use(localsMiddleware);

/**Set routers' base URL */
app.use("/", rootRouter);
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);
app.use("/api", apiRouter);

/**Set static files' URL */
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));

export default app;