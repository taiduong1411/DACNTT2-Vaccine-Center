import Navbar from "../../../components/Sidebar/Doctor/navbar";
import Sidebar from "../../../components/Sidebar/Admin/sidebar";
import { Layout, Table, Space, Button, Modal, message, Avatar, Badge, Switch } from 'antd';
import { useEffect, useState } from "react";
import { axiosCli } from "../../../interceptor/axios";
import { useForm } from 'react-hook-form';
import upload from '../../../utils/upload';
import { FileAddOutlined, EditOutlined } from '@ant-design/icons';
import Loader from "../../../components/Spin/Spin";

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
            title: 'Thời Gian Công Tác',
            dataIndex: 'createdAt',
            key: 'createdAt'
        },
        {
            title: 'Action',
            key: 'Action',
            render: (record) => (
                <Space size="middle">
                    <Button type="primary" style={{ backgroundColor: 'green' }} icon={<EditOutlined />} data-id={record._id} onClick={showUpdate} >Cập Nhật</Button>
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
        const res = await axiosCli().get('admin/all-centers');
        setAddOpen(true);
        setDataCenters(res.data.centers);
    }
    const onAddSubmit = async (data) => {
        const url = await upload(file, 'DACNTT2/avatar');
        const allData = {
            ...data,
            avatar: url ? url : 'https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg',
            password: '1',
            level: '2',
            certificates: certificates ? certificates : ''
        }
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
    // Search
    const onSearchSubmit = async (data) => {
        await axiosCli().get(`admin/search-doctor/${data.key}`).then(res => {
            if (res.data.length < 1) {
                setDataDoctor([]);
                messageApi.open({
                    type: 'warning',
                    content: 'Không tìm thấy nhân viên'
                })
            } else {
                setDataDoctor(res.data)
            }
        })
    }
    const onInput = (e) => {
        if (e.target.value.length < 1) {
            getDataDoctor();
        }
    }
    // Handle HashTag
    const [inputValue, setInputValue] = useState('');
    const [certificates, setCertificates] = useState([]);
    const handleInputChange = (e) => {
        // console.log(e.target.value);
        setInputValue(e.target.value);
    };
    const handleAddCertificate = (event) => {
        event.preventDefault();
        setCertificates([...certificates, inputValue]);
        setInputValue('');
    };
    const removeData = (index) => {
        setCertificates(certificates.filter((el, i) => i !== index));
        // setDataBeforeAddSend(dataBeforeAddSend.filter((el, i) => i !== index));
    }
    // update
    const [updateOpen, setUpdateOpen] = useState(false);
    const [idUpdate, setIdUpdate] = useState(null);
    const [dataUpdate, setDataUpdate] = useState([]);
    // thay doi gia tri o dropdown trung tam
    const [selectedCenter, setSelectedCenter] = useState('');
    // 
    const [isChecked, setIsChecked] = useState(false);
    const showUpdate = async (e) => {
        setUpdateOpen(true);
        const id = e.currentTarget.dataset.id;
        setIdUpdate(id);
        await axiosCli().get(`admin/get-data-doctor-by-id/${id}`).then(res => {
            setDataUpdate(res.data);
            setCertificates(res.data.certificates);
            setSelectedCenter(res.data.centerOf);
            setIsChecked(res.data.status);
        })
        const center = await axiosCli().get('admin/all-centers');
        setDataCenters(center.data.centers);
    }

    const handleChange = (e) => {
        setSelectedCenter(e.target.value);
    };
    const onChange = () => {
        setIsChecked(!isChecked);
    };
    const onUpdateSubmit = async (data) => {
        const dataSubmit = {
            fullname: data['fullname'] ? data['fullname'] : dataUpdate.fullname,
            email: dataUpdate.email,
            phone: data['phone'] ? data['phone'] : dataUpdate.phone,
            dob: data['dob'] ? data['dob'] : dataUpdate.dob,
            certificates: certificates ? certificates : dataUpdate.certificates,
            centerOf: selectedCenter ? selectedCenter : dataUpdate.centerOf,
            status: isChecked
        }
        await axiosCli().post(`admin/update-doctor/${idUpdate}`, dataSubmit).then(res => {
            if (res.status == 200) {
                messageApi.open({
                    type: 'success',
                    content: res.data.msg
                });
                getDataDoctor();
                setUpdateOpen(false)
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
                <Sidebar props={4} />
                <Layout>
                    <Content
                        style={{
                            margin: '24px 16px 0',
                        }}
                    >
                        <Button className="float-right mb-5" onClick={showAdd} icon={<FileAddOutlined />}>Add New</Button>
                        <div>
                            <form className="space-y-1 md:space-y-6 mt-4 mb-10" onSubmit={handleSubmit(onSearchSubmit)}>
                                <div className="relative mb-8">
                                    <input type="search" {...register("key")} onInput={onInput} id="default-search" className="block w-full p-4 pl-10 text-sm border border-gray-300 rounded-lg text-black bg-gray-50 focus:ring-blue-500 focus:border-blue-50 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Tìm kiếm nhân viên" required />
                                    <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                                </div>
                            </form>
                        </div>
                        <Table columns={columns} dataSource={dataDoctor}></Table>
                    </Content>
                </Layout>
            </div>
            <Modal open={addOpen} okButtonProps={{ style: { display: 'none' } }} cancelButtonProps={{ style: { display: 'none' } }} onCancel={() => setAddOpen(false)}>
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
                    {/* certificate */}
                    <div className="mb-6 flex justify-between items-center">
                        <div className="flex">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={handleInputChange}
                                className="bg-gray-100 border border-gray-300 text-gray-900 sm:text-sm rounded-l-lg focus:ring-primary-600 focus:border-primary-600 p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Nhập Chứng Chỉ ..."

                            />
                            <button
                                onClick={handleAddCertificate}
                                className="bg-blue-500 text-white rounded-r-lg transition duration-300 hover:bg-blue-600 px-4 py-2"
                            >
                                Thêm
                            </button>
                        </div>
                        <div className="ml-2">
                            {certificates.map((data, index) => (
                                <span key={index} onClick={() => removeData(index)} className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full mr-2 mb-2">
                                    {data}
                                </span>
                            ))}
                        </div>
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
                    <button type="submit" className="w-full mt-5 text-white bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-800 dark:hover:bg-primary-800 dark:focus:ring-primary-800">Tạo Tài Khoản</button>
                </form>

            </Modal>
            <Modal open={updateOpen} okButtonProps={{ style: { display: 'none' } }} cancelButtonProps={{ style: { display: 'none' } }} onCancel={() => setUpdateOpen(false)}>
                <form onSubmit={handleSubmit(onUpdateSubmit)}>
                    <div className="mb-4">
                        <label htmlFor="fullname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Họ Và Tên</label>
                        <input type="text" {...register('fullname')} defaultValue={dataUpdate.fullname} placeholder="Họ Và Tên" name="fullname" id="fullname" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Email</label>
                        <input type="email" {...register('email')} defaultValue={dataUpdate.email} placeholder="Email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} disabled />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Số Điện Thoại</label>
                        <input type="text" {...register('phone')} defaultValue={dataUpdate.phone} placeholder="Số Điện Thoại" name="phone" id="phone" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="dob" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Ngày Sinh</label>
                        <input type="date" {...register('dob')} defaultValue={dataUpdate.dob} placeholder="Ngày Sinh" name="dob" id="dob" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                    </div>
                    {/* certificate */}
                    <div className="mb-6 flex justify-between items-center">
                        <div className="flex">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={handleInputChange}
                                className="bg-gray-100 border border-gray-300 text-gray-900 sm:text-sm rounded-l-lg focus:ring-primary-600 focus:border-primary-600 p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Nhập Chứng Chỉ ..."

                            />
                            <button
                                onClick={handleAddCertificate}
                                className="bg-blue-500 text-white rounded-r-lg transition duration-300 hover:bg-blue-600 px-4 py-2"
                            >
                                Thêm
                            </button>
                        </div>
                        <div className="ml-2">
                            {certificates.map((data, index) => (
                                <span key={index} onClick={() => removeData(index)} className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full mr-2 mb-2">
                                    {data}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="dob" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Thuộc Trung Tâm</label>
                        <select name="centerOf" id="centerOf" {...register('centerOf')} value={selectedCenter} onChange={handleChange}>
                            <option value="null">Chọn Trung Tâm</option>
                            {dataCenters?.map((data, index) => (
                                <option value={data._id} key={index}>{data.center_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mt-5">
                        <div>Trạng Thái: {isChecked === true ? <strong>Hoạt Động</strong> : <strong>Tài Khoản Bị Khoá</strong>}</div>
                        <Switch checked={isChecked} onChange={onChange} />
                        &nbsp;
                    </div>
                    <button type="submit" className="w-full mt-5 text-white bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-800 dark:hover:bg-primary-800 dark:focus:ring-primary-800">Cập Nhật Tài Khoản</button>
                </form>

            </Modal>
        </div>
    )
}
export default DoctorManager