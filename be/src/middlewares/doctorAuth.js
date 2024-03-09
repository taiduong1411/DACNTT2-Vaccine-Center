const jwt = require('jsonwebtoken');
module.exports = userRole = async (req, res, next) => {
    const token = req.headers['authorization'];
    const token_decode = jwt.decode(token);
    await jwt.verify(token, process.env.SESSION_SECRET, function (err) {
        if (err) {
            // console.log(err);
            return res.status(401).json({ msg: 'Bạn Chưa Đăng Nhập' })
        }
        else {
            if (token_decode.level != '2') {
                return res.status(404).json({ msg: 'Bạn Không Thể Sử Dụng Chức Năng. Vui Lòng Sử Dụng Tài Khoản Khác' })
            } else {
                next();
            }
        }
    })
}