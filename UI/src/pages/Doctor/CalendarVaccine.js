import Navbar from "../../components/Sidebar/Doctor/navbar";
import Sidebar from "../../components/Sidebar/Doctor/sidebar";
import { Layout, theme, Card, Row, Col } from 'antd';
const { Content } = Layout;
function CalendarVaccine() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <div>
            <Navbar />

            <div className="flex">
                <Sidebar props={2} />
                <Layout>
                    <Content
                        style={{
                            margin: '24px 16px 0',
                        }}
                    >
                        <div
                            style={{
                                padding: 24,
                                minHeight: 660,
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                            }}
                        >
                            {/* <div className="flex justify-center">
                                <div className="mr-3">
                                    <Card
                                        title="Card title"
                                        bordered={false}
                                        style={{
                                            width: 300,
                                        }}
                                    >
                                        <p>Card content</p>
                                        <p>Card content</p>
                                        <p>Card content</p>
                                    </Card>
                                </div>
                            </div> */}
                            <Row justify="space-evenly">
                                <Col span={4}>
                                    <Card
                                        title="Card title"
                                        bordered={false}
                                    // style={{
                                    //     width: 300,
                                    // }}
                                    >
                                        <p>Card content</p>
                                        <p>Card content</p>
                                        <p>Card content</p>
                                    </Card>
                                </Col>
                                <Col span={4}>
                                    <Card
                                        title="Card title"
                                        bordered={false}
                                    // style={{
                                    //     width: 300,
                                    // }}
                                    >
                                        <p>Card content</p>
                                        <p>Card content</p>
                                        <p>Card content</p>
                                    </Card>
                                </Col>
                                <Col span={4}>
                                    <Card
                                        title="Card title"
                                        bordered={false}
                                    // style={{
                                    //     width: 300,
                                    // }}
                                    >
                                        <p>Card content</p>
                                        <p>Card content</p>
                                        <p>Card content</p>
                                    </Card>
                                </Col>
                                <Col span={4}>
                                    <Card
                                        title="Card title"
                                        bordered={false}
                                    // style={{
                                    //     width: 300,
                                    // }}
                                    >
                                        <p>Card content</p>
                                        <p>Card content</p>
                                        <p>Card content</p>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </Content>
                </Layout>
            </div>
        </div>
    );
}

export default CalendarVaccine;