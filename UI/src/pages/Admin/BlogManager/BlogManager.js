import Navbar from "../../../components/Sidebar/Doctor/navbar";
import Sidebar from "../../../components/Sidebar/Admin/sidebar";
import { Layout } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useState } from "react";
import { Table, Space, Badge, Button, Modal, message, Popover } from 'antd'
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
            key: 'tile',
            render: (record) => {
                const content = (
                    <div> <strong>Tag:</strong>
                        {record.hashtags?.map((h, index) => (
                            <div key={index}>
                                <span>{h}</span>
                            </div>
                        ))}
                    </div>
                );
                return (
                    <Space wrap>
                        <Popover content={content} trigger="hover">
                            {record.title}
                        </Popover>
                    </Space>
                )
            }
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
            title: 'Người Tạo',
            dataIndex: 'author',
            key: 'author'
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
            content: content,
            hashtags: hashtags
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
    // Handle HashTag
    const [inputValue, setInputValue] = useState('');
    const [hashtags, setHashtags] = useState([]);
    const handleInputChange = (e) => {
        // console.log(e.target.value);
        setInputValue(e.target.value);
    };
    const handleAddHashtag = (event) => {
        event.preventDefault();
        setHashtags([...hashtags, inputValue]);
        setInputValue('');
    };
    const removeData = (index) => {
        setHashtags(hashtags.filter((el, i) => i !== index));
        // setDataBeforeAddSend(dataBeforeAddSend.filter((el, i) => i !== index));
    }
    // Search
    const onSearchSubmit = async (data) => {
        await axiosCli().get(`admin/search-blog/${data.key}`).then(res => {
            if (res.data.length < 1) {
                setDataBlog([]);
                messageApi.open({
                    type: 'warning',
                    content: 'Không tìm thấy nhân viên'
                })
            } else {
                setDataBlog(res.data)
            }
        })
    }
    const onInput = (e) => {
        if (e.target.value.length < 1) {
            getDataBlog();
        }
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
                        <Button className="float-right mb-5" onClick={showAdd}>Add New</Button>
                        <div>
                            <form className="space-y-1 md:space-y-6 mt-4 mb-10" onSubmit={handleSubmit(onSearchSubmit)}>
                                <div className="relative mb-8">
                                    <input type="search" {...register("key")} onInput={onInput} id="default-search" className="block w-full p-4 pl-10 text-sm border border-gray-300 rounded-lg text-black bg-gray-50 focus:ring-blue-500 focus:border-blue-50 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Tìm kiếm học sinh" required />
                                    <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                                </div>
                            </form>
                        </div>

                        <Table dataSource={dataBlog} columns={columns}></Table>
                    </Content>
                </Layout>
            </div>
            <Modal open={addOpen} width={2000} okButtonProps={{ style: { display: 'none' } }} onCancel={() => setAddOpen(false)}>
                <form onSubmit={handleSubmit(onAddSubmit)}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tiêu Đề Chính</label>
                        <input type="text" {...register('title')} placeholder="Tiêu Đề Chính" name="title" id="title" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="sub_content" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Mô tả ngắn</label>
                        <input type="text" {...register('sub_content')} placeholder="Tiêu Đề Phụ" name="sub_content" id="sub_content" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="cover" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Ảnh Đại Diện</label>
                        <input onChange={(e) => setFile(e.target.files[0])} type="file" name="cover" id="cover" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    {/* Hashtag */}
                    <div className="mb-6 flex justify-between items-center">
                        <div className="flex">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={handleInputChange}
                                className="bg-gray-100 border border-gray-300 text-gray-900 sm:text-sm rounded-l-lg focus:ring-primary-600 focus:border-primary-600 p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Hash Tag"

                            />
                            <button
                                onClick={handleAddHashtag}
                                className="bg-blue-500 text-white rounded-r-lg transition duration-300 hover:bg-blue-600 px-4 py-2"
                            >
                                Add
                            </button>
                        </div>
                        <div className="ml-2">
                            {hashtags.map((tag, index) => (
                                <span key={index} onClick={() => removeData(index)} className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full mr-2 mb-2">
                                    {tag}
                                </span>
                            ))}
                        </div>
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