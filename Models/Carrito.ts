import { Schema, model } from "mongoose";

//Creación del Schema Carrito
const carritoSchema = new Schema({
    Nombre_Producto: {type: String, required: true, unique: true},
    Cantidad: {type: Number, required: true},
    Precio: {type: Number}, 
});

export default model("Carrito", carritoSchema);
