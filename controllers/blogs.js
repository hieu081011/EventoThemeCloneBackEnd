import mongoose from "mongoose";
import BlogList from "../models/blogModel.js"


export const getBlog = async (req, res) => {
    const { id } = req.params;

    try {

        const blog = await BlogList.findById(id)
        res.status(200).json(blog)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const getBlogs = async (req, res) => {
    const { page } = req.query;

    try {

        if (page == 'all') {
            const blogs = await BlogList.find()
            res.status(200).json({ data: blogs })
            return;
        }
        const LIMIT = 10;
        const startIndex = (Number(page - 1)) * LIMIT; //get the start index of every page
        const total = await BlogList.countDocuments({});

        const blogs = await BlogList.find().limit(LIMIT).skip(startIndex);

        res.status(200).json({ data: blogs, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
    } catch (error) {
        res.status(404).json({ message: error.message })
    }

}
export const getBlogsBySearch = async (req, res) => {
    const { id: searchParams } = req.params

    try {
        const title = new RegExp(searchParams, 'i')
        const blogs = await BlogList.find({ $or: [{ title }, { tags: title }] })
        res.json(blogs)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const createBlog = async (req, res) => {
    const blog = req.body;
    const newBlog = new BlogList(blog)
    try {
        await newBlog.save();
        res.status(201).json(newBlog)

    } catch (error) {
        res.status(409).json({ message: error.message })
    }
}

export const updateBlog = async (req, res) => {
    const { id: _id } = req.params
    const blog = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No blog with that id')

    const updatedBlog = await BlogList.findByIdAndUpdate(_id, { ...blog, _id }, { new: true })

    res.json(updatedBlog)
}

export const deleteBlog = async (req, res) => {
    const { id: _id } = req.params

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No blog with that id')

    await BlogList.findByIdAndRemove(_id)
    res.json({ message: 'Deleted' })
}