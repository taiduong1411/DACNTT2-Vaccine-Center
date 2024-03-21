import { useNavigate, useParams } from "react-router-dom";
import NavBar from '../../components/NavbarUser/Navbar'
import { useEffect, useState } from "react";
import { axiosCli } from "../../interceptor/axios";
import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Carousel } from 'antd';
import { Navigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Report from "../../components/Report/Report";
import Loader from "../../components/Spin/Spin";
function VaccineDetail() {
    const { slug } = useParams();
    useEffect(() => {
        getDataDetailVaccine();
        getDataCenter();
    }, [slug]);
    const contentStyle = {
        height: '460px',
        color: '#fff',
        lineHeight: '160px',
        textAlign: 'center',
        background: '#F0F0F0F0',
    };
    const nav = useNavigate();
    const [dataDetail, setDataDetail] = useState([]);
    const [dataAllVaccine, setDataAllVaccine] = useState([]);
    const [dataCenter, setDataCenter] = useState([]);

    const getDataDetailVaccine = async () => {
        await axiosCli().get(`user/detail-vaccine/${slug}`).then(res => {
            setDataDetail(res.data)
        })
        await axiosCli().get('user/data-vaccine').then(res => {
            let data = res.data
            setDataAllVaccine(data.filter((e) => e.slug != slug));

        })
    }
    const getDataCenter = async () => {
        await axiosCli().get('user/data-center').then(res => {
            setDataCenter(res.data);
        })
    }
    const handleClickBooking = async () => {
        nav(`/book-appointment/${dataDetail.slug}`)
    }
    // Check Amount Vaccine
    const [amount, setAmount] = useState('');
    const handleCenter = async (e) => {
        const idCenter = e.target.value;
        if (idCenter == 'null') {
            setAmount('')
        } else {
            await axiosCli().get(`user/check-amount-vaccine/${idCenter}/${dataDetail._id}`).then(res => {
                setAmount(res.data)
            })
        }
    }

    return (
        <div>
            <div>
                <Loader />
            </div>
            <NavBar />
            <div className="ml-4 mt-4">
                <Breadcrumb
                    items={[
                        {
                            href: '/home',
                            title: <HomeOutlined />,
                        },
                        {
                            // href: '',
                            title: (
                                <>
                                    {/* <UserOutlined /> */}
                                    <span>Chi Tiết Vaccine</span>
                                </>
                            ),
                        },
                        {
                            title: `${dataDetail.pro_name}`,
                        },
                    ]}
                />
            </div>
            <div>
                <div className="mt-4">
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                        <div className="mb-10 md:mb-0 mx-auto overflow-hidden">
                            <Carousel autoplay style={{ width: '100%', maxWidth: '550px' }} className="ml-1">
                                {dataDetail.img?.map((image, index) => (
                                    <div key={index}>
                                        <h3 style={contentStyle}>
                                            <img src={image} alt={`Image ${index}`} className="w-full h-full" />
                                        </h3>
                                    </div>
                                ))}
                            </Carousel>
                        </div>
                        <div className="relative w-[85%] mx-auto rounded-lg border">
                            <div className="bg-orange-500 h-20 rounded-t-lg flex items-center justify-center">
                                <p className="text-xl text-center text-white" style={{ lineHeight: '70px' }}><strong>[{dataDetail.pro_code}] {dataDetail.pro_name}</strong></p>
                            </div>
                            <div className="bg-white p-6 text-black">
                                <p className="mb-2 mt-4"><strong>Cam Kết:</strong></p>
                                <ul className="list-disc pl-4" style={{ listStyleType: 'none' }}>
                                    <li className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" className="bi bi-check-circle-fill mr-2" viewBox="0 0 16 16">
                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                        </svg>
                                        <span>Đúng Giá</span>
                                    </li>
                                    <li className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" className="bi bi-check-circle-fill mr-2" viewBox="0 0 16 16">
                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                        </svg>
                                        <span>Chất Lượng Được Kiểm Định</span>
                                    </li>
                                    <li className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" className="bi bi-check-circle-fill mr-2" viewBox="0 0 16 16">
                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                        </svg>
                                        <span>Hỗ Trợ 24/7</span>
                                    </li>
                                </ul>
                                <p className="mb-4 mt-4 inline-block"><strong>Kiểm Tra Trung Tâm Có Vắc Xin:</strong>
                                    <br />
                                    <select name="center" className="mt-4" onChange={handleCenter}>
                                        <option value="null">Chọn Trung Tâm</option>
                                        {dataCenter.map((center, index) => (
                                            <option value={center._id} key={index}>{center.center_name}</option>
                                        ))}
                                    </select>
                                </p>
                                <p className={`${amount == '' ? "hidden" : "mt-4 inline-block"}`}>
                                    {parseInt(amount) > 0
                                        ? <div>Còn<strong> {amount}</strong> liều</div>
                                        : <div><strong>Tạm Thời Hết Vắc Xin</strong></div>
                                    }
                                </p>
                            </div>
                            <div className="flex justify-end p-4 rounded-b-lg">
                                {/* <button className="text-white px-4 py-2 bg-orange-500 rounded-md hover:bg-orange-400 transition-colors duration-300">Xem chi tiết</button> */}
                                <button className="text-white px-4 py-2 bg-orange-500 rounded-md hover:bg-orange-400 transition-colors duration-300 float-right" onClick={handleClickBooking}>Đặt lịch ngay</button>
                            </div>

                        </div>
                    </div>
                    {/* Information */}
                    <div className="grid grid-cols-12 gap-4 content" >
                        <div className="inline-block col-start-2 col-span-10 border rounded-2xl p-8">
                            <div className="mb-4">
                                <div className="p-2 bg-blue-700 rounded-md flex items-center mb-4">
                                    <h2 className="text-xl font-bold text-orange-400 ml-4">1. Thông Tin Chung</h2>
                                </div>
                                <div className=''>
                                    <div dangerouslySetInnerHTML={{ __html: dataDetail.details?.generalInformation }} />
                                </div>
                            </div>
                            <div className="mb-4">
                                <div className="p-2 bg-blue-700 rounded-md flex items-center mb-4">
                                    <h2 className="text-xl font-bold text-orange-400 ml-4">2. Đối Tượng</h2>
                                </div>
                                <div className=''>
                                    <div dangerouslySetInnerHTML={{ __html: dataDetail.details?.vaccineForPerson }} />
                                </div>
                            </div>
                            <div className="mb-4">
                                <div className="p-2 bg-blue-700 rounded-md flex items-center mb-4">
                                    <h2 className="text-xl font-bold text-orange-400 ml-4">4. Phác Đồ - Lịch Tiêm </h2>
                                </div>
                                <div className=''>
                                    <div dangerouslySetInnerHTML={{ __html: dataDetail.details?.vaccineSchedule }} />
                                </div>
                            </div>
                            <div className="mb-4">
                                <div className="p-2 bg-blue-700 rounded-md flex items-center mb-4">
                                    <h2 className="text-xl font-bold text-orange-400 ml-4">5. Phản Ứng Sau Khi Tiêm </h2>
                                </div>
                                <div className=''>
                                    <div dangerouslySetInnerHTML={{ __html: dataDetail.details?.vaccineReact }} />
                                </div>
                            </div>
                            <div className="mb-4">
                                <div className="p-2 bg-blue-700 rounded-md flex items-center mb-4">
                                    <h2 className="text-xl font-bold text-orange-400 ml-4">6. Tình Trạng Vắc Xin </h2>
                                </div>
                                <div className=''>
                                    <div dangerouslySetInnerHTML={{ __html: dataDetail.details?.vaccineStatus }} />
                                </div>
                            </div>
                            <div className="mb-4">
                                <div className="p-2 bg-blue-700 rounded-md flex items-center mb-4">
                                    <h2 className="text-xl font-bold text-orange-400 ml-4">7. Khoảng Cách Với Các Vắc Xin Khác </h2>
                                </div>
                                <div className=''>
                                    <div dangerouslySetInnerHTML={{ __html: dataDetail.details?.vaccineDistance }} />
                                </div>
                            </div>
                            <div className="mb-4">
                                <div className="p-2 bg-blue-700 rounded-md flex items-center mb-4">
                                    <h2 className="text-xl font-bold text-orange-400 ml-4">8. Các Câu Hỏi Thường Gặp </h2>
                                </div>
                                <div className=''>
                                    <div dangerouslySetInnerHTML={{ __html: dataDetail.details?.vaccineFaq }} />
                                </div>
                            </div>
                            <div className="float-right mb-4 mt-10">
                                <Button style={{ backgroundColor: 'orange' }} size="large" type="primary" onClick={handleClickBooking}>Đặt Lịch</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <Report props={dataCenter} />
            </div>
            <div className="mt-10">
                <Footer />
            </div>
        </div>
    );
}

export default VaccineDetail;