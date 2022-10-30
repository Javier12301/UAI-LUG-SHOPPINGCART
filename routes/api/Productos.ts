import { Router } from "express";
import productosController from "../../Controllers/Productos";

const router = Router();

//Aquí utilizaremos las controladoras creadas para productos.
router.get("/", productosController.get);

export default router;