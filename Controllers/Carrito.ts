import { Request, Response } from "express";
import {Server} from "http";
import {Query} from "mongoose";
import {type} from "os";
import carritoDetailsModel from "../Models/Carrito-Detalles";
import carritoModel from "../Models/Carrito";

const carritoController = {

    get: async(req: Request, res: Response) => {
        try
        {
            const obtenerCarrito = await carritoModel.find()
            if(obtenerCarrito)
            {   
                res.status(200).send(obtenerCarrito)
            }else
            {
                res.status(400).send(`No existen carritos registrados en la base de datos.`)
            }
        }
        catch(error)
        {
            res.status(500).send(error)
        }



    },
}

export default carritoController;

