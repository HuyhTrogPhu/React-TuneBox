import React from 'react'
import './Carousel.css'
import { images } from '../../assets/images/images'

const Carousel = () => {
    return (
        // Start slide
        <div
            className="carousel slide"
            id="carouselExampleCaptions"
        >
            <div className="carousel-indicators">
                <button
                    aria-current="true"
                    aria-label="Slide 1"
                    className="active"
                    data-bs-slide-to="0"
                    data-bs-target="#carouselExampleCaptions"
                    type="button"
                />
                <button
                    aria-label="Slide 2"
                    data-bs-slide-to="1"
                    data-bs-target="#carouselExampleCaptions"
                    type="button"
                />
                <button
                    aria-label="Slide 3"
                    data-bs-slide-to="2"
                    data-bs-target="#carouselExampleCaptions"
                    type="button"
                />
                <button
                    aria-label="Slide 4"
                    data-bs-slide-to="3"
                    data-bs-target="#carouselExampleCaptions"
                    type="button"
                />
                <button
                    aria-label="Slide 5"
                    data-bs-slide-to="4"
                    data-bs-target="#carouselExampleCaptions"
                    type="button"
                />
            </div>
            <div className="carousel-inner">
                <div className="carousel-item active">
                    <img
                        alt="..."
                        className="d-block w-100"
                        src={images.slide1}
                    />
                </div>
                <div className="carousel-item">
                    <img
                        alt="..."
                        className="d-block w-100"
                        src={images.slide2}
                    />
                </div>
                <div className="carousel-item">
                    <img
                        alt="..."
                        className="d-block w-100"
                        src={images.slide3}
                    />
                </div>
                <div className="carousel-item">
                    <img
                        alt="..."
                        className="d-block w-100"
                        src={images.slide4}
                    />
                </div>
                <div className="carousel-item">
                    <img
                        alt="..."
                        className="d-block w-100"
                        src={images.slide5}
                    />
                </div>
            </div>
            <button
                className="carousel-control-prev"
                data-bs-slide="prev"
                data-bs-target="#carouselExampleCaptions"
                type="button"
            >
                <span
                    aria-hidden="true"
                    className="carousel-control-prev-icon"
                />
                <span className="visually-hidden">
                    Previous
                </span>
            </button>
            <button
                className="carousel-control-next"
                data-bs-slide="next"
                data-bs-target="#carouselExampleCaptions"
                type="button"
            >
                <span
                    aria-hidden="true"
                    className="carousel-control-next-icon"
                />
                <span className="visually-hidden">
                    Next
                </span>
            </button>

        </div>
        // End slide


    )
}

export default Carousel
