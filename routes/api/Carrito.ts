import { Router } from "express";
import { resolveModuleNameFromCache } from "typescript";
import carritoController from "../../Controllers/Carrito";

const router = Router();

//Get
router.get("/", carritoController.get);


export default router;