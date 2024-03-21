/* eslint-disable react/prop-types */
import { useEffect } from "react";
import Glide from "@glidejs/glide";
import { useNavigate } from "react-router-dom";
import { Button } from 'antd';

export default function CarouselVaccine({ props }) {
    const nav = useNavigate();
    useEffect(() => {
        const slider = new Glide(".glide-01", {
            type: "carousel",
            focusAt: "center",
            perView: 4,
            autoplay: 3000,
            animationDuration: 700,
            gap: 24,
            classNames: {
                nav: {
                    active: "[&>*]:bg-wuiSlate-700",
                },
            },
            breakpoints: {
                1024: {
                    perView: 2,
                },
                640: {
                    perView: 1,
                },
            },
        }).mount()

        return () => {
            slider.destroy()
        }
    }, [])
    return (
        <>
            {props.length < 0
                ?
                <div>abc</div>
                :
                <div className="glide-01 relative w-full">

                    <div className="overflow-hidden" data-glide-el="track">
                        <ul className="whitespace-no-wrap flex-no-wrap [backface-visibility: hidden] [transform-style: preserve-3d] [touch-action: pan-Y] [will-change: transform] relative flex w-full overflow-hidden p-0">
                            <li></li>
                            <li></li>
                            {props && props?.map((data) => (
                                <li key={data.pro_code} className="mr-4" onClick={() => nav(`/vaccine/${data.slug}`)}>
                                    <div className="w-full h-80 sm:w-72 bg-white shadow-sm border hover:shadow-lg rounded-xl overflow-hidden">
                                        <img
                                            className="w-full h-40 object-cover sm:h-44"
                                            src={`${data.cover}`}
                                            alt=""
                                        />
                                        <div className="p-4 flex flex-col justify-between h-full">
                                            <p className="text-lg mb-2">{data.pro_name}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                            <li></li>
                            <li></li>
                        </ul>
                    </div>
                    <div
                        className="absolute left-0 top-1/2 flex h-0 w-full items-center justify-between px-4 "
                        data-glide-el="controls"
                    >
                        <button
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-white/20 text-slate-700 transition duration-300 hover:border-slate-900 hover:text-slate-900 focus-visible:outline-none lg:h-12 lg:w-12"
                            data-glide-dir="<"
                            aria-label="prev slide"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="h-5 w-5"
                            >
                                <title>prev slide</title>
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                                />
                            </svg>
                        </button>
                        <button
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-white/20 text-slate-700 transition duration-300 hover:border-slate-900 hover:text-slate-900 focus-visible:outline-none lg:h-12 lg:w-12"
                            data-glide-dir=">"
                            aria-label="next slide"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="h-5 w-5"
                            >
                                <title>next slide</title>
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            }
            <script src="https://cdnjs.cloudflare.com/ajax/libs/Glide.js/3.0.2/glide.js"></script>
            {/*<!-- End Carousel with controls inside --> */}
        </>
    )
}