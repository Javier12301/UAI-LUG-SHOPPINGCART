import { Console, info } from "console";
import { Request, Response} from "express";
import { type } from "os";
import carritoModel from "../models/carrito";
//Para poder obtener los productos de la base de datos, deberé importar el modelo de producto
import productosModel from "../Models/Productos";


const carritoController = {
        //Req tendrá la información sobre la petición HTTP del Evento
        //Res devolverá la repuesta HTTP deseada.   
        get: async (req: Request, res: Response) => {
            try
            {
                //Obtener Productos
                const buscarProductos = await carritoModel.find()
                //Se mostrará la lista de productos en el carrito
                res.status(200).send(buscarProductos)
            }
            catch (error)
            {
                //Código de error 500
                res.status(500).send(error)
            }
        },

        add: async (req: Request, res: Response) => {
            try
            {
                //Producto que se desea agregar, para agregar un producto se deberá escribir desde body
                const buscarProductos = await productosModel.findOne({Nombre_Producto: req.body.Nombre_Producto});
                
                //Revisar si existe el producto antes de agregarlo
                if(buscarProductos?.Nombre_Producto != undefined || buscarProductos?.Nombre_Producto != null){
                //OperacionesCART es la cantidad de productos que se quiuere tener ahora y también tendrá el precio que se obtendrá de la base de datos productos
                const OperacionesCART = {Cantidad: req.body.Cantidad, Precio: buscarProductos.Precio}
                if(OperacionesCART.Cantidad <= buscarProductos.Cantidad ){
                    //Si se cumple la condición, se agregará el producto y se descontará la cantidad de productos del model producto                   
                    //La variable TotalPrecio guardará el nuevo precio según la cantidad de productos ingresados
                    const TotalPrecio = OperacionesCART.Precio * OperacionesCART.Cantidad;
                    //La variable TotalPrecio pondrá el nuevo precio del producto en el carrito
                    const addProducto = new carritoModel({Nombre_Producto: buscarProductos?.Nombre_Producto, Cantidad: req.body.Cantidad, Precio: TotalPrecio}); 
                    await addProducto.save();
                    //Actualizar productos // La variable TotalStock guardará el stock total que quedo en la base de datos de Productos
                    const TotalStock = buscarProductos.Cantidad - OperacionesCART.Cantidad;
                    //Para comprobar sí es 0 el Stock, sí es 0 se borrará el producto de la base de datos
                    if(TotalStock == 0)
                    {
                        buscarProductos.delete();
                    }else{
                        buscarProductos.Cantidad = TotalStock;
                        //Se mandará también un mensaje de que se encuentra en carrito
                        buscarProductos.En_Carrito = true;
                        buscarProductos.save();
                    }                              
                    res.status(200).send(addProducto);
                    }else
                    {
                        res.status(400).send(`No se puede agregar el producto porque el producto ${buscarProductos.Nombre_Producto} no tiene stock suficiente`);
                    }             
                }else{
                    res.status(404).send(`El producto ${buscarProductos?.Nombre_Producto} no existe en la base de datos.`)
                //HTTP STATUS NOT FOUND
                }
            }
            catch(error)
            {
                res.status(500).send(error);
            }
            
        },

        delete: async (req: Request, res: Response) => {
            try
            {
                //Buscar el producto a eliminar del carrito con parametros
                const BuscarProducto = await carritoModel.findOne({Nombre_Producto: req.params.Nombre_Producto})
                //Antes de eliminarlo creo también una variable que conecta con la base de datos de Producto
                const Productos = await productosModel.findOne({... req.params})
                //Este if sirve para comprobar si existe el producto deseado y también existe en la base de datos de Producto
                if(BuscarProducto?.Nombre_Producto != undefined && Productos?.Nombre_Producto != undefined){
                //Creo la variable del producto del carrito que se está por eliminar para devolver el stock en la base de datos de Producto
                    const StockCarrito = {Cantidad: BuscarProducto?.Cantidad}
                    //Guardo el stock que tiene almacenado la base de datos de Producto
                    const StockProductos = {Cantidad: Productos?.Cantidad}
                    //Ahora creo una variable que guardará el stock de ProductoCarrito y sumará ese Stock con el Stock de la base de datos de Producto
                    const TotalStock = StockCarrito.Cantidad + StockProductos.Cantidad
                    const productoNombre = await carritoModel.findOneAndDelete({Nombre_Producto: req.params.Nombre_Producto})
                    //Una vez eliminado la base de datos, se guardará los stock sumados a la base de datos de PRODUCTOS
                    Productos.Cantidad = TotalStock;
                    Productos.save()
                    res.status(200).send(`El producto ${BuscarProducto.Nombre_Producto} se elimino con exito del carrito y \nse devolvió el stock del carrito a la base de datos de Productos`);                         
                //Sí esta condiciíon se activa es porque existe el producto en la base de datos Carrito pero no en la base de datos Productos
                }else if(BuscarProducto?.Nombre_Producto != undefined && Productos?.Nombre_Producto == undefined && BuscarProducto.Precio != undefined) 
                {
                    //Operaciones Matemáticas para devolver el precio Original
                    const OperacionesCART = {Cantidad: BuscarProducto.Cantidad, Precio: BuscarProducto.Precio}
                    const precioProducto = OperacionesCART.Precio / OperacionesCART.Cantidad;
                    //Volver a crear el producto en la base de datos productos
                    const newProducto = new productosModel({Nombre_Producto: BuscarProducto.Nombre_Producto, Cantidad: BuscarProducto.Cantidad, Precio: precioProducto, En_Carrito: false});
                    newProducto.save();
                    //Ahora borrará el producto del carrito y lo devolverá a la base de datos productos
                    BuscarProducto.delete();
                    res.status(200).send(`El producto ${BuscarProducto.Nombre_Producto} se elimino con exito del carrito y \nse devolvió el stock del carrito a la base de datos de Productos`)
                }else{
                    res.status(404).send(`El producto ${req.params.Nombre_Producto} no existe en la base de datos`);
                }
            }
            catch(error)
            {
                res.status(500);
            }
        },

}


export default carritoController;