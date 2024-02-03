import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
const { Sider } = Layout;
import { LogoutOutlined, CalendarOutlined, VideoCameraOutlined } from '@ant-design/icons';
function Sidebar({ props }) {
    return (
        <div>
            <Layout style={{ height: '700px' }}>
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
                                label: <Link to="/doctor" rel="noopener noreferrer">
                                    Dashboard
                                </Link>,
                            },
                            {
                                key: '2',
                                icon: <CalendarOutlined />,
                                label: <Link to="/vaccine-schedule" rel="noopener noreferrer">
                                    Lịch Tiêm
                                </Link>,
                            },
                            {
                                key: '3',
                                icon: <VideoCameraOutlined />,
                                label: <Link to="/vaccine-manager" rel="noopener noreferrer">
                                    Quản Lý Vaccine
                                </Link>,
                            },
                            {
                                key: '4',
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
