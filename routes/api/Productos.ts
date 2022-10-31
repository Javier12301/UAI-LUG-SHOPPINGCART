import { Router } from "express";
import productosController from "../../Controllers/Productos";

const router = Router();


//Aquí utilizaremos las controladoras creadas para productos.

//GET
router.get("/", productosController.get);
//Utilizar parametros para seleccionar un producto único
router.get('/:Nombre_Producto', productosController.getunique);

//POST
router.post("/", productosController.add);

//DELETE
router.delete("/:Nombre_Producto", productosController.delete);

export default router;