/**
 * Generate an identifier for a user for a given partner or usage. This salts
 * and hashes the user's private ID to ensure any given partner only receives
 * a unique collection which is not shared among partners.
 *
 * @param {string} nameOrUsage Name or usage of identity (e.g. partner label).
 * @param {string} privateId   The private ID of the user.
 */
export default async function identityFor(nameOrUsage, privateId) {
  if (
    typeof window !== 'undefined' &&
    (window.Promise === undefined ||
      window.crypto === undefined ||
      window.crypto.subtle === undefined ||
      window.crypto.subtle.digest === undefined)
  ) {
    return unsafeIdentityFor(nameOrUsage, privateId);
  }

  if (!nameOrUsage || nameOrUsage.length < 1) {
    console && console.log && console.log('must pass a service name to identityFor, using a non unique value');
    nameOrUsage = 'notallthatunique';
  }

  return await generateSaltedHash(nameOrUsage, privateId);
}

/**
 * Fallback mechanism for generating an unsafe identity string.
 *
 * @param {string} nameOrUsage Name or usage of identity (e.g. partner label).
 * @param {string} privateId   The private ID of the user.
 */
function unsafeIdentityFor(nameOrUsage, privateId) {
  var hash = '';
  var alphabet = '0123456789abcdef';
  var uniqueIdentity = privateId + nameOrUsage;

  if (uniqueIdentity.length == 0) return hash;

  for (var i = 0; i < uniqueIdentity.length; i++) {
    hash = alphabet[uniqueIdentity.charCodeAt(i) % alphabet.length] + hash;
  }
  return hash;
}

async function generateSaltedHash(nameOrUsage, privateId) {
  // Browser:
  if (typeof window !== 'undefined') {
    // Generate a byte stream with UTF-8 encoding.
    const uniqueId = stringToArrayBuffer(privateId + nameOrUsage);

    // use the subtle crytpo digest to generate a salted sha-256 digest
    const hashArrayMap = await window.crypto.subtle.digest('SHA-256', uniqueId);

    return convertArrayMapToHexString(hashArrayMap);
  }

  // Node.js:
  const crypto = require('crypto');
  return crypto
    .createHash('sha256')
    .update(privateId + nameOrUsage)
    .digest('hex');
}

// Convert list of array map integers into a hex string
function convertArrayMapToHexString(digestArrayBuffer) {
  return [].slice
    .call(new Uint8Array(digestArrayBuffer))
    .map(function (b) {
      return b.toString(16).padStart(2, '0');
    })
    .join('');
}

function stringToArrayBuffer(string) {
  if (typeof TextEncoder === 'function') {
    return new TextEncoder().encode(string);
  }
  var bytesPerCharacter = 2;
  var buffer = new ArrayBuffer(string.length * bytesPerCharacter);
  var bufferView = new Uint16Array(buffer);
  for (var i = 0, strLen = string.length; i < strLen; i++) {
    bufferView[i] = string.charCodeAt(i);
  }
  return buffer;
}
