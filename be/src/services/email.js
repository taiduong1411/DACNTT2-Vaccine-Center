const express = require('express')
const nodemailer = require('nodemailer')

module.exports = {
    randomCode: () => {
        const characters = '0123456789';
        function generateString(length) {
            var result = '';
            const charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }
        return generateString(6)
    },
    sendEmail: async (code, mail) => {
        async function autoSend(code, mail) {
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'djtimz1411@gmail.com',
                    pass: 'esfryvpkyuykxyzy'
                }
            })
            var mailOptions = {
                from: 'djtimz1411@gmail.com',
                to: mail,
                subject: 'Quên mật khẩu',
                text: code,
                html: `<!DOCTYPE html>
                <html lang="en">
                
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                
                <body>
                    <div style="width: 50%; height: 200px;background: rgba(250, 242, 242, 0.908); margin: auto">
                        <h1 style="text-align: center; padding-top: 20px;">Hệ Thống Tiêm Chủng Quốc Gia</h1>
                        <div style="width: 200px; height: 50px; background-color: white; text-align: center; line-height: 50px; margin: auto">
                            <h1 style="letter-spacing: 8px;">${code}</h1>
                        </div>
                        <h4 style="text-align: center">Đây là mã xác thực có hiệu lực trong 5 phút. Vui lòng không chia sẻ cho người khác !!</h4>
                    </div>
                </body>
                
                </html>`
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
        return autoSend(code, mail)
    },
    confirmBooking: async (fullname, phone, dateBooking, timeBooking, center, vaccine, mail) => {
        async function autoSend(fullname, phone, dateBooking, timeBooking, center, vaccine, mail) {
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'djtimz1411@gmail.com',
                    pass: 'esfryvpkyuykxyzy'
                }
            })
            var mailOptions = {
                from: 'djtimz1411@gmail.com',
                to: mail,
                subject: 'Xác Nhận Lịch Đăng Ký Vắc Xin',
                text: '',
                html: `<!DOCTYPE html>
                <html lang="en">
                
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                
                <body>
                    <div>
                        <h1 style="text-align: center; padding-top: 20px;">Hệ Thống Tiêm Chủng Quốc Gia</h1>
                        <p style="text-align: center; padding-top: 20px;">Cảm ơn <strong>${fullname}</strong> đã đặt lịch tại Hệ Thống Tiêm Chủng!</p>
                        <p style="text-align: center; padding-top: 20px;">Bên Dưới Là Thông Tin Xác Nhận. Vui lòng kiểm tra kỹ, nếu có bất kỳ sai sót xin liên hệ theo số <strong>123123</strong></p>
                        <div style="margin-left: 30px;">
                            <div>
                                <p>
                                    <strong>Họ Và Tên :</strong>
                                    ${fullname}
                                </p>
                            </div>
                            <div>
                                <p>
                                    <strong>Số Điện Thoại :</strong>
                                    ${phone}
                                </p>
                            </div>
                            <div>
                                <p>
                                    <strong>Ngày Tiêm :</strong>
                                    ${dateBooking}
                                </p>
                            </div>
                            <div>
                                <p>
                                    <strong>Giờ Tiêm :</strong>
                                    ${timeBooking}
                                </p>
                            </div>
                            <div>
                                <p>
                                    <strong>Trung Tâm :</strong>
                                    ${center}
                                </p>
                            </div>
                            <div>
                                <p>
                                    <strong>Tên Vắc Xin :</strong>
                                    ${vaccine}
                                </p>
                            </div>
                            
                        </div>
                        <div style="text-align: center; padding-top: 20px;">
                            <h3>
                                Vui Lòng Đến Sớm Ít Nhất 15 Phút Để Tiến Hành. Cảm Ơn Bạn Đã Xác Nhận !
                            </h3>
                        </div>
                    </div>
                </body>
                
                </html>`
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
        return autoSend(fullname, phone, dateBooking, timeBooking, center, vaccine, mail)
    },
}