/*
* Shared members across all public JS files.
* Also serves utility functions.
*/

'use strict';

// Gateway for connecting to Node.js server.
export const Gateway = 'http://localhost:3000';

// DRY code for building POST requests.
export function buildPostRequest(rawBody) {
  if (!rawBody)
      return null;

    return {
      method: 'POST',
      cache: 'no-cache',
      body: JSON.stringify(rawBody),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
}