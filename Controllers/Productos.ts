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
             //Aquí se programó para que se escriba en el body todo los datos deseados para agregar
            const producto = new productosModel({...req.body})
            await producto.save()
            res.send(producto)
            res.status(200)
        } catch (error) {
            //Los valos de status son los tipos de errores que nosotros queremos que salga -> 500 es error de servidor
            res.status(500).send(error)
        }
    },

    //Para eliminar los productos
    delete: async (req: Request, res: Response) => {
        try
        {
            //Aquí se programó para que sólo se escriba el parametro que se desea eliminar
            const verProducto = await productosModel.findOne({... req.params})
            //Revisará sí existe el producto deseado
            if(verProducto?.Nombre_Producto != undefined){
                const productoNombre = await productosModel.findOneAndDelete({... req.params});
                res.send(`Se elimino ${productoNombre?.Nombre_Producto} y sus respectivos valores de la base de datos.`);
                res.status(200);
            }else{
                res.send(`El producto ${verProducto} no existe en la base de datos.`)
                //HTTP STATUS NOT FOUND
                res.status(404);
            }
        }
        catch(error)
        {
            res.status(500);
        }
    },

    
}
//Exportar los controladores
export default productosController