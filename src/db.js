import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL);

const BBDB = mongoose.connection;

const handleOpen = () => console.log("The DB bridge has connected!🆗");

BBDB.on("error", (error) => console.log("db caught an error💥", error));
BBDB.once("open", handleOpen);