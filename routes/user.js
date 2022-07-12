import express from "express";
import { updateCart, signin, signup, getCart, addToCart, deleteInCart } from '../controllers/user.js'
import auth from "../middleware/auth.js";
const router = express.Router()

router.post('/signin', signin)
router.post('/signup', signup)


router.get('/cart/:userId', auth, getCart)
router.post('/add-to-cart', auth, addToCart)
router.post('/update-cart', auth, updateCart)
router.post('/delete-cart', auth, deleteInCart)

export default router