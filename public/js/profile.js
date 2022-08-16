/*
* Does very basic state management stuff of the page. Perhaps it would've been 
* better to use a framework, but I like learning the hardway for the sake of
* learning.
*/
'use strict';

import { Gateway, buildPostRequest } from './shared.js';

(function () {
  // State of various elements within the page.
  const STATE = {
    editPage: false,
    addActivity: false
  };

  const GATEWAY = Gateway;

  // Initialize listener and IDs for the page.
  const addEventListeners = () => {

    // All IDs on the profile page.
    const idList = {
      userId: 'userId',
      firstName: 'first-name',
      middleName: 'middle-name',
      lastName: 'last-name',
      summary: 'summary-section',
      emailContent: 'email-content',
      phoneContent: 'phone-content',
      whatsappContent: 'whatsapp-content',
      newActivitySection: 'new-activity-section',
      newActivityDesc: 'new-activity-desc',
      newActivityDate: 'new-activity-date'
    };

    // All buttons on the page.
    const btnList = {
      editBtn: 'edit-page-button',
      toggleActivityBtn: 'btn-toggle-activity',
      submitActivityBtn: 'btn-submit-activity',
      cancelActivityBtn: 'btn-cancel-activity'
    };

    const editBtn = document.getElementById(btnList.editBtn);
    editBtn.onclick = () => { toggleEditModeState(idList, btnList); }

    const toggleActivityBtn = document.getElementById(btnList.toggleActivityBtn);
    toggleActivityBtn.onclick = () => { toggleAddActivity(idList, btnList); }
  }

  // Toggles the state of the page to and from EDIT_MODE.
  const toggleEditModeState = (idList, btnList) => {
    STATE.editPage = !STATE.editPage;
    const editBtn = document.getElementById(btnList.editBtn);
    const summary = document.getElementById(idList.summary);
    const email = document.getElementById(idList.emailContent);
    const phone = document.getElementById(idList.phoneContent);
    const whatsapp = document.getElementById(idList.whatsappContent);
    const firstName = document.getElementById(idList.firstName);
    const middleName = document.getElementById(idList.middleName);
    const lastName = document.getElementById(idList.lastName);

    // Editing
    if (STATE.editPage) {

      //
      // Edit button
      editBtn.innerHTML = "Save Changes";
      editBtn.classList.remove("btn")
      editBtn.classList.add("btn--caution");

      //
      // Header section
      const firstNameContent = firstName.innerHTML;
      const middleNameContent = middleName.innerHTML;
      const lastNameContent = lastName.innerHTML;

      firstName.innerHTML = null;
      const inputFirstName = document.createElement('input');
      inputFirstName.setAttribute('id', 'first-name-input');
      inputFirstName.setAttribute('name', 'first-name');
      inputFirstName.setAttribute('type', 'text');
      inputFirstName.setAttribute('placeholder', 'First name');
      inputFirstName.value = firstNameContent;
      firstName.appendChild(inputFirstName);

      middleName.innerHTML = null;
      const inputMiddleName = document.createElement('input');
      inputMiddleName.setAttribute('id', 'middle-name-input');
      inputMiddleName.setAttribute('name', 'middle-name');
      inputMiddleName.setAttribute('type', 'text');
      inputMiddleName.setAttribute('placeholder', 'Middle name');
      inputMiddleName.value = middleNameContent;
      middleName.appendChild(inputMiddleName);

      lastName.innerHTML = null;
      const inputLastName = document.createElement('input');
      inputLastName.setAttribute('id', 'last-name-input');
      inputLastName.setAttribute('name', 'last-name');
      inputLastName.setAttribute('type', 'text');
      inputLastName.setAttribute('placeholder', 'Last name');
      inputLastName.value = lastNameContent;
      lastName.appendChild(inputLastName);

      //
      // Summary section
      const summaryContent = summary.innerHTML;
      summary.innerHTML = null;
      const textareaSummary = document.createElement("textarea");
      textareaSummary.setAttribute('id', 'summary-textarea');
      textareaSummary.setAttribute('name', 'summary');
      summary.appendChild(textareaSummary);
      textareaSummary.value = summaryContent;

      //
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

      //
      // Edit button
      editBtn.innerHTML = "Edit Profile";
      editBtn.classList.remove("btn--caution")
      editBtn.classList.add("btn");

      //
      // Header section
      const inputFirstName = document.getElementById('first-name-input');
      firstName.innerHTML = inputFirstName.value;
      const inputMiddleName = document.getElementById('middle-name-input');
      middleName.innerHTML = inputMiddleName.value;
      const inputLastName = document.getElementById('last-name-input');
      lastName.innerHTML = inputLastName.value;

      //
      // Summary section
      const textareaSummary = document.getElementById('summary-textarea');
      summary.innerHTML = textareaSummary.value;

      //
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
    const userId = document.getElementById(idList.userId);
    const firstName = document.getElementById(idList.firstName);
    const middleName = document.getElementById(idList.middleName);
    const lastName = document.getElementById(idList.lastName);
    const summary = document.getElementById(idList.summary);
    const email = document.getElementById(idList.emailContent);
    const phone = document.getElementById(idList.phoneContent);
    const whatsapp = document.getElementById(idList.whatsappContent);

    const rawBody = {
      userId: userId.value,
      firstName: firstName.innerHTML.trim(),
      middleName: middleName.innerHTML.trim(),
      lastName: lastName.innerHTML.trim(),
      summary: summary.innerHTML.trim(),
      email: email.innerHTML.trim(),
      phone: phone.innerHTML.trim(),
      whatsapp: whatsapp.innerHTML.trim()
    };

    const request = buildPostRequest(rawBody);

    const response = await fetch(`${GATEWAY}/main/profile`, request);
    // DEV-NOTE: Toast message based on response.
  }

  // Toggles the state of the 'Add Activity' button.
  const toggleAddActivity = (idList, btnList) => {
    STATE.addActivity = !STATE.addActivity;

    let dateInstance = null; // This non-read is intentional.
    const addActivityAnchor = document.getElementById(idList.newActivitySection);
    const activityHtml = `
    <div class="flex-container--nowrap">
      <p class="date">
        <input name="datePicker" type="text" placeholder="Add date" autocomplete="off" id="new-activity-date">
      </p>
      <textarea class="new-activity" placeholder="Add activity details" id="new-activity-desc"></textarea>
    </div>
    <div class="confirmation-buttons">
      <button class="btn" id="btn-submit-activity">Submit</button>
      <button class="btn" id="btn-cancel-activity">Cancel</button>
    </div>`;

    if (STATE.addActivity) {
      addActivityAnchor.innerHTML = activityHtml;
      addActivityAnchor.classList.remove('hide');

      // Initialize datetime picker
      dateInstance = new dtsel.DTS('input[name="datePicker"]', {
        direction: 'BOTTOM',
        showTime: false,
        showDate: true,
        dateFormat: "yyyy-mm-dd"
      });

      // Add click event
      const postActivityBtn = document.getElementById(btnList.submitActivityBtn);
      postActivityBtn.onclick = () => { postActivity(idList, btnList); }

      const cancelBtn = document.getElementById(btnList.cancelActivityBtn);
      cancelBtn.onclick = () => { toggleAddActivity(idList, btnList); }
    }
    else {
      addActivityAnchor.innerHTML = null;
      addActivityAnchor.classList.add('hide');
      dateInstance = null;
    }
  }

  // Posts new activity to MongoDB.
  const postActivity = async (idList) => {
    const userId = document.getElementById(idList.userId);
    const activityDesc = document.getElementById(idList.newActivityDesc);
    const activityDate = document.getElementById(idList.newActivityDate);

    const rawBody = {
      userId: userId.value,
      desc: activityDesc.value,
      date: activityDate.value
    };

    const request = buildPostRequest(rawBody);

    const response = await fetch(`${GATEWAY}/main/profile/add-activity`, request);

    if(response.status === 200)
      location.reload();
    else {
      console.error("Something went wrong sending activity data...");
      // DEV-NOTE: Toast message here for error.
    }
  }

  // Main initialization
  function init() {
    addEventListeners();
  }

  init();
})();

