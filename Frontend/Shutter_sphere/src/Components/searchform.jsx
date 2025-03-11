import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { usePhotographers } from "./photographercontext";
import { useTranslation } from "react-i18next";
import { FaStar } from "react-icons/fa";
import Navbar from "./navbar2";

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
  const [testimonials, setTestimonials] = useState([]);

  const { t, i18n } = useTranslation();

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
      const response = await axios.get(`http://localhost:5000/api/photographers/search`, {
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

  const scrollRef = useRef(null);
  const navigatere = useNavigate();
  const [visibleTestimonials, setVisibleTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/reviews");
        setTestimonials(response.data.slice(0, 6)); // Limit to 6 testimonials
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };
    fetchTestimonials();
  }, []);

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
      <Navbar />
      <div
        className="relative bg-cover bg-center bg-no-repeat h-[800px] flex flex-col justify-center items-center text-white"
        style={{
          backgroundImage:
            'url("https://res.cloudinary.com/dncosrakg/image/upload/v1738661125/oj8rlnltxkx4hnhzbquz.png")',
        }}
      >

        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center z-10 p-5 text-center">

          <h2 className="font-semibold text-[#fcd34d] uppercase tracking-wide text-xl">{t("atelier_of_photography")}</h2>
          <h1 className="font-[Libre_Baskerville] text-6xl my-6">{t("where_moments_become_masterpieces")}</h1>
          <p className="text-lg mb-8">{t("experience_photography")}</p>

          <form onSubmit={handleSearch} className="flex gap-2 justify-center items-center">
            <div className="flex gap-2">
              <div className="bg-[#fcd34d] rounded-full flex p-2 items-center">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  name="specialization"
                  placeholder={t("enterSpecialization")}
                  value={search.specialization}
                  onChange={handleChange}
                  className="bg-transparent border-none text-black pl-2 outline-none w-[200px] text-lg"
                />
              </div>
              <div className="bg-[#fcd34d] rounded-full flex p-2 items-center">
                <i className="fas fa-map-marker-alt location-icon"></i>
                <input
                  type="text"
                  name="location"
                  placeholder={t("enterLocation")}
                  value={search.location}
                  onChange={handleChange}
                  className="bg-transparent border-none text-black pl-2 outline-none w-[200px] text-lg"
                />
              </div>
              <button type="submit" className="bg-[#fcd34d] text-black font-semibold py-3 px-6 rounded-full text-lg transition duration-300 hover:bg-[#fbbf24]">
                {t("search")}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="bg-gray-900 text-white flex items-center justify-center text-center py-4 h-[500px]">
        <div className="max-w-2xl p-4">
          <h1 className="text-3xl font-bold mb-5">{t("our_vision")}</h1>
          <p className="text-lg mb-10">
            {t("vision_description")}
          </p>
          <p className="text-lg mb-10">
            {t("goal_description")}
          </p>
          <div className="flex items-center justify-center">
            <div className="border-r border-gray-600 h-6 mr-2"></div>
            <a href="#" className="text-sm uppercase tracking-wide text-white transition duration-300 hover:text-blue-300">{t("get_in_touch")}</a>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 text-center h-[450px] py-12 px-4">
        <h2 className="text-2xl font-bold mb-8">{t("how_it_works")}</h2>
        <div className="flex flex-col md:flex-row justify-center gap-8">
          <div className="flex flex-col items-center h-[300px] w-[400px]">
            <div className="bg-gray-300 rounded-full p-4 mb-4 h-[60px] w-[60px]">
              <span className="text-3xl text-blue-500">📷</span>
            </div>
            <h3 className="text-lg font-semibold text-black mb-2">{t("search")}</h3>
            <p className="text-gray-600 text-lg max-w-[360px]">{t("search_photographer")}</p>
          </div>
          <div className="flex flex-col items-center h-[300px] w-[400px]">
            <div className="bg-gray-300 rounded-full p-4 mb-4 h-[60px] w-[60px]">
              <span className="text-3xl text-blue-500">📷</span>
            </div>
            <h3 className="text-lg font-semibold text-black mb-2">{t("book")}</h3>
            <p className="text-gray-600 text-lg max-w-[360px]">{t("book_session")}</p>
          </div>
          <div className="flex flex-col items-center h-[300px] w-[400px]">
            <div className="bg-gray-300 rounded-full p-4 mb-4 h-[60px] w-[60px]">
              <span className="text-3xl text-blue-500">📷</span>
            </div>
            <h3 className="text-lg font-semibold text-black mb-2">{t("capture")}</h3>
            <p className="text-gray-600 text-lg max-w-[360px]">{t("capture_moments")}</p>
          </div>

        </div>
      </div>

      <div>
        {/* Categories Section */}
        <div className="text-center mb-10 overflow-hidden">
          <h1 className="text-4xl font-bold my-10">{t("top_categories")}</h1>
          <div className="flex overflow-hidden whitespace-nowrap" ref={scrollRef}>
            <div className="flex whitespace-nowrap w-max">
              {[...categories, ...categories].map((category, index) => (
                <div className="w-[350px] h-[500px] relative rounded-lg shadow-md flex-shrink-0 mx-2" key={index}>
                  <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 bg-black bg-opacity-60 text-white w-full text-center py-1 text-lg">{category.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-100 min-h-screen py-12 px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">{t("featured_photographers")}</h1>
          <div className="flex flex-wrap justify-center gap-5">
            {photographers.map((photographer) => (
              <div key={photographer.id} className="bg-white rounded-lg shadow-md overflow-hidden w-[390px] h-[632px] transition-transform duration-300 hover:scale-105">
                <img src={photographer.image} alt={photographer.name} className="w-full h-[420px] object-cover" />
                <div className="p-5">
                  <h2 className="text-2xl font-bold text-gray-900">{photographer.name}</h2>
                  <p className="text-gray-600 mt-1">{photographer.specialty}</p>
                  <div className="flex justify-center mt-2">
                    {[...Array(Math.floor(photographer.rating))].map((_, i) => (

                      <FaStar size={30} color="gold" />
                    ))}
                    {photographer.rating % 1 !== 0 && <FaStar className="text-yellow-400 text-lg" />}
                  </div>
                  <a href="#" className="mt-3 inline-block text-lg font-semibold text-blue-800 hover:text-blue-600">{t("viewProfile")}</a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="text-center py-10">
          <h1 className="text-4xl font-bold mb-10">{t("review.title")}</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {visibleTestimonials.map((testimonial, index) => (
              <div key={index} className="w-[350px] h-[200px] bg-white p-4 rounded-lg shadow-md">
                <div className="stars">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <span key={i} className="text-yellow-400 text-2xl">⭐</span>
                  ))}
                </div>
                <p className="italic text-gray-900 text-lg">
                "{t("reviewDynamic.text", { review: testimonial.review })}"
                  </p>
                <p className="font-bold text-xl mt-2">
                {t("reviewDynamic.name", { name: testimonial.name })}
                  </p>
                <p className="text-gray-500 text-sm">
                {t("reviewDynamic.role", { role: testimonial.role })}
                  </p>
              </div>
            ))}
          </div>
          <button className="mt-5 px-5 py-2 bg-orange-500 text-white rounded-md cursor-pointer hover:bg-orange-600" onClick={() => navigatere("/reviews")}>{t("view_more")}</button>
        </div>
      </div>
    </>
  );
};

export default SearchForm;