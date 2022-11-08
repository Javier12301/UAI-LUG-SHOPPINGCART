import { Console, info } from "console";
import { Request, Response} from "express";
import { Server } from "http";
import { Query } from "mongoose";
import { type } from "os";
import carritoDetallesModel from "../Models/Carrito-Detalles";
//Para poder obtener los productos de la base de datos, deberé importar el modelo de producto
import productosModel from "../Models/Productos";
import carritoModel from "../Models/Carrito";
import { getRandomValues, randomBytes } from "crypto";
import Carrito from "../Models/Carrito";

const carrito_DetailsController = {
        //Req tendrá la información sobre la petición HTTP del Evento
        //Res devolverá la repuesta HTTP deseada.   
    
        get: async (req: Request, res: Response) => {
            try
            {
                const existeCarrito = await carritoModel.find()
                if(existeCarrito)
                {
                //Obtener Productos
                const buscarProductos = await carritoDetallesModel.find()
                //Se mostrará la lista de productos en el carrito
                res.status(200).send(buscarProductos)
                }else
                {
                    //Creará el carrito y se podrá operar
                   crearCarrito()
                   res.status(200).send(`Se creo un carrito.`)
                }
               
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
                const existeCarrito = await carritoModel.findOne({Nombre_Carrito: "Carrito"})
                                    //Consultas mongoose
                if(!existeCarrito)
                {
                    crearCarrito();
                }
                
                
                //Revisar si existe el producto antes de agregarlo
                if(buscarProductos?.Nombre_Producto && existeCarrito){
                //OperacionesCART es la cantidad de productos que se quiuere tener ahora y también tendrá el precio que se obtendrá de la base de datos productos
                const OperacionesCART = {Cantidad: req.body.Cantidad, Precio: buscarProductos.Precio}
                if(OperacionesCART.Cantidad <= buscarProductos.Cantidad ){
                    //Si se cumple la condición, se agregará el producto y se descontará la cantidad de productos del model producto                   
                    //La variable TotalPrecio guardará el nuevo precio según la cantidad de productos ingresados
                    const TotalPrecio = getPrecioTOTAL(OperacionesCART.Precio, OperacionesCART.Cantidad);
                    //La variable TotalPrecio pondrá el nuevo precio del producto en el carrito
                    const addProducto = new carritoDetallesModel({Nombre_Producto: buscarProductos?.Nombre_Producto, Cantidad: req.body.Cantidad, Precio: TotalPrecio}); 
                    await addProducto.save();
                    //Actualizar productos // La variable TotalStock guardará el stock total que quedo en la base de datos de Productos
                    const stockRestante = getstockRestante(OperacionesCART.Cantidad, buscarProductos.Cantidad);
                    //carritoLenght obtenemos el tamaño del array
                    const carritoLenght = existeCarrito.Carrito_Details.length
                    //Para comprobar sí es 0 el Stock, sí es 0 se borrará el producto de la base de datos
                    if(stockRestante == 0)
                    {
                        
                        existeCarrito?.Carrito_Details.push(addProducto)
                        existeCarrito.Precio_Total = getPreciocarritoList(existeCarrito.Precio_Total, TotalPrecio);
                        existeCarrito.save();
                        buscarProductos.delete();
                        
                    }else{
                        buscarProductos.Cantidad = stockRestante;
                        buscarProductos.save();
                        existeCarrito?.Carrito_Details.push(addProducto)
                        existeCarrito.Precio_Total = getPreciocarritoList(existeCarrito.Precio_Total, TotalPrecio);
                        existeCarrito.save();
                    }                            
                    //COndicionales para subir en array
                    res.status(200).send(addProducto);
                    }else
                    {
                        res.status(400).send(`No se puede agregar el producto porque el producto ${req.body.Nombre_Producto}\nno tiene stock suficiente.`);
                    }             
                }else{
                    res.status(404).send(`El producto ${req.body.Nombre_Producto} no existe en la base de datos.`)
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
                const BuscarProducto = await carritoDetallesModel.findOne({Nombre_Producto: req.params.Nombre_Producto})
                //Antes de eliminarlo creo también una variable que conecta con la base de datos de Producto
                const Productos = await productosModel.findOne({Nombre_Producto: req.params.Nombre_Producto})
                const existeCarrito = await carritoModel.findOne({Nombre_Carrito: "Carrito"})
                if(!existeCarrito)
                {
                    crearCarrito()
                }
                
                //Este if sirve para comprobar si existe el producto deseado y también existe en la base de datos de Producto
                if(BuscarProducto?.Nombre_Producto && Productos?.Nombre_Producto){
                //Creo la variable del producto del carrito que se está por eliminar para devolver el stock en la base de datos de Producto
                    const StockCarrito = {Cantidad: BuscarProducto?.Cantidad}
                    //Guardo el stock que tiene almacenado la base de datos de Producto
                    const StockProductos = {Cantidad: Productos?.Cantidad}
                    //Ahora creo una variable que guardará el stock de ProductoCarrito y sumará ese Stock con el Stock de la base de datos de Producto
                    const TotalStock = getCantidadTOTAL(StockCarrito.Cantidad, StockProductos.Cantidad);
                    const productoNombre = await carritoDetallesModel.findOneAndDelete({Nombre_Producto: req.params.Nombre_Producto})
                    //Una vez eliminado la base de datos, se guardará los stock sumados a la base de datos de PRODUCTOS
                    Productos.Cantidad = TotalStock;
                    
                    if(existeCarrito && BuscarProducto.Precio)
                    {
                        //Eliminar valores del array
                        const deleteProductoArray = existeCarrito.Carrito_Details.filter((BuscarProducto => BuscarProducto.Nombre_Producto != req.params.Nombre_Producto))
                        existeCarrito.Carrito_Details = deleteProductoArray;
                        existeCarrito.Precio_Total = existeCarrito.Precio_Total - BuscarProducto.Precio
                        existeCarrito.save();
                    }
                    Productos.save()
                    res.status(200).send(`El producto ${BuscarProducto.Nombre_Producto} se elimino con exito del carrito y \nse devolvió el stock del carrito a la base de datos de Productos`);                         
                //Sí esta condiciíon se activa es porque existe el producto en la base de datos Carrito pero no en la base de datos Productos
                }else if(BuscarProducto?.Nombre_Producto && !Productos?.Nombre_Producto && BuscarProducto.Precio) 
                {
                    //Operaciones Matemáticas para devolver el precio Original
                    const OperacionesCART = {Cantidad: BuscarProducto.Cantidad, Precio: BuscarProducto.Precio}
                    const precioProducto = getPrecio(OperacionesCART.Precio, OperacionesCART.Cantidad);
                    //Volver a crear el producto en la base de datos productos
                    const newProducto = new productosModel({Nombre_Producto: BuscarProducto.Nombre_Producto, Cantidad: BuscarProducto.Cantidad, Precio: precioProducto});
                    newProducto.save();
                    //Actualizar array
                    if(existeCarrito)
                    {
                        //Eliminar valores del array
                        const deleteProductoArray = existeCarrito.Carrito_Details.filter((BuscarProducto => BuscarProducto.Nombre_Producto != req.params.Nombre_Producto))
                        existeCarrito.Carrito_Details = deleteProductoArray;
                        existeCarrito.Precio_Total = existeCarrito.Precio_Total - BuscarProducto.Precio
                        existeCarrito.save();
                    }
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

        put: async (req: Request, res: Response) => {
            try
            {
                //Se obtendrá el producto de la base de datos del carrito
                const obtenerProductoCART = await carritoDetallesModel.findOne({Nombre_Producto: req.body.Nombre_Producto})
                //Se obtendrá el producto de la base de datos de producto
                const obtenerProducto = await productosModel.findOne({Nombre_Producto: req.body.Nombre_Producto})
                //El condicional este nos dirá si existen los dos productos en sus respectivas base de datos
                const existeCarrito = await carritoModel.findOne({Nombre_Carrito: "Carrito"})
                if(!existeCarrito)
                {
                    crearCarrito();
                }

                if(obtenerProductoCART && obtenerProducto)
                {
                    //Obtenemos el cantidadTOTAL
                    const stockTOTAL = getCantidadTOTAL(obtenerProductoCART?.Cantidad, obtenerProducto?.Cantidad)
                    //Obtenemos el precio del producto, no el precio del producto en el carrito 
                    const precioProducto = obtenerProducto?.Precio;
                    //Obtenemos la nueva cantidad que se quiere modificar
                    const nuevaCantidad = {Cantidad: req.body.Cantidad}
                    //Obtenemos el stock restante que será devuelto a la base de datos de producto
                    const stockRestante = getstockRestante(nuevaCantidad.Cantidad, stockTOTAL)
                     //Crear una variable para guardar el precio antiguo
                    const precioCARTAntiguo = obtenerProductoCART.Precio;
                    //En el siguiente condicional, se comprobará que la cantidad nueva de productos no sea negativa
                    //También si el precio del producto del carrito existe y también el precio del producto de la base de datos
                    if(stockRestante >= 0 && precioProducto && existeCarrito && obtenerProductoCART && precioCARTAntiguo)
                    {
                        
                     if(nuevaCantidad.Cantidad != 0)
                     {
                        //Sí stock restante es 0 se borrará el producto de la base de datos
                        if(stockRestante == 0)
                        {
                            obtenerProducto?.delete();
                        }else if(obtenerProducto?.Cantidad != null)
                        {
                            obtenerProducto.Cantidad = stockRestante
                            obtenerProducto.save();
                        }
                       
                        obtenerProductoCART.Cantidad = nuevaCantidad.Cantidad
                        obtenerProductoCART.Precio = precioProducto * nuevaCantidad.Cantidad;
                        obtenerProductoCART.save();
                        //Actualizar Array
                        const index = existeCarrito.Carrito_Details.findIndex((producto) => {
                            return producto.Nombre_Producto == obtenerProductoCART.Nombre_Producto
                        });
                        const updateArray = existeCarrito.Carrito_Details.splice(index, 1)
                        existeCarrito.Carrito_Details.push(obtenerProductoCART);
                        //Comprobar si existe solo un producto en el carritp
                        existeCarrito.Precio_Total = existeCarrito.Precio_Total + obtenerProductoCART.Precio - precioCARTAntiguo 
                        existeCarrito.save();
                        res.status(200).send(`Se actualizo con exito el producto del carrito:\n* ${req.body.Nombre_Producto}\n* Cantidad: ${nuevaCantidad.Cantidad}\n\n`)
                     }
                     else
                      {
                        if(existeCarrito && obtenerProductoCART.Precio)
                        {
                        //Eliminar valores del array
                           
                        existeCarrito.Carrito_Details = existeCarrito.Carrito_Details.filter((producto) => {
                            return producto.Nombre_Producto != obtenerProductoCART.Nombre_Producto
                        })
                        existeCarrito.Precio_Total = existeCarrito.Precio_Total - obtenerProductoCART.Precio
                        existeCarrito.save();
                        }           
                        //Se eliminará el producto del carrito sí la nueva cantidad es 0
                        obtenerProducto.Cantidad = stockRestante;
                        obtenerProducto.save();
                        obtenerProductoCART.delete();
                        res.status(200).send(`Se elimino el producto del carrito y se envió el stock restante a \nla base de datos de Productos.`)
                      }    
                        
                    }else
                    {
                        res.status(400).send(`No hay stock suficiente.`);
                    }
                } 
                //El condicional este nos dirá si no existe en la base de datos carrito pero si existe el producto en la base de datos de producto     
                if(!obtenerProductoCART && obtenerProducto)
                {
                    res.status(400).send(`No se puede actualizar, el producto ${req.body.Nombre_Producto} no existe en el carrito.`)
                }
                // El condicional se activa si existe el producto en el carrito pero no en la base de datos de producto          
                if(obtenerProductoCART && !obtenerProducto)
                {
                    //Obtenemos el cantidadTOTAL
                    const stockTOTAL = obtenerProductoCART.Cantidad
                    //Obtenemos el precio del producto, no el precio del producto en el carrito 
                    const precioProducto = getPrecio(obtenerProductoCART.Precio, stockTOTAL)
                    //Obtenemos la nueva cantidad que se quiere modificar
                    const nuevaCantidad = {Cantidad: req.body.Cantidad}
                    //Obtenemos el stock restante que será devuelto a la base de datos de producto
                    const stockRestante = getstockRestante(nuevaCantidad.Cantidad, stockTOTAL)
                    const precioCARTAntiguo = obtenerProductoCART.Precio;
                    //En el siguiente condicional, se comprobará que la cantidad nueva de productos no sea negativa ni 0
                    //También si el precio del producto del carrito existe y también el precio del producto de la base de datos
                    if(stockRestante > 0)
                    {
                        //Sí la nueva cantidad es 0, entonces se borrará el producto de la base de datos y se devolverá todo sus valores a la base de datos productos
                        if(nuevaCantidad.Cantidad == 0 && existeCarrito && obtenerProductoCART.Precio)
                        {
                            const crearProducto = new productosModel({Nombre_Producto: obtenerProductoCART.Nombre_Producto, Cantidad: stockRestante, Precio: precioProducto})
                            crearProducto.save();
                           //Eliminar valores del array
                            existeCarrito.Carrito_Details = existeCarrito.Carrito_Details.filter((producto) => {
                            return producto.Nombre_Producto != obtenerProductoCART.Nombre_Producto
                            })
                            existeCarrito.Precio_Total = existeCarrito.Precio_Total - obtenerProductoCART.Precio
                            existeCarrito.save();
                            obtenerProductoCART.delete();
                            res.status(200).send(`Se elimino el producto ${req.body.Nombre_Producto} del carrito \ny se devolvió el stock a la base de datos Productos.`)
                        } 
                        if (nuevaCantidad.Cantidad > 0 && existeCarrito && obtenerProductoCART.Precio && precioCARTAntiguo)
                        {
                            const crearProducto = new productosModel({Nombre_Producto: obtenerProductoCART.Nombre_Producto, Cantidad: stockRestante, Precio: precioProducto})
                            obtenerProductoCART.Cantidad = nuevaCantidad.Cantidad
                            obtenerProductoCART.Precio = getPrecioTOTAL(precioProducto, nuevaCantidad.Cantidad)
                            crearProducto.save();
                            obtenerProductoCART.save();
                            //Actualizar Array
                            const index = existeCarrito.Carrito_Details.findIndex((producto) => {
                                return producto.Nombre_Producto == obtenerProductoCART.Nombre_Producto
                                });
                                const updateArray = existeCarrito.Carrito_Details.splice(index, 1)
                                existeCarrito.Carrito_Details.push(obtenerProductoCART);
                                //Comprobar si existe solo un producto en el carritp
                                existeCarrito.Precio_Total = existeCarrito.Precio_Total + obtenerProductoCART.Precio - precioCARTAntiguo 
                                existeCarrito.save();
                            res.status(200).send(`Se actualizo con exito el producto del carrito:\n* Producto: ${obtenerProductoCART.Nombre_Producto}\n* Nueva cantidad: ${obtenerProductoCART.Cantidad}\n* Nuevo precio: ${obtenerProductoCART.Precio}\n\nSe devolvió a la base de datos producto:\n* Producto: ${req.body.Nombre_Producto}\n* Stock devuelto: ${stockRestante}`)
                        }                       
                    }else
                    {
                        res.status(400).send(`No se pudo actualizar, debido a que supero la cantidad de stock, el stock total del producto ${obtenerProductoCART.Nombre_Producto} es de: ${obtenerProductoCART.Cantidad}`)
                    }
                }
                if(!obtenerProductoCART && !obtenerProducto)
                {
                    res.status(400).send(`El producto ${req.body.Nombre_Producto} no existe.`)
                }
                
            }
            catch (error)
            {
                res.status(500).send(`Error en el servidor`);
            }
               
        },

}

function getPrecio(precioTOTAL: any, cantidad: any)
{
    //Ecuación utilizada: precio = precioTOTAL/cantidad
    return precioTOTAL/cantidad;
}

function getCantidadTOTAL(cantidad: any, stockRestante: any)
{
    return cantidad + stockRestante;
}

function getstockRestante(nuevaCantidad: any, stockTOTAL: any)
{
    //Ecuación utilizada: stockRestante = stockTOTAL - nuevaCantidad
    return stockTOTAL - nuevaCantidad;
}

function getPrecioTOTAL(precio: any, cantidad: any)
{
    //Ecuación utilizada: precioTOTAL = precio * cantidad
    return precio * cantidad;
}

function crearCarrito()
{
    const newCarrito = new carritoModel({Nombre_Carrito: "Carrito", Carrito_Details: [], Precio_Total: 0}); 
    newCarrito.save();
}

function getPreciocarritoList(precioTOTALCARRITOLIST: any, precioTOTALCARRITODETAILS: any)
{
    return precioTOTALCARRITODETAILS + precioTOTALCARRITOLIST;
}

export default carrito_DetailsController;