import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import "./Homepage.css";
import BlogsNews from "./BlogsNews";
import ChatbotWidget from "../../components/ChatbotWidget/ChatbotWidget";

const HomePage = () => {
    const carouselImages = [
        "/Images/Slide1.png",
        "/Images/Slide2.png",
        "/Images/Slide3.png",
        "/Images/Slide4.png",
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 3000);
        return () => clearInterval(interval);
    }, [currentIndex]);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    };

    const prevSlide = () => {
        setCurrentIndex(
            (prevIndex) => (prevIndex - 1 + carouselImages.length) % carouselImages.length
        );
    };

    const columnsData = [
        {
            image: "/Images/hos.jpg",
            title: "Hospitals Around You",
            text: "Locate nearby healthcare facilities with detailed information on specialties, ratings, and emergency services. Find the best care close to home.",
            path: "/hospitals"
        },
        {
            image: "/Images/doc.jpg",
            title: "Check Best Doctors",
            text: "Connect with verified medical specialists. View qualifications, experience, and patient reviews to choose your ideal healthcare provider.",
            path: "/doctors"
        },
        {
            image: "/Images/Beds.jpg",
            title: "Search Beds",
            text: "Real-time availability of hospital beds across departments. Check ICU, general ward, and specialty bed status with daily updates.",
            path: "/beds"
        },
        {
            image: "/Images/blood.jpg",
            title: "Need Blood ?",
            text: "Find blood type availability and connect with donors instantly. Emergency requests get priority handling with our rapid response system.",
            path: "/blood-bank"
        },
    ];

    return (
        <>
            <div>
                {/* Carousel */}
                <div className="carousel-container">
                    <button className="carousel-button prev" onClick={prevSlide}>
                        ❮
                    </button>
                    <div className="carousel-slide">
                        <div
                            className="carousel-images"
                            style={{
                                transform: `translateX(-${currentIndex * 100}%)`,
                            }}
                        >
                            {carouselImages.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`Slide ${index + 1}`}
                                    className="carousel-image"
                                />
                            ))}
                        </div>
                    </div>
                    <button className="carousel-button next" onClick={nextSlide}>
                        ❯
                    </button>
                </div>

                {/* 4-Column Layout */}
                <div className="grid-container">
                    {columnsData.map((column, index) => (
                        <Link to={column.path} key={index} className="grid-link">
                            <div className="grid-item">
                                <img
                                    src={column.image}
                                    alt={`Column ${index + 1}`}
                                    className="column-icon"
                                />
                                <h3>{column.title}</h3>
                                <p>{column.text}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* New Section */}
                <div className="new-container">
                    <h2 className="new-heading">Join Us Today (For Solo Practitioner)</h2>
                    <div className="new-subheadings">
                        <p className="subtitle">Find doctors, beds, and blood banks easily. <br></br>Register now for exclusive benefits!<br></br>Streamline your healthcare journey with us<br></br>Register now for exclusive benefits!</p>
                    </div>
                    <div>
                    <Link to="/signup">
                        <button className="register-button">Get Registered</button>
                    </Link>
                    </div>
                    <img
                        src="/Images/ForDoctor.png"
                        alt="Healthcare Facility"
                        className="new-container-image"
                    />
                </div>
            </div>
            <div>
                <div className="container">
                    {/* Blood Bank Section */}
                    <div className="section">
                        <div className="content">
                            <h2>Blood Bank Availability</h2>
                            <p className="subtitle2">
                                Find out you prefered blood at and ease of one click
                            </p>
                            <Link to='/blood-bank'>
                            <button className="check-button">
                                Check Availability
                            </button>
                            </Link>
                        </div>
                        <div className="bb-image-container">
                            <img
                                src="https://www.drsstantiamch.org/uploads/infrastructure/blood_bank.jpg"
                            />
                        </div>
                    </div>

                    {/* Bed Availability Section */}
                    <div className="section">
                        <div className="content">
                            <h2>Check Bed Availability</h2>
                            <p className="subtitle2">
                                Checkout Availability of Beds in Hospital Rooms at various locations
                            </p>
                            <Link to='/beds'>
                            <button className="check-button">
                                Check
                            </button>
                            </Link>
                        </div>
                        <div className="bb-image-container">
                            <img
                                src="https://www.medplushealth.ca/wp-content/uploads/bigstock-Clean-Empty-Bed-In-A-Hospital-282271810-1024x683.jpg"
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="find-doctors-section">
                <div className="find-doctors-overlay">
                    <div className="find-doctors-content">
                        <h1>FIND DOCTORS</h1>
                        <p className="find-doctors-subtitle">
                            Find out Doctors from various specializations and departments on a go. Checkout their ratings and work, refer for better and healthy treatment
                        </p>
                        <Link to='/doctors'>
                            <button className="find-doctors-button">Find</button>
                        </Link>
                    </div>
                </div>
            </div> */}
            <BlogsNews />
            <ChatbotWidget />
        </>
    );
};


export default HomePage;