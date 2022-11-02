import { Router } from "express";
import { resolveModuleNameFromCache } from "typescript";
import carritoController from "../../Controllers/Carrito";

//Invocamos la ruta de express
const router = Router();

//GET
router.get("/", carritoController.get)

//POST
router.post("/", carritoController.add)

//DELETE
router.delete("/:Nombre_Producto", carritoController.delete)

//PUT
router.put("/", carritoController.put)

export default router;