const Vaccines = require('../models/vaccine.model');
const Doctors = require('../models/doctor.model');
const Users = require('../models/user.model');
const Centers = require('../models/center.model');
const Accounts = require('../models/account.model');
const Blogs = require('../models/blog.model');
const bcrypt = require('bcrypt');
const slugify = require('slugify')
const AdminController = {
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

        // await Vaccine.findOne({ pro_code: req.body.pro_code }).then(async vaccine => {
        //     if (vaccine) return res.status(300).json({ msg: 'Vaccin Đã Tồn Tại' });
        // })
        const data = {
            pro_name: req.body.pro_name,
            pro_code: req.body.pro_code,
            desc: req.body.desc,
            img: req.body.img,
            cover: req.body.cover,
            centerOf: req.body.centerOf
        }
        // console.log(data);
        await Vaccines(data).save();
        return res.status(200).json({ msg: 'Thêm Vaccin Thành Công' });
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
    // Dashboard
    dataDashboard: async (req, res, next) => {
        let totalVaccines = await Vaccines.countDocuments();
        let totalDoctors = await Doctors.countDocuments();
        let totalUsers = await Users.countDocuments();
        let totalCenters = await Centers.countDocuments();
        let totalBlogs = await Blogs.countDocuments();
        return res.status(200).json({
            totalVaccines: totalVaccines,
            totalUsers: totalUsers,
            totalCenters: totalCenters,
            totalDoctors: totalDoctors,
            totalBlogs: totalBlogs
        });
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
    addCenter: async (req, res, next) => {
        try {
            await Centers.findOne({ center_name: req.body.center_name }).then(async center => {
                if (center) return res.status(400).json({ msg: 'Tên Trung Tâm Đã Tồn Tại' })
                let data = {
                    center_name: req.body.center_name,
                    address: {
                        street: req.body.street_name,
                        district: req.body.district,
                        province: req.body.province,
                        number: req.body.number
                    }
                }
                await Centers(data).save();
                return res.status(200).json({ msg: 'Tạo Mới Thành Công' });
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: 'Server Error' });
        }
    },
    // DocTor
    getAllDoctors: async (req, res, next) => {
        const getCenterName = async (email) => {
            let name = '';
            await Doctors.findOne({ email: email }).then(async doctor => {
                await Centers.findById({ _id: doctor.centerOf }).then(center => {
                    name = center.center_name;
                })
            })
            return name
        }
        try {
            await Accounts.find({ level: '2' }).lean().sort({ createdAt: -1 }).then(async accounts => {
                accounts = await Promise.all(
                    accounts.map(async (doctor) => {
                        return {
                            _id: doctor._id,
                            email: doctor.email,
                            fullname: doctor.fullname,
                            avatar: doctor.avatar,
                            createdAt: (doctor.createdAt) ? (doctor.createdAt).toLocaleDateString('en-GB') : '01/01/2024',
                            centerOf: await getCenterName(doctor.email),
                            status: doctor.status
                        }
                    })
                )
                // console.log(accounts);
                return res.status(200).json(accounts);
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: 'server error' });
        }
    },
    addDoctor: async (req, res, next) => {
        try {
            await Accounts.findOne({ email: req.body.email }).then(async account => {
                if (account) return res.status(300).json({ msg: 'Email đã được sử dụng' })
                let phone = await Accounts.findOne({ phone: req.body.phone });
                if (phone) return res.status(300).json({ msg: 'Số điện thoại đã được sử dụng' });
                const hash = bcrypt.hashSync(req.body.password, 5);
                const data = {
                    ...req.body,
                    password: hash
                }
                await Accounts(data).save();
                const dataDoctor = {
                    email: req.body.email,
                    centerOf: req.body.centerOf
                }
                await Doctors(dataDoctor).save();
                return res.status(200).json({ msg: 'Thêm Thành Công' });
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: 'server error' })
        }
    },
    // Blog
    getAllBlogs: async (req, res, next) => {
        try {
            let blogs = await Blogs.find().lean().sort({ createdAt: -1 });
            blogs = blogs.map(blog => {
                return {
                    ...blog,
                    createdAt: (blog.createdAt).toLocaleDateString('en-GB')
                }
            })
            return res.status(200).json(blogs);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: 'server error' });
        }
    },
    addBlog: async (req, res, next) => {
        try {
            await Blogs.findOne({ title: req.body.title }).then(async blog => {
                if (blog) return res.status(300).json({ msg: 'Tiêu Đề Đã Tồn Tại' })
                await Blogs(req.body).save();
                return res.status(200).json({ msg: 'Tạo Mới Blog Thành Công' });
            })
        } catch (error) {
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
    }

}
module.exports = AdminController;