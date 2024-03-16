const Bookings = require('../models/booking.model');
const Vaccines = require('../models/vaccine.model');
const Centers = require('../models/center.model');
const Doctors = require('../models/doctor.model');
const Accounts = require('../models/account.model');
const Users = require('../models/user.model');
const Blogs = require('../models/blog.model');
const services = require('../services/email');
const jwt_decode = require('../services/tokenDecode');
const slugify = require('slugify');
const moment = require('moment');
const DoctorController = {
    postBooking: async (req, res, next) => {
        await Bookings.findOne({ phone: req.body.phone }).then(async booking => {
            // if (booking) return res.status(300).json({ msg: 'Số Điện Thoại Đã Có Đặt Lịch' })
            const data = {
                email: req.body.email ? req.body.email : '',
                fullname: req.body.fullname ? req.body.fullname : '',
                phone: req.body.phone,
                dateBooking: req.body.dateBooking,
                timeBooking: req.body.timeBooking,
                cid: req.body.center,
                vid: req.body.vaccine
            }
            let vaccine = await Vaccines.findById(data.vid);
            let center = await Centers.findById(data.cid);
            await Bookings(data).save().then(async booking => {
                const token = jwt_decode.decodeToken(req.headers['authorization']);
                const account = await Accounts.findById(token._id);
                const user = await Users.findOne({ email: account.email });
                if (!user) {
                    next();
                } else {
                    const dataCurrent = {
                        ...data,
                        _id: booking._id
                    }
                    await Users.findByIdAndUpdate(user._id, { $push: { currentSchedule: dataCurrent } }, { new: true })
                }
            })
            await services.confirmBooking(data.fullname, data.phone, data.dateBooking, data.timeBooking, center.center_name, vaccine.pro_name, data.email);
            return res.status(200).json({ msg: 'Đặt lịch thành công', desc: `Cảm ơn ${data.email} đã sử dụng dịch vụ tại VNVC. Vui lòng kiểm trai lại email để xem lại thông tin đăng ký. Nếu có bất kì sai sót nào xin liên hệ ngay với chúng tôi !` })
        }).catch(err => {
            console.log(err);
            return res.status(500).json({ msg: 'Hệ Thống Lỗi' })
        })
    },
    getDataBooking: async (req, res, next) => {
        try {
            const token = jwt_decode.decodeToken(req.headers['authorization']);
            let account = await Accounts.findById(token._id);
            let doctor = await Doctors.findOne({ email: account.email });
            let bookings = await Bookings.find({ isCancel: false }).lean();
            let data = bookings.filter(e => e.cid == doctor.centerOf);
            const getNameVaccine = async (vid) => {
                let vaccine = await Vaccines.findById(vid);
                return vaccine.pro_name;
            }
            data = await Promise.all(
                data.map(async (d) => {
                    return {
                        _id: d._id,
                        fullname: d.fullname,
                        email: d.email,
                        phone: d.phone,
                        dateBooking: new Date(d.dateBooking).toLocaleDateString('en-GB'),
                        timeBooking: d.timeBooking,
                        v_name: await getNameVaccine(d.vid),
                        status: d.status
                    }
                })
            )
            return res.status(200).json(data)
        } catch (error) {
            return res.status(200).json({ msg: 'Hệ Thống Lỗi' })
        }
    },
    getDataBookingById: async (req, res, next) => {
        await Bookings.findById(req.params.id).then(booking => {
            return res.status(200).json(booking)
        }).catch(err => {
            return res.status(500).json({ msg: 'Server error' })
        })
    },
    postUpdateBooking: async (req, res, next) => {
        try {
            const booking = await Bookings.findById(req.params.id)
            if (!booking) return res.status(404)
            // if (booking.timeBooking == req.body.timeBooking) return res.status(300).json({ msg: `Ngày ${req.body.dateBooking} vào lúc ${req.body.timeBooking} đã có lịch tiêm. Vui Lòng Chọn Giờ Khác` });
            const data = {
                dateBooking: req.body.dateBooking,
                timeBooking: req.body.timeBooking
            }
            // let timeDb = moment(booking.timeBooking, 'HH:mm');
            // let timePlus30Minutes = timeDb.clone().add(30, 'minutes');
            // let timeEdit = moment(req.body.timeBooking, 'HH:mm');
            // let timeEditAdd30m = timeDb.clone().add(30, 'minutes');
            // timeEditAdd30m = moment(timeEditAdd30m);
            // timeEditAdd30m = timeEditAdd30m.format('HH:mm');
            // if (timeEdit.isAfter(timePlus30Minutes)) {

            // } else {
            //     return res.status(300).json({ msg: `Lúc ${booking.timeBooking} đến ${timeEditAdd30m} đã có lịch tiêm. Vui Lòng Chọn Giờ Khác` })
            // }
            let vaccine = await Vaccines.findById(req.body.vid);
            let center = await Centers.findById(req.body.cid);
            await Bookings.findByIdAndUpdate(req.params.id, data);
            await services.confirmBooking(req.body.fullname, req.body.phone, data.dateBooking, data.timeBooking, center.center_name, vaccine.pro_name, req.body.email);
            return res.status(200).json({ msg: 'Cập Nhật Thành Công' });
        } catch (error) {
            return res.status(500).json({ msg: 'server error' })
        }
    },
    getConfirmBooking: async (req, res, next) => {
        await Bookings.findByIdAndUpdate(req.params.id, { status: true }).then(async booking => {
            const user = await Users.findOne({ email: booking.email });
            if (!user) {
                const data = {
                    email: booking.email,
                    vac_history: [{
                        cid: booking.cid,
                        vid: booking.vid,
                        dateBooking: booking.dateBooking,
                        timeBooking: booking.timeBooking,
                        _id: (booking._id).toString()
                    }]
                }
                await Users(data).save();
            } else {
                const data = {
                    cid: booking.cid,
                    vid: booking.vid,
                    dateBooking: booking.dateBooking,
                    timeBooking: booking.timeBooking,
                    _id: (booking._id).toString()
                }
                let dataSchedule = user.currentSchedule;
                dataSchedule = dataSchedule.filter(i => i._id !== data._id);
                await Users.findByIdAndUpdate(user._id, { $push: { vac_history: data } }, { new: true });
                await Users.findByIdAndUpdate(user._id, { currentSchedule: dataSchedule });
            }
            return res.status(200).json({ msg: 'Xác Nhận Lịch Thành Công' })
        }).catch(err => {
            console.log(err);
            return res.status(500).json({ msg: 'server error' })
        })
    },
    getSearchBooking: async (req, res, next) => {
        try {
            await Bookings.find(
                {
                    "$or": [
                        { email: { $regex: req.params.key } },
                        { fullname: { $regex: req.params.key } },
                        { phone: { $regex: req.params.key } },
                        { dateBooking: { $regex: req.params.key } },
                        { timeBooking: { $regex: req.params.key } },
                    ],
                    isCancel: false
                }
            ).then(async bookings => {
                // if (!bookings) return res.status(300).json({ msg: 'Không có kết quả tìm kiếm' })
                const getNameVaccine = async (vid) => {
                    let vaccine = await Vaccines.findById(vid);
                    return vaccine.pro_name;
                }
                let data = await Promise.all(
                    bookings.map(async (d) => {
                        return {
                            _id: d._id,
                            fullname: d.fullname,
                            email: d.email,
                            phone: d.phone,
                            dateBooking: new Date(d.dateBooking).toLocaleDateString('en-GB'),
                            timeBooking: d.timeBooking,
                            v_name: await getNameVaccine(d.vid),
                            status: d.status
                        }
                    })
                )
                return res.status(200).json(data)
            })
        } catch (error) {
            return res.status(500).json({ msg: 'error' })
        }
    },
    // Vaccine
    getAllVaccines: async (req, res, next) => {
        await Vaccines.find().lean().sort({ createdAt: -1 }).then(async vaccines => {
            if (!vaccines) return res.status(400).json({ msg: 'Chưa có vaccine' })
            vaccines = await Promise.all(
                vaccines.map(async vaccine => {
                    return {
                        ...vaccine,
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
            // console.log(vaccines);
            return res.status(200).json(vaccines)
        })
    },
    addVaccine: async (req, res, next) => {
        try {
            const data = {
                pro_name: req.body.pro_name,
                pro_code: req.body.pro_code,
                desc: req.body.desc,
                img: req.body.img,
                cover: req.body.cover,
                centerOf: req.body.centerOf
            }
            await Vaccines(data).save();
            return res.status(200).json({ msg: 'Thêm Vaccin Thành Công' });
        } catch (error) {
            return res.status(500).json({ msg: 'Có lỗi xảy ra' })
        }
    },
    delVaccine: async (req, res, next) => {
        const _id = req.params._id;
        try {
            await Vaccines.findByIdAndDelete(_id);
            return res.status(200).json({ msg: 'Xoá Thành Công' })
        } catch (error) {
            return res.status(500).json({ msg: 'Xoá Thất Bại' });
        }
    },
    getVaccineById: async (req, res, next) => {
        const _id = req.params._id;
        try {
            await Vaccines.findOne({ _id: _id }).then(async vaccine => {
                if (!vaccine) return res.status(400).json({ msg: 'Sản Phẩm Không Tồn Tại' });

                vaccine = await Promise.all(
                    [vaccine].map(async (vaccine) => {
                        return {
                            _id: vaccine._id,
                            pro_name: vaccine.pro_name,
                            pro_code: vaccine.pro_code,
                            desc: vaccine.desc,
                            cover: vaccine.cover,
                            img: vaccine.img,
                            centerOfByName:
                                await Promise.all((vaccine.centerOf).map((e) =>
                                    Centers.findOne({ _id: e.cid }).then(center => {
                                        return center ? { center: center.center_name, amount: e.amount } : null
                                    })
                                )),
                            centerOfById: (vaccine.centerOf).map((e) => {
                                return {
                                    cid: e.cid,
                                    amount: e.amount
                                }
                            })
                        }
                    })
                )
                return res.status(200).json(vaccine)
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: 'server error' })
        }
    },
    updateVaccineById: async (req, res, next) => {
        const _id = req.params._id;
        // console.log(_id);
        try {
            await Vaccines.findOne({ _id: _id }).then(async vaccine => {
                if (!vaccine) return res.status(400).json({ msg: 'Sản Phẩm Không Tồn Tại' });
                const data = {
                    ...req.body,
                    slug: slugify(req.body.pro_name, {
                        lower: true,
                    })
                }
                try {
                    await Vaccines.findByIdAndUpdate(_id, data);
                    return res.status(200).json({ msg: 'Cập Nhật Thành Công' });
                } catch (error) {
                    return res.status(300).json({ msg: 'Mã Sản Phẩm Đã Tồn Tại' });
                }
            })
        } catch (error) {
            console.log(error);
            return res.status(300).json({ msg: 'Có Lỗi Xảy Ra' })
        }
    },
    getSearchVaccine: async (req, res, next) => {
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
    getVaccineByCode: async (req, res, next) => {
        await Vaccines.findOne({ pro_code: req.params.pro_code }).then(vac => {
            return res.status(200).json(vac)
        })
    },
    updateDetailByCode: async (req, res, next) => {
        const context = req.params.context;
        // console.log(req.body);
        const vaccine = await Vaccines.findOne({ pro_code: req.params.pro_code });
        if (!vaccine) {
            return res.status(404).json({ msg: 'Vaccine Không Tồn Tại' });
        }
        try {
            const updateObject = {};
            updateObject[`details.${context}`] = req.body[context];
            await Vaccines.updateOne({ _id: vaccine._id }, { $set: updateObject });
            return res.status(200).json({ msg: "Thêm Chi Tiết Thành Công" });
        } catch (error) {
            // console.error(error);
            return res.status(500).json({ msg: "Có lỗi xảy ra khi cập nhật chi tiết vaccine" });
        }
    },
    // Centers
    allCenters: async (req, res, next) => {
        await Centers.find().lean().then(centers => {
            centers = centers.map((center) => {
                return {
                    ...center,
                    createdAt: (center.createdAt).toLocaleDateString('en-GB')
                }
            })
            return res.status(200).json({ centers })
        })
    },
    // blog
    getAllBlogs: async (req, res, next) => {
        try {
            const token = jwt_decode.decodeToken(req.headers['authorization']);
            let blogs = await Blogs.find().lean().sort({ createdAt: -1 });
            const getNameAuthor = async (id) => {
                const account = await Accounts.findById(id);
                return account.fullname
            }
            blogs = blogs.filter(e => e.author == token._id)
            blogs = await Promise.all(
                blogs.map(async blog => {
                    return {
                        ...blog,
                        author: await getNameAuthor(blog.author),
                        createdAt: (blog.createdAt).toLocaleDateString('en-GB'),
                    }
                })
            )
            return res.status(200).json(blogs);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: 'server error' });
        }
    },
    addBlog: async (req, res, next) => {
        try {
            await Blogs.findOne({ title: req.body.title }).then(async blog => {
                if (blog) return res.status(300).json({ msg: 'Tiêu Đề Đã Tồn Tại' });
                const token = jwt_decode.decodeToken(req.headers['authorization']);
                // let nameAuthor = await Accounts.findOne({ _id: token._id });
                const data = {
                    ...req.body,
                    // author: nameAuthor.fullname ? nameAuthor.fullname : nameAuthor.email,
                    author: token._id
                }
                await Blogs(data).save();
                return res.status(200).json({ msg: 'Tạo Mới Blog Thành Công' });
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: 'server error' })
        }
    },
    delBlog: async (req, res, next) => {
        try {
            await Blogs.findByIdAndDelete(req.params._id);
            return res.status(200).json({ msg: 'Xoá Blog Thành Công' })
        } catch (error) {
            return res.status(400).json({ msg: "Xoá Thất Bại" });
        }
    },
    searchBlog: async (req, res, next) => {
        const token = jwt_decode.decodeToken(req.headers['authorization']);
        await Blogs.find({
            "$or": [
                { title: { $regex: req.params.key } },
                { sub_content: { $regex: req.params.key } },
                { hashtags: { $in: [req.params.key] } },
                { author: { $regex: req.params.key } },
            ],
            author: token._id
        }).then(async blogs => {
            const getNameAuthor = async (id) => {
                const account = await Accounts.findById(id);
                return account.fullname
            }
            blogs = blogs.filter(e => e.author == token._id)
            blogs = await Promise.all(
                blogs.map(async blog => {
                    return {
                        _id: blog._id,
                        title: blog.title,
                        sub_content: blog.sub_content,
                        author: await getNameAuthor(blog.author),
                        hashtags: blog.hashtags,
                        status: blog.status,
                        cover: blog.cover,
                        slug: blog.slug,
                        createdAt: (blog.createdAt).toLocaleDateString('en-GB'),
                    }
                })
            )

            return res.status(200).json(blogs);
        }).catch(err => {
            return res.status(500).json({ msg: 'server error' })
        })
    },
    getBlogById: async (req, res, next) => {
        await Blogs.findById(req.params.id).then(blog => {
            return res.status(200).json(blog)
        })
    },
    updateBlog: async (req, res, next) => {
        const data = {
            ...req.body,
            slug: slugify(req.body.title, {
                lower: true,
            })
        }
        await Blogs.findByIdAndUpdate(req.params.id, data).then(blog => {
            return res.status(200).json({ msg: 'Cập nhật thành công' })
        }).catch(err => {
            return res.status(500).json({ msg: 'error' })
        })
    },
    // disease
    getDataDisease: async (req, res, next) => {
        const token = jwt_decode.decodeToken(req.headers['authorization']);
        const account = await Accounts.findById(token._id);
        const doctor = await Doctors.findOne({ email: account.email });
        const center = await Centers.findById(doctor.centerOf);

        let doctorDiseases = doctor.assignDisease;
        let centerDiseases = center.reportDisease;
        let data = [];
        for (var i = 0; i < doctorDiseases.length; i++) {
            // console.log(doctorDiseases[i].diseaseId.toString());
            for (var j = 0; j < centerDiseases.length; j++) {
                if ((doctorDiseases[i].diseaseId).toString() === (centerDiseases[j]._id).toString()) {
                    var result = {
                        email: centerDiseases[j].email,
                        phone: centerDiseases[j].phone,
                        note: doctorDiseases[i].note,
                        desc: doctorDiseases[i].desc,
                        status: doctorDiseases[i].status,
                        diseaseId: doctorDiseases[i].diseaseId
                    }
                    data.push(result)
                } else {
                    next();
                }
            }
        }
        return res.status(200).json(data)
    },
    delReport: async (req, res, next) => {
        const reportId = req.params._id; // ID của report cần xoá
        const token = jwt_decode.decodeToken(req.headers['authorization']);
        const account = await Accounts.findById(token._id);
        const doctor = await Doctors.findOne({ email: account.email });
        const center = await Centers.findById(doctor.centerOf);

        // Tìm và cập nhật trạng thái của báo cáo có id tương ứng
        doctor.assignDisease = doctor.assignDisease.map((disease) => {
            if (disease.diseaseId === reportId) {
                // Nếu diseaseId trùng khớp, cập nhật trạng thái của báo cáo
                return {
                    ...disease,
                    status: '2'
                };
            }
            return disease; // Trả về các báo cáo không cần chỉnh sửa
        });
        center.reportDisease = center.reportDisease.map((disease) => {
            if ((disease._id).toString() === reportId) {
                // Nếu diseaseId trùng khớp, cập nhật trạng thái của báo cáo
                return {
                    ...disease,
                    isComplete: '3'
                };
            }
            return disease; // Trả về các báo cáo không cần chỉnh sửa
        });

        await Doctors.findByIdAndUpdate(doctor._id, doctor)
        await Centers.findByIdAndUpdate(center._id, center)
        return res.status(200).json({ msg: 'Từ chối tiếp nhận thành công' })
    },
    acceptReport: async (req, res, next) => {
        const reportId = req.params._id; // ID của report cần xoá
        const token = jwt_decode.decodeToken(req.headers['authorization']);
        const account = await Accounts.findById(token._id);
        const doctor = await Doctors.findOne({ email: account.email });
        const center = await Centers.findById(doctor.centerOf)
        // Tìm và cập nhật trạng thái của báo cáo có id tương ứng
        doctor.assignDisease = doctor.assignDisease.map((disease) => {
            if (disease.diseaseId === reportId) {
                // Nếu diseaseId trùng khớp, cập nhật trạng thái của báo cáo
                return {
                    ...disease,
                    status: '3'
                };
            }
            return disease; // Trả về các báo cáo không cần chỉnh sửa
        });
        center.reportDisease = center.reportDisease.map((disease) => {
            if ((disease._id).toString() === reportId) {
                // Nếu diseaseId trùng khớp, cập nhật trạng thái của báo cáo
                return {
                    ...disease,
                    isComplete: '4'
                };
            }
            return disease; // Trả về các báo cáo không cần chỉnh sửa
        });
        await Doctors.findByIdAndUpdate(doctor._id, doctor)
        await Centers.findByIdAndUpdate(center._id, center)
        return res.status(200).json({ msg: 'Tiếp nhận thành công' })
    }
}
module.exports = DoctorController;