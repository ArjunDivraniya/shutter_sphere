import { usePhotographers } from "./photographercontext";

const SearchResults = () => {
  const { photographers } = usePhotographers();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {photographers?.length > 0 ? (
        photographers.map((photographer) => (
          <div
            key={photographer._id}
            className="bg-white rounded-lg shadow-lg p-6 w-80 text-center flex flex-col items-center relative"
          >
            <div className="absolute top-2 right-2">
              <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                Active
              </span>
            </div>
            <div className="flex flex-col items-center">
              <img
                src="https://res.cloudinary.com/dncosrakg/image/upload/v1738656424/WhatsApp_Image_2025-01-31_at_13.51.48_ddpmxi.jpg"
                alt={`Profile picture of ${photographer.name}`}
                className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
              />
            </div>
            <div className="mt-4 text-center">
              <div className="text-lg font-bold text-gray-800">
                {photographer.name}
              </div>
              <p className="text-sm text-gray-600">- {photographer.email}</p>

              <div className="flex items-center justify-center text-yellow-500 mt-2">
                <i className="fas fa-star mr-1"></i>
                <span>{photographer.rating}</span>
              </div>
              <div className="flex items-center justify-center text-gray-600 mt-2">
                <i className="fas fa-map-marker-alt mr-1"></i>
                <span>{photographer.city}</span>
              </div>
            </div>
            <div className="text-center mt-4">
              <p className="text-sm font-medium text-gray-700 flex items-center justify-center">
                <i className="fas fa-camera mr-2"></i> Specializations:
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {photographer.specializations?.map((spec, index) => (
                  <div
                    key={index}
                    className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full"
                  >
                    {spec}
                  </div>
                ))}
              </div>
            </div>
            <div className="font-bold text-gray-800 mt-4 flex items-center">
              <i className="fas fa-clock mr-2"></i>
              <span>${photographer.pricePerHour} /Hour</span>
            </div>
            <div className="flex gap-4 mt-6">
              <button className="bg-yellow-400 text-black px-4 py-2 text-sm font-bold rounded-md hover:bg-yellow-500 transition">
                View Profile
              </button>
              <button className="bg-orange-500 text-white px-4 py-2 text-sm font-bold rounded-md hover:bg-orange-600 transition">
                Book Now
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No photographers found</p>
      )}
    </div>
  );
};

export default SearchResults;
