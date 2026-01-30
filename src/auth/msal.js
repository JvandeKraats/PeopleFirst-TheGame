import { PublicClientApplication } from "@azure/msal-browser";

export const msalConfig = {
    auth: {
        clientId: import.meta.env.VITE_AAD_CLIENT_ID,
        authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AAD_TENANT_ID}`,
        redirectUri: import.meta.env.VITE_AAD_REDIRECT_URI, // e.g. http://localhost:5173/
        navigateToLoginRequestUrl: false, // avoids MSAL trying to navigate back to a "request URL" you didn't expect
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    },
};

export const loginRequest = {
    scopes: ["User.Read","People.Read"], // add "People.Read" later once admin approves
};

export const msalInstance = new PublicClientApplication(msalConfig);
