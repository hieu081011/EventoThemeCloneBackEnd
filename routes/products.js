import express from "express";
import { getProduct, getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/products.js'
import auth from "../middleware/auth.js";
const router = express.Router()
router.get('/:id', getProduct)
router.get('/', getProducts)
// router.post('/', auth, createProduct)
// router.patch('/:id', auth, updateProduct)
// router.delete('/:id', auth, deleteProduct)




export default router
