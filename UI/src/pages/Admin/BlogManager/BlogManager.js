import Navbar from "../../../components/Sidebar/Doctor/navbar";
import Sidebar from "../../../components/Sidebar/Admin/sidebar";
import { Layout } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useState } from "react";
import { Table, Space, Badge, Button, Modal, message } from 'antd'
import { axiosCli } from "../../../interceptor/axios";
import { useForm } from 'react-hook-form'
import upload from "../../../utils/upload";
const { Content } = Layout;


const BlogManager = () => {
    // config
    const [content, setContent] = useState('');

    const handleContentChange = (newContent) => {
        setContent(newContent);
    };
    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean'],
            [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
        ],
    };


    const columns = [
        {
            title: 'Tên Tiêu Đề',
            dataIndex: 'title',
            key: 'tile',
        },
        {
            title: 'Mô Tả Ngắn',
            key: 'sub_content',
            render: (record) => {
                return <div>{record.sub_content}</div>;
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
                    <Button type="primary" style={{ backgroundColor: 'red' }} data-id={record._id} data-name={record.title} onClick={showDel} >Delete</Button>
                    <Button type="primary" style={{ backgroundColor: 'green' }} data-id={record._id} >Update</Button>
                </Space>
            ),
        },
    ];
    const { register, handleSubmit } = useForm();
    const [messageApi, contextHolder] = message.useMessage();
    // Get Data Blog
    const [dataBlog, setDataBlog] = useState([]);
    useEffect(() => {
        getDataBlog();
    }, [])
    const getDataBlog = async () => {
        await axiosCli().get('admin/all-blogs').then(res => {
            setDataBlog(res.data)
        })
    }
    // Handle Add Blog
    const [addOpen, setAddOpen] = useState(false);
    const [file, setFile] = useState('');
    const showAdd = () => {
        setAddOpen(true)
    }
    const onAddSubmit = async (data) => {
        const url = await upload(file, 'DACNTT2/blog');
        const allData = {
            ...data,
            cover: url,
            content: content
        }
        await axiosCli().post('admin/add-blog', allData).then(res => {
            if (res.status == 200) {
                messageApi.open({
                    type: 'success',
                    content: res.data.msg,
                })
                setAddOpen(false);
                getDataBlog();
            } else {
                messageApi.open({
                    type: 'error',
                    content: res.data.msg,
                })
            }
        })
    }
    // Show Preview
    const [preview, setPreview] = useState(false);
    const showPreview = () => {
        setPreview(true)
    }
    const closePreview = () => {
        setPreview(false)
    }
    // Handle Delete
    const [delOpen, setDelOpen] = useState(false);
    const [dataDel, setDataDel] = useState([]);

    const showDel = (event) => {
        const data = {
            _id: event.currentTarget.dataset.id,
            name: event.currentTarget.dataset.name,
        }
        setDataDel(data);
        setDelOpen(true);
    }
    const handleDel = () => {
        setDelOpen(false);
        deleteBlog(dataDel._id);
    }
    const deleteBlog = async (_id) => {
        await axiosCli().del(`admin/del-blog/${_id}`).then(res => {
            if (res.status == 200) {
                messageApi.open({
                    type: 'success',
                    content: res.data.msg
                });
                getDataBlog();
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
            <Navbar />
            <div className="flex">
                <Sidebar props={5} />
                <Layout>
                    <Content
                        style={{
                            margin: '24px 16px 0',
                        }}
                    >
                        <div className="mb-20">
                            <Button className="float-right mb-5" onClick={showAdd}>Add New</Button>
                            <Table dataSource={dataBlog} columns={columns}></Table>
                        </div>
                    </Content>
                </Layout>
            </div>
            <Modal open={addOpen} width={2000} okButtonProps={{ style: { display: 'none' } }} onCancel={() => setAddOpen(false)}>
                <form onSubmit={handleSubmit(onAddSubmit)}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tên Nội Dung</label>
                        <input type="text" {...register('title')} placeholder="Tên Trung Tâm" name="title" id="title" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="sub_content" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Mô tả ngắn</label>
                        <input type="text" {...register('sub_content')} placeholder="Số Nhà" name="sub_content" id="sub_content" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="cover" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Ảnh Đại Diện</label>
                        <input onChange={(e) => setFile(e.target.files[0])} type="file" name="cover" id="cover" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div>
                        <ReactQuill className="h-60" modules={modules} value={content} onChange={handleContentChange} />
                    </div>
                    <div className="mt-16 float-right">
                        {preview
                            ?
                            <Button type="primary" style={{ backgroundColor: 'red', marginRight: '10px' }} onClick={closePreview} >Close Preview</Button>
                            :
                            <Button type="primary" style={{ backgroundColor: 'blue', marginRight: '10px' }} onClick={showPreview} >Preview</Button>
                        }
                        {/* <Button type="primary" style={{ backgroundColor: 'green' }} >Submit</Button> */}
                    </div>
                    <div className="h-20"></div>
                    {preview
                        ?
                        <div>
                            <h3>Preview:</h3>
                            <div dangerouslySetInnerHTML={{ __html: content }} />
                        </div>
                        :
                        ''
                    }
                    <button type="submit" className="w-full mt-5 text-white bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-800 dark:hover:bg-primary-800 dark:focus:ring-primary-800">Submit</button>
                </form>
            </Modal>
            <Modal title='Xoá Blog' open={delOpen} onOk={handleDel} okButtonProps={{ style: { backgroundColor: 'red' } }} onCancel={() => setDelOpen(false)}>
                <div>
                    <div className="font-bold">
                        {dataDel.name}
                    </div>
                    <div>
                        Sẽ bị xoá và không thể khôi phục
                    </div>
                </div>
            </Modal>
        </div>
    )
}
export default BlogManager;