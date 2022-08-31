'use strict';

import {Gateway, buildPostRequest, DateTimeSettings } from './shared.js';

(function() {

  const GATEWAY = Gateway;

  // All IDs on the page that are static.
  const _idList = {
    mostRecentActivity: 'most-recent-activity',
    numOfContacts: 'num-of-contacts',
    friendMostActivities: 'friend-most-activities'
  };


  //
  // ACTIONS
  //
  // Gets the most recent activity details.
  const getMostRecentActivity = async () => {
    let htmlInjection = '';

    const response = await fetch(`${GATEWAY}/dashboard/get-most-recent-activity`);
    const responseContent = await response.json();

    if (response.status === 200) {
      const activityDate = new Date(responseContent.date)
        .toLocaleDateString(DateTimeSettings.scheme, DateTimeSettings.options);

      htmlInjection = `<h5>${responseContent.userId.firstName} ${responseContent.userId.lastName}</h5>
      <p>${activityDate}</p>
      <hr/>
      <p>${responseContent.desc}</p>`;
    }
    else {
      htmlInjection = `<p>${responseContent}</p>`;
    }

    const anchor = document.getElementById(_idList.mostRecentActivity);
    anchor.innerHTML = htmlInjection;
  };

  // Gets number of contacts belonging to this user.
  const getNumOfContacts = async () => {
    let htmlInjection = '';

    const response = await fetch(`${GATEWAY}/dashboard/get-num-of-contacts`);
    const responseContent = await response.json();

    if (response.status === 200) {
      htmlInjection = `<h5>${responseContent}</h5>`;
    }
    else {
      htmlInjection = `<p>${responseContent}</p>`;
    }

    const anchor = document.getElementById(_idList.numOfContacts);
    anchor.innerHTML = htmlInjection;
  }

  // Gets friend who has the most activities for this given user.
  const getFriendWithMostActivities = async () => {
    let htmlInjection = '';

    const response = await fetch(`${GATEWAY}/dashboard/get-friend-with-most-activities`);
    const responseContent = await response.json();

    if (response.status === 200) {
      htmlInjection = `<h5>${responseContent.name}</h5>
      <p>Count: ${responseContent.count}</p>`;
    }
    else {
      htmlInjection = `<p>${responseContent}</p>`;
    }

    const anchor = document.getElementById(_idList.friendMostActivities);
    anchor.innerHTML = htmlInjection;
  }

  function init() {

    // Running all actions we need loaded on the page.
    getMostRecentActivity();
    getNumOfContacts();
    getFriendWithMostActivities();
  }
  init();

  //
  // DOM exposed actions
  //
  //window._dashboardFns = { };

})();