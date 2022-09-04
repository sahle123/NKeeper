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

export const DateTimeSettings = {
  scheme: 'fr-CA',
  options: {
    year: 'numeric', 
    month: 'numeric', 
    day: 'numeric'
  }
};

export function UrlifyImage(rawFile) {
  if (!rawFile)
    return null;

    //const result = `data:${rawFile.mimetype};base64,${}`
    return URL.createObjectURL(rawFile);
}

export function ConvertBase64ToImage(encodedImg, mimeType) {
  if (!encodedImg || !mimeType)
    return null;

    const result = `data:${mimeType};base64,${encodedImg}`;
    return result;
}

// All IDs on the profile page.
// export const idList = {
// };

// export const btnList = { 
// }