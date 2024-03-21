const Blogs = require('../models/blog.model');
const Vaccines = require('../models/vaccine.model');
const Centers = require('../models/center.model');
const Users = require('../models/user.model');
const Bookings = require('../models/booking.model');
const Accounts = require('../models/account.model');
const jwt_decode = require('../services/tokenDecode');
const UserController = {
    getBlogs: async (req, res, next) => {
        await Blogs.find({ status: true }).lean().sort({ createdAt: -1 }).limit(4).then(blogs => {
            return res.status(200).json(blogs)
        }).catch(err => {
            console.log(err);
        })
    },
    getBlogPagination: async (req, res, next) => {
        const ITEMS_PER_PAGE = 6;
        const page = +req.query.page || 1; // Trang hiện tại, mặc định là trang 1
        try {
            const totalItems = await Blogs.countDocuments(); // Số lượng sản phẩm trong cơ sở dữ liệu
            const blogs = await Blogs.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE);

            return res.status(200).json({
                blogs: blogs,
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
            });
        } catch (err) {
            res.status(500).json({ msg: 'Lỗi khi tải dữ liệu blog.' });
        }
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
    searchBlog: async (req, res, next) => {
        await Blogs.find({
            "$or": [
                { title: { $regex: req.params.key } },
                { sub_content: { $regex: req.params.key } },
                { hashtags: { $in: [req.params.key] } },
                { author: { $regex: req.params.key } },
            ],
        }).then(async blogs => {
            blogs = blogs.map(blog => {
                return {
                    _id: blog._id,
                    title: blog.title,
                    sub_content: blog.sub_content,
                    author: blog.author,
                    hashtags: blog.hashtags,
                    status: blog.status,
                    cover: blog.cover,
                    slug: blog.slug,
                    createdAt: (blog.createdAt).toLocaleDateString('en-GB'),
                }
            })
            return res.status(200).json(blogs);
        }).catch(err => {
            return res.status(500).json({ msg: 'server error' })
        })
    },
    getDataBlogByTag: async (req, res, next) => {
        try {
            const query = req.params.query;
            // Sử dụng biểu thức chính quy để tìm kiếm các bài blog có chứa thẻ được chỉ định
            const regex = new RegExp(query, 'i'); // 'i' là để tìm kiếm không phân biệt hoa thường
            const blogs = await Blogs.find({ hashtags: regex });
            return res.status(200).json(blogs);
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error(error);
            return res.status(500).json({ message: 'Server Error' });
        }

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
    DataVaccineByCenter: async (req, res, next) => {
        await Vaccines.find().lean().then(vaccines => {
            if (!vaccines) return res.status(404).json({ msg: 'Không Tìm Thấy Vaccine' })
            var data = []
            for (var i = 0; i < vaccines.length; i++) {
                for (var j = 0; j < vaccines[i].centerOf.length; j++) {
                    if (vaccines[i].centerOf[j].cid == req.params.id) {
                        data.push(vaccines[i]);
                    } else {
                        continue;
                    }
                }
            }
            return res.status(200).json(data);
        })
    },
    getAllDataVaccine: async (req, res, next) => {
        Vaccines.find().lean().limit(10).sort({ createdAt: -1 }).then(vaccines => {
            return res.status(200).json(vaccines)
        })
    },
    getVaccinePagination: async (req, res, next) => {
        const ITEMS_PER_PAGE = 6;
        const page = +req.query.page || 1; // Trang hiện tại, mặc định là trang 1
        try {
            const totalItems = await Vaccines.countDocuments(); // Số lượng sản phẩm trong cơ sở dữ liệu
            const vaccines = await Vaccines.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE);

            return res.status(200).json({
                vaccines: vaccines,
                currentPage: page,
                total: totalItems,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
            });
        } catch (err) {
            res.status(500).json({ message: 'Lỗi khi tải dữ liệu sản phẩm.' });
        }
    },
    getVaccineBySlug: async (req, res, next) => {
        const vaccine = await Vaccines.findOne({ slug: req.params.slug });
        let center = vaccine.centerOf;
        const getNameCenter = async (id) => {
            const center = await Centers.findById(id);
            return center.center_name;
        }
        center = await Promise.all(
            center.map(async e => {
                return {
                    cid: e.cid,
                    c_name: await getNameCenter(e.cid)
                }
            })
        )
        const data = {
            vid: vaccine._id.toString(),
            pro_name: vaccine.pro_name,
            center: center
        }
        // console.log(data);
        return res.status(200).json(data);
    },
    getCheckAmountVaccine: async (req, res, next) => {
        let vaccine = await Vaccines.findById(req.params._id);
        let centerOf = vaccine.centerOf;
        centerOf.forEach((item, index) => {
            if (item.cid.toString() === req.params.idCenter) {
                // centerOf[index].amount = parseInt(centerOf[index].amount) + amountBooking;
                return centerOf[index].amount;
            } else {
                return centerOf[index].amount = 0;
            }
        });
        return res.status(200).json(centerOf[0].amount);
    },





    searchVaccine: async (req, res, next) => {
        await Vaccines.find({
            "$or": [
                { pro_name: { $regex: req.params.key } },
                { pro_code: { $regex: req.params.key } },

            ]
        }).then(async vaccines => {
            vaccines = await Promise.all(
                vaccines.map(async vaccine => {
                    return {
                        _id: vaccine._id,
                        slug: vaccine.slug,
                        pro_name: vaccine.pro_name,
                        pro_code: vaccine.pro_code,
                        img: vaccine.img,
                        cover: vaccine.cover,
                        countCenter: vaccine.centerOf.length,
                        detailCenter: await Promise.all((vaccine.centerOf).map((e) =>
                            Centers.findOne({ _id: e.cid }).then(center => {
                                return center ? { center: center.center_name, amount: e.amount } : null
                            })
                        )),
                        detailAmount: (vaccine.centerOf).map((e) => [{ cid: e.cid, amount: e.amount }]),
                        createdAt: vaccine.createdAt.toLocaleString('en-GB')
                    }
                })
            )
            return res.status(200).json(vaccines)
        }).catch(err => {
            return res.status(500).json({ msg: 'server err' })
        })
    },
    getHistoryVaccine: async (req, res, next) => {
        try {
            const token = jwt_decode.decodeToken(req.headers['authorization']);
            const account = await Accounts.findById(token._id);
            const user = await Users.findOne({ email: account.email });
            const getNameVaccine = async (vid) => {
                let vaccine = await Vaccines.findById(vid);
                return vaccine.pro_name;
            }
            const getNameCenter = async (cid) => {
                let center = await Centers.findById(cid);
                return center.center_name
            }
            const getSlugVaccine = async (vid) => {
                let vaccine = await Vaccines.findById(vid);
                return vaccine.slug
            }
            let data = user.vac_history;
            data = await Promise.all(
                data.map(async (d) => {
                    return {
                        dateBooking: new Date(d.dateBooking).toLocaleDateString('en-GB'),
                        timeBooking: d.timeBooking,
                        v_name: await getNameVaccine(d.vid),
                        c_name: await getNameCenter(d.cid),
                        slug: await getSlugVaccine(d.vid),
                        status: d.status
                    }
                })
            )
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ msg: 'server error' })
        }
    },
    getCurrentBooking: async (req, res, next) => {
        try {
            const token = jwt_decode.decodeToken(req.headers['authorization']);
            const account = await Accounts.findById(token._id);
            const user = await Users.findOne({ email: account.email });
            const getNameVaccine = async (vid) => {
                let vaccine = await Vaccines.findById(vid);
                return vaccine.pro_name;
            }
            const getNameCenter = async (cid) => {
                let center = await Centers.findById(cid);
                return center.center_name
            }
            const getSlugVaccine = async (vid) => {
                let vaccine = await Vaccines.findById(vid);
                return vaccine.slug
            }
            let data = user.currentSchedule;
            data = await Promise.all(
                data.map(async (d) => {
                    return {
                        dateBooking: new Date(d.dateBooking).toLocaleDateString('en-GB'),
                        timeBooking: d.timeBooking,
                        v_name: await getNameVaccine(d.vid),
                        c_name: await getNameCenter(d.cid),
                        slug: await getSlugVaccine(d.vid),
                        status: d.status,
                        _id: d._id
                    }
                })
            )
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ msg: 'server error' })
        }
    },
    getCancelBooking: async (req, res, next) => {
        try {
            const amountBooking = 1;
            let booking = await Bookings.findById(req.params.id)
            let vaccine = await Vaccines.findById(booking.vid);
            let centerOf = vaccine.centerOf;
            centerOf.forEach((item, index) => {
                if (item.cid.toString() === booking.cid) {
                    centerOf[index].amount = parseInt(centerOf[index].amount) + amountBooking;
                }
            });
            await Vaccines.findByIdAndUpdate(booking.vid, { centerOf: centerOf });
            await Bookings.findByIdAndUpdate(req.params.id, { isCancel: true });
            let user = await Users.findOne({ email: booking.email });
            let updateDataSchedule = (user.currentSchedule).filter(e => e._id != req.params.id);
            await Users.findByIdAndUpdate(user._id, { currentSchedule: updateDataSchedule });
            return res.status(200).json({ msg: 'Huỷ Lịch Thành Công' });
        } catch (error) {
            return res.status(500).json({ msg: 'Huỷ Lịch Thất Bại' });
        }
    },
    postReportDisease: async (req, res, next) => {
        const token = jwt_decode.decodeToken(req.headers['authorization']);
        if (!token) {
            let data = {
                email: req.body.email ? req.body.email : '',
                phone: req.body.phone ? req.body.phone : '',
                desc: req.body.desc,
                isComplete: '1'
            }
            let center = await Centers.findById(req.body.center);
            await Centers.findByIdAndUpdate(req.body.center, { $push: { reportDisease: data } }, { new: true }).then(center => {
                return res.status(200).json({ msg: 'Báo Cáo Dịch Bệnh Thành Công !', desc: `Cảm ơn ${data.email ? data.email : data.phone} đã báo cáo dịch bệnh. Thông tin đã được gửi đến trung tâm, vui lòng chờ phản hồi` })
            }).catch(err => {
                return res.status(500).json({ msg: 'Có lỗi xảy ra' })
            })
        } else {
            let user = await Accounts.findById(token._id);
            let data = {
                email: user.email,
                phone: user.phone,
                desc: req.body.desc,
                isComplete: '1'
            }
            let center = await Centers.findById(req.body.center);
            await Centers.findByIdAndUpdate(req.body.center, { $push: { reportDisease: data } }, { new: true }).then(center => {
                return res.status(200).json({ msg: 'Báo Cáo Dịch Bệnh Thành Công !', desc: `Cảm ơn ${data.email} đã báo cáo dịch bệnh. Thông tin đã được gửi đến trung tâm, vui lòng chờ phản hồi` })
            }).catch(err => {
                return res.status(500).json({ msg: 'Có lỗi xảy ra' })
            })
        }
    }
}
module.exports = UserController