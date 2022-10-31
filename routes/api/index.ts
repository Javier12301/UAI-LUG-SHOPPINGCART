import expressRoutes, { Router } from "express";
import productosRoutes from "./Productos";
import carritoRoutes from "./Carrito";

//Creación de variable para enrutar los distintos modelos 
//Esto serán las rutas donde nos podremos comunicar con la API
const router = Router();

router.use("/productos", productosRoutes)
router.use("/carrito", carritoRoutes)


export default router;