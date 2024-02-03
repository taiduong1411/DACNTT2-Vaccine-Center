import { Link } from 'react-router-dom';
import { Button, Result } from 'antd';
const PageNotFound = () => (
    <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Button type="primary" style={{ backgroundColor: 'blue' }}>
            <Link to={'/home'}>Home</Link>
        </Button>}
    />
);
export default PageNotFound;