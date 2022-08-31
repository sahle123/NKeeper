'use strict';

import { Gateway, buildPostRequest } from './shared.js';

(function() {
  const GATEWAY = Gateway;


  // All IDs that are not dynamic.
  const _idList = {
    firstName: 'first-name',
    middleName: 'middle-name',
    lastName: 'last-name',
    summary: 'summary',
    emailContent: 'email',
    phoneContent: 'mobile',
    whatsappContent: 'whatsApp',
    dobContent: 'dob',
    nationalityContent: 'nationality',
    livingInContent: 'livingIn'
  }

  // All buttons w/ actions on page
  const _btnList = { }

  //
  // ACTIONS
  //
  // Resets page.
  const clearPage = () => {
    location.reload();
  };

  // Submits contact to server
  const submitContact = async () => {
    const firstName = document.getElementById(_idList.firstName);
    const middleName = document.getElementById(_idList.middleName);
    const lastName = document.getElementById(_idList.lastName);
    const summary = document.getElementById(_idList.summary);
    const email = document.getElementById(_idList.emailContent);
    const phone = document.getElementById(_idList.phoneContent);
    const whatsapp = document.getElementById(_idList.whatsappContent);
    const dob = document.getElementById(_idList.dobContent);
    const nationality = document.getElementById(_idList.nationalityContent);
    const livingIn = document.getElementById(_idList.livingInContent);

    const rawBody = {
      firstName: firstName.value.trim(),
      middleName: middleName.value.trim(),
      lastName: lastName.value.trim(),
      summary: summary.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim(),
      whatsApp: whatsapp.value.trim(),
      dob: dob.value.trim(),
      nationality: nationality.value.trim(),
      livingIn: livingIn.value.trim()
    };

    const request = buildPostRequest(rawBody);

    const response = await fetch(`${GATEWAY}/newContact`, request);

    if (response.status === 200) {
      console.log("All good. Need to redirect to the new profile via their ID");
      location.href = response.url;
    }
    else {
      // DEV-NOTE: Toast message here for error.
      console.error("Something went wrong creating the new contact");
    }
  }

  function init() {

    // Initialize datepicker for page.
    let dateInstance = new dtsel.DTS('input[name="datePicker"]', {
      direction: 'BOTTOM',
      showTime: false,
      showDate: true,
      dateFormat: 'yyyy-mm-dd'
    });
  }
  init();

  //
  // DOM exposed actions
  //
  window._newContactFns = { clearPage, submitContact }
})();