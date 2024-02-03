import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/NavbarUser/Navbar";
import { useEffect, useState } from 'react'
import { axiosCli } from "../../interceptor/axios";
// import { Button } from 'antd';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
function Home() {
    const [allData, setData] = useState([]);
    const [allDataBlog, setAllDataBlog] = useState([]);
    const [dataCenter, setDataCenter] = useState([]);
    const [dataVaccine, setDataVaccine] = useState([]);
    const nav = useNavigate();
    useEffect(() => {
        getData();
        getDataBlog();
        getDataCenter();
        // getDataVaccine();
    }, []);
    const getData = async () => {
        await axiosCli().get('user/data-vaccine').then(res => {
            setData(res.data);
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
        var res = await axiosCli().get('user/data-vaccine');
        res = (res.data).map((c) => {
            return {
                cid: (c.centerOf).map(i => {
                    return {
                        cid: i.cid
                    }
                }),
                v_name: c.v_name
            }
        })
        const data = res.map(e => {
            return {
                v_name: e.v_name,
                cid: (e.cid).map(f => f.cid)
            }
        })
        // console.log(data);
        // console.log(res[0].cid[0].cid);
        // console.log(
        //     data.filter(f => f.  ));

    }
    // Handle Auto Scroll To Form Booking
    const ref = useRef(null);
    const props = () => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    }
    // Handle Submit Form Booking
    const { register, handleSubmit } = useForm();
    const onSubmit = async (data) => {
        console.log(data);
    }
    return (
        <div className="">
            <div className="">
                <Navbar props={props} />
            </div>
            <div className="bg-orange-50 items-center justify-center flex flex-wrap">
                <div className="w-full md:w-1/2 text-center">
                    <img src="./public/heart_574664.png" alt="health" className="px-4 mx-auto mt-5 md:mt-0" />
                </div>
                <div className="w-full md:w-1/2 text-center">
                    <h2 className='text-5xl font-bold mt-5 md:mt-0'>Healthy Living</h2>
                    <p className="text-xl mt-5">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Omnis minima ipsam modi, quibusdam eius voluptate esse quod accusamus rem sint ex culpa necessitatibus eveniet architecto odit cupiditate, adipisci reiciendis placeat?</p>
                </div>
            </div>

            <div className="bg-blue-200 flex flex-wrap items-center justify-center" ref={ref}>
                <div className="w-full md:w-2/3 text-center">
                    <h2 className='text-5xl font-bold mt-10'>Vacxin</h2>
                    <p className="text-xl mt-5">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Omnis minima ipsam modi, quibusdam eius voluptate esse quod accusamus rem sint ex culpa necessitatibus eveniet architecto odit cupiditate, adipisci reiciendis placeat?</p>
                </div>
                <div className="w-full md:w-1/3 text-center">
                    <img src="./public/vaccine.png" alt="health" className="px-4 mx-auto mt-5 md:mt-0" width={300} height={200} />
                </div>
            </div>



            <div className="grid grid-cols-2 m-auto mt-5 max-[1200px]:grid-cols-1" style={{ width: '95%' }}>
                <div className="max-[1200px]: w-full">
                    <img src="https://binhphuoc.gov.vn/uploads/binhphuoc/news/2022_11/tiem-vac-xin.png" alt="" />
                    {/* <h1>a</h1> */}
                </div>
                <div className="">
                    <div className="h-full shadow-md max-[1200px]:w-full max-[1200px]:mr-6 max-[1200px]:mt-10">
                        <div className="p-12" style={{ marginTop: 'auto' }}>
                            <p className="text-center text-2xl font-bold">Đặt Lịch Nhanh</p>
                            <form onSubmit={handleSubmit(onSubmit)} >
                                <div className="mb-4">
                                    <label htmlFor="fullname" className="block mb-2 text-sm font-medium text-gray-900 ">Họ Và Tên</label>
                                    <input type="text" {...register('fullname')} id="fullname" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Họ Và Tên" required />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 ">Địa Chỉ Email</label>
                                    <input type="email" {...register('email')} id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Địa Chỉ Email" />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 ">Số Điện Thoại</label>
                                    <input type="text" {...register('phone')} id="phone" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Số Điện Thoại" required />
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
                                            <option value={data.v_name} key={index}>{data.v_name}</option>
                                        ))}
                                    </select>
                                </div>
                                <button type="submit" className="text-white float-right bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Submit</button>
                            </form>
                        </div>

                    </div>
                </div>
            </div>

            <div className="mt-20">
                <h1 className="text-2xl mb-5 ml-10" style={{ borderLeft: '8px solid black' }}>
                    &nbsp; Danh Mục Vacxine
                </h1>
                <div className="max-w-[1200px] mx-auto grid grid-cols-1 gap-5 sm:flex justify-left mt-10 mb-10">
                    {allData.map((data) => (
                        <div className="" key={data.pro_code} onClick={() => nav(`/vaccine/${data.slug}`)}>
                            <div className="w-full h-80 sm:w-72 bg-white shadow-md hover:shadow-lg rounded-xl overflow-hidden">
                                <img
                                    className="w-full h-40 object-cover sm:h-44"
                                    src={`${data.cover}`}
                                    alt=""
                                />
                                <div className="p-4 flex flex-col justify-between h-full">
                                    <p className="text-lg  mb-2">{data.pro_name}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>





            <div className="mt-20">
                <h1 className="text-2xl mb-5 ml-10" style={{ borderLeft: '8px solid black' }}>
                    &nbsp; Tin Tức
                </h1>
                <div className="max-w-[1200px] mx-auto grid grid-cols-1 gap-5 justify-left sm:flex mt-10 mb-10">
                    {allDataBlog.map((blog) => (
                        <div key={blog.pro_code} onClick={() => nav(`/blog/${blog.slug}`)}>
                            <div className="w-full h-warp-content sm:w-72 bg-white shadow-md hover:shadow-lg rounded-xl overflow-hidden">
                                <div className="flex justify-center items-center">
                                    <img
                                        className="w-full h-40 object-cover sm:h-44 sm:w-60"
                                        src={`${blog.cover}`}
                                        alt=""
                                    />
                                </div>
                                <div className="p-4">
                                    <p className="text-sm font-semibold mb-2">{blog.title}</p>
                                    <p className="text-gray-600 text-sm">{blog.sub_content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>


            <div>
                <Footer />
            </div>
        </div>
    );
}

export default Home;