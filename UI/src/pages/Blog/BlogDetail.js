import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosCli } from "../../interceptor/axios";
import Navbar from "../../components/NavbarUser/Navbar";
import './blog.css'
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { Button } from "antd";
import CarouselBlog from "../../components/CarouselCard/CarouselBlog";
import Footer from "../../components/Footer/Footer";
import Report from "../../components/Report/Report";
import Loader from "../../components/Spin/Spin";

const BlogDetail = () => {
    const { slug } = useParams();
    const nav = useNavigate();
    const [dataBlog, setDataBlog] = useState([]);
    const [dataAllBlog, setDataAllBlog] = useState([]);
    const [dataCenter, setDataCenter] = useState([]);
    useEffect(() => {
        getDataBlog();
        getAllDataBlog();
        getDataCenter();
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
            // setDataAllBlog(data);
        })
    }
    const getDataCenter = async () => {
        await axiosCli().get('user/data-center').then(res => {
            setDataCenter(res.data);
        })
    }
    // handle Tag when click
    const handleTag = (e) => {
        const text = e.target.textContent;
        nav(`/blog/tag/${text}`)
    }
    return (
        <div>
            <div>
                <Loader />
            </div>
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
                        <div className="text-sm ml-4">
                            Tag:
                            {dataBlog.hashtags?.map((tag, index) => (
                                <Button key={index} className="ml-1" onClick={handleTag}>{tag}</Button>
                            ))}
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
            <div className="mt-20">
                <h1 className="text-2xl mb-5 ml-10" style={{ borderLeft: '8px solid black' }}>
                    &nbsp; Tin Tức
                </h1>
                <div className="max-w-[1200px] mx-auto grid grid-cols-1 gap-5 justify-center sm:flex mt-10 mb-10">
                    <div className="glide-01 relative w-full">
                        <div className="overflow-hidden" data-glide-el="track">
                            <ul className="whitespace-no-wrap flex-no-wrap [backface-visibility: hidden] [transform-style: preserve-3d] [touch-action: pan-Y] [will-change: transform] relative flex w-full overflow-hidden p-0">
                                <li></li>
                                <li></li>
                                {dataAllBlog && dataAllBlog?.map((blog) => (
                                    <li key={blog.pro_code} className="mr-4" onClick={() => nav(`/blog/${blog.slug}`)}>
                                        <div className="border w-full h-64 sm:w-72 bg-white shadow-md hover:shadow-lg rounded-xl overflow-hidden" onClick={() => nav(`/blog/${blog.slug}`)}>
                                            <div className="flex justify-center items-center">
                                                <img
                                                    className="w-full h-40 object-cover sm:h-44"
                                                    src={`${blog.cover}`}
                                                    alt=""
                                                    width={100}
                                                    height={100}
                                                />
                                            </div>
                                            <div className="p-4">
                                                <p className="text-sm font-semibold mb-2 truncate">{blog.title}</p>
                                                <p className="text-gray-600 text-sm truncate">{blog.sub_content}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                                <li></li>
                                <li></li>
                            </ul>
                        </div>
                        <div
                            className="absolute left-0 top-1/2 flex h-0 w-full items-center justify-between px-4 "
                            data-glide-el="controls"
                        >
                            <button
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-white/20 text-slate-700 transition duration-300 hover:border-slate-900 hover:text-slate-900 focus-visible:outline-none lg:h-12 lg:w-12"
                                data-glide-dir="<"
                                aria-label="prev slide"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="h-5 w-5"
                                >
                                    <title>prev slide</title>
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                                    />
                                </svg>
                            </button>
                            <button
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-white/20 text-slate-700 transition duration-300 hover:border-slate-900 hover:text-slate-900 focus-visible:outline-none lg:h-12 lg:w-12"
                                data-glide-dir=">"
                                aria-label="next slide"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="h-5 w-5"
                                >
                                    <title>next slide</title>
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

            </div>
            <div>
                <Report props={dataCenter} />
            </div>
            <div>
                <Footer />
            </div>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/Glide.js/3.0.2/glide.js"></script>
        </div>
    )
}
export default BlogDetail;