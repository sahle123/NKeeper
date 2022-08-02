'use strict';

(function () {
  // Determines whether or not the state of the page is in EDIT MODE or VIEW MODE.
  let EDIT_MODE = false;

  // Initialize listener for the EDIT_MODE state.
  const addEventListeners = () => {
    const idList = {
      editBtn: 'edit-page-button',
      summary: 'summary-section'
    }

    const editBtn = document.getElementById(idList.editBtn);
    editBtn.onclick = () => { toggleEditModeState(idList); }
  }

  // Toggles the state of the page to and from EDIT_MODE.
  const toggleEditModeState = (idList) => {
    EDIT_MODE = !EDIT_MODE;
    const editBtn = document.getElementById(idList.editBtn);
    const summary = document.getElementById(idList.summary);

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
      textareaSummary.setAttribute('name', 'summary-textarea');
      summary.appendChild(textareaSummary);
      textareaSummary.value = summaryContent;
    }
    else {

      // Edit button
      editBtn.innerHTML = "Edit Profile";
      editBtn.classList.remove("btn--caution")
      editBtn.classList.add("btn");

      // Summary section
      const textareaSummary = document.getElementById('summary-textarea');
      summary.innerHTML = textareaSummary.value;
      summary.removeChild(textareaSummary);
    }
  }


  //
  // Main initialization
  function init() {
    addEventListeners();
  }

  init();
})();

