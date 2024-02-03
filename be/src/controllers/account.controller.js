const Accounts = require('../models/account.model');
const Users = require('../models/user.model');
const otp = require('../models/otp.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const services = require('../services/email');
const jwt_decode = require('../services/tokenDecode');
const AccountController = {
    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            await Accounts.findOne({ email: email }).then(account => {
                if (!account) return res.status(404).json({ msg: "Tài Khoản Không Tồn Tại" });
                if (account.status == false) return res.status(400).json({ msg: "Tài Khoản Của Bạn Bị Khoá. Vui Lòng Liên Hệ Admin" })
                if (!bcrypt.compareSync(password, account.password)) return res.status(300).json({ msg: "Mật Khẩu Không Chính Xác" });
                const token = jwt.sign(
                    {
                        _id: account._id,
                        level: account.level,
                    },
                    process.env.SESSION_SECRET,
                    { expiresIn: 60 * 60 * 24 });
                return res.status(200).json({ token: token });
            })
        } catch (error) {
            // console.log(error);
            return res.status(500).json({ msg: 'server error' });
        }
    },
    register: async (req, res, next) => {
        try {
            await Accounts.findOne({ email: req.body.email }).then(async account => {
                if (account) return res.status(300).json({ msg: "Tài Khoản Đã Tồn Tại" });
                const phone = await Accounts.findOne({ phone: req.body.phone });
                if (phone) return res.status(300).json({ msg: 'Số Điện Thoại Đã Được Sử Dụng' });
                const hash = bcrypt.hashSync(req.body.password, 5);
                const data = {
                    ...req.body,
                    password: hash
                }
                await Accounts(data).save();
                await Users({ email: req.body.email }).save();
                return res.status(200).json({ msg: 'Đăng Ký Thành Công' })
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: 'server error' })
        }
    },
    forgotPassword: async (req, res, next) => {
        try {
            await Accounts.findOne({ email: req.body.email }).then(async user => {
                if (!user) return res.status(404).json({ msg: 'Email Không Tồn Tại' })
                const data = {
                    email: req.body.email,
                    code: services.randomCode()
                };
                await services.sendEmail(data.code, data.email);
                await otp(data).save();
                return res.status(200).json({ msg: 'Mã Xác Thực Đã Được Gửi Thành Công. Vui Lòng Kiểm Tra Email !' })
            })
        } catch (error) {
            return res.status(500).json({ msg: 'server error' })
        }
    },
    resetPassword: async (req, res, next) => {
        try {
            await otp.findOne({ email: req.body.email }).then(async otp => {
                if (!otp) return res.status(400).json({ msg: 'Mã Xác Thực Đã Hết Hiệu Lực Hoặc Không Tồn Tại' })
                if (otp.code !== req.body.code) return res.status(401).json({ msg: 'Mã Xác Thực Không Đúng' })
                let user = await Accounts.findOne({ email: otp.email });
                const hash = bcrypt.hashSync(req.body.password, 5);
                user.password = hash;
                await user.save();
                return res.status(200).json({ msg: 'Thay Đổi Mật Khẩu Thành Công' })
            })
        } catch (error) {
            return res.status(500).json({ msg: 'server error' })
        }
    },
    getMyInfo: async (req, res, next) => {
        try {
            const token = jwt_decode.decodeToken(req.headers['authorization']);
            if (!token) {
                return res.status(300)
            }
            await Accounts.findOne({ _id: token._id }).then(account => {
                if (!account) return res.status(404).json({ msg: 'Tài Khoản Không Tồn Tại' });
                return res.status(200).json(account);
            })
        } catch (error) {
            return res.status(500).json({ msg: 'server error' })
        }
    },
    updateInformation: async (req, res, next) => {
        const token = jwt_decode.decodeToken(req.headers['authorization']);
        if (!token) return res.status(300);
        const user = await Accounts.findOne({ _id: token._id })
        // if (user.email == req.body.email) return res.status(300).json({ msg: 'Email đã được sử dụng' })
        // if (user.phone == req.body.phone) return res.status(300).json({ msg: 'Số điện thoại đã được sử dụng' })
        const data = {
            ...req.body,
            password: req.body.password ? bcrypt.hashSync(req.body.password, 5) : user.password
        }
        try {
            await Accounts.findByIdAndUpdate(token._id, data).then(account => {
                return res.status(200).json({ msg: 'Cập Nhật Thông Tin Thành Công' })
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: 'server error' });
        }
    }
}

module.exports = AccountController;