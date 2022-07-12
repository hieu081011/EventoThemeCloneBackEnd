import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name: String,
    type: String,
    overView: String,
    category: String,
    sku: String,
    manufacturer: String,
    price: Number,
    sale: Number,
    size: [String],
    color: String,
    image: [String],
    brand: String,

})

var ProductList = mongoose.model('ProductList', productSchema)
export default ProductList