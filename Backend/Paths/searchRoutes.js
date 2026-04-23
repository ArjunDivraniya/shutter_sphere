const express = require("express");
const router = express.Router();
const { 
    advancedSearch, 
    getMapMarkers, 
    getSearchCategories, 
    getSearchSuggestions 
} = require("../Handlers/photographerController");

// Main search
router.get("/photographers", advancedSearch);

// Map markers
router.get("/photographers/map", getMapMarkers);

// Categories list
router.get("/categories", getSearchCategories);

// Autocomplete suggestions
router.get("/suggestions", getSearchSuggestions);

module.exports = router;
