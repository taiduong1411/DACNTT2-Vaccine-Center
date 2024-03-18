import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosCli } from "../../interceptor/axios";
import Navbar from "../../components/NavbarUser/Navbar";
import Footer from "../../components/Footer/Footer";
import Report from "../../components/Report/Report";
import { useNavigate } from "react-router-dom";
import { Pagination } from 'antd';


function BlogByTag() {
    const { query } = useParams();
    const nav = useNavigate();
    useEffect(() => {
        getDataBlogByTag();
        getDataCenter();
    }, []);

    const [dataBlog, setDataBlog] = useState([]);

    const getDataBlogByTag = async () => {
        await axiosCli().get(`user/get-blog-by-tag/${query}`).then(res => {
            setDataBlog(res.data)

        })
    }
    const [dataCenter, setDataCenter] = useState([]);
    const getDataCenter = async () => {
        await axiosCli().get('user/data-center').then(res => {
            setDataCenter(res.data);
        })
    }
    // pagination
    const handleClickPage = (page) => {

    }
    return (
        <div>
            <div>
                <Navbar />
            </div>
            <div className="container mx-auto mt-8 mb-10">
                <h1 className="text-2xl font-bold mb-10 underline">Tag: {query}</h1>
                {dataBlog.length === 0 ? (
                    <p>No blogs found for this tag.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {dataBlog.map(blog => (
                            <div key={blog.id} className="bg-white p-4 rounded-md shadow-md transition-transform hover:scale-105 hover:shadow-lg"
                                onClick={() => nav(`/blog/${blog.slug}`)}
                            >
                                <div className="flex justify-center items-center mb-2">
                                    <img src={blog.cover} alt="" className="h-16 w-16 object-cover rounded-full" />
                                </div>
                                <h2 className="text-lg font-semibold mb-1 overflow-hidden">{blog.title}</h2>
                                <p className="text-sm text-gray-600 overflow-hidden overflow-ellipsis">{blog.sub_content}</p>
                                {/* Thêm các thông tin khác của blog cần hiển thị */}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="flex justify-center mb-4">
                <Pagination defaultCurrent={1} total={dataBlog.length} onChange={handleClickPage} />
            </div>
            <div>
                <Report props={dataCenter} />
            </div>
            <div>
                <Footer />
            </div>

        </div>
    );
}

export default BlogByTag;