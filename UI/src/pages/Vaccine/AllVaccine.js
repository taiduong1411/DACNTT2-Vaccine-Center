import { useEffect, useState } from "react";
import Navbar from "../../components/NavbarUser/Navbar";
import { Pagination, message } from 'antd';
import { axiosCli } from "../../interceptor/axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Report from "../../components/Report/Report";
import { useForm } from 'react-hook-form';

function AllVaccine() {
    const nav = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [allDataVaccine, setAllDataVaccine] = useState([]);
    const [allDataBlog, setAllDataBlog] = useState([]);
    const [dataCenter, setDataCenter] = useState([]);
    const { register, handleSubmit } = useForm();
    const [messageApi, contextHolder] = message.useMessage();
    useEffect(() => {
        getDataVaccines();
        getDataBlog();
        getDataCenter();
    }, [currentPage])
    const getDataVaccines = async () => {
        await axiosCli().get(`user/all-vaccines?page=${currentPage}`).then(res => {
            setAllDataVaccine(res.data.vaccines);
            setTotalPages(res.data.lastPage);
        })
    }
    const getDataBlog = async () => {
        await axiosCli().get('user/all-blogs').then(res => {
            console.log(res.data);
            setAllDataBlog(res.data);
        })
    }
    const getDataCenter = async () => {
        await axiosCli().get('user/data-center').then(res => {
            setDataCenter(res.data);
        })
    }
    const handleClickPage = (page) => {
        console.log(page);
        setCurrentPage(page);
    }
    // search
    const onSearchSubmit = async (data) => {
        await axiosCli().get(`user/search-vaccine/${data.key}`).then(res => {
            if (res.data.length < 1) {
                setAllDataVaccine([]);
                messageApi.open({
                    type: 'warning',
                    content: 'Không tìm thấy vaccine'
                })
            } else {
                setAllDataVaccine(res.data);
            }
        })
    }
    const onInput = (e) => {
        if (e.target.value.length < 1) {
            getDataVaccines();
        }
    }
    return (
        <div>
            {contextHolder}
            <Navbar />
            <div className="max-w-[1200px] mx-auto grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6 mt-10 mb-1" >
                <form className="space-y-1 md:space-y-6 mt-4 mb-10" onSubmit={handleSubmit(onSearchSubmit)}>
                    <div className="relative mb-8">
                        <input type="search" {...register("key")} onInput={onInput} id="default-search" className="block w-full p-4 pl-10 text-sm border border-gray-300 rounded-lg text-black bg-gray-50 focus:ring-blue-500 focus:border-blue-50 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Tìm kiếm vắc xin..." required />
                        <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                    </div>
                </form>
            </div>
            <div className="max-w-[1200px] mx-auto grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6 mt-2 mb-10">
                {allDataVaccine?.map((data, index) => (
                    <div key={index} className="w-full mb-4">
                        <div className="w-full bg-white shadow-sm border hover:shadow-lg rounded-xl overflow-hidden" onClick={() => nav(`/vaccine/${data.slug}`)}>
                            <img
                                className="w-full h-40 object-cover"
                                src={data.cover}
                                alt=""
                            />
                            <div className="p-4">
                                <p className="text-lg mb-2">{data.pro_name}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-center mb-4">
                <Pagination defaultCurrent={1} total={50} onChange={handleClickPage} />
            </div>
            <div className="mt-20">
                <h1 className="text-2xl mb-5 ml-10" style={{ borderLeft: '8px solid black' }}>
                    &nbsp; Tin Tức
                    <div className="text-sm float-right mr-14 underline underline-offset-1">
                        <Link to={'/all-blogs/'}>Xem tất cả</Link>
                    </div>
                </h1>
                <div className="max-w-[1200px] mx-auto grid grid-cols-1 gap-5 justify-left sm:flex mt-10 mb-10">
                    {allDataBlog?.map((blog, index) => (
                        <div key={index}>
                            <div className="border w-full h-warp-content sm:w-72 bg-white shadow-md hover:shadow-lg rounded-xl overflow-hidden">
                                <div className="flex justify-center items-center">
                                    <img
                                        className="w-full h-40 object-cover sm:h-44"
                                        src={`${blog.cover}`}
                                        alt=""
                                    />
                                </div>
                                <div className="p-4">
                                    <p className="text-sm font-semibold mb-2">{blog.title}</p>
                                    <p className="text-gray-600 text-sm text-ellipsis overflow-hidden whitespace-nowrap">{blog.sub_content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <Report props={dataCenter} />
            </div>
            <div>
                <Footer />
            </div>
        </div>
    )
}
export default AllVaccine;