import Navbar from "../../components/Sidebar/Doctor/navbar";
import Sidebar from "../../components/Sidebar/Doctor/sidebar";


function Doctor() {
    return (
        <div>
            <div>
                <Navbar />
                <Sidebar props={1} />
            </div>
        </div>
    );
}

export default Doctor;