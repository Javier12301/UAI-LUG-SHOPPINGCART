import { Request, Response} from "express";
import carritoModel from "../models/carrito";

const carritoController = {
        //Req tendrá la información sobre la petición HTTP del Evento
        //Res devolverá la repuesta HTTP deseada.
        get: async (req: Request, res: Response) => {
            try
            {
                //Obtener Productos
                const verProductos = await carritoModel.find()
                res.status(200).send(verProductos)
            }
            catch (error)
            {
                //Código de error 500
                res.status(500).send(error)
            }
        },
}

export default carritoController;