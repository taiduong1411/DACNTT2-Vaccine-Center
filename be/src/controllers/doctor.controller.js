const Bookings = require('../models/booking.model');
const Vaccines = require('../models/vaccine.model');
const Centers = require('../models/center.model');
const Doctors = require('../models/doctor.model');
const Accounts = require('../models/account.model');
const Users = require('../models/user.model');
const services = require('../services/email');
const jwt_decode = require('../services/tokenDecode');
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
    }
}
module.exports = DoctorController;