/*
* Does very basic state management stuff of the page. Perhaps it would've been 
* better to use a framework, but I like learning the hardway for the sake of
* learning.
*/
'use strict';

(function () {
  // Determines whether or not the state of the page is in EDIT MODE or VIEW MODE.
  let EDIT_MODE = false;

  const GATEWAY = 'http://localhost:3000';

  // Initialize listener for the EDIT_MODE state.
  const addEventListeners = () => {

    // All IDs on the profile page.
    const idList = {
      editBtn: 'edit-page-button',
      summary: 'summary-section',
      emailContent: 'email-content',
      phoneContent: 'phone-content',
      whatsappContent: 'whatsapp-content'
    };

    const editBtn = document.getElementById(idList.editBtn);
    editBtn.onclick = () => { toggleEditModeState(idList); }
  }

  // Toggles the state of the page to and from EDIT_MODE.
  const toggleEditModeState = (idList) => {
    EDIT_MODE = !EDIT_MODE;
    const editBtn = document.getElementById(idList.editBtn);
    const summary = document.getElementById(idList.summary);
    const email = document.getElementById(idList.emailContent);
    const phone = document.getElementById(idList.phoneContent);
    const whatsapp = document.getElementById(idList.whatsappContent);

    // Editing
    if (EDIT_MODE) {

      // Edit button
      editBtn.innerHTML = "Save Changes";
      editBtn.classList.remove("btn")
      editBtn.classList.add("btn--caution");

      // Summary section
      const summaryContent = summary.innerHTML;
      summary.innerHTML = null;
      const textareaSummary = document.createElement("textarea");
      textareaSummary.setAttribute('id', 'summary-textarea');
      textareaSummary.setAttribute('name', 'summary');
      summary.appendChild(textareaSummary);
      textareaSummary.value = summaryContent;

      // Contact information
      const emailContent = email.innerHTML;
      const phoneContent = phone.innerHTML;
      const whatsappContent = whatsapp.innerHTML;

      const inputEmail = document.createElement('input');
      email.innerHTML = null;
      inputEmail.setAttribute('id', 'email-input');
      inputEmail.setAttribute('name', 'email');
      inputEmail.setAttribute('type', 'text');
      inputEmail.value = emailContent;
      email.appendChild(inputEmail);

      const inputPhone = document.createElement('input');
      phone.innerHTML = null;
      inputPhone.setAttribute('id', 'phone-input');
      inputPhone.setAttribute('name', 'phone');
      inputPhone.setAttribute('type', 'text');
      inputPhone.value = phoneContent;
      phone.appendChild(inputPhone);

      const inputWhatsapp = document.createElement('input');
      whatsapp.innerHTML = null;
      inputWhatsapp.setAttribute('id', 'whatsapp-input');
      inputWhatsapp.setAttribute('name', 'whatsapp');
      inputWhatsapp.setAttribute('type', 'text');
      inputWhatsapp.value = whatsappContent;
      whatsapp.appendChild(inputWhatsapp);

      //
      // ...add more as needed
    }
    // Reading
    else {

      // Edit button
      editBtn.innerHTML = "Edit Profile";
      editBtn.classList.remove("btn--caution")
      editBtn.classList.add("btn");

      // Summary section
      const textareaSummary = document.getElementById('summary-textarea');
      summary.innerHTML = textareaSummary.value;

      // Contact information
      const inputEmail = document.getElementById('email-input');
      email.innerHTML = inputEmail.value;
      const inputPhone = document.getElementById('phone-input');
      phone.innerHTML = inputPhone.value;
      const inputWhatsapp = document.getElementById('whatsapp-input');
      whatsapp.innerHTML = inputWhatsapp.value;


      //
      // ...add more as needed

      postChanges(idList);
    }
  }

  // Posts all changes to MongoDB.
  const postChanges = async (idList) => {
    const summary = document.getElementById(idList.summary);
    const email = document.getElementById(idList.emailContent);
    const phone = document.getElementById(idList.phoneContent);
    const whatsapp = document.getElementById(idList.whatsappContent);

    const rawBody = {
      summary: summary.innerHTML,
      email: email.innerHTML,
      phone: phone.innerHTML,
      whatsapp: whatsapp.innerHTML
    };

    const request = {
      method: 'POST',
      cache: 'no-cache',
      body: JSON.stringify(rawBody),
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    const response = await fetch(`${GATEWAY}/main/profile`, request);

    console.log("response: " + response);
  }

  //
  // Main initialization
  function init() {
    addEventListeners();
  }

  init();
})();

