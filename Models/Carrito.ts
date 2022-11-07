import {Schema, model, SchemaTypes, Types} from "mongoose"

const carritoSchema = new Schema({
    Nombre_Carrito: {type: String, unique: true},
    Carrito_Details: {type: Array},
    Precio_Total: {type: Number, default: 0}
});

export default model("Carrito", carritoSchema);