import Navbar from "../../../components/Sidebar/Doctor/navbar";
import Sidebar from "../../../components/Sidebar/Admin/sidebar";
import { Layout, Table, Space, Button, Modal, message, Avatar, Badge } from 'antd';
import { useEffect, useState } from "react";
import { axiosCli } from "../../../interceptor/axios";
import { useForm } from 'react-hook-form';
import upload from '../../../utils/upload';
const { Content } = Layout;
const DoctorManager = () => {
    const columns = [
        {
            title: 'Tên Bác Sĩ',
            key: 'fullname',
            render: (record) => {
                return (
                    <div>
                        <Avatar src={record.avatar} />
                        <span style={{ marginLeft: '10px' }}><strong>{record.fullname}</strong></span>
                    </div>
                )
            }
        },
        {
            title: 'Thuộc Trung Tâm',
            dataIndex: 'centerOf',
            key: 'centerOf'
        },
        {
            title: 'Trạng Thái',
            key: 'status',
            render: (record) => {
                if (record.status == true) {
                    return <Badge status="success" text='Hoạt động' />
                } else {
                    return <Badge status="error" text='Đang bị khoá' />
                }
            }
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt'
        },
        {
            title: 'Action',
            key: 'Action',
            render: (record) => (
                <Space size="middle">
                    <Button type="primary" style={{ backgroundColor: 'red' }} onClick={showDelModal} >Delete</Button>
                    <Button type="primary" style={{ backgroundColor: 'green' }} data-id={record._id} >Update</Button>
                </Space>
            ),
        },
    ];
    useEffect(() => {
        getDataDoctor();
    }, []);
    // 
    const [dataDoctor, setDataDoctor] = useState();
    const getDataDoctor = async () => {
        const res = await axiosCli().get('admin/all-doctors')
        // console.log(res.data);
        setDataDoctor(res.data)
    }
    const { register, handleSubmit } = useForm();
    const [addOpen, setAddOpen] = useState(false);
    const [dataCenters, setDataCenters] = useState([]);
    const [file, setFile] = useState('');
    const [messageApi, contextHolder] = message.useMessage();
    // Add
    const showAdd = async () => {
        const res = await axiosCli().get('admin/all-centers')
        setAddOpen(true);
        setDataCenters(res.data.centers);
    }
    const onAddSubmit = async (data) => {
        const url = await upload(file, 'DACNTT2/avatar');
        const allData = {
            ...data,
            avatar: url ? url : 'https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg',
            password: '1',
            level: '2'
        }
        // console.log(allData);
        await axiosCli().post('admin/add-doctor', allData).then(res => {
            if (res.status == 200) {
                messageApi.open({
                    type: 'success',
                    content: res.data.msg
                })
                getDataDoctor();
                setAddOpen(false);
            } else {
                messageApi.open({
                    type: 'error',
                    content: res.data.msg
                })
            }
        })
    }
    // Delete
    const [delOpen, setDelOpen] = useState(false);
    const showDelModal = () => {
        setDelOpen(true)
    }
    const handleDel = () => {

    }
    return (
        <div>
            {contextHolder}
            <Navbar />
            <div className="flex">
                <Sidebar props={4} />
                <Layout>
                    <Content
                        style={{
                            margin: '24px 16px 0',
                        }}
                    >
                        <Button className="float-right mb-5" onClick={showAdd}>Add New</Button>
                        <Table columns={columns} dataSource={dataDoctor}></Table>
                    </Content>
                </Layout>
            </div>
            <Modal open={addOpen} okButtonProps={{ style: { display: 'none' } }} onCancel={() => setAddOpen(false)}>
                <form onSubmit={handleSubmit(onAddSubmit)}>
                    <div className="mb-4">
                        <label htmlFor="fullname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Họ Và Tên</label>
                        <input type="text" {...register('fullname')} placeholder="Họ Và Tên" name="fullname" id="fullname" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Email</label>
                        <input type="email" {...register('email')} placeholder="Email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Số Điện Thoại</label>
                        <input type="text" {...register('phone')} placeholder="Số Điện Thoại" name="phone" id="phone" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="dob" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Ngày Sinh</label>
                        <input type="date" {...register('dob')} placeholder="Ngày Sinh" name="dob" id="dob" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="dob" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Thuộc Trung Tâm</label>
                        <select name="centerOf" id="centerOf" {...register('centerOf')}>
                            {dataCenters?.map((data, index) => (
                                <option value={data._id} key={index}>{data.center_name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="avatar" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Ảnh Đại Diện</label>
                        <input onChange={(e) => setFile(e.target.files[0])} type="file" name="avatar" id="avatar" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <button type="submit" className="w-full mt-5 text-white bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-800 dark:hover:bg-primary-800 dark:focus:ring-primary-800">Submit</button>
                </form>

            </Modal>
            <Modal title='Xoá Bác Sĩ' open={delOpen} onOk={handleDel} okButtonProps={{ style: { backgroundColor: 'red' } }} onCancel={() => setDelOpen(false)}>
                <div>
                    Sản Phẩm
                    {/* <p className="mt-3 mb-3">
                        <Avatar src={dataDel.cover} className="mr-4" />
                        <strong>[{dataDel.pro_code}]</strong>
                        {dataDel.pro_name}
                    </p> */}
                    Sẽ bị xoá và không thể khôi phục
                </div>
            </Modal>
        </div>
    )
}
export default DoctorManager