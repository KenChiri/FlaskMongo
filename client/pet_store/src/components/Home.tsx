import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {  FaShoppingCart, FaUser, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../css/home.css';

// Sample data for the carousel
const carouselData = [
    {
        image: "../assets/pexels-goochie-poochie-3361739.jpg",
        title: "Welcome to PetStore",
        subtitle: "Find your perfect companion"
    },
    {
        image: "../assets/pexels-valeriya-1805164.jpg",
        title: "Special Offers",
        subtitle: "Up to 30% off on pet supplies"
    },
    {
        image: "../assets/pexels-tranmautritam-245035.jpg",
        title: "Expert Pet Care",
        subtitle: "Professional grooming services available"
    }
];

// Sample data for pet gallery
const petGalleryData = [
    {
        image: "/api/placeholder/300/300",
        name: "Golden Retriever Puppy",
        price: "$1,200",
        category: "Dogs"
    },
    {
        image: "/api/placeholder/300/300",
        name: "Persian Cat",
        price: "$800",
        category: "Cats"
    },
    {
        image: "/api/placeholder/300/300",
        name: "African Grey Parrot",
        price: "$1,500",
        category: "Birds"
    },
    {
        image: "/api/placeholder/300/300",
        name: "Ball Python",
        price: "$300",
        category: "Reptiles"
    },
    {
        image: "/api/placeholder/300/300",
        name: "Maine Coon Cat",
        price: "$1,000",
        category: "Cats"
    },
    {
        image: "/api/placeholder/300/300",
        name: "French Bulldog",
        price: "$2,500",
        category: "Dogs"
    }
];

const Home: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { username } = location.state || { username: 'Guest' };
    const [currentSlide, setCurrentSlide] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState('All');

    const handleLogout = () => {
        navigate('/login');
    };

    // Auto-advance carousel
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselData.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % carouselData.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + carouselData.length) % carouselData.length);
    };

    return (
        <div className="home-container">
            {/* Navigation Bar */}
            <nav className="navbar">
                <div className="nav-content">
                    <div className="brand">
                        <h2>PetStore</h2>
                    </div>
                    <Link to="/contact" className="contacts-link">
                        Contacts
                    </Link>
                            
                    
                    <div className="search-container">
    <input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
    />
    <button onClick={handleSearch} className="search-button">Search</button>
</div>


                    <div className="nav-actions">
                        <button className="cart-button">
                            <FaShoppingCart />
                            <span className="cart-count">0</span>
                        </button>
                        <div className="user-menu">
                            <FaUser />
                            <span className="username">{username}</span>
                        </div>
                        <button onClick={handleLogout} className="logout-button">
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Carousel */}
            <div className="carousel-container">
                <div 
                    className="carousel-slides"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {carouselData.map((slide, index) => (
                        <div key={index} className="carousel-slide">
                            <img src={slide.image} alt={slide.title} />
                            <div className="slide-content">
                                <h1>{slide.title}</h1>
                                <p>{slide.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="carousel-control prev" onClick={prevSlide}>
                    <FaChevronLeft />
                </button>
                <button className="carousel-control next" onClick={nextSlide}>
                    <FaChevronRight />
                </button>
                <div className="carousel-indicators">
                    {carouselData.map((_, index) => (
                        <button
                            key={index}
                            className={`indicator ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => setCurrentSlide(index)}
                        />
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <main className="main-content">
                <section className="category-section">
                    <h2>Browse by Category</h2>
                    <div className="category-filters">
                        {['All', 'Dogs', 'Cats', 'Birds', 'Reptiles'].map(category => (
                            <button
                                key={category}
                                className={`category-filter ${selectedCategory === category ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </section>

                <section className="pet-gallery">
                    {petGalleryData
                        .filter(pet => selectedCategory === 'All' || pet.category === selectedCategory)
                        .map((pet, index) => (
                            <div key={index} className="pet-card">
                                <div className="pet-image">
                                    <img src={pet.image} alt={pet.name} />
                                </div>
                                <div className="pet-info">
                                    <h3>{pet.name}</h3>
                                    <p className="pet-category">{pet.category}</p>
                                    <p className="pet-price">{pet.price}</p>
                                    <button className="view-details-button">View Details</button>
                                </div>
                            </div>
                        ))}
                </section>
            </main>
        </div>
    );
};

export default Home;