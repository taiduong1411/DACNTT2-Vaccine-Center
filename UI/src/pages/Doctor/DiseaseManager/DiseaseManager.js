import Navbar from "../../../components/Sidebar/Doctor/navbar";
import Sidebar from "../../../components/Sidebar/Doctor/sidebar";
import { Table, Layout, Badge, Space, Button, Modal, message } from 'antd';
import { useEffect, useState } from "react";
import { axiosCli } from "../../../interceptor/axios";
import { useForm } from 'react-hook-form';
import Loader from "../../../components/Spin/Spin";

const { Content } = Layout;
function DiseaseManagerDoctor() {
    const columns = [
        {
            title: "Thông Tin Người Báo Cáo",
            key: 'email',
            render: (record) => {
                if (record.email) {
                    return <div>{record.email}</div>
                } else {
                    return <div>{record.phone}</div>
                }
            }
        },
        {
            title: 'Mô Tả Dịch Bệnh',
            dataIndex: 'desc',
            key: 'desc'
        },
        {
            title: 'Ghi Chú',
            dataIndex: 'note',
            key: 'note'
        },
        {
            title: 'Tình Trạng',
            key: 'isComplete',
            render: (record) => {
                if (record.status == '1') {
                    return <div>
                        <Badge status="warning" text='Chờ tiếp nhận' />
                    </div>
                }
                else if (record.status == '2') {
                    return <div>
                        <Badge status="error" text='Từ chối tiếp nhận' />
                    </div>
                } else {
                    return <div>
                        <Badge status="success" text='Đã tiếp nhận' />
                    </div>
                }
            }
        }, {
            title: 'Hành Động',
            key: 'Action',
            render: (record) => {
                if (record.status == 1) {
                    return <>
                        <Space size="middle">
                            <Button type="primary" style={{ backgroundColor: 'red' }} data-id={record.diseaseId} data-cid={record.centerId} onClick={showDel}>Từ Chối</Button>
                            <Button type="primary" style={{ backgroundColor: 'green' }} data-id={record.diseaseId} data-desc={record.desc} data-cid={record.centerId} onClick={showAccept} >Tiếp Nhận</Button>
                        </Space>
                    </>
                } else {
                    return (
                        <div></div>
                    )
                }
            }
        }

    ]
    const [dataDisease, setDataDisease] = useState([]);
    const [isSearch, setIsSearch] = useState(false);
    useEffect(() => {
        if (isSearch === false) {
            const intervalId = setInterval(() => {
                getDataDisease();
            }, 1000);
            // Đảm bảo rằng bạn xóa bỏ setInterval khi component unmount để tránh rò rỉ bộ nhớ
            return () => clearInterval(intervalId);
        } else {
            getDataDisease();
        }
    }, [isSearch]);
    const getDataDisease = async () => {
        await axiosCli().get('doctor/data-disease').then(res => {
            setDataDisease(res.data)
        })
    }
    // Delete
    const [messageApi, contextHolder] = message.useMessage();
    const [openDel, setOpenDel] = useState(false);
    const [dataId, setDataId] = useState([]);
    const showDel = (event) => {
        setOpenDel(!openDel);
        const data = {
            id: event.currentTarget.dataset.id,
        }
        setDataId(data);
    }
    const handelOk = async () => {
        setOpenDel(false);
        deleteById(dataId.id);
    }
    const deleteById = async (_id) => {
        await axiosCli().del(`doctor/delete-report/${_id}`).then(res => {
            if (res.status == 200) {
                messageApi.open({
                    type: 'success',
                    content: res.data.msg
                })
                getDataDisease();
            } else {
                messageApi.open({
                    type: 'error',
                    content: res.data.msg
                })
            }
        })
    }


    //    accept
    const [openAccept, setOpenAccept] = useState(false);
    const [dataAcptId, setDataAcptId] = useState([]);
    const showAccept = (event) => {
        setOpenAccept(!openDel);
        const data = {
            id: event.currentTarget.dataset.id,
        }
        setDataAcptId(data);
        console.log(data);
    }
    const handelAcptOk = async () => {
        setOpenAccept(false);
        acptById(dataAcptId.id);
    }
    const acptById = async (_id) => {
        await axiosCli().get(`doctor/accept-report/${_id}`).then(res => {
            if (res.status == 200) {
                messageApi.open({
                    type: 'success',
                    content: res.data.msg
                })
                getDataDisease();
            } else {
                messageApi.open({
                    type: 'error',
                    content: res.data.msg
                })
            }
        })
    }


    // Search
    const { register, handleSubmit } = useForm();
    const onSearchSubmit = async (data) => {
        setIsSearch(true);
        await axiosCli().get(`doctor/search-report/${data.key}`).then(res => {
            console.log(res.data);
            if (res.data.length < 1) {
                setDataDisease([]);
                messageApi.open({
                    type: 'warning',
                    content: 'Không tìm thấy báo cáo dịch bệnh'
                })
            } else {
                setDataDisease(res.data)
            }
        })
    }
    const onInput = (e) => {
        if (e.target.value.length < 1) {
            setIsSearch(false)
            getDataDisease();
        } else {
            setIsSearch(true);
        }
    }


    return (
        <div>
            {contextHolder}
            <div>
                <Loader />
            </div>
            <Navbar />
            <div className="flex">
                <Sidebar props={5} />
                <Layout>
                    <Content
                        style={{
                            margin: '24px 16px 0',
                        }}
                    >
                        <div>
                            <form className="space-y-1 md:space-y-6 mt-4 mb-10" onSubmit={handleSubmit(onSearchSubmit)}>
                                <div className="relative mb-8">
                                    <input type="search" {...register("key")} onInput={onInput} id="default-search" className="block w-full p-4 pl-10 text-sm border border-gray-300 rounded-lg text-black bg-gray-50 focus:ring-blue-500 focus:border-blue-50 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Nhập tên trung tâm..." required />
                                    <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                                </div>
                            </form>
                        </div>
                        <Table dataSource={dataDisease} columns={columns} />
                    </Content>
                </Layout>
            </div>
            {/* Delete */}
            <Modal title="Từ chối tiếp nhận xử lý dịch bệnh" open={openDel} onOk={handelOk} okButtonProps={{ style: { backgroundColor: 'red' } }} onCancel={() => setOpenDel(false)}>
                <p><strong>Bạn có chắc chắn muốn từ chối giải quyết dịch bệnh này ?</strong></p>
            </Modal>
            {/* Accept */}
            <Modal title="Tiếp nhận xử lý dịch bệnh" open={openAccept} onOk={handelAcptOk} okButtonProps={{ style: { backgroundColor: 'green' } }} onCancel={() => setOpenAccept(false)}>
                <p><strong>Bạn có chắc chắn muốn tiếp nhận giải quyết dịch bệnh này ?</strong></p>
            </Modal>
        </div>
    );
}

export default DiseaseManagerDoctor;