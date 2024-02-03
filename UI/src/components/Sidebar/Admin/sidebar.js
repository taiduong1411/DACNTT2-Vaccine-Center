import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
const { Sider } = Layout;
import { LogoutOutlined, PlusSquareOutlined, CalendarOutlined, VideoCameraOutlined } from '@ant-design/icons';

function Sidebar({ props }) {

    return (
        <div>
            <Layout className='' style={{ height: '100%', minHeight: '700px' }}>
                <Sider
                    breakpoint="lg"
                    collapsedWidth="0"
                    onBreakpoint={(broken) => {
                        console.log(broken);
                    }}
                    onCollapse={(collapsed, type) => {
                        console.log(collapsed, type);
                    }}
                >
                    <div className="demo-logo-vertical" />
                    <Menu className='mt-3' theme="dark" mode="inline" defaultSelectedKeys={[`${props}`]} items={
                        [
                            {
                                key: '1',
                                icon: <CalendarOutlined />,
                                label: <Link to="/admin/dashboard" rel="noopener noreferrer">
                                    Dashboard
                                </Link>,
                            },
                            {
                                key: '2',
                                icon: <PlusSquareOutlined />,
                                label: <Link to="/admin/vaccine-manager" rel="noopener noreferrer">
                                    Quản Lý Vaccine
                                </Link>,
                            },
                            {
                                key: '3',
                                icon: <VideoCameraOutlined />,
                                label: <Link to="/admin/center-manager" rel="noopener noreferrer">
                                    Quản Lý Trung Tâm
                                </Link>,
                            },
                            {
                                key: '4',
                                icon: <VideoCameraOutlined />,
                                label: <Link to="/admin/doctor-manager" rel="noopener noreferrer">
                                    Quản Lý Bác Sĩ
                                </Link>,
                            },
                            {
                                key: '5',
                                icon: <VideoCameraOutlined />,
                                label: <Link to="/admin/blog-manager" rel="noopener noreferrer">
                                    Quản Lý Blog
                                </Link>,
                            },
                            {
                                key: '6',
                                icon: <LogoutOutlined />,
                                label: <Link to="/login" rel="noopener noreferrer">
                                    Logout
                                </Link>,
                            },
                        ]
                    } />
                </Sider>
            </Layout>
        </div>
    );
}

export default Sidebar;
