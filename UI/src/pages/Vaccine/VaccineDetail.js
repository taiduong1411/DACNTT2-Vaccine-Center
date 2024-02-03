import { useNavigate, useParams } from "react-router-dom";
import NavBar from '../../components/NavbarUser/Navbar'
import { useEffect, useState } from "react";
import { axiosCli } from "../../interceptor/axios";
import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import { Navigate } from "react-router-dom";

function VaccineDetail() {
    const { slug } = useParams();
    useEffect(() => {
        getDataDetailVaccine();
    }, [slug]);
    const nav = useNavigate();
    const [dataDetail, setDataDetail] = useState([]);
    const [dataAllVaccine, setDataAllVaccine] = useState([])
    const getDataDetailVaccine = async () => {
        await axiosCli().get(`user/detail-vaccine/${slug}`).then(res => {
            console.log(res.data);
            setDataDetail(res.data)
        })
        await axiosCli().get('user/data-vaccine').then(res => {
            let data = res.data
            setDataAllVaccine(data.filter((e) => e.slug != slug));
        })
    }

    return (
        <div>
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
                    <div className="text-center flex justify-center mb-8">
                        <img className="align-middle" width={200} height={100} src={dataDetail.cover} alt="abc" />
                    </div>
                    <h1 className="text-4xl text-center font-bold text-blue-400 mb-12">
                        {dataDetail.pro_name}
                    </h1>
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
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-20">
                <h1 className="text-2xl mb-5 ml-10 font-bold" style={{ borderLeft: '8px solid black' }}>
                    &nbsp; Các Vắc Xin Khác
                </h1>
                <div className="max-w-[1200px] mx-auto grid grid-cols-1 gap-5 justify-left sm:flex mt-10 mb-10">
                    {dataAllVaccine.map((data) => (
                        <div key={data.pro_code} onClick={() => nav(`/vaccine/${data.slug}`)}>
                            <div className="w-full h-80 sm:w-72 bg-white shadow-md hover:shadow-lg rounded-xl overflow-hidden">
                                <img
                                    className="w-full h-40 object-cover sm:h-44"
                                    src={`${data.cover}`}
                                    alt=""
                                />
                                <div className="p-4 flex flex-col justify-between h-full">
                                    <p className="text-lg font-semibold mb-2">{data.pro_name}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

export default VaccineDetail;