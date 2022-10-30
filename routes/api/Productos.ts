import { Router } from "express";
import productosController from "../../Controllers/Productos";

const router = Router();

//Aquí utilizaremos las controladoras creadas para productos.
router.get("/", productosController.get);
//Utilizar parametros para seleccionar un producto único
router.get('/:id', productosController.getunique);
router.post("/", productosController.add);

export default router;