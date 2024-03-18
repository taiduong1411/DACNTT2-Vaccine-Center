const Vaccines = require('../models/vaccine.model');
const Doctors = require('../models/doctor.model');
const Users = require('../models/user.model');
const Centers = require('../models/center.model');
const Accounts = require('../models/account.model');
const Blogs = require('../models/blog.model');
const bcrypt = require('bcrypt');
const slugify = require('slugify');
const jwt_decode = require('../services/tokenDecode');
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
    getDataCenterById: async (req, res, next) => {
        await Centers.findById(req.params.id).then(center => {
            return res.status(200).json(center)
        }).catch(err => {
            return res.status(500).json({ msg: 'err' })
        })
    },
    updatedCenter: async (req, res, next) => {
        const center = await Centers.findById(req.params.id);
        const data = {
            center_name: req.body.center_name,
            address: {
                street: req.body.street_name,
                district: req.body.district,
                province: req.body.province,
                number: req.body.number
            },
            reportDisease: center.reportDisease
        }
        await Centers.findByIdAndUpdate(req.params.id, data).then(center => {
            return res.status(200).json({ msg: 'Cập nhật thành công' })
        }).catch(err => {
            console.log(err);
            return res.status(500).json({ msg: 'Cập nhật thất bại' })
        })
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
        const calculateTimeSince = (startDate) => {
            const millisecondsInDay = 1000 * 60 * 60 * 24;
            const millisecondsInMonth = millisecondsInDay * 30; // Giả sử mỗi tháng có 30 ngày

            const currentTime = new Date();
            const elapsedTime = currentTime.getTime() - startDate.getTime();

            if (elapsedTime < millisecondsInDay) {
                return Math.floor(elapsedTime / (1000 * 60 * 60)) + ' giờ trước'; // Số giờ
            } else if (elapsedTime < millisecondsInMonth) {
                return Math.floor(elapsedTime / (millisecondsInDay)) + ' ngày trước'; // Số ngày
            } else if (elapsedTime < millisecondsInMonth * 12) {
                return Math.floor(elapsedTime / (millisecondsInMonth)) + ' tháng trước'; // Số tháng
            } else {
                return Math.floor(elapsedTime / (millisecondsInMonth * 12)) + ' năm trước'; // Số năm
            }
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
                            createdAt: await calculateTimeSince(doctor.createdAt),
                            centerOf: await getCenterName(doctor.email),
                            status: doctor.status
                        }
                    })
                )
                return res.status(200).json(accounts);
            })
        } catch (error) {
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
                    centerOf: req.body.centerOf,
                    certificates: req.body.certificates
                }
                // console.log(dataDoctor);
                await Doctors(dataDoctor).save();
                return res.status(200).json({ msg: 'Thêm Thành Công' });
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: 'server error' })
        }
    },
    getSearchDoctor: async (req, res, next) => {
        await Accounts.find({
            "$or": [
                { fullname: { $regex: req.params.key } },
                { email: { $regex: req.params.key } },
                { phone: { $regex: req.params.key } },
                { dob: { $regex: req.params.key } },
            ],
            level: '2',
        }).then(async accounts => {
            const getCenterName = async (email) => {
                let name = '';
                await Doctors.findOne({ email: email }).then(async doctor => {
                    await Centers.findById({ _id: doctor.centerOf }).then(center => {
                        name = center.center_name;
                    })
                })
                return name
            }
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
            return res.status(200).json(accounts)
        }).catch(err => {
            return res.status(500).json({ msg: 'server error' })
        })
    },
    getDoctorByIdCenter: async (req, res, next) => {
        let doctors = await Doctors.find().lean();
        let activeDoctor = [];
        for (var i = 0; i < doctors.length; i++) {
            let account = await Accounts.findOne({ email: doctors[i].email })
            if (account.status == true) {
                activeDoctor.push(doctors[i])
            } else {
                continue
            }
        }

        doctors = activeDoctor.filter(e => e.centerOf == req.params.cid);
        const getNameByEmail = async (email) => {
            let account = await Accounts.findOne({ email: email });
            return account.fullname
        }
        doctors = await Promise.all(
            doctors.map(async (d) => {
                return {
                    _id: d._id,
                    fullname: await getNameByEmail(d.email),
                }
            })
        )
        return res.status(200).json(doctors);
    },
    getDoctorById: async (req, res, next) => {
        const account = await Accounts.findById(req.params.id);
        let doctor = await Doctors.findOne({ email: account.email })
        const dataDoctor = {
            _id: account._id,
            email: account.email,
            fullname: account.fullname,
            phone: account.phone,
            dob: account.dob,
            centerOf: doctor.centerOf,
            certificates: doctor.certificates,
            status: account.status
        }
        return res.status(200).json(dataDoctor)
    },
    updateDoctor: async (req, res, next) => {
        try {
            const account = await Accounts.findById(req.params.id);
            const doctor = await Doctors.findOne({ email: account.email });
            const dataUpdateAccount = {
                fullname: req.body.fullname,
                phone: req.body.phone,
                dob: req.body.dob,
                status: req.body.status
            }
            const dataUpdateDoctor = {
                certificates: req.body.certificates,
                centerOf: req.body.centerOf,
                assignDisease: doctor.assignDisease
            }

            await Accounts.findByIdAndUpdate(req.params.id, dataUpdateAccount);
            await Doctors.findByIdAndUpdate(doctor._id, dataUpdateDoctor);
            return res.status(200).json({ msg: 'Cập nhật thành công' });
        } catch (error) {
            return res.status(500).json({ msg: 'Có lỗi xảy ra' });
        }

    },
    // Blog
    getAllBlogs: async (req, res, next) => {
        try {
            let blogs = await Blogs.find().lean().sort({ createdAt: -1 });
            const getNameAuthor = async (id) => {
                const account = await Accounts.findById(id);
                return account.fullname
            }
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
        const centers = await Centers.find().lean();
        let dataReport = [];

        centers.forEach(center => {
            const centerName = center.center_name;
            const centerId = center._id; // Lấy ID của center
            const reports = center.reportDisease; // Lấy mảng các báo cáo bệnh tật của center

            // Kiểm tra nếu có báo cáo bệnh tật và là một mảng
            if (reports && Array.isArray(reports)) {
                // Gắn ID của center vào mỗi object trong mảng reportDisease
                reports.forEach(report => {
                    report.centerName = centerName;
                    // Thêm trường centerId vào mỗi object trong mảng reportDisease
                    report.centerId = centerId;
                    dataReport.push(report); // Thêm object đã được gắn ID vào mảng dataReport
                });
            }
        });
        return res.status(200).json(dataReport)
    },
    delReport: async (req, res, next) => {
        const centerId = req.params.cid; // ID của center
        const reportId = req.params._id; // ID của report cần xoá
        try {
            const result = await Centers.findOneAndUpdate(
                { _id: centerId }, // Điều kiện tìm center
                { $pull: { reportDisease: { _id: reportId } } }, // Xoá report có _id là reportId từ mảng reportDisease
                { new: true } // Trả về dữ liệu mới sau khi cập nhật
            );
            return res.status(200).json({ msg: 'Xoá Thành Công' }); // Trả về kết quả sau khi xoá
        } catch (error) {
            return res.status(200).json({ msg: 'Xoá Thất Bại' });
        }
    },
    searchReport: async (req, res, next) => {
        await Centers.find({
            "$or": [
                { center_name: { $regex: req.params.key } },
                { reportDisease: { $elemMatch: { desc: { $regex: req.params.key } } } }
            ],
        }).lean().then(async centers => {
            let dataReport = [];
            centers.forEach(center => {
                const centerName = center.center_name;
                const centerId = center._id; // Lấy ID của center
                const reports = center.reportDisease; // Lấy mảng các báo cáo bệnh tật của center

                // Kiểm tra nếu có báo cáo bệnh tật và là một mảng
                if (reports && Array.isArray(reports)) {
                    // Gắn ID của center vào mỗi object trong mảng reportDisease
                    reports.forEach(report => {
                        report.centerName = centerName;
                        // Thêm trường centerId vào mỗi object trong mảng reportDisease
                        report.centerId = centerId;
                        dataReport.push(report); // Thêm object đã được gắn ID vào mảng dataReport
                    });
                }
            });
            return res.status(200).json(dataReport)

        }).catch(err => {
            console.log(err);
        })
    },
    assignDisease: async (req, res, next) => {
        try {
            const doctor = await Doctors.findById(req.body.did);
            let data = {
                diseaseId: req.body.diseaseId,
                desc: req.body.desc,
                note: req.body.note,
                status: '1'
                // 1 = cho tiep nhan
                // 2 = tu choi tiep nhan
                // 3 = tiep nhan
            }

            const updatedDoctor = await Doctors.findByIdAndUpdate(doctor._id, { $push: { assignDisease: data } }, { new: true });

            if (!updatedDoctor) {
                return res.status(404).json({ msg: 'Không tìm thấy bác sĩ' });
            }

            const center = await Centers.findById(updatedDoctor.centerOf);

            if (!center) {
                return res.status(404).json({ msg: 'Không tìm thấy trung tâm' });
            }

            const updatedCenter = await Centers.findOneAndUpdate(
                { _id: updatedDoctor.centerOf, "reportDisease._id": data.diseaseId },
                { $set: { "reportDisease.$.isComplete": '2' } }
            );

            if (!updatedCenter) {
                return res.status(404).json({ msg: 'Không tìm thấy báo cáo bệnh' });
            }

            return res.status(200).json({ msg: 'Phân công giải quyết dịch bệnh thành công' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: 'Có lỗi xảy ra' });
        }
    }
}
module.exports = AdminController;