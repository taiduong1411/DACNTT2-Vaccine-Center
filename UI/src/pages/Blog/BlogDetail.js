import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosCli } from "../../interceptor/axios";
import Navbar from "../../components/NavbarUser/Navbar";
import './blog.css'
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
const BlogDetail = () => {
    const { slug } = useParams();
    const nav = useNavigate();
    const [dataBlog, setDataBlog] = useState([]);
    const [dataAllBlog, setDataAllBlog] = useState([]);
    useEffect(() => {
        getDataBlog();
        getAllDataBlog();
    }, [slug])
    const getDataBlog = async () => {
        await axiosCli().get(`user/blog/${slug}`).then(res => {
            // console.log(res.data);
            setDataBlog(res.data)
        })
    }
    const getAllDataBlog = async () => {
        await axiosCli().get('user/all-blogs').then(res => {
            const data = res.data;
            setDataAllBlog(data.filter((e) => e.slug != slug));
        })
    }
    return (
        <div>
            <Navbar />
            <div className="mt-10">
                <h1 className="text-4xl text-center font-bold text-orange-400 underline mb-10">
                    {dataBlog.title}
                </h1>
                <div className="grid grid-cols-12 gap-4 content">
                    <div className="col-start-2 col-span-10">
                        <div dangerouslySetInnerHTML={{ __html: dataBlog.content }} />
                    </div>
                </div>

                <div className="mx-auto mt-20" style={{ width: '85%' }}>
                    <div className="flex items-center bg-[#F5F5F5] p-4">
                        <div className="mr-4">
                            <img src="/blog.svg" alt="blog" width={26} height={26} />
                        </div>
                        <div className="text-sm">
                            Cập nhật vào: {dataBlog.updatedAt}
                        </div>

                        <div className="ml-auto flex"> {/* Sử dụng ml-auto để đẩy về bên phải */}
                            <p className="mr-2 flex items-center">Share:</p>
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 text-blue-500 hover:text-blue-700"
                            >
                                <FontAwesomeIcon icon={faFacebook} style={{ fontSize: 30 }} />
                            </a>
                            <a
                                href={`https://www.instagram.com/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 text-pink-500 hover:text-pink-700"
                            >
                                <FontAwesomeIcon icon={faInstagram} style={{ fontSize: 30 }} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-10">
                <h1 className="text-2xl mb-5 ml-10" style={{ borderLeft: '8px solid black' }}>
                    &nbsp; Tin Tức Mới Nhất
                </h1>
                <div className="max-w-[1200px] mx-auto grid grid-cols-1 gap-5 justify-center sm:flex mt-10 mb-10">
                    {dataAllBlog.map((blog) => (
                        <div key={blog.pro_code} onClick={() => nav(`/blog/${blog.slug}`)}>
                            <div className="w-full h-80 sm:w-72 bg-white shadow-md hover:shadow-lg rounded-xl overflow-hidden">
                                <div className="flex justify-center items-center">
                                    <img
                                        className="w-full h-40 object-cover sm:h-44 sm:w-60"
                                        src={`${blog.cover}`}
                                        alt=""
                                    />
                                </div>
                                <div className="p-4">
                                    <p className="text-lg font-semibold mb-2">{blog.title}</p>
                                    <p className="text-gray-600">{blog.sub_content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

        </div>
    )
}
export default BlogDetail;