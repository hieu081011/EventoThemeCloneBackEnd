import mongoose from "mongoose";
import ProductList from "../models/productModel.js";
export const getProduct = async (req, res) => {
    const { id: _id } = req.params
    try {
        if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No product with that id')
        const product = await ProductList.findById(_id)

        res.status(200).json(product)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}
export const getProducts = async (req, res) => {
    const { page, type, sort, perPage, increase, gt, lt, search } = req.query

    try {
        if (page == 'undefined') {     //get all products if there is no page 

            const products = await ProductList.find()
            res.status(200).json({ data: products });
        }
        else if (search !== 'undefined') {


            const searchQuery = new RegExp(search, 'i')
            const startIndex = (Number(page - 1)) * perPage; //get the start index of every page

            const total = await ProductList.countDocuments({ $or: [{ name: searchQuery }, { category: searchQuery }] });

            const products = await ProductList.find({
                $and: [
                    { price: { $gte: gt, $lte: lt } },
                    { $or: [{ name: searchQuery }, { category: searchQuery }] }
                ]
            }).limit(perPage).skip(startIndex).sort({ [sort]: Number(increase) })

            res.status(200).json({ data: products, currentPage: Number(page), numberOfPages: Math.ceil(total / perPage) });
        }

        else {

            const startIndex = (Number(page - 1)) * perPage; //get the start index of every page

            const total = await ProductList.countDocuments({ $and: [{ type }, { price: { $gte: gt, $lte: lt } }] });


            const products = await ProductList.find({
                $and: [
                    { type },
                    { price: { $gte: gt, $lte: lt } }
                ]
            }).limit(perPage).skip(startIndex).sort({ [sort]: Number(increase) })

            res.status(200).json({ data: products, currentPage: Number(page), numberOfPages: Math.ceil(total / perPage) });
        }
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const createProduct = async (req, res) => {
    const product = req.body;
    const newProduct = new ProductList(product)
    try {
        await newProduct.save();
        res.status(201).json(newProduct)

    } catch (error) {
        res.status(409).json({ message: error.message })
    }
}

export const updateProduct = async (req, res) => {
    const { id: _id } = req.params
    const product = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No product with that id')

    const updatedProduct = await ProductList.findByIdAndUpdate(_id, { ...product, _id }, { new: true })

    res.json(updatedProduct)
}

export const deleteProduct = async (req, res) => {
    const { id: _id } = req.params
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No product with that id')

    await ProductList.findByIdAndRemove(_id)
    res.json({ message: 'Product Deleted' })
}

