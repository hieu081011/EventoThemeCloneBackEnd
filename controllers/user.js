import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import User from '../models/user.js'
import ProductList from '../models/productModel.js'
const secret = 'test'

export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email })

        if (!existingUser) return res.status(404).json({ message: "User doesn't exist!" })

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)

        if (!isPasswordCorrect) return res.status(400).json({ message: 'You have entered wrong password!' })

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, secret, { expiresIn: '1h' })

        res.status(200).json({ result: existingUser, token })
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' })
    }
}
export const signup = async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName } = req.body

    try {

        const oldUser = await User.findOne({ email });

        if (oldUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await User.create({ email: email, password: hashedPassword, name: `${firstName} ${lastName}` });
        console.log(123)
        const token = jwt.sign({ email: result.email, id: result._id }, secret, { expiresIn: "1h" });

        res.status(201).json({ result, token });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' })
    }
}


export const getCart = async (req, res) => {
    const { userId } = req.params

    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(404).send('Not valid id')
        const { cart } = await User.findById(userId)

        res.status(201).json({ cart })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong" })
    }
}

export const addToCart = async (req, res) => {
    const { userId, addNumber, productId } = req.body


    try {
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) return res.status(404).send('Not valid id')

        const user = await User.findById(userId)

        if (!user) res.status(400).json({ message: 'No user with that id' })

        const updatedCart = await user.addToCart(productId, Number(addNumber))

        res.status(200).json({ cart: updatedCart })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong" })
    }
}
export const updateCart = async (req, res) => {
    const { userId, cart } = req.body


    try {
        if (typeof cart !== 'object') return res.status(404).send('Cart must be an object')
        if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(404).send('Not valid id')

        await User.findByIdAndUpdate(
            userId,
            { cart: cart },
            { new: true })
        const user = await User.findById(userId)
        const updatedCart = await user.calTotalPrice()

        res.status(200).json({ cart: updatedCart })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong" })
    }

}
export const deleteInCart = async (req, res) => {
    const { userId, productId } = req.body
    try {
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) return res.status(404).send('Not valid id')

        const user = await User.findById(userId)

        if (!user) res.status(400).json({ message: 'No user with that id' })

        const updatedCart = await user.removeFromCart(productId)

        res.status(200).json({ cart: updatedCart })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" })
    }
}