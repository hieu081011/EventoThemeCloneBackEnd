import express from "express";
import { getBlog, getBlogs, createBlog, updateBlog, deleteBlog, getBlogsBySearch } from '../controllers/blogs.js'
import auth from "../middleware/auth.js";
const router = express.Router()

router.get('/', getBlogs)
router.get('/:id', getBlog)
router.get('/search/:id', getBlogsBySearch)
// router.post('/', auth, createBlog)
// router.patch('/:id', auth, updateBlog)
// router.delete('/:id', auth, deleteBlog)
export default router;
