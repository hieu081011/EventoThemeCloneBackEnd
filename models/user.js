import mongoose from "mongoose";
import ProductList from './productModel.js'

const userSchema = mongoose.Schema({
    fisrtName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    id: {
        type: String
    },
    cart: {
        items: [{
            productId: {
                type: mongoose.Types.ObjectId,
                ref: 'ProductList',
                required: true
            },
            qty: {
                type: Number,
                required: true
            },
            name: {
                type: String,

            },
            price: {
                type: Number,

            },
            image: {
                type: Array,

            },
            type: {
                type: String,
            }
        }],
        totalPrice: {
            type: Number,
            default: 0,
        }
    },
    name: {
        type: String
    }
})




userSchema.methods.addToCart = async function (productId, addNumber = 1) {
    const product = await ProductList.findById(productId)
    if (product) {
        const cart = this.cart;
        const isExisting = cart.items.findIndex(objInItems => new String(objInItems.productId).trim() === new String(product._id).trim())
        if (isExisting >= 0) {
            cart.items[isExisting].qty += addNumber
        }
        else {
            cart.items.push({ productId: product._id, qty: addNumber, name: product.name, image: product.image, price: product.price, type: product.type })
        }
        // update total price after add
        const sum = await cart.items.reduce((prevValue, currentValue) => prevValue + currentValue.price * currentValue.qty, 0)
        cart.totalPrice = sum
        this.save()
        return cart

    }
};

userSchema.methods.removeFromCart = async function (productId) {
    const cart = this.cart;
    const isExisting = await cart.items.findIndex(objInItems => new String(objInItems.productId).trim() === new String(productId).trim())
    if (isExisting >= 0) {
        cart.items.splice(isExisting, 1);


    }
    // update total price after remove
    const sum = await cart.items.reduce((prevValue, currentValue) => prevValue + currentValue.price * currentValue.qty, 0)
    cart.totalPrice = sum
    this.save()
    return cart
}

userSchema.methods.calTotalPrice = async function () {
    const cart = this.cart
    if (Array.isArray(cart.items)) {
        const sum = await cart.items.reduce((prevValue, currentValue) => prevValue + currentValue.price * currentValue.qty, 0)
        cart.totalPrice = sum
        this.save()
        return cart
    }

}

var User = mongoose.model("User", userSchema)
export default User