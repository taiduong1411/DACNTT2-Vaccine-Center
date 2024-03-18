import Navbar from "../../components/Sidebar/Doctor/navbar";
import Sidebar from "../../components/Sidebar/Admin/sidebar";
import { Layout, Card } from 'antd';
import { useEffect, useState } from "react";
import { axiosCli } from "../../interceptor/axios";
import { Line } from "react-chartjs-2";
import Chart from 'chart.js/auto';
import { Doughnut } from "react-chartjs-2"
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Spin/Spin";

const { Content } = Layout;
const Dashboard = () => {
    const nav = useNavigate();
    const [data, setData] = useState([]);
    useEffect(() => {
        getDataDashboard();
    }, []);
    const getDataDashboard = async () => {
        await axiosCli().get('admin/dashboard').then(res => {
            setData(res.data)
        })
    }
    return (
        <div>
            <div>
                <Loader />
            </div>
            <Navbar />
            <div className="flex">
                <Sidebar props={1} />
                <Layout>
                    <Content
                        style={{
                            margin: '24px 16px 0',
                        }}
                    >
                        <div>
                            <div>
                                <p className="text-2xl"><strong>OVERVIEW</strong></p>
                            </div>
                            <div className="min-[1200px]:mt-5 max-[1200px]:mt-5 min-[1200px]:w-fit min-[1200px]:m-auto  max-[1200px]:w-fit max-[1200px]:items-center">
                                <div className="inline-block mr-4 hover:shadow-lg max-[1200px]:mt-3 transition-transform transform hover:scale-105"
                                    onClick={() => nav('/admin/dashboard')}
                                >
                                    <Card className="overflow-hidden bg-white rounded-lg shadow-md" style={{ width: '200px' }} >
                                        <div className="flex items-center justify-center p-4">
                                            <img src="/users.svg" alt="abc" width={50} height={50} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-semibold"><strong>Tổng Số Người Dùng</strong></p>
                                            <p className="text-2xl text-gray-700"><strong>{data.totalUsers}</strong></p>
                                        </div>
                                    </Card>
                                </div>
                                <div className="inline-block mr-4 hover:shadow-lg max-[1200px]:mt-3 transition-transform transform hover:scale-105"
                                    onClick={() => nav('/admin/doctor-manager')}
                                >
                                    <Card className="overflow-hidden bg-white rounded-lg shadow-md" style={{ width: '200px' }}>
                                        <div className="flex items-center justify-center p-4">
                                            <img src="/doctor.svg" alt="abc" width={50} height={50} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-semibold"><strong>Tổng Số Bác Sĩ</strong></p>
                                            <p className="text-2xl text-gray-700"><strong>{data.totalDoctors}</strong></p>
                                        </div>
                                    </Card>
                                </div>
                                <div className="inline-block mr-4 hover:shadow-lg max-[1200px]:mt-3 transition-transform transform hover:scale-105"
                                    onClick={() => nav('/admin/center-manager')}
                                >
                                    <Card className="overflow-hidden bg-white rounded-lg shadow-md" style={{ width: '200px' }}>
                                        <div className="flex items-center justify-center p-4">
                                            <img src="/hospital.svg" alt="abc" width={50} height={50} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-semibold"><strong>Tổng Số Trung Tâm</strong></p>
                                            <p className="text-2xl text-gray-700"><strong>{data.totalCenters}</strong></p>
                                        </div>
                                    </Card>
                                </div>
                                <div className="inline-block mr-4 hover:shadow-lg max-[1200px]:mt-3 transition-transform transform hover:scale-105"
                                    onClick={() => nav('/admin/vaccine-manager')}
                                >
                                    <Card className="overflow-hidden bg-white rounded-lg shadow-md" style={{ width: '200px' }}>
                                        <div className="flex items-center justify-center p-4">
                                            <img src="/vaccine.svg" alt="abc" width={50} height={50} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-semibold"><strong>Tổng Số Vắc Xin</strong></p>
                                            <p className="text-2xl text-gray-700"><strong>{data.totalVaccines}</strong></p>
                                        </div>
                                    </Card>
                                </div>
                                <div className="inline-block mr-4 hover:shadow-lg max-[1200px]:mt-3 transition-transform transform hover:scale-105"
                                    onClick={() => nav('/admin/blog-manager')}
                                >
                                    <Card className="overflow-hidden bg-white rounded-lg shadow-md" style={{ width: '200px' }}>
                                        <div className="flex items-center justify-center p-4">
                                            <img src="/blog.svg" alt="abc" width={50} height={50} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-semibold"><strong>Tổng Số Bài Blog</strong></p>
                                            <p className="text-2xl text-gray-700"><strong>{data.totalBlogs}</strong></p>
                                        </div>
                                    </Card>
                                </div>
                                {/* <div className="inline-block mr-4 hover:scale-105 max-[1200px]:mt-3 ">
                                    <Card
                                        style={{
                                            width: 210,
                                        }}
                                    >
                                        <div className="inline-block">
                                            <img src="/hospital.svg" alt="abc" width={50} height={50} className="hidden" />
                                        </div>
                                        <div className="inline-block">
                                            <p className="text-center"><strong>Tổng Số Trung Tâm</strong></p>
                                            <p className="text-4xl text-center"><strong>{data.totalCenters}</strong></p>
                                        </div>
                                    </Card>
                                </div> */}
                            </div>
                            <div className="min-[1200px]:mt-10 min-[1200px]:w-fit min-[1200px]:m-auto mb-5">
                                <div className="inline-block mr-5">
                                    <Card
                                        style={{
                                            width: 670,
                                            height: 500
                                        }}
                                    >
                                        <Line
                                            data={{
                                                labels: [1500, 1600, 1700, 1750, 1800, 1850, 1900, 1950, 1999, 2050],
                                                datasets: [
                                                    {
                                                        data: [86, 114, 106, 106, 107, 111, 133, 221, 783, 2478],
                                                        label: "Africa",
                                                        borderColor: "#3e95cd",
                                                        fill: false
                                                    },
                                                    {
                                                        data: [282, 350, 411, 502, 635, 809, 947, 1402, 3700, 5267],
                                                        label: "Asia",
                                                        borderColor: "#8e5ea2",
                                                        fill: false
                                                    },
                                                    {
                                                        data: [168, 170, 178, 190, 203, 276, 408, 547, 675, 734],
                                                        label: "Europe",
                                                        borderColor: "#3cba9f",
                                                        fill: false
                                                    },
                                                    {
                                                        data: [40, 20, 10, 16, 24, 38, 74, 167, 508, 784],
                                                        label: "Latin America",
                                                        borderColor: "#e8c3b9",
                                                        fill: false
                                                    },
                                                    {
                                                        data: [6, 3, 2, 2, 7, 26, 82, 172, 312, 433],
                                                        label: "North America",
                                                        borderColor: "#c45850",
                                                        fill: false
                                                    }
                                                ]
                                            }}
                                            options={{
                                                title: {
                                                    display: true,
                                                    text: "World population per region (in millions)"
                                                },
                                                legend: {
                                                    display: true,
                                                    position: "bottom"
                                                }
                                            }}
                                        />
                                    </Card>
                                </div>
                                <div className="inline-block ">
                                    <Card
                                        style={{
                                            width: 470,
                                            height: 500
                                        }}
                                    >
                                        <Doughnut
                                            data={{
                                                labels: [
                                                    "Africa",
                                                    "Asia",
                                                    "Europe",
                                                    "Latin America",
                                                    "North America"
                                                ],
                                                datasets: [
                                                    {
                                                        label: "Population (millions)",
                                                        backgroundColor: [
                                                            "#3e95cd",
                                                            "#8e5ea2",
                                                            "#3cba9f",
                                                            "#e8c3b9",
                                                            "#c45850"
                                                        ],
                                                        data: [2478, 5267, 734, 784, 433]
                                                    }
                                                ]
                                            }}
                                            option={{
                                                title: {
                                                    display: true,
                                                    text: "Predicted world population (millions) in 2050"
                                                }
                                            }}
                                        />
                                    </Card>
                                </div>
                            </div>
                            {/* <div className="min-[1200px]:mt-10 min-[1200px]:w-fit min-[1200px]:m-auto mb-5">
                                <div className="inline-block mr-5">
                                    <Card
                                        style={{
                                            width: 670,
                                            height: 500
                                        }}
                                    >
                                        <Line
                                            data={{
                                                labels: [1500, 1600, 1700, 1750, 1800, 1850, 1900, 1950, 1999, 2050],
                                                datasets: [
                                                    {
                                                        data: [86, 114, 106, 106, 107, 111, 133, 221, 783, 2478],
                                                        label: "Africa",
                                                        borderColor: "#3e95cd",
                                                        fill: false
                                                    },
                                                    {
                                                        data: [282, 350, 411, 502, 635, 809, 947, 1402, 3700, 5267],
                                                        label: "Asia",
                                                        borderColor: "#8e5ea2",
                                                        fill: false
                                                    },
                                                    {
                                                        data: [168, 170, 178, 190, 203, 276, 408, 547, 675, 734],
                                                        label: "Europe",
                                                        borderColor: "#3cba9f",
                                                        fill: false
                                                    },
                                                    {
                                                        data: [40, 20, 10, 16, 24, 38, 74, 167, 508, 784],
                                                        label: "Latin America",
                                                        borderColor: "#e8c3b9",
                                                        fill: false
                                                    },
                                                    {
                                                        data: [6, 3, 2, 2, 7, 26, 82, 172, 312, 433],
                                                        label: "North America",
                                                        borderColor: "#c45850",
                                                        fill: false
                                                    }
                                                ]
                                            }}
                                            options={{
                                                title: {
                                                    display: true,
                                                    text: "World population per region (in millions)"
                                                },
                                                legend: {
                                                    display: true,
                                                    position: "bottom"
                                                }
                                            }}
                                        />
                                    </Card>
                                </div>
                                <div className="inline-block ">
                                    <Card
                                        style={{
                                            width: 470,
                                            height: 500
                                        }}
                                    >
                                        <Doughnut
                                            data={{
                                                labels: [
                                                    "Africa",
                                                    "Asia",
                                                    "Europe",
                                                    "Latin America",
                                                    "North America"
                                                ],
                                                datasets: [
                                                    {
                                                        label: "Population (millions)",
                                                        backgroundColor: [
                                                            "#3e95cd",
                                                            "#8e5ea2",
                                                            "#3cba9f",
                                                            "#e8c3b9",
                                                            "#c45850"
                                                        ],
                                                        data: [2478, 5267, 734, 784, 433]
                                                    }
                                                ]
                                            }}
                                            option={{
                                                title: {
                                                    display: true,
                                                    text: "Predicted world population (millions) in 2050"
                                                }
                                            }}
                                        />
                                    </Card>
                                </div>
                            </div> */}

                        </div>
                    </Content>
                </Layout>
            </div>
        </div>
    );
}

export default Dashboard;