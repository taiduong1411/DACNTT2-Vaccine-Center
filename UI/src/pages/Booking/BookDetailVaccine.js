import { useParams } from "react-router-dom";
import Navbar from "../../components/NavbarUser/Navbar";
import Report from "../../components/Report/Report";
import Footer from "../../components/Footer/Footer";
import { useForm } from 'react-hook-form';
import { message, notification } from "antd";
import { useEffect, useState } from "react";
import { axiosCli } from "../../interceptor/axios";
import Loader from "../../components/Spin/Spin";



function BookDetailVaccine() {
    const { slug } = useParams();

    const [messageApi, contextHolderMessage] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const { register, handleSubmit } = useForm();
    useEffect(() => {
        getDataCenter();
        getDataUser();
        getDataVaccineBySlug();
    }, []);

    const [dataCenter, setDataCenter] = useState([]);
    const getDataCenter = async () => {
        await axiosCli().get('user/data-center').then(res => {
            setDataCenter(res.data);
        })
    }


    const [dataUser, setDataUser] = useState([]);
    const getDataUser = async () => {
        await axiosCli().get('account/my-info').then(res => {
            if (res.status == 200) {
                setDataUser(res.data)
            } else {
                setDataUser([]);
            }
        })
    }
    const [dataSlug, setDataSlug] = useState([]);
    const getDataVaccineBySlug = async () => {
        await axiosCli().get(`user/vaccine-by-slug/${slug}`).then(res => {
            setDataSlug(res.data)
        })
    }

    const onSubmit = async (data) => {
        // Check Date
        const atPresent = new Date();
        var dbk = new Date(data['dateBooking']);
        if (dbk < atPresent) {
            return messageApi.open({
                type: 'error',
                content: 'Ngày Đặt Lịch Sai. Vui Lòng Kiểm Tra Lại'
            })
        }
        // Check Select
        if (data['center'] == 'null' || data['vaccine'] == 'null') {
            return messageApi.open({
                type: 'error',
                content: 'Vui Lòng Điền Đầy Đủ Thông Tin'
            })
        }
        const dataSubmit = {
            ...data,
            email: dataUser.email,
            phone: dataUser.phone,
            fullname: dataUser.fullname ? dataUser.fullname : data['fullname'],
            vaccine: dataSlug.vid
        }
        // console.log(dataSubmit);
        await axiosCli().post('/doctor/booking', dataSubmit).then(res => {
            if (res.status == 200) {
                api.open({
                    message: res.data.msg,
                    description: res.data.desc,
                    duration: 4,
                });
                setTimeout(() => {
                    window.location.href = '/home';
                }, 5000)
            } else {
                messageApi.open({
                    type: 'error',
                    content: res.data.msg
                })
            }
        })
    }
    return (
        <div>
            {contextHolderMessage}
            {contextHolderNotification}
            <div>
                <Loader />
            </div>
            <div>
                <Navbar />
            </div>
            <div className="grid grid-cols-2 mt-10 m-auto max-[1200px]:grid-cols-1" style={{ width: '95%' }}>
                <div className="max-[1200px]: w-full">
                    <img src="https://goacademy.vn/wp-content/uploads/2020/07/loi-ich-cua-phan-mem-dat-lich-cuoc-hen-trong-nganh-dich-vu-kinh-doanh-tmdt-thumbnail.png" alt="" />
                </div>
                <div className="">
                    <div className="h-full shadow-md max-[1200px]:w-full max-[1200px]:mr-6 max-[1200px]:mt-10">
                        <div className="p-12" style={{ marginTop: 'auto' }}>
                            <p className="text-center text-2xl font-bold">Đặt Lịch</p>
                            <form onSubmit={handleSubmit(onSubmit)} >
                                <div className="mb-4">
                                    <label htmlFor="fullname" className="block mb-2 text-sm font-medium text-gray-900 ">Họ Và Tên</label>
                                    <input type="text" {...register('fullname')} placeholder={dataUser.fullname} disabled={dataUser.fullname ? true : false} id="fullname" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 ">Địa Chỉ Email</label>
                                    <input type="email" {...register('email')} placeholder={dataUser.email} id="email" disabled={dataUser.email ? true : false} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 ">Số Điện Thoại</label>
                                    <input type="text" {...register('phone')} placeholder={dataUser.phone} disabled={dataUser.phone ? true : false} id="phone" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="dateBooking" className="block mb-2 text-sm font-medium text-gray-900 ">Ngày Đăng Ký</label>
                                    <input type="date" id="dateBooking" {...register('dateBooking')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Ngày Đăng Ký" required />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="timeBooking" className="block mb-2 text-sm font-medium text-gray-900 ">Thời Gian Đăng Ký</label>
                                    <input type="time" id="timeBooking" {...register('timeBooking')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Thời Gian Đăng Ký" required />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="timeBooking" className="block mb-2 text-sm font-medium text-gray-900 ">Chọn Trung Tâm Tiêm</label>
                                    <select name="center" id="center" {...register('center')}>
                                        <option value="null">Chọn Trung Tâm</option>
                                        {dataSlug.center?.map((data, index) => (
                                            <option value={data.cid} key={index}>{data.c_name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="timeBooking" className="block mb-2 text-sm font-medium text-gray-900 ">Chọn Loại Vắc Xin Cần Tiêm</label>
                                    <input type="text" id="vaccine" {...register('vaccine')} value={dataSlug.pro_name} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Thời Gian Đăng Ký" disabled required />

                                </div>
                                <button type="submit" className="text-white mb-4 float-right bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Gửi</button>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
            <Report props={dataCenter} />
            <div className="mt-5">
                <Footer />
            </div>
        </div>
    );
}

export default BookDetailVaccine;