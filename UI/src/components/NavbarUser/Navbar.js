import { Link } from 'react-router-dom';
import { Button, Dropdown, Space, Avatar, Modal, message, Table, Tag } from 'antd';
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { axiosCli } from '../../interceptor/axios';
// import { UploadOutlined } from '@ant-design/icons'
import upload from '../../utils/upload';
import { jwtDecode } from 'jwt-decode';
function Navbar({ props }) {
    const columnsHistoryVaccine = [
        {
            title: 'Ngày Tiêm',
            dataIndex: 'dateBooking',
            key: 'dateBooking'
        },
        {
            title: 'Thời Gian Tiêm',
            dataIndex: 'timeBooking',
            key: 'timeBooking'
        },
        {
            title: 'Trung Tâm',
            dataIndex: 'c_name',
            key: 'c_name'
        },
        {
            title: 'Loại Vắc Xin',
            key: 'v_name',
            render: (record) => {
                return (
                    <div>
                        <Link to={`/vaccine/${record.slug}`}>{record.v_name}</Link>
                    </div>
                )
            }
        },
        {
            title: 'Trạng Thái',
            key: 'status',
            render: (record) => {
                if (record.status == '1') {
                    return <div>
                        <Tag color="gold">Đã Xác Nhận Lịch Tiêm</Tag>
                    </div>
                } else if (record.status == '2') {
                    return <div>
                        <Tag color="green">Tiêm Thành Công</Tag>
                    </div>
                } else {
                    return <div>
                        <Tag color="red">Tiêm Thất Bại</Tag>
                    </div>
                }
            }
        },
    ];
    const columnsCurrentBooking = [
        {
            title: 'Ngày Tiêm',
            dataIndex: 'dateBooking',
            key: 'dateBooking'
        },
        {
            title: 'Thời Gian Tiêm',
            dataIndex: 'timeBooking',
            key: 'timeBooking'
        },
        {
            title: 'Trung Tâm',
            dataIndex: 'c_name',
            key: 'c_name'
        },
        {
            title: 'Tên Vắc Xin',
            key: 'v_name',
            render: (record) => {
                return <div>
                    <Link to={`/vaccine/${record.slug}`}>{record.v_name}</Link>
                </div>
            }
        },
        {
            title: 'Trạng Thái',
            key: 'status',
            render: (record) => {
                if (record.status == '1') {
                    return (
                        <div>
                            <Tag color="gold">Chờ xác nhận</Tag>
                        </div>
                    )
                } else {
                    return (
                        <div>
                            <Tag color="green">Đã xác nhận</Tag>
                        </div>
                    )
                }
            }
        },
        {
            title: '',
            key: 'acction',
            render: (record) => {
                return <Button type="danger" className='bg-red-600 text-white' data-id={record._id} onClick={showCancelBooking}>Huỷ Lịch</Button>
            }
        }

    ]
    const [login, setLogin] = useState(true);
    const { register, handleSubmit } = useForm();
    const [file, setFile] = useState('');
    const [level, setLevel] = useState(true);
    // Set Up Message
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
    useEffect(() => {
        checkLogin();
        getData();
        getHistoryVaccine();
        getCurrentBooking();
    }, []);
    const checkLogin = async () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) return setLogin(false)
        if (jwtDecode(accessToken).level == '2' || jwtDecode(accessToken).level == '3') {
            // console.log('pass');
            setLevel(false);
        }
        setLogin(true)
    }
    const [data, setData] = useState([]);
    const getData = async () => {
        await axiosCli().get('account/my-info').then(res => {
            if (res.status == 200) {
                setData(res.data)
            } else {
                setData([]);
            }
        })
    }

    const [dataHistoryVaccine, setDataHistoryVaccine] = useState([]);
    const getHistoryVaccine = async () => {
        await axiosCli().get('user/history-vaccine').then(res => {
            setDataHistoryVaccine(res.data)
        })
    }

    const [dataCurrentBooking, setDataCurrentBooking] = useState([]);
    const getCurrentBooking = async () => {
        await axiosCli().get('user/current-booking').then(res => {
            // console.log(res.data);
            setDataCurrentBooking(res.data)
        })
    }
    // Update Info
    const [openUpdate, setOpenUpdate] = useState(false)
    const updateInformation = async () => {
        setOpenUpdate(true);
    }
    const handleUpdateCancel = () => {
        setOpenUpdate(false)
    }
    const onUpdateSubmit = async (dataForm) => {
        const url = await upload(file, 'DACNTT2/avatar');
        // if(!url) return 
        const allData = {
            ...dataForm,
            avatar: url
        }
        // console.log(allData);
        await axiosCli().post('account/update-information', allData).then(res => {
            if (res.status == 200) {
                setOpenUpdate(false);
                getData();
                success(res.data.msg);
                setTimeout(() => {
                    window.location.href = '/home'
                }, 1000)
            } else {
                // setOpenUpdate(false);
                error(res.data.msg);
            }
        })
    }
    // setup Navbar when scroll
    const [nav, setNav] = useState();
    const changeNav = () => {
        return window.scrollY >= 30 ? setNav(true) : setNav(false);
    };
    window.addEventListener('scroll', changeNav);
    // History Vaccine
    const [isShowHistoryVaccine, setIsShowHistoryVaccine] = useState(false);
    const historyVaccine = () => {
        setIsShowHistoryVaccine(true);
    }
    // Current Booking
    const [isShowCurrentBooking, setIsShowCurrentBooking] = useState(false);
    const currentBooking = () => {
        setIsShowCurrentBooking(true);
    }
    // Cancel Booking
    const showCancelBooking = async (e) => {
        const id = e.currentTarget.dataset.id;
        await axiosCli().get(`user/cancel-booking/${id}`).then(res => {
            if (res.status == 200) {
                messageApi.open({
                    type: 'success',
                    content: res.data.msg
                })
                getCurrentBooking();
            } else {
                messageApi.open({
                    type: 'error',
                    content: res.data.msg
                });
            }
        })
    }
    const items = [
        {
            label: <p onClick={updateInformation}>Cập Nhật Thông Tin</p>,
            key: '0',
        },
        {
            label: <p onClick={historyVaccine} className={`${level ? "" : "hidden"}`}>Lịch Sử Tiêm</p>,
            key: '1',
        },
        {
            label: <p onClick={currentBooking} className={`${level ? "" : "hidden"}`}>Lịch Tiêm Chờ Duyệt</p>,
            key: '2',
        },
        {
            type: 'divider',
        },
        {
            label: <Link to="/login">Đăng Xuất</Link>,
            key: '3',
        },
    ];
    return (
        <nav className={`${nav
            ?
            'fixed top-0 w-full z-50'
            :
            ''
            }`}>
            {contextHolder}
            <div className="w-full h-22 bg-gray-100">
                <div className='w-40 px-3 py-3 inline-block'>
                    <Link to="/home">
                        <img src="/main-logo.png" alt="logo" width={60} height={60} />
                    </Link>
                </div>
                {login
                    ?
                    <div className='float-right inline-block leading-[5rem] mr-4'>
                        <Button onClick={() => props(1)} type='primary' style={{ backgroundColor: 'blue' }} className='mr-7' size='large'>
                            Đặt Lịch Nhanh
                        </Button>
                        <Dropdown
                            menu={{
                                items,
                            }}
                            trigger={['click']}
                        >
                            <a onClick={(e) => e.preventDefault()}>
                                {data.avatar
                                    ?
                                    <Space>
                                        <Avatar src={data.avatar} size={'large'} />
                                    </Space>
                                    :
                                    <Space>
                                        <Avatar src='/noavatar.jpeg' size={'large'} />
                                    </Space>
                                }
                            </a>
                        </Dropdown>
                    </div>
                    :
                    <div className='float-right inline-block leading-[5rem] mr-4'>
                        <Button type='primary' style={{ backgroundColor: 'blue' }} className='mr-5' size='large'>
                            Đặt Lịch Nhanh</Button>
                        <Button className='mr-1'>
                            <Link to='/login'>Login</Link>
                        </Button>
                        <Button className='bg-orange-400'>
                            <Link to='/register'>Register</Link>
                        </Button>
                    </div>
                }
            </div>
            {/* Update Information */}
            <Modal title="Cập Nhật Thông Tin" open={openUpdate} okButtonProps={{ style: { display: 'none' } }} cancelButtonProps={{ style: { display: 'none' } }} onCancel={handleUpdateCancel}>
                <form onSubmit={handleSubmit(onUpdateSubmit)}>
                    <div>
                        <label htmlFor="Email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Email</label>
                        <input type="Email" {...register('email')} defaultValue={data.email} placeholder="Email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                    </div>
                    <div>
                        <label htmlFor="fullname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Họ Và Tên</label>
                        <input type="text" {...register('fullname')} defaultValue={data.fullname} placeholder="Họ Và Tên" name="fullname" id="fullname" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                    </div>
                    <div>
                        <label htmlFor="dob" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Ngày Sinh</label>
                        <input type="date" {...register('dob')} defaultValue={data.dob} name="dob" id="dob" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Số Điện Thoại</label>
                        <input type="text" {...register('phone')} defaultValue={data.phone} name="phone" id="phone" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Mật Khẩu</label>
                        <input type="password" {...register('password')} name="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="avatar" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Ảnh Đại Diện</label>
                        <input onChange={(e) => setFile(e.target.files[0])} type="file" name="avatar" id="avatar" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        {/* <UploadOutlined style={{ marginTop: '20px', fontSize: '30px' }} onClick={upload} /> */}
                    </div>
                    <button type="submit" className="w-full mt-5 text-white bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-800 dark:hover:bg-primary-800 dark:focus:ring-primary-800">Cập Nhật</button>
                </form>
            </Modal>
            {/* History Vaccine */}
            <Modal width={1000} open={isShowHistoryVaccine} onCancel={() => setIsShowHistoryVaccine(!isShowHistoryVaccine)} okButtonProps={{ style: { display: 'none' } }} cancelButtonProps={{ style: { display: 'none' } }}>
                <Table dataSource={dataHistoryVaccine} columns={columnsHistoryVaccine} />
            </Modal>
            {/* Current Booking */}
            <Modal width={2000} open={isShowCurrentBooking} onCancel={() => setIsShowCurrentBooking(!isShowCurrentBooking)} okButtonProps={{ style: { display: 'none' } }} cancelButtonProps={{ style: { display: 'none' } }}>
                <Table dataSource={dataCurrentBooking} columns={columnsCurrentBooking} />
            </Modal>
        </nav>
    );
}

export default Navbar;