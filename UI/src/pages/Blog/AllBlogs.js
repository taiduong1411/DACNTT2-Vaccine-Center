import { useEffect, useState } from "react";
import Navbar from "../../components/NavbarUser/Navbar";
import { Pagination, message } from 'antd';
import { axiosCli } from "../../interceptor/axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Report from "../../components/Report/Report";
import { useForm } from 'react-hook-form';

function AllBlog() {
    const nav = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [allDataBlog, setAllDataBlog] = useState([]);
    // const [allDataBlog, setAllDataBlog] = useState([]);
    const [dataCenter, setDataCenter] = useState([]);
    const { register, handleSubmit } = useForm();
    const [messageApi, contextHolder] = message.useMessage();
    useEffect(() => {
        getDataBlogs();
        // getDataBlog();
        getDataCenter();
    }, [currentPage])
    const getDataBlogs = async () => {
        await axiosCli().get(`user/blog-pagination?page=${currentPage}`).then(res => {
            setAllDataBlog(res.data.blogs);
            setTotalPages(res.data.lastPage);
        })
    }
    // const getDataBlog = async () => {
    //     await axiosCli().get('user/all-blogs').then(res => {
    //         console.log(res.data);
    //         setAllDataBlog(res.data);
    //     })
    // }
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
        await axiosCli().get(`user/search-blog/${data.key}`).then(res => {
            if (res.data.length < 1) {
                setAllDataBlog([]);
                messageApi.open({
                    type: 'warning',
                    content: 'Không tìm thấy vaccine'
                })
            } else {
                setAllDataBlog(res.data);
            }
        })
    }
    const onInput = (e) => {
        if (e.target.value.length < 1) {
            getDataBlogs();
        }
    }
    return (
        <div>
            {contextHolder}
            <Navbar />
            <div className="max-w-[1200px] mx-auto grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6 mt-10 mb-1" >
                <form className="space-y-1 md:space-y-6 mt-4 mb-10" onSubmit={handleSubmit(onSearchSubmit)}>
                    <div className="relative mb-8">
                        <input type="search" {...register("key")} onInput={onInput} id="default-search" className="block w-full p-4 pl-10 text-sm border border-gray-300 rounded-lg text-black bg-gray-50 focus:ring-blue-500 focus:border-blue-50 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Tìm kiếm bài viết..." required />
                        <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                    </div>
                </form>
            </div>
            <div className="max-w-[1200px] mx-auto grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6 mt-2 mb-10">
                {allDataBlog?.map((blog, index) => (
                    <div key={index} className="w-full mb-4" onClick={() => nav(`/blog/${blog.slug}`)}>
                        <div key={blog.id} className="bg-white rounded-md shadow-md transition-transform hover:scale-105 hover:shadow-lg aspect-w-1 aspect-h-1 p-4 sm:px-6 md:p-4">
                            <div className="flex justify-center items-center mb-2">
                                <img src={blog.cover} alt="" className="h-16 w-16 object-cover rounded-full" />
                            </div>
                            <h2 className="text-lg font-semibold mb-1 line-clamp-2">{blog.title}</h2>
                            <p className="text-sm text-gray-600 line-clamp-3">{blog.sub_content}</p>
                            {/* Thêm các thông tin khác của blog cần hiển thị */}
                        </div>
                    </div>
                ))}
            </div>



            <div className="flex justify-center mb-4">
                <Pagination defaultCurrent={1} total={50} onChange={handleClickPage} />
            </div>
            <div>
                <Report props={dataCenter} />
            </div>
            <div className="mt-10">
                <Footer />
            </div>
        </div>
    )
}
export default AllBlog;