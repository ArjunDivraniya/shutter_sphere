import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const portfolioData = {
  categories: ["Wedding", "Portrait", "Events", "Nature"],
  items: [
    {
      id: 1,
      title: "Sunset Wedding",
      category: "Wedding",
      image: "https://images.unsplash.com/photo-1682933766299-81bf6fc4f2cb?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      size: "large",
    },
    {
      id: 2,
      title: "Urban Portrait",
      category: "Portrait",
      image: "https://images.unsplash.com/photo-1477587879355-bbb4d635852e?q=80&w=1960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      size: "medium",
    },
    {
      id: 3,
      title: "Concert Night",
      category: "Events",
      image: "https://images.unsplash.com/photo-1519955266818-0231b63402bc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGNvY2VydCUyMG5pZ2h0JTIwJTIwaW5kaWF8ZW58MHx8MHx8fDA%3D",
      size: "small",
    },
  ],
};

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredItems =
    activeCategory === "All"
      ? portfolioData.items
      : portfolioData.items.filter((item) => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] w-full">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1654156984213-1ec017810bf7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Photographer with camera"
            className="object-cover w-full h-full brightness-75"
          />
        </div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
          <motion.h1
            className="text-4xl md:text-6xl font-bold tracking-wider"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-amber-400">Mein</span>Fest{" "}
            <span className="text-amber-400">Films</span>
          </motion.h1>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-16 px-4 md:px-16 lg:px-24 bg-white">
        <h2 className="text-3xl font-light tracking-wide text-amber-400 mb-8 text-center">
          PORTFOLIO
        </h2>
        <div className="flex justify-center mb-12">
          <div className="flex space-x-6 md:space-x-10 overflow-x-auto pb-2">
            {["All", ...portfolioData.categories].map((category) => (
              <button
                key={category}
                className={`text-sm md:text-base whitespace-nowrap ${
                  activeCategory === category
                    ? "text-amber-400 font-medium border-b-2 border-amber-400"
                    : "text-gray-500 hover:text-gray-800"
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="wait">
            {filteredItems.map((item) => {
              const spanClasses =
                item.size === "large"
                  ? "col-span-2 row-span-2"
                  : item.size === "medium"
                  ? "col-span-2"
                  : "";

              return (
                <motion.div
                  key={item.id}
                  className={`relative overflow-hidden group ${spanClasses}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <div className="relative aspect-square w-full">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                      <h3 className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
