/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ get_appointments_load_test)
});

;// CONCATENATED MODULE: external "k6"
const external_k6_namespaceObject = require("k6");
;// CONCATENATED MODULE: external "k6/http"
const http_namespaceObject = require("k6/http");
var http_default = /*#__PURE__*/__webpack_require__.n(http_namespaceObject);
;// CONCATENATED MODULE: ./src/utils/http-client.ts
/**
 * HTTP Client Utility
 * Responsibility: Execute HTTP requests with consistent configuration
 */

/**
 * Get base URL from environment variable
 */
function getBaseUrl() {
    const baseUrl = __ENV.BASE_URL;
    if (!baseUrl) {
        throw new Error('BASE_URL environment variable is not set');
    }
    return baseUrl;
}
/**
 * Build full URL from path
 */
function buildUrl(path) {
    const baseUrl = getBaseUrl();
    // Remove leading slash if present to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${baseUrl}/${cleanPath}`;
}
/**
 * Get default HTTP parameters
 */
function getDefaultParams(customParams) {
    return {
        timeout: customParams?.timeout || '30s',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...customParams?.headers,
        },
    };
}
/**
 * Execute GET request
 */
function get(path, params) {
    const url = buildUrl(path);
    const requestParams = getDefaultParams(params);
    return http_default().get(url, requestParams);
}
/**
 * Execute POST request
 */
function post(path, body, params) {
    const url = buildUrl(path);
    const requestParams = getDefaultParams(params);
    const payload = typeof body === 'string' ? body : JSON.stringify(body);
    return http_default().post(url, payload, requestParams);
}
/**
 * Execute PUT request
 */
function put(path, body, params) {
    const url = buildUrl(path);
    const requestParams = getDefaultParams(params);
    const payload = typeof body === 'string' ? body : JSON.stringify(body);
    return http_default().put(url, payload, requestParams);
}
/**
 * Execute DELETE request
 */
function del(path, params) {
    const url = buildUrl(path);
    const requestParams = getDefaultParams(params);
    return http_default().del(url, null, requestParams);
}
/**
 * Execute PATCH request
 */
function patch(path, body, params) {
    const url = buildUrl(path);
    const requestParams = getDefaultParams(params);
    const payload = typeof body === 'string' ? body : JSON.stringify(body);
    return http_default().patch(url, payload, requestParams);
}

;// CONCATENATED MODULE: ./src/utils/auth-helper.ts
/**
 * Authentication Helper
 * Responsibility: Generate authentication headers and retrieve DP tokens for CBA Edge API
 */

function randomUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
/**
 * Get DP Token from authentication service
 * This token is required for authenticated API calls
 */
function getDpToken(netBankId) {
    const dpTokenUrl = __ENV.DP_TOKEN_URL;
    if (!dpTokenUrl) {
        throw new Error('DP_TOKEN_URL environment variable is not set');
    }
    console.log(`Fetching DP Token for NetBankId: ${netBankId}`);
    console.log(`DP Token URL: ${dpTokenUrl}`);
    const payload = JSON.stringify({
        DeviceId: 'UH0052527334',
        Environment: 'Test2',
        IsLocal: false,
        IsSteppedUp: true,
        NetbankId: netBankId,
        RegisterInCAAS: true,
    });
    const params = {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'User-Agent': "HomeHub Performance Test/1.0",
            'interactionId': randomUUID().replace(/-/g, '').toUpperCase(),
            'x-request-id': randomUUID(),
            'Host': 'www.my.test.commbank.com.au',
        },
        timeout: '30s',
    };
    const response = http_default().post(dpTokenUrl, payload, params);
    console.log(`DP Token API Response Status: ${response.status}`);
    // Validate status code
    if (response.status !== 200) {
        console.error(`DP Token API Response Body: ${response.body}`);
        throw new Error(`Failed to get DP Token. Status: ${response.status}`);
    }
    // Parse response
    let responseData;
    try {
        responseData = JSON.parse(response.body);
    }
    catch (error) {
        console.error(`Failed to parse DP Token response: ${response.body}`);
        throw new Error('Invalid JSON response from DP Token API');
    }
    // Validate response contains DpTok
    if (!responseData.DpTok) {
        throw new Error('Response does not contain DpTok field');
    }
    if (responseData.DpTok.includes('error')) {
        throw new Error(`Error in DpTok: ${responseData.DpTok}`);
    }
    console.log('Successfully obtained DP Token');
    return responseData.DpTok;
}
/**
 * Get authentication headers for CBA Edge API
 * Only includes DP token Authorization header
 */
function getAuthHeaders(credentials) {
    return {
        Authorization: `Bearer ${credentials.dpToken}`,
    };
}
/**
 * Get test user credentials from environment (fallback only)
 * For actual testing, use test-data-loader.ts
 */
function getTestCredentials() {
    return {
        netBankId: __ENV.NETBANK_ID || 'TESTUSER001',
    };
}
/**
 * Validate that required authentication environment variables are set
 * Note: CIF_CODE and NETBANK_ID are no longer required as they come from test data
 */
function validateAuthConfig() {
    if (!__ENV.DP_TOKEN_URL) {
        throw new Error('DP_TOKEN_URL environment variable is required. Set it in your .env file.');
    }
    if (!__ENV.BASE_URL) {
        throw new Error('BASE_URL environment variable is required. Set it in your .env file.');
    }
}

;// CONCATENATED MODULE: ./src/fixtures/test-data.json
const test_data_namespaceObject = /*#__PURE__*/JSON.parse('{"testUsers":[{"netBankId":"79162845","gnafId":"GANSW703919713","searchAddress":"180 cad"},{"netBankId":"68064680","gnafId":"GANSW703919714","searchAddress":"1 martin place"},{"netBankId":"91459195","gnafId":"GANSW703919713","searchAddress":"100 george street"},{"netBankId":"27870814","gnafId":"GANSW703919714","searchAddress":"50 bridge street"},{"netBankId":"34878387","gnafId":"GANSW703919713","searchAddress":"200 pitt street"},{"netBankId":"43890842","gnafId":"GANSW703919714","searchAddress":"300 kent street"},{"netBankId":"82192634","gnafId":"GANSW703919713","searchAddress":"45 york street"},{"netBankId":"82910764","gnafId":"GANSW703919714","searchAddress":"88 phillip street"},{"netBankId":"41389371","gnafId":"GANSW703919713","searchAddress":"33 king street"},{"netBankId":"61420376","gnafId":"GANSW703919714","searchAddress":"77 hunter street"}]}');
;// CONCATENATED MODULE: ./src/utils/test-data-loader.ts
/**
 * Test Data Loader
 * Responsibility: Load and manage test data from JSON files
 */

/**
 * Get all test users from test data file
 */
function getAllTestUsers() {
    return test_data_namespaceObject.testUsers;
}
/**
 * Get a random test user from the test data
 */
function getRandomTestUser() {
    const users = getAllTestUsers();
    const randomIndex = Math.floor(Math.random() * users.length);
    return users[randomIndex];
}
/**
 * Get test user by index (useful for round-robin selection)
 * Uses modulo to wrap around if index exceeds array length
 */
function getTestUserByIndex(index) {
    const users = getAllTestUsers();
    const wrappedIndex = index % users.length;
    return users[wrappedIndex];
}
/**
 * Get test user for current virtual user
 * Uses k6's __VU (virtual user ID) for consistent user assignment
 */
function getTestUserForVU() {
    return getTestUserByIndex(__VU - 1); // __VU starts at 1
}
/**
 * Get total count of test users available
 */
function getTestUserCount() {
    return getAllTestUsers().length;
}

;// CONCATENATED MODULE: ./src/utils/token-cache.ts
/**
 * Token Cache Utility
 * Responsibility: Manage per-VU token caching with TTL for BlazeMeter compatibility
 *
 * This utility provides token caching functionality that works reliably in both
 * local k6 execution and BlazeMeter cloud environment. It eliminates the need
 * for setup() functions which may not execute reliably in BlazeMeter.
 *
 * Usage:
 * ```typescript
 * import { getCachedToken, clearTokenCache } from '../utils/token-cache';
 *
 * export default function(): void {
 *   const token = getCachedToken(() => getDpToken(netBankId), 3600000);
 *   // Use token for API calls
 * }
 * ```
 */
/** How long (ms) to wait after a fetch failure before retrying. */
const FAILURE_COOLDOWN_MS = 10000;
// Per-VU token cache
// Each VU maintains its own cache instance
const cache = {
    token: null,
    fetchTime: 0,
    ttlMs: 3600000, // Default 1 hour
    lastFailureTime: 0,
};
/**
 * Get cached token or fetch new one if expired
 *
 * Returns null when the token fetch failed and the 30-second failure cooldown
 * has not yet elapsed. The caller should skip the API call in that case.
 *
 * @param fetchFn - Function to fetch a new token
 * @param ttlMs - Time-to-live in milliseconds (default: 1 hour)
 * @returns Cached or freshly fetched token, or null if in failure cooldown
 *
 * @example
 * ```typescript
 * const token = getCachedToken(() => getDpToken('12345678'), 3600000);
 * if (token === null) { return; }
 * ```
 */
function getCachedToken(fetchFn, ttlMs = 3600000) {
    const now = Date.now();
    // Cooldown guard: suppress retries for FAILURE_COOLDOWN_MS after a failure
    if (cache.lastFailureTime > 0) {
        const cooldownRemaining = FAILURE_COOLDOWN_MS - (now - cache.lastFailureTime);
        if (cooldownRemaining > 0) {
            console.log(`[Token Cache] In failure cooldown — skipping fetch ` +
                `(${Math.ceil(cooldownRemaining / 1000)}s remaining)`);
            return null;
        }
    }
    const isExpired = cache.token === null || now - cache.fetchTime > ttlMs;
    if (isExpired) {
        console.log(`[Token Cache] Fetching new token (TTL: ${ttlMs}ms)`);
        try {
            cache.token = fetchFn();
            cache.fetchTime = now;
            cache.ttlMs = ttlMs;
            cache.lastFailureTime = 0; // reset on success
            console.log('[Token Cache] Token fetched and cached successfully');
        }
        catch (error) {
            console.error(`[Token Cache] Failed to fetch token: ${error}`);
            cache.lastFailureTime = now; // start cooldown
            return null; // do NOT re-throw
        }
    }
    else {
        const age = now - cache.fetchTime;
        const remaining = ttlMs - age;
        console.log(`[Token Cache] Using cached token ` +
            `(age: ${Math.round(age / 1000)}s, remaining: ${Math.round(remaining / 1000)}s)`);
    }
    return cache.token;
}
/**
 * Clear the token cache
 * Useful for testing or forcing token refresh
 *
 * @example
 * ```typescript
 * clearTokenCache();
 * ```
 */
function clearTokenCache() {
    cache.token = null;
    cache.fetchTime = 0;
    cache.lastFailureTime = 0;
    console.log('[Token Cache] Cache cleared');
}
/**
 * Get cache statistics
 * Useful for debugging and monitoring
 *
 * @returns Cache statistics object
 *
 * @example
 * ```typescript
 * const stats = getCacheStats();
 * console.log(`Token age: ${stats.ageSeconds}s`);
 * ```
 */
function getCacheStats() {
    const now = Date.now();
    const age = cache.token ? now - cache.fetchTime : 0;
    const remaining = cache.token ? cache.ttlMs - age : 0;
    const cooldownElapsed = cache.lastFailureTime > 0 ? now - cache.lastFailureTime : FAILURE_COOLDOWN_MS;
    const cooldownRemaining = Math.max(0, FAILURE_COOLDOWN_MS - cooldownElapsed);
    return {
        hasToken: cache.token !== null,
        ageSeconds: Math.round(age / 1000),
        ttlSeconds: Math.round(cache.ttlMs / 1000),
        remainingSeconds: Math.round(remaining / 1000),
        inFailureCooldown: cooldownRemaining > 0,
        cooldownRemainingSeconds: Math.round(cooldownRemaining / 1000),
    };
}

;// CONCATENATED MODULE: ./src/scenarios/application/get-appointments.load.test.ts





const TOKEN_TTL_MS = 3600000;
/* harmony default export */ function get_appointments_load_test() {
    const user = getTestUserForVU();
    if (__ITER === 0) {
        console.log(`[VU ${__VU}] Starting Get Appointments Load Test`);
        console.log(`NetBankId: ${user.netBankId}`);
    }
    const dpToken = getCachedToken(() => {
        console.log(`[VU ${__VU}] Fetching DP Token for NetBankId: ${user.netBankId}`);
        return getDpToken(user.netBankId);
    }, TOKEN_TTL_MS);
    if (dpToken === null) {
        console.log(`[VU ${__VU}] No token available — skipping iteration`);
        (0,external_k6_namespaceObject.sleep)(1);
        return;
    }
    const headers = getAuthHeaders({ dpToken });
    const response = get('/appointments?type=ZAHL&status=open&status=conflict', { headers });
    const checks = (0,external_k6_namespaceObject.check)(response, {
        'status is 200': (r) => r.status === 200,
        'response time < 1000ms': (r) => r.timings.duration < 1000,
    });
    if (!checks) {
        console.error(`[VU ${__VU}] Check failed - Status: ${response.status}`);
    }
    (0,external_k6_namespaceObject.sleep)(1);
}


// k6-compatible exports added by post-build script
exports.default = get_appointments_load_test;

/******/ })()
;
//# sourceMappingURL=get-appointments.load.test.js.map