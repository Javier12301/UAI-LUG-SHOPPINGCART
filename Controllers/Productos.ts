import { Request, Response} from "express";
import productosModel from "../Models/Productos";

//Controladora de Productos
const productosController = {
    //Req tendrá la información sobre la petición HTTP del Evento
    //Res devolverá la repuesta HTTP deseada.
    get: async (req: Request, res: Response) => {
        try
        {
            //Obtener Productos
            const verProductos = await productosModel.find()
            res.status(200).send(verProductos)
        }
        catch (error)
        {
            //Código de error 500
            res.status(500).send(error)
        }
    },
    //Para agregar productos
    add: async (req: Request, res: Response) => {
        try 
        {
            const producto = new productosModel({...req.body})
            await producto.save()
            res.send(producto)
        } catch (error) {
            //Los valos de status son los tipos de errores que nosotros queremos que salga -> 500 es error de servidor
            res.status(500).send(error)
        }
    },
}
//Exportar los controladores
export default productosController