import { useForm } from "react-hook-form";
import { axiosCli } from "../../../interceptor/axios";
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
function ForgotPassword() {
    const [messageApi, contextHolder] = message.useMessage();
    const key = 'updatable';
    const { register, handleSubmit } = useForm();
    const nav = useNavigate();
    const onSubmit = async (data) => {
        await axiosCli().post('account/forgot-password', data).then(res => {
            if (res.status == 200) {
                messageApi.open({
                    key,
                    type: 'loading',
                    content: 'Loading...',
                });
                setTimeout(() => {
                    messageApi.open({
                        key,
                        type: 'success',
                        content: res.data.msg,
                        duration: 2,
                    });
                }, 1000);
                localStorage.setItem('email', data['email'])
                setTimeout(() => {
                    return nav('/reset-password')
                }, 2000)
            } else {
                messageApi.error({ content: res.data.msg });
            }
        })
    }
    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                <input type="text" {...register("email")} placeholder="Enter Your Email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                            </div>
                            <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
            {contextHolder}
        </div>
    );
}

export default ForgotPassword;