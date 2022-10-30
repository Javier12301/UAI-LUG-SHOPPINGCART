import expressRoutes, { Router } from "express";
import productosRoutes from "./Productos";

//Creación de variable para enrutar los distintos modelos 
//Esto serán las rutas donde nos podremos comunicar con la API
const router = Router();

router.use("/Productos", productosRoutes)


export default Router;