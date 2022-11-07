import expressRoutes, { Router } from "express";
import productosRoutes from "./Productos";
import carritodetailsRoutes from "./Carrito-Details";
import carritoRoutes from "./Carrito"

//Creación de variable para enrutar los distintos modelos 
//Esto serán las rutas donde nos podremos comunicar con la API
const router = Router();

router.use("/productos", productosRoutes)
router.use("/carrito-details", carritodetailsRoutes)
router.use("/carritolist", carritoRoutes)


export default router;