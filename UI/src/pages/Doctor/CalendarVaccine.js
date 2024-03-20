import { useEffect, useState } from "react";
import Navbar from "../../components/Sidebar/Doctor/navbar";
import Sidebar from "../../components/Sidebar/Doctor/sidebar";
import { Layout, theme, Table, Space, Popover, Button, Modal, message, Tag } from 'antd';
import { axiosCli } from "../../interceptor/axios";
import { useForm } from "react-hook-form";
import { EditOutlined, CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import Loader from "../../components/Spin/Spin";



const { Content } = Layout;
function CalendarVaccine() {
    const columns = [
        {
            title: 'Tên Khách Hàng',
            key: 'fullname',
            render: (record) => {
                const content = (
                    <div>
                        <strong>Email:</strong> {record.email} <br />
                        <strong>Phone:</strong> {record.phone}
                    </div>
                );
                return (
                    <Space wrap>
                        <Popover content={content} trigger="hover">
                            {record.fullname}
                        </Popover>
                    </Space>
                )
            }
        },
        {
            title: 'Ngày/Giờ Tiêm',
            key: 'dateBooking',
            render: (record) => {
                return <div>
                    <strong>Ngày</strong>: {record.dateBooking}<br />
                    <strong>Giờ</strong>: {record.timeBooking}
                </div>
            }
        },
        {
            title: 'Tên Vắc Xin',
            dataIndex: 'v_name',
            key: 'v_name',
        },
        {
            title: 'Trạng Thái',
            key: 'Action',
            render: (record) => {
                if (record.status == '2') {
                    return <div>
                        <Tag color="purple">Đã xác nhận lịch</Tag>
                    </div>
                } else if (record.status == '1') {
                    return <div>
                        <Tag color="gold">Chờ xác nhận lịch</Tag>
                    </div>
                } else if (record.status == '4') {
                    return <div>
                        <Tag color="red">Lịch đã bị huỷ</Tag>
                    </div>
                } else {
                    return <div>
                        <Tag color="green">Tiêm Thành Công</Tag>
                    </div>
                }
            }

        }, {
            title: 'Hành Động',
            key: 'action',
            render: (record) => {
                if (record.status == '2') {
                    return <div>
                        <Button type="primary" style={{ backgroundColor: 'green', width: '128px', marginRight: '6px' }} onClick={showSuccess} icon={<CheckOutlined />} data-id={record._id} >Thành Công</Button>
                        <Button type="primary" style={{ backgroundColor: 'red', width: '120px', }} icon={<DeleteOutlined />} onClick={showCancel} data-id={record._id} >Vắng Mặt</Button>
                    </div>
                } else if (record.status == '1') {
                    return <div>
                        <Button type="primary" style={{ backgroundColor: 'orange', width: '120px', marginRight: '6px' }} icon={<EditOutlined />} onClick={showConfirm} data-id={record._id} >Sửa Lịch</Button>
                        <Button type="primary" style={{ backgroundColor: 'blue', width: '120px', }} icon={<CheckOutlined />} onClick={confirmBooking} data-id={record._id} >Xác Nhận</Button>
                    </div>
                } else {
                    return ''
                }
            }
        }
    ];
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [dataBooking, setDataBooking] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const { register, handleSubmit } = useForm();
    const [isSearch, setIsSearch] = useState(false);
    useEffect(() => {
        if (isSearch === false) {
            const intervalId = setInterval(() => {
                getDataBooking();
            }, 100);
            // Đảm bảo rằng bạn xóa bỏ setInterval khi component unmount để tránh rò rỉ bộ nhớ
            return () => clearInterval(intervalId);
        } else {
            getDataBooking();
        }
    }, [isSearch]);
    const getDataBooking = async () => {
        await axiosCli().get('doctor/data-booking').then(res => {
            setDataBooking(res.data)
        })
    }
    // Edit Booking
    const [openEdit, setOpenEdit] = useState(false);
    const [dataBookingById, setDataBookingById] = useState([]);
    const showConfirm = async (e) => {
        setOpenEdit(true)
        const id = e.currentTarget.dataset.id;
        await axiosCli().get(`doctor/getDataBookingById/${id}`).then(res => {
            setDataBookingById(res.data)
        })
    }
    const onSubmit = async (data) => {
        const submitData = {
            email: dataBookingById.email,
            fullname: dataBookingById.fullname,
            phone: dataBookingById.phone,
            dateBooking: data['dateBooking'] ? data['dateBooking'] : dataBookingById.dateBooking,
            timeBooking: data['timeBooking'] ? data['timeBooking'] : dataBookingById.timeBooking,
            cid: dataBookingById.cid,
            vid: dataBookingById.vid
        }
        await axiosCli().post(`doctor/updateBooking/${dataBookingById._id}`, submitData).then(res => {
            if (res.status == 200) {
                messageApi.open({
                    type: 'success',
                    content: res.data.msg
                });
                setOpenEdit(false);
                getDataBooking();
            } else {
                messageApi.open({
                    type: 'error',
                    content: res.data.msg
                });
                setOpenEdit(false);
            }
        })
    }
    // Confirm Booking 
    const confirmBooking = async (e) => {
        const id = e.currentTarget.dataset.id;
        await axiosCli().get(`doctor/confirm-booking/${id}`).then(res => {
            if (res.status == 200) {
                messageApi.open({
                    type: 'success',
                    content: res.data.msg
                });
                getDataBooking();

            } else {
                messageApi.open({
                    type: 'error',
                    content: res.data.msg
                });
                getDataBooking();
            }
        })
    }
    // Search
    const onSearchSubmit = async (data) => {
        setIsSearch(true);
        await axiosCli().get(`doctor/search-booking/${data.key}`).then(res => {
            setDataBooking(res.data);
            if (res.data.length == 0) {
                messageApi.open({
                    type: 'warning',
                    content: 'Không tìm thấy dữ liệu'
                })
                setDataBooking([]);
            }
        })
    }
    const onInput = (e) => {
        if (e.target.value.length < 1) {
            setIsSearch(false)
        } else {
            setIsSearch(true);
        }
    }
    // Show Success 
    const showSuccess = async (e) => {
        const idSuccess = e.currentTarget.dataset.id;
        await axiosCli().get(`doctor/confirm-success/${idSuccess}`).then(res => {
            if (res.status == 200) {
                messageApi.open({
                    type: 'success',
                    content: res.data.msg
                })
            } else {
                messageApi.open({
                    type: 'error',
                    content: res.data.msg
                })
            }
        })
    }
    // Show Cancel
    const showCancel = async (e) => {
        const idCancel = e.currentTarget.dataset.id;
        await axiosCli().get(`doctor/confirm-cancel/${idCancel}`).then(res => {
            if (res.status == 200) {
                messageApi.open({
                    type: 'success',
                    content: res.data.msg
                })
            } else {
                messageApi.open({
                    type: 'error',
                    content: res.data.msg
                })
            }
        })
    }
    return (
        <div>
            {contextHolder}
            <div>
                <Loader />
            </div>
            <Navbar />
            <div className="flex">
                <Sidebar props={2} />
                <Layout>
                    <Content
                        style={{
                            margin: '24px 16px 0',
                        }}
                    >
                        <div
                            style={{
                                padding: 24,
                                minHeight: 660,
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                            }}
                        >
                            <form className="space-y-1 md:space-y-6 mt-4 mb-10" onSubmit={handleSubmit(onSearchSubmit)}>
                                <div className="relative mb-8">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                        </svg>
                                    </div>
                                    <input type="search" {...register("key")} onInput={onInput} id="default-search" className="block w-full p-4 pl-10 text-sm border border-gray-300 rounded-lg text-black bg-gray-50 focus:ring-blue-500 focus:border-blue-50 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Tìm kiếm lịch tiêm..." required />
                                    <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                                </div>
                            </form>
                            <Table dataSource={dataBooking} columns={columns}></Table>
                        </div>
                    </Content>
                </Layout>
            </div>
            <Modal title="Sửa Lịch Đăng Ký" open={openEdit} onOk={() => setOpenEdit(true)} okButtonProps={{ style: { display: 'none' } }} onCancel={() => setOpenEdit(false)}>
                <form onSubmit={handleSubmit(onSubmit)} >
                    <div className="mb-4">
                        <label htmlFor="dateBooking" className="block mb-2 text-sm font-medium text-gray-900 ">Ngày Đăng Ký</label>
                        <input type="date" id="dateBooking" {...register('dateBooking')} defaultValue={dataBookingById.dateBooking} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Ngày Đăng Ký" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="timeBooking" className="block mb-2 text-sm font-medium text-gray-900 ">Thời Gian Đăng Ký</label>
                        <input type="time" id="timeBooking" {...register('timeBooking')} defaultValue={dataBookingById.timeBooking} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Thời Gian Đăng Ký" required />
                    </div>
                    <button type="submit" className="text-white mb-4 float-right ml-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Submit</button>
                </form>
            </Modal>
        </div>
    );
}

export default CalendarVaccine;