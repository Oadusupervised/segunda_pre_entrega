import mongoose from 'mongoose'
import {schemaCarts} from '../models/carts.js'

export  class CartManager{
  #cartsDb;
  constructor() {
    this.#cartsDb = mongoose.model("carts", schemaCarts);
  }

  async addCart(cart) {
    const cartsave = await this.#cartsDb.create({
      _id: cart.id,
      nombreProducts: cart.nombreProducts
    });
    return cartsave;
  }
  
  async getProductsInCartById(id) {
    const cart = await this.#cartsDb.findOne({ _id: id }).lean();
    if (!cart) {
      throw new Error("Not Found");
    }
    return cart;
  }
  
  async addProductInCart(cid, pid) {
    const cart = await this.#cartsDb.findOne({ _id: cid });
    if (!cart) {
      throw new Error("Not Found");
    }
    const serchprod = cart.nombreProducts.find(
        //@ts-ignore
      (p) => p._id.toString() === pid
    );
    if (!serchprod) {
        //@ts-ignore
      cart.nombreProducts.push({ product: pid, quantity: 1 });
    } else {
        //@ts-ignore
      serchprod.quantity++;
    }
    await cart.save();
    return serchprod;
  }
  
  async delProductInCart(cid, pid) {
    const cart = await this.#cartsDb.findOne({ _id: cid });
    if (!cart) {
      throw new Error("Not Found");
    }
    const deleter = cart.nombreProducts.filter(
        //@ts-ignore
      (p) => p._id.toString() !== pid
    );
    cart.nombreProducts = deleter;
    await cart.save();
    return deleter;
  }
  
  async updateCart(cid, updcart) {
    const cart = await this.#cartsDb.findOne({ _id: cid });
    if (!cart) {
      throw new Error("Not Found");
    }
    cart.nombreProducts = updcart;
    await cart.save();
  }
  
  async updProductinCart(cid, pid, updquantity) {
    const cart = await this.#cartsDb.findOne({ _id: cid });
    if (!cart) {
      throw new Error("Not Found");
    }
    const serchprod = cart.nombreProducts.find(
        //@ts-ignore
      (p) => p._id.toString() === pid
    );
    if (!serchprod) {
      throw new Error("Not Found");
    }
    if (isNaN(updquantity) || updquantity < 0) {
      throw new Error("Invalid Quantity");
    }
      //@ts-ignore
    serchprod.quantity = updquantity;
    await cart.save();
  }
  
  async delAllProductsInCart(cid) {
    const cart = await this.#cartsDb.findOne({ _id: cid });
    if (!cart) {
      throw new Error("Not Found");
    }
    cart.nombreProducts = [];
    await cart.save();
    return cart;
  }
  
}

export const cartManager = new CartManager()


