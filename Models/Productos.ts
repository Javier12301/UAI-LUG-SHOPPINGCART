import {Schema , model} from "mongoose";

//Creación del Schema Productos
const productosSchema = new Schema({
    ID: {type: Number, required: true, unique: true},
    Nombre_Producto: {type: String, required: true, unique: true},
    Cantidad: {type: Number, required: true} 
});

export default model("Productos", productosSchema);