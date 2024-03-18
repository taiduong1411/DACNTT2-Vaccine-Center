import Navbar from "../../components/Sidebar/Doctor/navbar";
import Sidebar from "../../components/Sidebar/Doctor/sidebar";
import Loader from "../../components/Spin/Spin";


function Doctor() {
    return (
        <div>
            <div>
                <Loader />
            </div>
            <div>
                <Navbar />
                <Sidebar props={1} />
            </div>
        </div>
    );
}

export default Doctor;