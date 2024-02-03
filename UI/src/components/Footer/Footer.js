function Footer() {
    return (

        <div className="bg-blue-400 text-white">

            <div className="container mx-auto py-8 flex flex-col md:flex-row items-center justify-between">
                <div className="text-center md:text-left mb-4 md:mb-0">
                    <h3 className="text-2xl font-bold">Your Company Name</h3>
                    <p className="text-sm">Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
                </div>
                {/* <div className="flex items-center justify-center space-x-4 md:space-x-8">
                    <a href="#" className="text-gray-300 hover:text-white">Home</a>
                    <a href="#" className="text-gray-300 hover:text-white">About</a>
                    <a href="#" className="text-gray-300 hover:text-white">Services</a>
                    <a href="#" className="text-gray-300 hover:text-white">Contact</a>
                </div> */}
                <div className="flex flex-col items-center md:flex-row mt-4 md:mt-0">
                    <span className="text-gray-400 text-sm mb-2 md:mb-0">© 2024 Your Company. All rights reserved.</span>
                    <ul className="text-gray-400 text-sm ml-0 md:ml-4">
                        <li>Center 1</li>
                        <li>Center 2</li>
                        <li>Center 3</li>
                        {/* Thêm các trung tâm khác nếu cần */}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Footer;