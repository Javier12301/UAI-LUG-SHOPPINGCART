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

    //Getunique es utilizado para buscar un producto en especifico
    getunique: async (req: Request, res: Response) => {
        try
        {
            const verProductosUnique = await productosModel.findOne({... req.params})
            
            //Sí el producto no existe la API mandará un HTTP STATUS NOT FOUND
            if(verProductosUnique?.Nombre_Producto != undefined)
            {
                res.status(200).send(verProductosUnique)
            }else{
                res.status(404).send(`El producto escrito en los parametros no existe en la base de datos.`);
            }
        }
        catch (error)
        {
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

    //Para eliminar los productos
    delete: async (req: Request, res: Response) => {
        try
        {

        }
    },

    
}
//Exportar los controladores
export default productosController