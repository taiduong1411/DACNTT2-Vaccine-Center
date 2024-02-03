import Navbar from "../../../components/Sidebar/Doctor/navbar";
import Sidebar from "../../../components/Sidebar/Admin/sidebar";
import { Layout, Button, Table, Space, Modal, message, Badge } from 'antd';
const { Content } = Layout;
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from 'axios';
import { axiosCli } from "../../../interceptor/axios";
const CenterManager = () => {
    const columns = [
        {
            title: 'Tên Trung Tâm',
            dataIndex: 'center_name',
            key: 'center_name',
        },
        {
            title: 'Địa Chỉ',
            key: 'address',
            render: (record) => {
                return <div>{record.address.number}, {record.address.street}, {record.address.district}, {record.address.province}</div>;
            }
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
                    <Button type="primary" style={{ backgroundColor: 'red' }} data-id={record._id} data-name={record.pro_name} data-code={record.pro_code} data-cover={record.cover} >Delete</Button>
                    <Button type="primary" style={{ backgroundColor: 'green' }} data-id={record._id} >Update</Button>
                </Space>
            ),
        },
    ];
    const [messageApi, contextHolder] = message.useMessage();
    const success = (msg) => {
        messageApi.open({
            type: 'success',
            content: msg,
        });
    };
    const error = (msg) => {
        messageApi.open({
            type: 'error',
            content: msg,
        });
    };
    const { register, handleSubmit } = useForm();
    const [addOpen, setAddOpen] = useState(false);
    const [provinceData, setProvinceData] = useState([]);
    const [districtData, setDistrictData] = useState([]);
    const [dataCenter, setDataCenter] = useState([]);
    useEffect(() => {
        getDataCenter();
    }, []);
    const getDataCenter = async () => {
        await axiosCli().get('admin/all-centers').then(res => {
            if (res.status == 200) {
                // console.log(res);
                setDataCenter(res.data.centers)
            }
        })
    }
    const showAdd = async () => {
        const res = await axios.get('https://provinces.open-api.vn/api/?depth=2');
        const provinces = (res.data).map(province => {
            return {
                name: province.name,
                districts: {
                    name: (province.districts).map(e => e.name)
                }
            }
        });
        setProvinceData(provinces);
        setAddOpen(true)
    }
    const handleDistrict = (e) => {
        const districts = provinceData.filter(f => f.name == e.target.value)
        // console.log(districts[0].districts);
        setDistrictData(districts[0].districts.name);
    }
    const onAddSubmit = async (data) => {
        await axiosCli().post('admin/add-center', data).then(res => {
            if (res.status == 200) {
                success(res.data.msg);
                getDataCenter();
                setAddOpen(false);
            } else {
                error(res.data.msg)
            }
        })
    }
    return (
        <div>
            {contextHolder}
            <Navbar />
            <div className="flex">
                <Sidebar props={3} />
                <Layout>
                    <Content
                        style={{
                            margin: '24px 16px 0',
                        }}
                    >
                        <div>
                            <Button className="float-right mb-5" onClick={showAdd}>Add New</Button>
                            <Table columns={columns} dataSource={dataCenter} />
                        </div>
                    </Content>
                </Layout>
            </div>
            <Modal open={addOpen} width={1000} okButtonProps={{ style: { display: 'none' } }} onCancel={() => setAddOpen(false)}>
                <form onSubmit={handleSubmit(onAddSubmit)}>
                    <div className="mb-4">
                        <label htmlFor="Tên Trung Tâm" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tên Trung Tâm</label>
                        <input type="text" {...register('center_name')} placeholder="Tên Trung Tâm" name="center_name" id="center_name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="Số Nhà" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Số Nhà</label>
                        <input type="text" {...register('number')} placeholder="Số Nhà" name="number" id="number" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="Tên Đường" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tên Đường</label>
                        <input type="text" {...register('street_name')} placeholder="Tên Đường" name="street_name" id="street_name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="province" className=" block mb-2 text-sm font-medium text-gray-900 dark:text-black">Thuộc Tỉnh</label>
                        <select name="province" {...register('province')} id="province" onChange={handleDistrict}>
                            <option value="null">Chọn Tỉnh Thành</option>
                            {provinceData?.map((province, index) => (
                                <option value={province.name} key={index}>{province.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="district" className=" block mb-2 text-sm font-medium text-gray-900 dark:text-black">Thuộc Quận/Huyện</label>
                        <select name="district" {...register('district')} id="district">
                            <option value="null">Chọn Quận/Huyện</option>
                            {districtData?.map((distr, index) => (
                                <option value={distr} key={index}>{distr}</option>
                            ))}
                        </select>
                    </div>
                    {/* <div>
                        <label htmlFor="avatar" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Ảnh Vaccine</label>
                        <input type="file" multiple onChange={(e) => setFiles(e.target.files)} />
                    </div> */}
                    <button type="submit" className="w-full mt-5 text-white bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-800 dark:hover:bg-primary-800 dark:focus:ring-primary-800">Submit</button>
                </form>

            </Modal>
            {/* <Modal title='Xoá Trung Tâm' open={delOpen} onOk={handleDel} okButtonProps={{ style: { backgroundColor: 'red' } }} onCancel={handleCancel}>
                <div>
                    Sản Phẩm
                    <p className="mt-3 mb-3">
                        <Avatar src={dataDel.cover} className="mr-4" />
                        <strong>[{dataDel.pro_code}]</strong>
                        {dataDel.pro_name}
                    </p>
                    Sẽ bị xoá và không thể khôi phục
                </div>
            </Modal> */}
        </div>
    )
}
export default CenterManager;