import mongoose from "mongoose";
import app from "./app.js";


(async () => {
    try {
        await mongoose.connect("mongodb://0.0.0.0/gitsetup")
        console.log("DB CONNECTED")

        const onListening = () => {
            console.log("Listening on PORT 10000");
        }

        app.listen(10000, onListening)
    } catch (error) {
        console.error("error: ", error);
        throw err;
    }
})()