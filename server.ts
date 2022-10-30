import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import apiCart from "./routes/api/index"

dotenv.config();

//Inciar app express
const app = express();

//Settings
app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({ extended: true}));

//Routes, esta será nuestra ruta principal donde se encontrarán las Colecciones de datos guardadas en MongoDB
app.use("/ShoppingCart", apiCart);

//Server ON
app.listen(process.env.PORT, () => {
    console.log(`Server listening on ${process.env.PORT}`);
});

//Connect to DataBase
connectDb()
    .then(() => console.log("DataBase connected successfully"))
    .catch((err) => console.log(err));

async function connectDb() {
    if (process.env.DB_CONNECTION_STRING){
        await mongoose.connect(process.env.DB_CONNECTION_STRING);
    } else {
        console.log("Failed to connect to DataBase");
    }
}