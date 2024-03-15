import Navbar from "../../../components/Sidebar/Doctor/navbar";
import Sidebar from "../../../components/Sidebar/Admin/sidebar";
import { Layout, Button, Table, Space, Modal, message, } from 'antd';
const { Content } = Layout;
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
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
            title: 'Action',
            key: 'Action',
            render: (record) => (
                <Space size="middle">
                    <Button type="primary" style={{ backgroundColor: 'green' }} data-id={record._id} onClick={showUpdate} >Update</Button>
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
        setAddOpen(true)
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
    // update
    const [idUpdate, setIdUpdate] = useState(null);
    const [updateOpen, setUpdateOpen] = useState(false);
    const [dataUpdate, setDataUpdate] = useState([]);
    const showUpdate = async (e) => {
        setUpdateOpen(true);
        const id = e.currentTarget.dataset.id;
        setIdUpdate(id);
        await axiosCli().get(`admin/get-data-center-by-id/${id}`).then(res => {
            setDataUpdate(res.data);
        })
    }
    const onUpdateSubmit = async (data) => {
        const allData = {
            center_name: data['center_name'] ? data['center_name'] : dataUpdate.center_name,
            number: data['number'] ? data['number'] : dataUpdate.address.number,
            street_name: data['street_name'] ? data['street_name'] : dataUpdate.address.street,
            province: data['province'] ? data['province'] : dataUpdate.address.province,
            district: data['district'] ? data['district'] : dataUpdate.address.district
        }
        await axiosCli().post(`admin/update-center/${idUpdate}`, allData).then(res => {
            if (res.status == 200) {
                messageApi.open({
                    type: 'success',
                    content: res.data.msg
                })
                getDataCenter();
                setUpdateOpen(false);
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
            <Modal open={addOpen} width={1000} okButtonProps={{ style: { display: 'none' } }} cancelButtonProps={{ style: { display: 'none' } }} onCancel={() => setAddOpen(false)}>
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
                        <label htmlFor="Tỉnh Thành" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tên Tỉnh Thành</label>
                        <input type="text" {...register('province')} placeholder="Tên Đường" name="province" id="province" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="Quận" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tên Quận</label>
                        <input type="text" {...register('district')} placeholder="Tên Quận" name="district" id="district" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                    </div>
                    <button type="submit" className="w-full mt-5 text-white bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-800 dark:hover:bg-primary-800 dark:focus:ring-primary-800">Tạo Trung Tâm</button>
                </form>

            </Modal>
            <Modal open={updateOpen} width={1000} okButtonProps={{ style: { display: 'none' } }} cancelButtonProps={{ style: { display: 'none' } }} onCancel={() => setUpdateOpen(false)}>
                <form onSubmit={handleSubmit(onUpdateSubmit)}>
                    <div className="mb-4">
                        <label htmlFor="Tên Trung Tâm" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tên Trung Tâm</label>
                        <input type="text" {...register('center_name')} defaultValue={dataUpdate.center_name} placeholder="Tên Trung Tâm" name="center_name" id="center_name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="Số Nhà" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Số Nhà</label>
                        <input type="text" {...register('number')} defaultValue={dataUpdate?.address?.number} placeholder="Số Nhà" name="number" id="number" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="Tên Đường" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tên Đường</label>
                        <input type="text" {...register('street_name')} defaultValue={dataUpdate?.address?.street} placeholder="Tên Đường" name="street_name" id="street_name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="Tỉnh Thành" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tên Tỉnh Thành</label>
                        <input type="text" {...register('province')} defaultValue={dataUpdate?.address?.province} placeholder="Tên Đường" name="province" id="province" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="Quận" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tên Quận</label>
                        <input type="text" {...register('district')} defaultValue={dataUpdate?.address?.district} placeholder="Tên Quận" name="district" id="district" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                    </div>
                    <button type="submit" className="w-full mt-5 text-white bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-800 dark:hover:bg-primary-800 dark:focus:ring-primary-800">Tạo Trung Tâm</button>
                </form>

            </Modal>

        </div>
    )
}
export default CenterManager;