/*
* Scripts related to the page's dropdown menus.
*/

'use strict';

import { Gateway, buildPostRequest } from './shared.js';

const GATEWAY = Gateway;

// Current state of all open menus.
let _openMenus = [];

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// Toggles edit/delete dropdown menu for a given activity.
const toggleDropdownMenu = (menuId) => {

  if (_openMenus.includes(menuId))
    _openMenus = _openMenus.filter(x => x !== menuId); // Remove menuId from array.
  else
    _openMenus.push(menuId);

  document.getElementById(menuId).classList.toggle("show");
}

// Closes a dropdown menu and removes from _openMenu.
const closeDropdownMenu = (menuId) => {
  // Remove menuId from array.
  _openMenus = _openMenus.filter(x => x !== menuId);
  document.getElementById(menuId).classList.remove('show');
} 

// Closes dropdown menu if user clicks outside of the menu
window.onclick = function (event) {
  const dropdowns = document.getElementsByClassName("dropdown-menu");

  if (!event.target.matches('.btn--dropdown')) {

    // Closes all open menus.
    for (let i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
  else if (event.target.matches('.btn--dropdown')) {
    const keepDropdownId = event.target.nextElementSibling.attributes.id.value;

    for (let i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i];
      if(openDropdown.id !== keepDropdownId) {
        closeDropdownMenu(openDropdown.id);
      }
    }
  }

}

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// Sends request to server to delete the selected activity. 
const deleteActivity = async (activityId) => {

  const rawBody = {
    activityId: activityId
  };

  const request = buildPostRequest(rawBody);

  const response = await fetch(`${GATEWAY}/main/profile/delete-activity`, request);

  // DEV-NOTE: Toast message based on response.

  // Remove element from browser.
  document.getElementById(activityId).remove();
}

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// Moving all necessary event listeners to global scope.
window._menus = { toggleDropdownMenu, closeDropdownMenu, deleteActivity }