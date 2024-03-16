import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/NavbarUser/Navbar";
import { useEffect, useState } from 'react'
import { axiosCli } from "../../interceptor/axios";
import { Spin } from 'antd';
import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import CarouselVaccine from "../../components/CarouselCard/CarouselVaccine";
import CarouselBlog from "../../components/CarouselCard/CarouselBlog";
// import CarouselTestimonial from "../../components/CarouselCard/CarouselTestimonial";

import { message, notification } from "antd";
import SliderIntro from "../../components/Silder/SliderIntro";
import Report from "../../components/Report/Report";

function Booking() {
    const [messageApi, contextHolderMessage] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const [allData, setData] = useState([]);
    const [allDataBlog, setAllDataBlog] = useState([]);
    const [dataCenter, setDataCenter] = useState([]);
    const [dataVaccine, setDataVaccine] = useState([]);
    const [dataUser, setDataUser] = useState([]);
    const nav = useNavigate();
    const [spinning, setSpinning] = useState(false);
    const showLoader = () => {
        setSpinning(true);
        setTimeout(() => {
            setSpinning(false);
        }, 2000);
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            getDataAllVaccine();
            getDataBlog();
        }, 3000);
        getDataCenter();
        getDataUser();
        showLoader();
        // Đảm bảo rằng bạn xóa bỏ setInterval khi component unmount để tránh rò rỉ bộ nhớ
        return () => clearInterval(intervalId);
    }, []);
    const getDataAllVaccine = async () => {
        await axiosCli().get('user/all-data-vaccine').then(res => {
            setData(res.data);
        })
    }
    const getDataUser = async () => {
        await axiosCli().get('account/my-info').then(res => {
            if (res.status == 200) {
                setDataUser(res.data)
            } else {
                setDataUser([]);
            }
        })
    }
    const getDataBlog = async () => {
        await axiosCli().get('user/all-blogs').then(res => {
            setAllDataBlog(res.data);
        })
    }
    const getDataCenter = async () => {
        await axiosCli().get('user/data-center').then(res => {
            setDataCenter(res.data);
        })
    }
    const getDataVaccine = async (e) => {
        const id = e.target.value;
        var res = await axiosCli().post(`user/data-vaccine/${id}`);
        setDataVaccine(res.data);
    }
    // Handle Auto Scroll To Form Booking
    const ref = useRef(null);
    const props = () => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    }
    // Handle Submit Form Booking
    const { register, handleSubmit } = useForm();
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
            fullname: dataUser.fullname ? dataUser.fullname : data['fullname']
        }

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
        <div className="">
            {contextHolderMessage}
            {contextHolderNotification}
            <Spin spinning={spinning} fullscreen />
            <div className="">
                <Navbar props={props} />
            </div>
            <div className="grid grid-cols-2 m-auto mt-5 max-[1200px]:grid-cols-1" style={{ width: '95%' }}>
                <div className="max-[1200px]: w-full">
                    <img src="https://goacademy.vn/wp-content/uploads/2020/07/loi-ich-cua-phan-mem-dat-lich-cuoc-hen-trong-nganh-dich-vu-kinh-doanh-tmdt-thumbnail.png" alt="" />
                </div>
                <div className="">
                    <div className="h-full shadow-md max-[1200px]:w-full max-[1200px]:mr-6 max-[1200px]:mt-10" ref={ref}>
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
                                    <select name="center" id="center" {...register('center')} onChange={getDataVaccine}>
                                        <option value="null">Chọn Trung Tâm</option>
                                        {dataCenter?.map((data, index) => (
                                            <option value={data._id} key={index}>{data.center_name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="timeBooking" className="block mb-2 text-sm font-medium text-gray-900 ">Chọn Loại Vắc Xin Cần Tiêm</label>
                                    <select name="vaccine" id="vaccine" {...register('vaccine')} >
                                        <option value="null">Chọn Vaccine</option>
                                        {dataVaccine?.map((data, index) => (
                                            <option value={data._id} key={index}>{data.pro_name}</option>
                                        ))}
                                    </select>
                                </div>
                                <button type="submit" className="text-white mb-4 float-right bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Submit</button>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
            <Report props={dataCenter} />
            <div>
                <Footer />
            </div>
        </div>
    );
}

export default Booking;