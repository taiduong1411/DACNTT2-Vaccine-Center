import Navbar from "../../../components/Sidebar/Doctor/navbar";
import Sidebar from "../../../components/Sidebar/Admin/sidebar";
import { Table, Layout, Badge, Space, Button, Modal, message } from 'antd';
import { useEffect, useState } from "react";
import { axiosCli } from "../../../interceptor/axios";
import { useForm } from 'react-hook-form';
import Loader from "../../../components/Spin/Spin";
const { Content } = Layout;
function DiseaseManager() {
    const columns = [
        {
            title: "Trung Tâm",
            dataIndex: 'centerName',
            key: 'centerName'
        },
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
            title: 'Tình Trạng',
            key: 'isComplete',
            render: (record) => {
                if (record.isComplete == '1') {
                    return <div>
                        <Badge status="warning" text='Chưa phân công' />
                    </div>
                } else if (record.isComplete == '2') {
                    return <div>
                        <Badge status="warning" text='Chờ tiếp nhận' />
                    </div>
                } else if (record.isComplete == '3') {
                    return <div>
                        <Badge status="error" text='Đã từ chối' />
                    </div>
                } else {
                    return <div>
                        <Badge status="success" text='Đã tiếp nhận' />
                    </div>
                }
            }
        }, {
            title: 'Phân Công',
            key: 'Action',
            render: (record) => {
                if (record.isComplete == '1') {
                    return (
                        <>
                            <Space size="middle">
                                <Button type="primary" style={{ backgroundColor: 'red' }} data-id={record._id} data-cid={record.centerId} onClick={showDel}>Xoá</Button>
                                <Button type="primary" style={{ backgroundColor: 'green' }} data-id={record._id} data-desc={record.desc} data-cid={record.centerId} onClick={showAssign} >Phân Công</Button>
                            </Space>
                        </>
                    )
                } else {
                    return (
                        <div>
                            Đã Phân Công
                        </div>
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
        await axiosCli().get('admin/data-disease').then(res => {
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
            cid: event.currentTarget.dataset.cid
        }
        setDataId(data);
    }
    const handelOk = async () => {
        setOpenDel(false);
        deleteById(dataId.id, dataId.cid);
    }
    const deleteById = async (_id, cid) => {
        await axiosCli().del(`admin/delete-report/${_id}/${cid}`).then(res => {
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
        await axiosCli().get(`admin/search-report/${data.key}`).then(res => {
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
    // Assign
    const [openAssign, setOpenAssign] = useState(false);
    const [dataDoctor, setDataDoctor] = useState([]);
    const [dataDesc, setDataDesc] = useState();
    const showAssign = async (event) => {
        const data = {
            id: event.currentTarget.dataset.id,
            cid: event.currentTarget.dataset.cid,
            desc: event.currentTarget.dataset.desc
        }
        setOpenAssign(true);
        setDataDesc(data)
        await axiosCli().get(`admin/getDataDoctorByIdCenter/${data.cid}`).then(res => {
            setDataDoctor(res.data);
        })
    }
    const onSubmit = async (data) => {
        // console.log(data);
        if (data['doctor'] == 'null') {
            return messageApi.open({
                type: 'error',
                content: 'Bạn phải chọn nhân viên giải quyết dịch bệnh'
            })
        }
        const allData = {
            did: data['doctor'],
            note: data['note'],
            desc: dataDesc.desc,
            diseaseId: dataDesc.id
        }
        await axiosCli().post('admin/assign-disease', allData).then(res => {
            if (res.status == 200) {
                messageApi.open({
                    type: 'success',
                    content: res.data.msg
                });
                getDataDisease();
                setOpenAssign(false);
            } else {
                messageApi.open({
                    type: 'error',
                    content: res.data.msg
                });
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
                <Sidebar props={6} />
                <Layout>
                    <Content
                        style={{
                            margin: '24px 16px 0',
                        }}
                    >
                        <div>
                            <form className="space-y-1 md:space-y-6 mt-4 mb-10" onSubmit={handleSubmit(onSearchSubmit)}>
                                <div className="relative mb-8">
                                    <input type="search" {...register("key")} onInput={onInput} id="default-search" className="block w-full p-4 pl-10 text-sm border border-gray-300 rounded-lg text-black bg-gray-50 focus:ring-blue-500 focus:border-blue-50 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Tìm kiếm báo cáo..." required />
                                    <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                                </div>
                            </form>
                        </div>
                        <Table dataSource={dataDisease} columns={columns} />
                    </Content>
                </Layout>
            </div>
            {/* Delete */}
            <Modal title="Xoá" open={openDel} onOk={handelOk} okButtonProps={{ style: { backgroundColor: 'red' } }} onCancel={() => setOpenDel(false)}>
                <p><strong>Bạn có chắc chắn muốn xoá báo cáo dịch bệnh này ?</strong></p>
            </Modal>
            {/* Assign */}
            <Modal title="Phân Công Xử Lý Dịch Bệnh" open={openAssign} okButtonProps={{ style: { display: 'none' } }} cancelButtonProps={{ style: { display: 'none' } }} onCancel={() => setOpenAssign(false)}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <select name="doctor" id="doctor" {...register('doctor')}>
                            <option value="null">Chọn Nhân Viên Xử Lý</option>
                            {dataDoctor && dataDoctor.map((data, index) => (
                                <option value={data._id} key={index}>{data.fullname}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="desc" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Ghi Chú</label>
                        <textarea cols={4} rows={8} type="text" {...register('note')} name="note" placeholder="Ghi chú cho nhân viên xử lý ..." id="note" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <button type="submit" className="w-full mt-5 text-white bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-800 dark:hover:bg-primary-800 dark:focus:ring-primary-800">Gửi</button>
                </form>
            </Modal>
        </div>
    );
}

export default DiseaseManager;