/*
* Does very basic state management stuff of the page. Perhaps it would've been 
* better to use a framework, but I like learning the hard way for the sake of
* learning.
*/
'use strict';

import { Gateway, buildPostRequest, ConvertBase64ToImage } from './shared.js';

(function () {
  // State of various elements within the page.
  const STATE = {
    editPage: false,
    addActivity: false
  };

  const GATEWAY = Gateway;

  // CSS selectors used in this JS file for element selection.
  const _classSelectors = {
    activitiesEditDesc: '.activities__list--subcontent--desc'
  };

  // All IDs on the profile page that are not dynamic.
  const _idList = {
    userId: 'userId',
    firstName: 'first-name',
    middleName: 'middle-name',
    lastName: 'last-name',
    summary: 'summary-section',
    emailContent: 'email-content',
    phoneContent: 'phone-content',
    whatsappContent: 'whatsapp-content',
    dobContent: 'dob-content',
    nationalityContent: 'nationality-content',
    livingInContent: 'livingIn-content',
    newActivitySection: 'new-activity-section',
    newActivityDesc: 'new-activity-desc',
    newActivityDate: 'new-activity-date',
    imageSection: 'image-section'
  };

  // All buttons on the page.
  const _btnList = {
    editBtn: 'edit-page-button',
    toggleActivity: 'btn-toggle-activity',
    submitActivity: 'btn-submit-activity',
    cancelActivity: 'btn-cancel-activity',
    submitEdit: 'btn-submit-edit',
    cancelEdit: 'btn-cancel-edit',
    addNewImage: 'btn-add-new-image',
    hiddenImgUpload: 'hidden-upload-image'
  };


  //
  // ACTIONS
  //
  // Initialize listeners and IDs for the page.
  const addEventListeners = () => {

    const editBtn = document.getElementById(_btnList.editBtn);
    editBtn.onclick = () => { toggleEditModeState(_idList, _btnList); }

    const toggleActivityBtn = document.getElementById(_btnList.toggleActivity);
    toggleActivityBtn.onclick = () => { toggleAddActivity(_idList, _btnList); }

    // For registering clicks on the image icon.
    const addImageIcon = document.getElementById(_btnList.addNewImage);
    addImageIcon.addEventListener("click", (e) => {
      const hiddenInput = document.getElementById(_btnList.hiddenImgUpload);
      if (hiddenInput)
        hiddenInput.click();
      else
        console.error("Upload image not working. :(");
    });

  };

  // Toggles the state of the page to and from EDIT_MODE.
  const toggleEditModeState = (idList, btnList) => {
    STATE.editPage = !STATE.editPage;
    const editBtn = document.getElementById(btnList.editBtn);
    const summary = document.getElementById(idList.summary);
    const email = document.getElementById(idList.emailContent);
    const phone = document.getElementById(idList.phoneContent);
    const whatsapp = document.getElementById(idList.whatsappContent);
    const dob = document.getElementById(idList.dobContent);
    const nationality = document.getElementById(idList.nationalityContent);
    const livingIn = document.getElementById(idList.livingInContent);
    const firstName = document.getElementById(idList.firstName);
    const middleName = document.getElementById(idList.middleName);
    const lastName = document.getElementById(idList.lastName);
    const imageSection = document.getElementById(idList.imageSection);

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
      // Image section
      const plusImage = document.getElementById(_btnList.addNewImage);
      plusImage.classList.remove('hide');

      const helpfulText = document.createElement('p');
      helpfulText.innerHTML = "You can upload images here";

      imageSection.appendChild(plusImage);
      imageSection.appendChild(helpfulText);

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
      const inputEmail = document.createElement('input');
      email.innerHTML = null;
      inputEmail.setAttribute('id', 'email-input');
      inputEmail.setAttribute('name', 'email');
      inputEmail.setAttribute('type', 'text');
      inputEmail.value = emailContent;
      email.appendChild(inputEmail);

      const phoneContent = phone.innerHTML;
      const inputPhone = document.createElement('input');
      phone.innerHTML = null;
      inputPhone.setAttribute('id', 'phone-input');
      inputPhone.setAttribute('name', 'phone');
      inputPhone.setAttribute('type', 'text');
      inputPhone.value = phoneContent;
      phone.appendChild(inputPhone);

      const whatsappContent = whatsapp.innerHTML;
      const inputWhatsapp = document.createElement('input');
      whatsapp.innerHTML = null;
      inputWhatsapp.setAttribute('id', 'whatsapp-input');
      inputWhatsapp.setAttribute('name', 'whatsapp');
      inputWhatsapp.setAttribute('type', 'text');
      inputWhatsapp.value = whatsappContent;
      whatsapp.appendChild(inputWhatsapp);

      const dobContent = dob.innerHTML;
      const inputDob = document.createElement('input');
      dob.innerHTML = null;
      inputDob.setAttribute('id', 'dob-input');
      inputDob.setAttribute('name', 'dob');
      inputDob.setAttribute('type', 'text');
      inputDob.setAttribute('placeholder', 'yyyy-MM-dd');
      inputDob.value = dobContent;
      dob.appendChild(inputDob);

      const nationalityContent = nationality.innerHTML;
      const inputNationality = document.createElement('input');
      nationality.innerHTML = null;
      inputNationality.setAttribute('id', 'nationality-input');
      inputNationality.setAttribute('name', 'nationality');
      inputNationality.setAttribute('type', 'text');
      inputNationality.value = nationalityContent;
      nationality.appendChild(inputNationality);

      const livingInContent = livingIn.innerHTML;
      const inputLivingIn = document.createElement('input');
      livingIn.innerHTML = null;
      inputLivingIn.setAttribute('id', 'livingIn-input');
      inputLivingIn.setAttribute('name', 'livingIn');
      inputLivingIn.setAttribute('type', 'text');
      inputLivingIn.value = livingInContent;
      livingIn.appendChild(inputLivingIn);

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

      const inputDob = document.getElementById('dob-input');
      dob.innerHTML = inputDob.value;

      const inputNationality = document.getElementById('nationality-input');
      nationality.innerHTML = inputNationality.value;

      const inputLivingIn = document.getElementById('livingIn-input');
      livingIn.innerHTML = inputLivingIn.value;

      //
      // ...add more as needed

      postChanges(idList);
    }
  };

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
    const dob = document.getElementById(idList.dobContent);
    const nationality = document.getElementById(idList.nationalityContent);
    const livingIn = document.getElementById(idList.livingInContent);
    const hiddenImgUpload = document.getElementById(_btnList.hiddenImgUpload);

    const rawBody = {
      userId: userId.value,
      firstName: firstName.innerHTML.trim(),
      middleName: middleName.innerHTML.trim(),
      lastName: lastName.innerHTML.trim(),
      summary: summary.innerHTML.trim(),
      email: email.innerHTML.trim(),
      phone: phone.innerHTML.trim(),
      whatsapp: whatsapp.innerHTML.trim(),
      dob: dob.innerHTML.trim(),
      nationality: nationality.innerHTML.trim(),
      livingIn: livingIn.innerHTML.trim(),
    };

    const request = buildPostRequest(rawBody);
    const response = await fetch(`${GATEWAY}/main/profile`, request);

    // Upload image
    if (hiddenImgUpload.files.length > 0) {
      const imgUpload = hiddenImgUpload.files[0];
      const imgData = new FormData();
      imgData.append('img', imgUpload);
      imgData.append('contactId', userId.value);

      const imgUploadResponse = await fetch(`${GATEWAY}/main/profile/upload-image`, {
        method: "POST",
        body: imgData
      });

      if (imgUploadResponse.status !== 200)
        console.error("Had issue uploading photo.");
    }

    // DEV-NOTE: Toast message based on response.

    // Refresh page.
    location.reload();
  };

  // Toggles the state of the 'Add Activity' button.
  const toggleAddActivity = (idList, btnList) => {
    STATE.addActivity = !STATE.addActivity;

    let dateInstance = null; // This non-read is intentional.
    const addActivityAnchor = document.getElementById(idList.newActivitySection);
    const activityHtml = `
    <div class="flex-container--nowrap">
      <p class="date">
        <input name="datePicker" type="text" placeholder="Add date" autocomplete="off" id="${idList.newActivityDate}">
      </p>
      <textarea class="new-activity" placeholder="Add activity details" id="${idList.newActivityDesc}"></textarea>
    </div>
    <div class="confirmation-buttons">
      <button class="btn" id="${btnList.submitActivity}">Submit</button>
      <button class="btn" id="${btnList.cancelActivity}">Cancel</button>
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
      const postActivityBtn = document.getElementById(btnList.submitActivity);
      postActivityBtn.onclick = () => { postActivity(idList, btnList); }

      const cancelBtn = document.getElementById(btnList.cancelActivity);
      cancelBtn.onclick = () => { toggleAddActivity(idList, btnList); }
    }
    else {
      addActivityAnchor.innerHTML = null;
      addActivityAnchor.classList.add('hide');
      dateInstance = null;
    }
  };

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

    if (response.status === 200)
      location.reload();
    else {
      location.href = response.url;
      console.error("Something went wrong sending activity data...");
      // DEV-NOTE: Toast message here for error.
    }
  };

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
  };

  // Updates an activity in for a given Contact.
  const editActivity = async (activityId) => {

    const activity = document.getElementById(activityId);

    // Get original activity desc
    const descEl = activity.querySelector(_classSelectors.activitiesEditDesc);
    //descEl.classList.add('hide');

    // Add textarea for editing the activity.
    const editActivityHtml = `<textarea class="new-activity" placeholder="Edit activtiy details" id="${activityId}-edit-desc">${descEl.innerHTML}</textarea>`;
    const editActivityAnchor = document.getElementById(`${activityId}-edit`);
    editActivityAnchor.innerHTML = editActivityHtml;

    // Reveal the edit section
    const editActivitySection = document.getElementById(`${activityId}-edit-section`);
    editActivitySection.classList.remove('hide');
    editActivitySection.classList.add('activities__list--subcontent');

    // Hide the original activity section.
    const originalActivitySection = document.getElementById(`${activityId}`);
    originalActivitySection.classList.remove('activities__list--subcontent')
    originalActivitySection.classList.add('hide');
  };

  // Cancels the edit activity action.
  const cancelEdit = async (activityId) => {
    //const activity = document.getElementById(activityId);

    // Hide edit activity section
    const editActivitySection = document.getElementById(`${activityId}-edit-section`);
    editActivitySection.classList.remove('activities__list--subcontent');
    editActivitySection.classList.add('hide');

    // Show the riginal activity section.
    const originalActivitySection = document.getElementById(`${activityId}`);
    originalActivitySection.classList.add('activities__list--subcontent');
    originalActivitySection.classList.remove('hide');
  };

  // Posts edited activity to MongoDB.
  const saveEdit = async (activityId) => {
    const userId = document.getElementById(_idList.userId);
    const editedActivity = document.getElementById(activityId + "-edit-desc");

    const rawBody = {
      userId: userId.value,
      activityId: activityId,
      desc: editedActivity.value,
      date: null
    };

    const request = buildPostRequest(rawBody);

    // Send out request
    const response = await fetch(`${GATEWAY}/main/profile/edit-activity`, request);

    //await cancelEdit(activityId);

    console.log(response.status);

    // Refresh page if successful.
    if (response.status === 200)
      location.reload();
    else {
      location.href = response.url;
      // DEV-NOTE: Toast message.
      console.log("Something went wrong server side...");
    }
  };

  // Dynamically displays new image on upload.
  // This is client-side, still not on the server yet.
  const displayNewUploadImg = (e) => {
    const addImageIcon = document.getElementById(_btnList.addNewImage);
    addImageIcon.src = URL.createObjectURL(e.target.files[0]);
  };


  // Main initialization
  async function init() {
    addEventListeners();

    // DEV-NOTE: Maybe move the code below into a function later...
    const contactId = document.getElementById(_idList.userId).value;
    const response = await fetch(`${GATEWAY}/main/profile/get-images/${contactId}`);
    const responseContent = await response.json();
    console.log(responseContent);

    responseContent.forEach((el, index, arr) => {
      const imgHtml = document.getElementById(el._id);
      imgHtml.src = ConvertBase64ToImage(el.data, el.mimeType);
      //imgHtml.src = UrlifyImage(new Blob([el.data], {type: el.mimeType}) );
    });

  }
  init();

  //
  // For any functions I need directly accessible to the DOM.
  //
  window._profileFns = {
    deleteActivity,
    editActivity, 
    cancelEdit, 
    saveEdit, 
    displayNewUploadImg
  };
})();