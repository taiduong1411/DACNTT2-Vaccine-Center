import { useParams } from "react-router-dom";
import Navbar from "../../../../components/Sidebar/Doctor/navbar";
// import Sidebar from "../../../../components/Sidebar/Admin/sidebar";
import { Layout, theme, Breadcrumb, Button, message } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { axiosCli } from "../../../../interceptor/axios";
const { Content } = Layout;
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './vaccineDetail.css'
import Loader from "../../../../components/Spin/Spin";

const VaccineDetailDoctor = () => {
    // CONFIG
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const { slug, pro_code } = useParams();
    const [messageApi, contextHolder] = message.useMessage();
    // 
    const [content, setContent] = useState('');
    const [dataDetail, setDataDetail] = useState();
    const handleContentChange = (newContent) => {
        setContent(newContent);
    };
    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            // ['link', 'image'],
            ['clean'],
            [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
        ],
    };
    // GET DATA
    useEffect(() => {
        getDataVaccineByCode();
    }, [])
    const getDataVaccineByCode = async () => {
        const res = await axiosCli().get(`doctor/vaccine/${pro_code}`)
        setDataDetail(res.data.details)
    }
    // RENDER
    // State Visibility
    const [hiddenStates, setHiddenStates] = useState({
        isHidden1: false,
        isHidden2: false,
        isHidden3: false,
        isHidden4: false,
        isHidden5: false,
        isHidden6: false,
        isHidden7: false,
        isHidden8: false,
    });
    const [hiddenUpdate, setHiddenUpdate] = useState({
        isHiddenUpdate1: false,
        isHiddenUpdate2: false,
        isHiddenUpdate3: false,
        isHiddenUpdate4: false,
        isHiddenUpdate5: false,
        isHiddenUpdate6: false,
        isHiddenUpdate7: false,
        isHiddenUpdate8: false,
    });
    // 
    const toggleVisibility = (key) => {
        setHiddenStates((prevStates) => ({
            ...prevStates,
            [key]: !prevStates[key],
        }));
    };
    const toggleButtonUpdate = (key) => {
        setHiddenUpdate((prevStates) => ({
            ...prevStates,
            [key]: !prevStates[key],
        }));
    }
    // State isUpdate
    // const [isUpdate, setIsUpdate] = useState(false);
    // const handleIsUpdate = () => {
    //     setIsUpdate(!isUpdate);
    // }
    // Handle General Information
    const handleGeneralInformation = async () => {
        const data = {
            generalInformation: content
        }
        await axiosCli().post(`doctor/update-detail/generalInformation/${pro_code}`, data).then(res => {
            if (res.status == 200) {
                messageApi.open({
                    type: 'success',
                    content: res.data.msg
                });
                getDataVaccineByCode();
            } else {
                messageApi.open({
                    type: 'error',
                    content: res.data.msg
                });
            }
        })
    }
    // Handle Vaccine For Person
    const handleVaccineForPerson = async () => {
        const data = {
            vaccineForPerson: content
        }
        await axiosCli().post(`doctor/update-detail/vaccineForPerson/${pro_code}`, data).then(res => {
            if (res.status == 200) {
                messageApi.open({
                    type: 'success',
                    content: res.data.msg
                });
                getDataVaccineByCode();
            } else {
                messageApi.open({
                    type: 'error',
                    content: res.data.msg
                });
            }
        })
    }
    // Handle Vaccine Schedule
    const handleVaccineSchedule = async () => {
        const data = {
            vaccineSchedule: content
        }
        await axiosCli().post(`doctor/update-detail/vaccineSchedule/${pro_code}`, data).then(res => {
            if (res.status == 200) {
                messageApi.open({
                    type: 'success',
                    content: res.data.msg
                });
                getDataVaccineByCode();
            } else {
                messageApi.open({
                    type: 'error',
                    content: res.data.msg
                });
            }
        })
    }
    // Handle Vaccine Condition
    const handleVaccineCondition = async () => {
        const data = {
            vaccineCondition: content
        }
        await axiosCli().post(`doctor/update-detail/vaccineCondition/${pro_code}`, data).then(res => {
            if (res.status == 200) {
                messageApi.open({
                    type: 'success',
                    content: res.data.msg
                });
                getDataVaccineByCode();
            } else {
                messageApi.open({
                    type: 'error',
                    content: res.data.msg
                });
            }
        })
    }
    // Handle Vaccine Distance
    const handleVaccineDistance = async () => {
        const data = {
            vaccineDistance: content
        }
        await axiosCli().post(`doctor/update-detail/vaccineDistance/${pro_code}`, data).then(res => {
            if (res.status == 200) {
                messageApi.open({
                    type: 'success',
                    content: res.data.msg
                });
                getDataVaccineByCode();
            } else {
                messageApi.open({
                    type: 'error',
                    content: res.data.msg
                });
            }
        })
    }
    // Handle Vaccine React
    const handleVaccineReact = async () => {
        const data = {
            vaccineReact: content
        }
        await axiosCli().post(`doctor/update-detail/vaccineReact/${pro_code}`, data).then(res => {
            if (res.status == 200) {
                messageApi.open({
                    type: 'success',
                    content: res.data.msg
                });
                getDataVaccineByCode();
            } else {
                messageApi.open({
                    type: 'error',
                    content: res.data.msg
                });
            }
        })
    }
    // Handle Vaccine Status
    const handleVaccineStatus = async () => {
        const data = {
            vaccineStatus: content
        }
        await axiosCli().post(`doctor/update-detail/vaccineStatus/${pro_code}`, data).then(res => {
            if (res.status == 200) {
                messageApi.open({
                    type: 'success',
                    content: res.data.msg
                });
                getDataVaccineByCode();
            } else {
                messageApi.open({
                    type: 'error',
                    content: res.data.msg
                });
            }
        })
    }
    // Handle Vaccine FAQ
    const handleVaccineFaq = async () => {
        const data = {
            vaccineFaq: content
        }
        await axiosCli().post(`doctor/update-detail/vaccineFaq/${pro_code}`, data).then(res => {
            if (res.status == 200) {
                messageApi.open({
                    type: 'success',
                    content: res.data.msg
                });
                getDataVaccineByCode();
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
            <div className="mt-4 mb-4 ml-6">
                <Breadcrumb
                    items={[
                        {
                            href: '/doctor/dashboard',
                            title: <HomeOutlined />,
                        },
                        {
                            href: '/doctor/vaccine-manager',
                            title: (
                                <>
                                    <span>Vaccine Manager</span>
                                </>
                            ),
                        },
                        {
                            title: (
                                <>
                                    <span>{slug}</span>
                                </>
                            )
                        },
                    ]}
                />
            </div>
            <div>
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
                            <div className="mb-4">
                                <div className="p-1 bg-blue-700 rounded-md flex items-center mb-4" onClick={() => toggleVisibility('isHidden1')}>
                                    <h2 className="text-xl font-bold text-orange-400 ml-4">1. Thông Tin Vaccine</h2>
                                </div>
                                <div className={hiddenStates.isHidden1 ? 'hidden' : ''}>
                                    {dataDetail?.generalInformation
                                        ?
                                        <div>
                                            <div className="mb-4 main-content" dangerouslySetInnerHTML={{ __html: dataDetail.generalInformation }} />

                                            <div className={hiddenUpdate.isHiddenUpdate1 ? '' : 'hidden'}>
                                                <div>
                                                    <ReactQuill modules={modules} defaultValue={dataDetail.generalInformation} onChange={handleContentChange} />
                                                </div>
                                            </div>
                                            <div className="mt-4 mb-4 flex justify-end">
                                                {hiddenUpdate.isHiddenUpdate1 ?
                                                    <div>
                                                        <div className="mr-2 inline-block">
                                                            <Button type="primary" style={{ backgroundColor: 'red' }} onClick={() => toggleButtonUpdate('isHiddenUpdate1')}>Đóng</Button>
                                                        </div>
                                                        <div className="inline-block">
                                                            <Button onClick={handleGeneralInformation}>Save</Button>
                                                        </div>
                                                    </div>
                                                    :
                                                    <Button type="primary" style={{ backgroundColor: 'green' }} onClick={() => toggleButtonUpdate('isHiddenUpdate1')}>Chỉnh sửa</Button>
                                                }
                                            </div>
                                        </div>
                                        :
                                        <div>
                                            <div>
                                                <p className="mb-4">
                                                    Chưa Có Dữ Liệu.
                                                </p>
                                            </div>
                                            <div>
                                                <ReactQuill modules={modules} onChange={handleContentChange} />
                                            </div>
                                            <div className="mt-4 flex justify-end">
                                                <Button onClick={handleGeneralInformation}>Save</Button>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="mb-4">
                                <div className="p-1 bg-blue-700 rounded-md flex items-center mb-4" onClick={() => toggleVisibility('isHidden2')}>
                                    <h2 className="text-xl font-bold text-orange-400 ml-4">2. Đối Tượng</h2>
                                </div>
                                <div className={hiddenStates.isHidden2 ? 'hidden' : ''}>
                                    {dataDetail?.vaccineForPerson
                                        ?
                                        <div>
                                            <div className="mb-4 main-content" dangerouslySetInnerHTML={{ __html: dataDetail.vaccineForPerson }} />

                                            <div className={hiddenUpdate.isHiddenUpdate2 ? '' : 'hidden'}>
                                                <div>
                                                    <ReactQuill modules={modules} defaultValue={dataDetail.vaccineForPerson} onChange={handleContentChange} />
                                                </div>
                                            </div>
                                            <div className="mt-4 mb-4 flex justify-end">
                                                {hiddenUpdate.isHiddenUpdate2 ?
                                                    <div>
                                                        <div className="mr-2 inline-block">
                                                            <Button type="primary" style={{ backgroundColor: 'red' }} onClick={() => toggleButtonUpdate('isHiddenUpdate2')}>Đóng</Button>
                                                        </div>
                                                        <div className="inline-block">
                                                            <Button onClick={handleVaccineForPerson}>Save</Button>
                                                        </div>
                                                    </div>
                                                    :
                                                    <Button type="primary" style={{ backgroundColor: 'green' }} onClick={() => toggleButtonUpdate('isHiddenUpdate2')}>Chỉnh sửa</Button>
                                                }
                                            </div>
                                        </div>
                                        :
                                        <div>
                                            <div>
                                                <p className="mb-4">
                                                    Chưa Có Dữ Liệu.
                                                </p>
                                            </div>
                                            <div>
                                                <ReactQuill modules={modules} onChange={handleContentChange} />
                                            </div>
                                            <div className="mt-4 flex justify-end">
                                                <Button onClick={handleVaccineForPerson}>Save</Button>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="mb-4" >
                                <div className="p-1 bg-blue-700 rounded-md flex items-center mb-4" onClick={() => toggleVisibility('isHidden3')}>
                                    <h2 className="text-xl font-bold text-orange-400 ml-4">3. Phác Đồ - Lịch Tiêm</h2>
                                </div>
                                <div className={hiddenStates.isHidden3 ? 'hidden' : ''}>
                                    {dataDetail?.vaccineSchedule
                                        ?
                                        <div>
                                            <div className="mb-4 main-content" dangerouslySetInnerHTML={{ __html: dataDetail.vaccineSchedule }} />

                                            <div className={hiddenUpdate.isHiddenUpdate3 ? '' : 'hidden'}>
                                                <div>
                                                    <ReactQuill modules={modules} defaultValue={dataDetail.vaccineSchedule} onChange={handleContentChange} />
                                                </div>
                                            </div>
                                            <div className="mt-4 mb-4 flex justify-end">
                                                {hiddenUpdate.isHiddenUpdate3 ?
                                                    <div>
                                                        <div className="mr-2 inline-block">
                                                            <Button type="primary" style={{ backgroundColor: 'red' }} onClick={() => toggleButtonUpdate('isHiddenUpdate3')}>Đóng</Button>
                                                        </div>
                                                        <div className="inline-block">
                                                            <Button onClick={handleVaccineSchedule}>Save</Button>
                                                        </div>
                                                    </div>
                                                    :
                                                    <Button type="primary" style={{ backgroundColor: 'green' }} onClick={() => toggleButtonUpdate('isHiddenUpdate3')}>Chỉnh sửa</Button>
                                                }
                                            </div>
                                        </div>
                                        :
                                        <div>
                                            <div>
                                                <p className="mb-4">
                                                    Chưa Có Dữ Liệu.
                                                </p>
                                            </div>
                                            <div>
                                                <ReactQuill modules={modules} onChange={handleContentChange} />
                                            </div>
                                            <div className="mt-4 flex justify-end">
                                                <Button onClick={handleVaccineSchedule}>Save</Button>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="mb-4">
                                <div className="p-1 bg-blue-700 rounded-md flex items-center mb-4" onClick={() => toggleVisibility('isHidden4')}>
                                    <h2 className="text-xl font-bold text-orange-400 ml-4">4. Điều Kiện Trước Khi Tiêm</h2>
                                </div>
                                <div className={hiddenStates.isHidden4 ? 'hidden' : ''}>
                                    {dataDetail?.vaccineCondition
                                        ?
                                        <div>
                                            <div className="mb-4 main-content" dangerouslySetInnerHTML={{ __html: dataDetail.vaccineCondition }} />

                                            <div className={hiddenUpdate.isHiddenUpdate4 ? '' : 'hidden'}>
                                                <div>
                                                    <ReactQuill modules={modules} defaultValue={dataDetail.vaccineCondition} onChange={handleContentChange} />
                                                </div>
                                            </div>
                                            <div className="mt-4 mb-4 flex justify-end">
                                                {hiddenUpdate.isHiddenUpdate4 ?
                                                    <div>
                                                        <div className="mr-2 inline-block">
                                                            <Button type="primary" style={{ backgroundColor: 'red' }} onClick={() => toggleButtonUpdate('isHiddenUpdate4')}>Đóng</Button>
                                                        </div>
                                                        <div className="inline-block">
                                                            <Button onClick={handleVaccineCondition}>Save</Button>
                                                        </div>
                                                    </div>
                                                    :
                                                    <Button type="primary" style={{ backgroundColor: 'green' }} onClick={() => toggleButtonUpdate('isHiddenUpdate4')}>Chỉnh sửa</Button>
                                                }
                                            </div>
                                        </div>
                                        :
                                        <div>
                                            <div>
                                                <p className="mb-4">
                                                    Chưa Có Dữ Liệu.
                                                </p>
                                            </div>
                                            <div>
                                                <ReactQuill modules={modules} onChange={handleContentChange} />
                                            </div>
                                            <div className="mt-4 flex justify-end">
                                                <Button onClick={handleVaccineCondition}>Save</Button>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="mb-4">
                                <div className="p-1 bg-blue-700 rounded-md flex items-center mb-4" onClick={() => toggleVisibility('isHidden5')}>
                                    <h2 className="text-xl font-bold text-orange-400 ml-4">5. Khoảng Cách Với Các Vaccine Khác</h2>
                                </div>
                                <div className={hiddenStates.isHidden5 ? 'hidden' : ''}>
                                    {dataDetail?.vaccineDistance
                                        ?
                                        <div>
                                            <div className="mb-4 main-content" dangerouslySetInnerHTML={{ __html: dataDetail.vaccineDistance }} />

                                            <div className={hiddenUpdate.isHiddenUpdate5 ? '' : 'hidden'}>
                                                <div>
                                                    <ReactQuill modules={modules} defaultValue={dataDetail.vaccineDistance} onChange={handleContentChange} />
                                                </div>
                                            </div>
                                            <div className="mt-4 mb-4 flex justify-end">
                                                {hiddenUpdate.isHiddenUpdate5 ?
                                                    <div>
                                                        <div className="mr-2 inline-block">
                                                            <Button type="primary" style={{ backgroundColor: 'red' }} onClick={() => toggleButtonUpdate('isHiddenUpdate5')}>Đóng</Button>
                                                        </div>
                                                        <div className="inline-block">
                                                            <Button onClick={handleVaccineDistance}>Save</Button>
                                                        </div>
                                                    </div>
                                                    :
                                                    <Button type="primary" style={{ backgroundColor: 'green' }} onClick={() => toggleButtonUpdate('isHiddenUpdate5')}>Chỉnh sửa</Button>
                                                }
                                            </div>
                                        </div>
                                        :
                                        <div>
                                            <div>
                                                <p className="mb-4">
                                                    Chưa Có Dữ Liệu.
                                                </p>
                                            </div>
                                            <div>
                                                <ReactQuill modules={modules} onChange={handleContentChange} />
                                            </div>
                                            <div className="mt-4 flex justify-end">
                                                <Button onClick={handleVaccineDistance}>Save</Button>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="mb-4">
                                <div className="p-1 bg-blue-700 rounded-md flex items-center mb-4" onClick={() => toggleVisibility('isHidden6')}>
                                    <h2 className="text-xl font-bold text-orange-400 ml-4">6. Phản Ứng Sau Khi Tiêm</h2>
                                </div>
                                <div className={hiddenStates.isHidden6 ? 'hidden' : ''}>
                                    {dataDetail?.vaccineReact
                                        ?
                                        <div>
                                            <div className="mb-4 main-content" dangerouslySetInnerHTML={{ __html: dataDetail.vaccineReact }} />

                                            <div className={hiddenUpdate.isHiddenUpdate6 ? '' : 'hidden'}>
                                                <div>
                                                    <ReactQuill modules={modules} defaultValue={dataDetail.vaccineReact} onChange={handleContentChange} />
                                                </div>
                                            </div>
                                            <div className="mt-4 mb-4 flex justify-end">
                                                {hiddenUpdate.isHiddenUpdate6 ?
                                                    <div>
                                                        <div className="mr-2 inline-block">
                                                            <Button type="primary" style={{ backgroundColor: 'red' }} onClick={() => toggleButtonUpdate('isHiddenUpdate6')}>Đóng</Button>
                                                        </div>
                                                        <div className="inline-block">
                                                            <Button onClick={handleVaccineReact}>Save</Button>
                                                        </div>
                                                    </div>
                                                    :
                                                    <Button type="primary" style={{ backgroundColor: 'green' }} onClick={() => toggleButtonUpdate('isHiddenUpdate6')}>Chỉnh sửa</Button>
                                                }
                                            </div>
                                        </div>
                                        :
                                        <div>
                                            <div>
                                                <p className="mb-4">
                                                    Chưa Có Dữ Liệu.
                                                </p>
                                            </div>
                                            <div>
                                                <ReactQuill modules={modules} onChange={handleContentChange} />
                                            </div>
                                            <div className="mt-4 flex justify-end">
                                                <Button onClick={handleVaccineReact}>Save</Button>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="mb-4">
                                <div className="p-1 bg-blue-700 rounded-md flex items-center mb-4" onClick={() => toggleVisibility('isHidden7')}>
                                    <h2 className="text-xl font-bold text-orange-400 ml-4">7. Tình Trạng Vaccine</h2>
                                </div>
                                <div className={hiddenStates.isHidden7 ? 'hidden' : ''}>
                                    {dataDetail?.vaccineStatus
                                        ?
                                        <div>
                                            <div className="mb-4 main-content" dangerouslySetInnerHTML={{ __html: dataDetail.vaccineStatus }} />

                                            <div className={hiddenUpdate.isHiddenUpdate7 ? '' : 'hidden'}>
                                                <div>
                                                    <ReactQuill modules={modules} defaultValue={dataDetail.vaccineStatus} onChange={handleContentChange} />
                                                </div>
                                            </div>
                                            <div className="mt-4 mb-4 flex justify-end">
                                                {hiddenUpdate.isHiddenUpdate7 ?
                                                    <div>
                                                        <div className="mr-2 inline-block">
                                                            <Button type="primary" style={{ backgroundColor: 'red' }} onClick={() => toggleButtonUpdate('isHiddenUpdate7')}>Đóng</Button>
                                                        </div>
                                                        <div className="inline-block">
                                                            <Button onClick={handleVaccineStatus}>Save</Button>
                                                        </div>
                                                    </div>
                                                    :
                                                    <Button type="primary" style={{ backgroundColor: 'green' }} onClick={() => toggleButtonUpdate('isHiddenUpdate7')}>Chỉnh sửa</Button>
                                                }
                                            </div>
                                        </div>
                                        :
                                        <div>
                                            <div>
                                                <p className="mb-4">
                                                    Chưa Có Dữ Liệu.
                                                </p>
                                            </div>
                                            <div>
                                                <ReactQuill modules={modules} onChange={handleContentChange} />
                                            </div>
                                            <div className="mt-4 flex justify-end">
                                                <Button onClick={handleVaccineStatus}>Save</Button>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="mb-4">
                                <div className="p-1 bg-blue-700 rounded-md flex items-center mb-4" onClick={() => toggleVisibility('isHidden8')}>
                                    <h2 className="text-xl font-bold text-orange-400 ml-4">8. Các Câu Hỏi Thường Gặp</h2>
                                </div>
                                <div className={hiddenStates.isHidden8 ? 'hidden' : ''}>
                                    {dataDetail?.vaccineFaq
                                        ?
                                        <div>
                                            <div className="mb-4 main-content" dangerouslySetInnerHTML={{ __html: dataDetail.vaccineFaq }} />

                                            <div className={hiddenUpdate.isHiddenUpdate8 ? '' : 'hidden'}>
                                                <div>
                                                    <ReactQuill modules={modules} defaultValue={dataDetail.vaccineFaq} onChange={handleContentChange} />
                                                </div>
                                            </div>
                                            <div className="mt-4 mb-4 flex justify-end">
                                                {hiddenUpdate.isHiddenUpdate8 ?
                                                    <div>
                                                        <div className="mr-2 inline-block">
                                                            <Button type="primary" style={{ backgroundColor: 'red' }} onClick={() => toggleButtonUpdate('isHiddenUpdate8')}>Đóng</Button>
                                                        </div>
                                                        <div className="inline-block">
                                                            <Button onClick={handleVaccineFaq}>Save</Button>
                                                        </div>
                                                    </div>
                                                    :
                                                    <Button type="primary" style={{ backgroundColor: 'green' }} onClick={() => toggleButtonUpdate('isHiddenUpdate8')}>Chỉnh sửa</Button>
                                                }
                                            </div>
                                        </div>
                                        :
                                        <div>
                                            <div>
                                                <p className="mb-4">
                                                    Chưa Có Dữ Liệu.
                                                </p>
                                            </div>
                                            <div>
                                                <ReactQuill modules={modules} onChange={handleContentChange} />
                                            </div>
                                            <div className="mt-4 flex justify-end">
                                                <Button onClick={handleVaccineFaq}>Save</Button>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>

                        </div>
                    </Content>
                </Layout>
            </div>
        </div>
    )
}
export default VaccineDetailDoctor