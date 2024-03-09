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
                        slug: await getSlugVaccine(d.vid)
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
            let booking = await Bookings.findById(req.params.id)
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
module.exports = UserController