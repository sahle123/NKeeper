'use strict';

import { Gateway, buildPostRequest } from './shared.js';


(function() {

  const GATEWAY = Gateway;
  const _searchId = "search-field"; // Needs to match the one in the HTML file.
  const _searchResults = "search-results"; // Needs to match the one in the HTML file.

  //
  // ACTIONS
  //
  // Posts search value to backend.
  const postSearch = async (searchValue) => {
    resetSearchResults();
    
    const request = buildPostRequest({contact: searchValue});
    const response = await fetch(`${GATEWAY}/search`, request);

    const contacts = await response.json();

    if (contacts.length <= 0) {
      console.log("No contacts found");
    }
    else {
      console.log("We found: " + contacts.length + " contacts");
      contacts.forEach(buildSearchResult);
    }
  }

  // Builds the search result into HTML format.
  const buildSearchResult = (contactDetails) => {
    const searchResultSection = document.getElementById(_searchResults);

    const contact = document.createElement("div");
    contact.classList.add("some-class");
    contact.innerHTML = `<p>${contactDetails.firstName}</p>`

    searchResultSection.appendChild(contact);
  }

  // Resets the search results section
  const resetSearchResults = () => {
    const searchResultSection = document.getElementById(_searchResults);
    searchResultSection.innerHTML = null;
  }


  function init() {
   const searchField = document.getElementById(_searchId);
   
   searchField.addEventListener('input', () => {
    postSearch(searchField.value);
   });
  }
  init();

  //
  // DOM exposed actions
  //
  window._searchFns = { }
})();