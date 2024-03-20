import Navbar from "../../../components/Sidebar/Doctor/navbar";
import Sidebar from "../../../components/Sidebar/Admin/sidebar";
import { useEffect, useState, useRef } from 'react';
import { useForm } from "react-hook-form";
import { Layout, theme, Table, Button, Modal, message, Avatar, Space, Popover } from 'antd';
import { axiosCli } from "../../../interceptor/axios";
// import { UploadOutlined } from '@ant-design/icons';
import upload from "../../../utils/upload";
import { Link } from "react-router-dom";
// import axios from "axios";
// import props from '../../../components/Upload/Upload';
import { FileAddOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Loader from "../../../components/Spin/Spin";

const { Content } = Layout;
function Vaccine() {
    const columns = [
        {
            title: 'Tên Vaccine',
            key: 'pro_name',
            render: (record) => {
                return (
                    <div>
                        <Avatar src={record.cover} />
                        <span style={{ marginLeft: '10px' }}>
                            <Link to={`/admin/vaccine-manager/vaccine-detail/${record.slug}/${record.pro_code}`}><strong>[{record.pro_code}]</strong> {record.pro_name}</Link>
                        </span>
                    </div>
                );
            }
        },
        // {
        //     title: 'Số lượng',
        //     dataIndex: 'amount',
        //     key: 'amount',
        // },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt'
        },
        {
            title: 'Thuộc Trung Tâm',
            // dataIndex: 'centerOf',
            key: 'centerOf',
            render: (record) => {
                const content = (
                    <div>
                        {record.detailCenter?.map((e, index) => (
                            <div key={index}>
                                <p><strong>{e.center}</strong>- SL: <strong>{e.amount}</strong></p>
                            </div>
                        ))}
                    </div>
                );
                return (
                    <Space wrap>
                        <Popover content={content} trigger="hover">
                            <Button>Đang có tại {record.countCenter} trung tâm</Button>
                        </Popover>
                    </Space>
                )
            }
        },
        {
            title: 'Action',
            key: 'Action',
            render: (record) => (
                <Space size="middle">
                    <Button type="primary" style={{ backgroundColor: 'red' }} icon={<DeleteOutlined />} data-id={record._id} data-name={record.pro_name} data-code={record.pro_code} data-cover={record.cover} onClick={showDel}>Delete</Button>
                    <Button type="primary" style={{ backgroundColor: 'green' }} icon={<EditOutlined />} data-id={record._id} onClick={showUpdate} >Update</Button>
                </Space>
            ),
        },
    ];
    // Config
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [dataVaccine, setDataVaccine] = useState();
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
    // GET DATA
    useEffect(() => {
        getDataVaccine();
    }, []);
    const getDataVaccine = async () => {
        await axiosCli().get('admin/all-vaccines').then(res => {
            setDataVaccine(res.data)
        })
    }
    // Handle Modal
    // Setup
    const { register, handleSubmit } = useForm();
    const [addOpen, setAddOpen] = useState(false);
    const [delOpen, setDelOpen] = useState(false);
    const [updateOpen, setUpdateOpen] = useState(false);
    const amountRef = useRef(null);
    const centerRef = useRef(null);
    const handleCancel = () => {
        setAddOpen(false);
        setDelOpen(false);
        setUpdateOpen(false);
    }

    // Handle Center Data -> Before Add & Update
    const [centerData, setCenterData] = useState([{}]);
    const handleCenterData = async () => {
        await axiosCli().get('admin/all-centers').then(res => {
            setCenterData(res.data.centers);
        })
    }
    // Add Modal
    const [files, setFiles] = useState([]);
    // dataBeforeAdd just show data
    const [dataBeforeAdd, setDataBeforeAdd] = useState([]);
    // dataUpload will send data to server include _id of center (dont send center name)
    const [dataBeforeAddSend, setDataBeforeAddSend] = useState([]);
    const showAdd = async () => {
        setAddOpen(true);
        handleCenterData();
    }
    const addCenter = () => {
        const amount = amountRef.current.value;
        const center = centerRef.current.options[centerRef.current.selectedIndex].text;
        const centerUpload = centerRef.current.value;
        if (amount.length < 1 || center.length < 1 || center == 'null') return
        setDataBeforeAdd([...dataBeforeAdd, { center: center, amount: amount }]);
        setDataBeforeAddSend([...dataBeforeAddSend, { cid: centerUpload, amount: parseInt(amount) }]);
        amountRef.current.value = '0';
    }
    const removeData = (index) => {
        setDataBeforeAdd(dataBeforeAdd.filter((el, i) => i !== index));
        setDataBeforeAddSend(dataBeforeAddSend.filter((el, i) => i !== index));
    }
    const onAddSubmit = async (data) => {
        const images = await Promise.all(
            [...files].map(async (file) => {
                const url = await upload(file, 'DACNTT2/products');
                return url;
            })
        );
        const allData = {
            pro_name: data['pro_name'],
            pro_code: data['pro_code'],
            desc: data['desc'],
            img: images,
            cover: images[0],
            centerOf: dataBeforeAddSend
        }
        // console.log(allData);
        await axiosCli().post('admin/add-product', allData).then(res => {
            if (res.status == 200) {
                handleCancel();
                getDataVaccine();
                success(res.data.msg);
            } else {
                error(res.data.msg);
            }
        })
    }
    // DEl Modal
    const [dataDel, setDataDel] = useState([]);
    const showDel = async (event) => {
        const data = {
            _id: event.currentTarget.dataset.id,
            pro_name: event.currentTarget.dataset.name,
            pro_code: event.currentTarget.dataset.code,
            cover: event.currentTarget.dataset.cover
        }
        setDataDel(data);
        setDelOpen(true);
    }

    const handleDel = () => {
        handleCancel();
        deleteProduct(dataDel._id);
    }
    const deleteProduct = async (_id) => {
        await axiosCli().del(`admin/del-vaccine/${_id}`).then(res => {
            if (res.status == 200) {
                success(res.data.msg);
                getDataVaccine();
            } else {
                error(res.data.msg);
            }
        })
    }
    // Update Modal
    const [dataPro, setDataPro] = useState([]);
    const showUpdate = async (event) => {
        handleCenterData();
        setUpdateOpen(true);
        const _id = event.currentTarget.dataset.id;
        await axiosCli().get(`admin/get-product/${_id}`).then(res => {
            if (res.status == 200) {
                setDataPro(res.data[0]);
                setDataBeforeAdd(res.data[0].centerOfByName);
                setDataBeforeAddSend(res.data[0].centerOfById);
            } else {
                error(res.data.msg);
            }
        });
    }
    const onUpdateSubmit = async (data) => {
        const images = await Promise.all(
            [...files].map(async (file) => {
                const url = await upload(file, 'DACNTT2/products');
                return url;
            })
        );
        const allDataUpdate = {
            pro_name: data['pro_name'] ? data['pro_name'] : dataPro.pro_name,
            pro_code: data['pro_code'] ? data['pro_code'] : dataPro.pro_code,
            desc: data['desc'] ? data['desc'] : dataPro.desc,
            img: images.length > 0 ? images : dataPro.img,
            // amount: data['amount'] ? data['amount'] : dataPro.amount,
            cover: images[0] ? images[0] : dataPro.cover,
            centerOf: dataBeforeAddSend ? dataBeforeAddSend : dataPro.centerOf
        }
        // console.log(allDataUpdate);
        await axiosCli().post(`admin/update-product/${dataPro._id}`, allDataUpdate).then(res => {
            if (res.status == 200) {
                handleCancel();
                getDataVaccine();
                success(res.data.msg);
            } else {
                error(res.data.msg);
            }
        })
    }
    const onSearchSubmit = async (data) => {
        await axiosCli().get(`admin/search-vaccine/${data.key}`).then(res => {
            if (res.data.length < 1) {
                setDataVaccine([]);
                messageApi.open({
                    type: 'warning',
                    content: 'Không tìm thấy vắc xin'
                })
            } else {
                setDataVaccine(res.data)
            }
        })
    }
    const onInput = (e) => {
        if (e.target.value.length < 1) {
            getDataVaccine();
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
                <Sidebar props={2} />
                <Layout>
                    <Content
                        style={{
                            margin: '24px 16px 0',
                        }}
                    >
                        <div style={{
                            padding: 24,
                            minHeight: 660,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}>
                            <Button onClick={showAdd} className="float-right mb-5" icon={<FileAddOutlined />}>Thêm mới</Button>
                            <div>
                                <form className="space-y-1 md:space-y-6 mt-4 mb-10" onSubmit={handleSubmit(onSearchSubmit)}>
                                    <div className="relative mb-8">
                                        <input type="search" {...register("key")} onInput={onInput} id="default-search" className="block w-full p-4 pl-10 text-sm border border-gray-300 rounded-lg text-black bg-gray-50 focus:ring-blue-500 focus:border-blue-50 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Tìm kiếm vắc xin" required />
                                        <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Tìm Kiếm</button>
                                    </div>
                                </form>
                            </div>
                            <Table dataSource={dataVaccine} columns={columns} />
                        </div>
                    </Content>
                </Layout>
            </div>
            {/* MODAL ADD */}
            <Modal open={addOpen} width={1000} okButtonProps={{ style: { display: 'none' } }} cancelButtonProps={{ style: { display: 'none' } }} onCancel={handleCancel}>
                <form onSubmit={handleSubmit(onAddSubmit)}>
                    <div className="mb-4">
                        <label htmlFor="Tên Vaccine" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tên Vaccine</label>
                        <input type="text" {...register('pro_name')} placeholder="Tên Vaccine" name="pro_name" id="pro_name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="Mã Vaccine" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Mã Vaccine</label>
                        <input type="text" {...register('pro_code')} placeholder="Mã Vaccine" name="pro_code" id="pro_code" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="desc" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Mô Tả</label>
                        <textarea cols={4} rows={8} type="text" {...register('desc')} placeholder="Mô Tả" id="desc" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                    </div>
                    <div className="mb-4 inline-block mr-10">
                        <label htmlFor="province" className=" block mb-2 text-sm font-medium text-gray-900 dark:text-black">Thuộc Trung Tâm</label>
                        <select name="province" id="province" ref={centerRef} >
                            <option value="null">Chọn Trung Tâm</option>
                            {centerData?.map((center, index) => (
                                <option value={center._id} key={index}>{center.center_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4 inline-block">
                        <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Số Lượng</label>
                        <input ref={amountRef} type="number" id="amount" placeholder="Số Lượng Vaccine" defaultValue={0} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div className="mb-4 inline-block float-right mt-7 mr-4">
                        <img src="/add.svg" width={30} height={30} alt="abc" onClick={addCenter} />
                    </div>
                    <div>
                        {dataBeforeAdd.map((tag, index) => (
                            <div className="tag-item mb-2 inline-block mr-2 relative" key={index}>
                                <span className="text inline-block" style={{ padding: '8px', backgroundColor: 'rgb(255,232,232)', borderRadius: '10px' }} onClick={() => removeData(index)}>Tên: <strong>{tag.center}</strong> - SL: <strong>{tag.amount}</strong></span>
                                {/* <span className="close absolute top-0 text-lg right-0" onClick={() => removeData(index)}>&times;</span> */}
                            </div>
                        ))}
                    </div>
                    <div>
                        <label htmlFor="avatar" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Ảnh Vaccine</label>
                        <input type="file" multiple onChange={(e) => setFiles(e.target.files)} />
                    </div>
                    <button type="submit" className="w-full mt-5 text-white bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-800 dark:hover:bg-primary-800 dark:focus:ring-primary-800">Tạo Mới</button>
                </form>

            </Modal>
            {/* MODAL DEL */}
            <Modal title='Xoá Sản Phẩm' open={delOpen} onOk={handleDel} okButtonProps={{ style: { backgroundColor: 'red' } }} onCancel={handleCancel}>
                <div>
                    Sản Phẩm
                    <p className="mt-3 mb-3">
                        <Avatar src={dataDel.cover} className="mr-4" />
                        <strong>[{dataDel.pro_code}]</strong>
                        {dataDel.pro_name}
                    </p>
                    Sẽ bị xoá và không thể khôi phục
                </div>
            </Modal>
            {/* MODAL UPDATE */}
            <Modal open={updateOpen} width={1000} okButtonProps={{ style: { display: 'none' } }} cancelButtonProps={{ style: { display: 'none' } }} onCancel={handleCancel}>
                <form onSubmit={handleSubmit(onUpdateSubmit)}>
                    <div>
                        <label htmlFor="Tên Vaccine" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tên Vaccine</label>
                        <input type="text" {...register('pro_name')} defaultValue={dataPro.pro_name} placeholder="Tên Vaccine" name="pro_name" id="pro_name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                    </div>
                    <div>
                        <label htmlFor="Mã Vaccine" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Mã Vaccine</label>
                        <input type="text" {...register('pro_code')} defaultValue={dataPro.pro_code} placeholder="Mã Vaccine" name="pro_code" id="pro_code" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="desc" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Mô Tả</label>
                        <textarea cols={4} rows={8} type="text" {...register('desc')} defaultValue={dataPro.desc} placeholder="Mô Tả" id="desc" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                    </div>
                    <div className="mb-4 inline-block mr-10">
                        <label htmlFor="province" className=" block mb-2 text-sm font-medium text-gray-900 dark:text-black">Thuộc Trung Tâm</label>
                        <select name="province" id="province" ref={centerRef} >
                            <option value="null">Chọn Trung Tâm</option>
                            {centerData?.map((center, index) => (
                                <option value={center._id} key={index}>{center.center_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4 inline-block">
                        <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Số Lượng</label>
                        <input ref={amountRef} type="text" id="amount" placeholder="Số Lượng Vaccine" defaultValue={0} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div className="mb-4 inline-block float-right mt-7 mr-4">
                        <img src="/add.svg" width={30} height={30} alt="abc" onClick={addCenter} />
                    </div>
                    <div>
                        {dataBeforeAdd.map((tag, index) => (
                            <div className="tag-item mb-2 inline-block mr-2 relative" key={index}>
                                <span className="text inline-block" style={{ padding: '8px', backgroundColor: 'rgb(255,232,232)', borderRadius: '10px' }} onClick={() => removeData(index)}>Tên: <strong>{tag.center}</strong> - SL: <strong>{tag.amount}</strong></span>
                                {/* <span className="close absolute top-0 text-lg right-0" onClick={() => removeData(index)}>&times;</span> */}
                            </div>
                        ))}
                    </div>
                    <div>
                        <label htmlFor="avatar" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Ảnh Vaccine</label>
                        <input type="file" multiple onChange={(e) => setFiles(e.target.files)} />
                    </div>
                    <div>
                        {(dataPro.img)?.map((data, index) => (
                            <Avatar key={index} src={`${data}`} className="mt-4 mr-4" style={{ border: '1px solid rgb(220,220,220)' }} size={'large'} />
                        ))}
                    </div>
                    <button type="submit" className="w-full mt-5 text-white bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-800 dark:hover:bg-primary-800 dark:focus:ring-primary-800">Sửa Đổi</button>
                </form>

            </Modal>
        </div>
    );
}

export default Vaccine;