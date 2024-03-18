import { Button, Modal, message, notification } from "antd";
import { useForm } from 'react-hook-form';
import { useState } from "react";
import { axiosCli } from "../../interceptor/axios";
function Report({ props }) {
    // Handle Report 
    const { register, handleSubmit } = useForm();
    const [openRe, setOpenRe] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    // Check Login
    const [isLogin, setIsLogin] = useState(false)
    const checkLogin = () => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            setIsLogin(true);
        } else {
            setIsLogin(false);
        }
    }
    const [api, contextHolder] = notification.useNotification();
    const showReport = () => {
        checkLogin();
        setOpenRe(true);
    }

    const onReportSubmit = async (data) => {
        if (data['center'] == 'null') {
            setErrMsg('Vui lòng chọn Trạm y tế gần nhất')
        } else {
            await axiosCli().post('user/report-disease', data).then(res => {
                api.open({
                    message: res.data.msg,
                    description: res.data.desc,
                    duration: 4,
                });
                setOpenRe(false)
            })
        }

    }
    return (
        <div>
            {contextHolder}
            <div className="fixed bottom-0 right-0 mb-20 mr-5" >
                <Button onClick={showReport} className="bg-orange-600 flex items-center" style={{ borderRadius: '100%', width: '50px', height: '50px' }}>
                    <div className="inline-block">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="rgba(255,255,255,1)"><path d="M6.45455 19L2 22.5V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V18C22 18.5523 21.5523 19 21 19H6.45455ZM11 13V15H13V13H11ZM11 7V12H13V7H11Z"></path></svg>
                    </div>
                </Button>
            </div>
            <Modal width={1000} title="Báo Cáo Dịch Bệnh" open={openRe} okButtonProps={{ style: { display: 'none' } }} cancelButtonProps={{ style: { display: 'none' } }} onCancel={() => setOpenRe(false)}>
                <form onSubmit={handleSubmit(onReportSubmit)}>
                    {isLogin
                        ?
                        <div></div>
                        :
                        <div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Email</label>
                                <input type="email" {...register('email')} placeholder="Email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Số Điện Thoại</label>
                                <input type="text" {...register('phone')} placeholder="Số Điện Thoại" name="phone" id="phone" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            </div>
                        </div>
                    }
                    <div className="mb-4">
                        <label htmlFor="timeBooking" className="block mb-2 text-sm font-medium text-gray-900 ">Chọn Trung Tâm</label>
                        <select name="center" id="center" {...register('center')}>
                            <option value="null">Chọn Trung Tâm Gần Nhất</option>
                            {props && props.map((data, index) => (
                                <option value={data._id} key={index}>{data.center_name}</option>
                            ))}
                        </select>
                        <p className='ml-2 text-xs text-red-600 mt-3'>{errMsg}</p>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="desc" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Mô Tả</label>
                        <textarea cols={4} rows={8} type="text" {...register('desc')} placeholder="Mô Tả Tình Hình Dịch Bệnh" id="desc" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                    </div>
                    <button type="submit" className="w-full mt-5 text-white bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-800 dark:hover:bg-primary-800 dark:focus:ring-primary-800">Submit</button>
                </form>
            </Modal>
        </div>
    );
}

export default Report;