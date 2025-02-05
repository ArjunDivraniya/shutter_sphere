import { useState ,useEffect} from "react";
import SearchForm from "../Components/searchform";

const SearchResults = () => {
    const [photographers, setPhotographers] = useState([]);
    useEffect(() => {
        const photographers= localStorage.getItem("photographers");
        if (photographers) {
          setPhotographers(JSON.parse(photographers)); // Retrieve stored data
        }
      }, []);
    return (
        <div className="p-6">
            
          
            <div className="mt-6">
                {photographers.length > 0 ? (
                    photographers.map((photographer) => (
                        <div key={photographer._id} className="border p-4 mb-2 rounded shadow">
                            <h3 className="text-xl font-bold">{photographer.name}</h3>
                            <p><strong>Location:</strong> {photographer.city}</p>
                            <p><strong>Specialization:</strong> {photographer.specialization}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No photographers found.</p>
                )}
            </div>
        </div>
    );
};

export default SearchResults;
