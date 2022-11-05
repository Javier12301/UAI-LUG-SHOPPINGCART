import {Schema, model} from "mongoose"

const carritoSchema = new Schema({
    Nombre_Carrito: {type: String, unique: true},
    Carrito_Details: {type: String},
    Precio_Total: {type: Number}
})

export default model("Carrito", carritoSchema);