import mongoose from 'mongoose'

const blogSchema = mongoose.Schema({
    title: String,
    listContent: String,
    detailContent: String,
    tags: [String],
    image: String,
    date: String,
})

var BlogList = mongoose.model('BlogList', blogSchema)
export default BlogList

