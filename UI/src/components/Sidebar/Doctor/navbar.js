import { Link } from 'react-router-dom';
import { Button, Dropdown, Space, Avatar, Modal, message } from 'antd';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { axiosCli } from '../../../interceptor/axios';
import { BellOutlined } from '@ant-design/icons'
import upload from '../../..//utils/upload';
function Navbar() {
    const [login, setLogin] = useState(true);
    const { register, handleSubmit } = useForm();
    const [data, setData] = useState([]);
    const [file, setFile] = useState('');
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
    }, []);
    const checkLogin = async () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) return setLogin(false)
        setLogin(true)
    }
    const getData = async () => {
        await axiosCli().get('account/my-info').then(res => {
            if (res.status == 200) {
                setData(res.data)
            } else {
                setData([]);
            }
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
                success(res.data.msg)
            } else {
                // setOpenUpdate(false);
                error(res.data.msg);
            }
        })
    }
    const [nav, setNav] = useState();
    const changeNav = () => {
        return window.scrollY >= 30 ? setNav(true) : setNav(false);
    };
    window.addEventListener('scroll', changeNav);




    const items = [
        {
            label: <p onClick={updateInformation}>Cập Nhật Thông Tin</p>,
            key: '0',
        },
        {
            type: 'divider',
        },
        {
            label: <Link to="/login">Đăng Xuất</Link>,
            key: '1',
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
                    <div className='float-right inline-block mr-4 mt-4'>
                        <BellOutlined style={{ fontSize: '24px', marginRight: '10px' }} />
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
                                        <p className='mr-5'>Hi, <strong>{data.fullname}</strong></p>
                                        <Avatar src={data.avatar} size={'large'} />
                                    </Space>
                                    :
                                    <div>
                                        <Space>
                                            <Avatar src='./public/noavatar.jpeg' size={'large'} />
                                        </Space>
                                    </div>
                                }
                            </a>
                        </Dropdown>
                    </div>
                    :
                    <div className='float-right inline-block leading-[5rem] mr-4'>
                        <Button className='mr-1'>
                            <Link to='/login'>Login</Link>
                        </Button>
                        <Button className='bg-orange-400'>
                            <Link to='/register'>Register</Link>
                        </Button>
                    </div>
                }
            </div>
            <Modal title="Cập Nhật Thông Tin" open={openUpdate} okButtonProps={{ style: { display: 'none' } }} onCancel={handleUpdateCancel}>
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
                    <button type="submit" className="w-full mt-5 text-white bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-800 dark:hover:bg-primary-800 dark:focus:ring-primary-800">Submit</button>
                </form>
            </Modal>
        </nav>
    );
}

export default Navbar;