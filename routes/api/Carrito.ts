import { Router } from "express";
import carritoController from "../../Controllers/Carrito";

//Invocamos la ruta de express
const router = Router();

router.get("/", carritoController.get);

export default router;