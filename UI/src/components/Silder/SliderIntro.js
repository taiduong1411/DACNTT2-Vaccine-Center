import { Carousel } from 'antd';

const SliderIntro = () => {
    const onChange = (currentSlide) => {
        console.log(currentSlide);
    };
    return (
        <Carousel afterChange={onChange}>
            <div>
                <img src="https://vnvc.vn/wp-content/uploads/2023/11/thumbnail.png" alt=""
                    className='w-full'
                />
            </div>
            <div>
                <img src="https://vnvc.vn/wp-content/uploads/2023/11/khai-truong-vnvc-viet-hung.jpg" alt=""
                    className='w-full'
                />
            </div>
            <div>
                <img src="https://vnvc.vn/wp-content/uploads/2024/01/thumb-khai-truong-vnvc-long-thanh-my.jpg" alt=""
                    className='w-full'
                />
            </div>
            <div>
                <img src="https://vnvc.vn/wp-content/uploads/2023/04/vnvc-tuy-hoa-thumb.webp" alt=""
                    className='w-full'
                />
            </div>
        </Carousel>
    );
};
export default SliderIntro;