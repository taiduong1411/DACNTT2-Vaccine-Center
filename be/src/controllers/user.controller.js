const Blogs = require('../models/blog.model');
const Vaccines = require('../models/vaccine.model');
const Centers = require('../models/center.model');
const UserController = {
    getBlogs: async (req, res, next) => {
        await Blogs.find({ status: true }).lean().sort({ createdAt: -1 }).limit(4).then(blogs => {
            return res.status(200).json(blogs)
        })
    },
    getBlogBySlug: async (req, res, next) => {
        // console.log(req.params.slug);
        await Blogs.findOne({ slug: req.params.slug }).then(blog => {
            if (!blog) return res.status(400).json({ msg: 'Blog Không Tồn Tại' });
            blog = {
                ...blog._doc,
                createdAt: (blog.createdAt).toLocaleDateString('en-GB'),
                updatedAt: (blog.updatedAt).toLocaleDateString('en-GB')
            }
            return res.status(200).json(blog)
        }).catch(err => {
            return res.status(500).json({ msg: 'server error' })
        })
    },
    getDataVaccineDetail: async (req, res, next) => {
        await Vaccines.findOne({ slug: req.params.slug }).then(vac => {
            return res.status(200).json(vac)
        })
    },
    getDataCenter: async (req, res, next) => {

        await Centers.find().lean().then(centers => {
            if (!centers) return res.status(404).json({ msg: 'Không Tìm Thấy Trung Tâm' })
            centers = centers.map(center => {
                return {
                    _id: center._id,
                    center_name: center.center_name,
                }
            })
            return res.status(200).json(centers)
        })
    },
    getDataVaccine: async (req, res, next) => {
        await Vaccines.find().lean().limit(4).sort({ createdAt: -1 }).then(vaccines => {
            if (!vaccines) return res.status(404).json({ msg: 'Không Tìm Thấy Vaccine' })
            return res.status(200).json(vaccines)
        })
    },
}
module.exports = UserController