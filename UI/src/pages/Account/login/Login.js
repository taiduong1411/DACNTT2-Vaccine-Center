import { Link } from 'react-router-dom'
// import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { axiosCli } from '../../../interceptor/axios';
import { message } from 'antd';
import { jwtDecode } from 'jwt-decode';
function Login() {
    localStorage.removeItem('accessToken');
    const [messageApi, contextHolder] = message.useMessage();
    const { register, handleSubmit } = useForm();
    // const nav = useNavigate();
    const onSubmit = async (data) => {
        if (!data['email'] || !data['password']) {
            return messageApi.open({
                type: 'error',
                content: 'Vui lòng điền đầy đủ thông tin'
            })
        }
        await axiosCli().post('account/login', data).then(res => {
            if (res.status == 200) {
                localStorage.setItem("accessToken", res.data.token);
                let userInfo = jwtDecode(localStorage.getItem("accessToken"));
                if (userInfo.level == '1') return window.location.href = '/home'
                if (userInfo.level == '2') return window.location.href = '/doctor/dashboard'
                if (userInfo.level == '3') return window.location.href = '/admin/dashboard'
            } else {
                messageApi.open({
                    type: 'error',
                    content: res.data.msg,
                });
            }
        })
    }
    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Đăng Nhập
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                <input type="text" {...register("email")} placeholder="Nhập email..." name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mật Khẩu</label>
                                <input type="password" {...register("password")} name="password" id="password" placeholder="Nhập Mật Khẩu..." className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                    <div className="ml-3 text-sm">
                                        <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Quên mật khẩu ?</Link>
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Chưa có tài khoản ? <Link to="/register" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Đăng ký tài khoản</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
            {contextHolder}
        </div>
    );
}

export default Login;