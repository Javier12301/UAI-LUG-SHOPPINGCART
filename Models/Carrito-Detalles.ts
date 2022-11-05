import { Schema, model } from "mongoose";

//Creación del Schema Carrito
const carritoDetallesSchema = new Schema({
    Nombre_Producto: {type: String, required: true, unique: true},
    Cantidad: {type: Number, required: true},
    Precio: {type: Number}
});

export default model("Carrito_Detalles", carritoDetallesSchema);
