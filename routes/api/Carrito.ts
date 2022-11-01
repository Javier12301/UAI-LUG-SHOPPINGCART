import { Router } from "express";
import carritoController from "../../Controllers/Carrito";

//Invocamos la ruta de express
const router = Router();

//GET
router.get("/", carritoController.get)

//POST
router.post("/", carritoController.add)

//DELETE
router.delete("/:Nombre_Producto", carritoController.delete);

export default router;