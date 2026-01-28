import { msalInstance, loginRequest } from "./msal";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

export function isSignedIn() {
    return msalInstance.getAllAccounts().length > 0;
}

export async function signInRedirect() {
    // If already signed in, don't redirect
    if (isSignedIn()) return;

    await msalInstance.initialize();
    await msalInstance.loginRedirect(loginRequest);
}

export async function signOutRedirect() {
    await msalInstance.initialize();
    const account = msalInstance.getAllAccounts()[0];
    await msalInstance.logoutRedirect({ account });
}

export async function getAccessToken(scopes = loginRequest.scopes) {
    await msalInstance.initialize();

    const accounts = msalInstance.getAllAccounts();
    if (!accounts.length) {
        // Not signed in; start redirect login
        await msalInstance.loginRedirect({ scopes });
        return; // will redirect away
    }

    const request = { scopes, account: accounts[0] };

    try {
        const resp = await msalInstance.acquireTokenSilent(request);
        return resp.accessToken;
    } catch (e) {
        // Token missing/expired and silent refresh not possible → redirect
        if (e instanceof InteractionRequiredAuthError) {
            await msalInstance.acquireTokenRedirect(request);
            return; // will redirect away
        }
        throw e;
    }
}
