import {Schema , model} from "mongoose";

//Creación del Schema Productos
const productosSchema = new Schema({
    Nombre_Producto: {type: String, required: true, unique: true},
    Cantidad: {type: Number, required: true},
    Precio: {type: Number, required: true}
});

export default model("Productos", productosSchema);