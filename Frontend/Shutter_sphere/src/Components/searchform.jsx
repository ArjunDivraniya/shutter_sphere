import { useState,useEffect,useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { usePhotographers } from "./photographercontext";
import "./searchform.css";
import {FaStar} from "react-icons/fa";


const testimonials = [
  {
    name: "John Smith",
    role: "Wedding Client",
    feedback: "Amazing experience! Our wedding photos turned out better than we could have ever imagined.",
    rating: 5,
  },
  {
    name: "Lisa Wong",
    role: "Business Owner",
    feedback: "The product photography service was exceptional. Highly professional and creative.",
    rating: 4,
  },
  {
    name: "David Miller",
    role: "Travel Blogger",
    feedback: "Found an incredible photographer for my travel shoots. The process was smooth and efficient.",
    rating: 5,
  },
  {
    name: "Sophia Brown",
    role: "Fashion Model",
    feedback: "The portraits captured my best angles and were absolutely stunning. Highly recommended!",
    rating: 5,
  },
  {
    name: "Michael Johnson",
    role: "Food Critic",
    feedback: "The food photography was mouth-watering and beautifully shot. Great work!",
    rating: 4,
  },
  {
    name: "Sophia Brown",
    role: "Fashion Model",
    feedback: "The portraits captured my best angles and were absolutely stunning. Highly recommended!",
    rating: 5,
  },
  {
    name: "Michael Johnson",
    role: "Food Critic",
    feedback: "The food photography was mouth-watering and beautifully shot. Great work!",
    rating: 4,
  },
];

const photographers = [
  {
    id: 1,
    name: "Sarah Johnson",
    specialty: "Wedding Photography",
    image:
      "https://storage.googleapis.com/a1aa/image/SsNRfuiDIiJdwVdUGUPPTOBfKb9rAyXmoZ-A-hVxsok.jpg",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    specialty: "Portrait Photography",
    image:
      "https://storage.googleapis.com/a1aa/image/AquBlAjhYQ_OeqyuWRRQ-lfVx9MrsSo8uvUk5MQ-aEU.jpg",
    rating: 4.5,
  },
  {
    id: 3,
    name: "Emma Davis",
    specialty: "Fashion Photography",
    image:
      "https://storage.googleapis.com/a1aa/image/8IDeucQqu-W_mwfk10YyvkePBRmIwLTylFsTWzNoVWQ.jpg",
    rating: 4.8,
  },
];

const SearchForm = () => {
  const [search, setSearch] = useState({ location: "", specialization: "" });
  const categories = [
    { name: "Wedding", image: "https://storage.googleapis.com/a1aa/image/J03TfbI5gI5GX894uV6hVWQYOdwgNzTklZEasR6eUn8.jpg" },
    { name: "Portrait", image: "https://storage.googleapis.com/a1aa/image/YLssOgkW2a68SAQqVnwyLwcXwXKq0UbPiQ0DIHPr03c.jpg" },
    { name: "Travel", image: "https://storage.googleapis.com/a1aa/image/O7edUiZ8OwLRqfdbs-L8SVKfVEL4qAT8d0-DSyk7RTo.jpg" },
    { name: "Product", image: "https://storage.googleapis.com/a1aa/image/CO6BkcIH4g5kx1EeRjhQjceD3oy88ECWj5aXqzcD4E8.jpg" },
    { name: "Food", image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=2020&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "Fashion", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "Sports", image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "Nature", image: "https://unsplash.com/photos/a-waterfall-in-the-middle-of-a-lush-green-forest-J6Fdqeb0Vcs" },
    { name: "Architecture", image: "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?q=80&w=2020&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "Event", image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  ];
 

  
  const navigate = useNavigate();
  const { setPhotographers } = usePhotographers();
  const handleChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`https://shutter-sphere.onrender.com/api/search`, {
        params: search,
      });
      
     

      if (response.status === 200 || response.status === 201) {
        setPhotographers(response.data);
        console.log(response.data)
        navigate("/pgresult");
      }
      
    } catch (error) {
      console.error("Error searching photographers", error);
    }
  };
  const goToProfile = () => {
    navigate("/profile"); // Change "/profile" to your actual profile page route
  };
  
  const scrollRef = useRef(null);
  const navigatere = useNavigate();
  const [visibleTestimonials, setVisibleTestimonials] = useState([]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollAmount = 1;
    let requestId;

    const scroll = () => {
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft = 0; // Reset scroll position for seamless effect
      }
      scrollContainer.scrollLeft += scrollAmount;
      requestId = requestAnimationFrame(scroll);
    };

    requestId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(requestId);
  }, []);


  useEffect(() => {
    // Show only 6 reviews
    setVisibleTestimonials(testimonials.slice(0, 6));
  }, [testimonials]);

  return (
    <>
    
    <div
      className="background-container"
      style={{
        backgroundImage:
          'url("https://res.cloudinary.com/dncosrakg/image/upload/v1738661125/oj8rlnltxkx4hnhzbquz.png")',
      }}
    >
        
      <div className="overlay">
      <div className="profile-icon" onClick={goToProfile}>Profile</div>
        <h2 className="title">ATELIER OF PHOTOGRAPHY</h2>
        <h1 className="main-title">Where Moments Become Masterpieces</h1>
        <p className="description">
          Experience Photography At Its Finest With Our Handpicked Selection Of Master Photographers
        </p>
        <form onSubmit={handleSearch} className="search-form">
          <div className="input-container">
            <div className="input-group">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                name="specialization"
                placeholder="Enter Specialization"
                value={search.specialization}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div className="input-group">
              <i className="fas fa-map-marker-alt location-icon"></i>
              <input
                type="text"
                name="location"
                placeholder="Enter Location"
                value={search.location}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <button type="submit" className="submit-button">
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
    <div className="vision-container">
      <div className="vision-content">
        <h1 className="vision-title">Our Vision</h1>
        <p className="vision-text">
        At Shutter Sphere, our vision is to create a seamless platform that connects passionate
         photographers with clients seeking exceptional photography services. We aim to bridge the gap
          between creativity and opportunity, making it effortless for individuals and businesses to find
           the perfect photographer for their special moments.
        </p>
        <p className="vision-text">Our goal is to build a trusted community where photographers can showcase 
          their talent, grow their careers, and gain recognition, while clients can discover professionals 
          who align with their style and needs. By integrating cutting-edge technology, user-friendly search tools,
           and a seamless booking experience, we strive to revolutionize the way photography services are accessed and delivered.</p>
        <div className="vision-link-container">
          <div className="vision-divider"></div>
          <a href="#" className="vision-link">Get in touch</a>
        </div>
      </div>
    </div>
    <div className="how-it-works-container">
      <h2 className="how-it-works-title">How It Works</h2>
      <div className="how-it-works-steps">
        <div className="step">
          <div className="step-icon">
           
          </div>
          <h3 className="step-title">Search</h3>
          <p className="step-text">Find the perfect photographer based on your needs and location</p>
        </div>

        <div className="step">
          <div className="step-icon">
           
          </div>
          <h3 className="step-title">Book</h3>
          <p className="step-text">Schedule a session at your preferred date and time</p>
        </div>

        <div className="step">
          <div className="step-icon">
            
          </div>
          <h3 className="step-title">Capture</h3>
          <p className="step-text">Get amazing photos from your professional photographer</p>
        </div>
      </div>
    </div>
   
    <div>
      {/* Categories Section */}
      <div className="top-categories-container">
        <h1 className="top-categories-title">Top Categories</h1>
        <div className="categories-scroll-container" ref={scrollRef}>
          <div className="categories-wrapper">
            {[...categories, ...categories].map((category, index) => (
              <div className="category-card" key={index}>
                <img src={category.image} alt={category.name} className="category-image" />
                <div className="category-overlay">{category.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="featured-container">
      <h1 className="featured-title">Featured Photographers</h1>
      <div className="photographers-grid">
        {photographers.map((photographer) => (
          <div key={photographer.id} className="photographer-card">
            <img src={photographer.image} alt={photographer.name} className="photographer-image" />
            <div className="card-content">
              <h2 className="photographer-name">{photographer.name}</h2>
              <p className="photographer-specialty">{photographer.specialty}</p>
              <div className="photographer-rating">
                {[...Array(Math.floor(photographer.rating))].map((_, i) => (
               
               <FaStar size={30} color="gold" />
                ))}
                {photographer.rating % 1 !== 0 && <FaStar className="star-icon half-star" />}
              </div>
              <a href="#" className="view-profile">View Profile</a>
            </div>
          </div>
        ))}
      </div>
    </div>

      {/* Testimonials Section */}
      <div className="testimonials-container">
        <h1 className="reviewtitle">What Our Clients Say</h1>
        <div className="testimonials-slider">
          {visibleTestimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="stars">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <span key={i} className="star">⭐</span>
                ))}
              </div>
              <p className="feedback">"{testimonial.feedback}"</p>
              <p className="name">{testimonial.name}</p>
              <p className="role">{testimonial.role}</p>
            </div>
          ))}
        </div>
        <button className="view-more-btn" onClick={() => navigatere("/reviews")}>View More</button>
      </div>
    </div>
 
    </>
  );
};

export default SearchForm;
