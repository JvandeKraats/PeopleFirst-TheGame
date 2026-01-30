import fallbackPeople from "@/data/people-fallback.json";
import { getAccessToken } from "@/auth/authService";

const GRAPH_BASE = "https://graph.microsoft.com/v1.0";

function useFallbackEnabled() {
    return String(import.meta.env.VITE_USE_FALLBACK).toLowerCase() === "true";
}

function shuffle(arr) {
    return arr.slice().sort(() => Math.random() - 0.5);
}

function toGameColleague(p, photoLink) {
    const displayName = (p.displayName || "").trim() || "Unknown";
    const firstName = (p.givenName || displayName.split(" ")[0] || displayName).trim();

    return {
        name: displayName,
        firstName,
        answer: "",
        link: photoLink || "/fallback-avatar.png",
        graph: p,
    };
}

async function graphJson(url, scopes) {
    const token = await getAccessToken(scopes);
    const resp = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });

    if (!resp.ok) {
        const text = await resp.text();
        const err = new Error(`Graph error ${resp.status}: ${text}`);
        err.status = resp.status;
        throw err;
    }
    return resp.json();
}

async function graphPhotoObjectUrl(userId, scopes) {
    const token = await getAccessToken(scopes);
    const resp = await fetch(`${GRAPH_BASE}/users/${userId}/photo/$value`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (resp.status === 404) return null; // no photo
    if (!resp.ok) return null; // don’t block game on photo issues

    const blob = await resp.blob();
    return URL.createObjectURL(blob);
}

function pickTenFromFallback() {
    const people = fallbackPeople.value || [];
    const selected = shuffle(people).slice(0, Math.min(10, people.length));

    return selected.map((p) => {
        // In fallback JSON we store photo path as `photo`
        return toGameColleague(p, p.photo);
    });
}

export async function getTenRandomCoworkers() {
    // Forced fallback via env flag
    if (useFallbackEnabled()) {
        return pickTenFromFallback();
    }

    // Try Graph, fallback automatically if 403 happens
    const scopes = ["User.Read", "People.Read"]; // You’ll still be blocked until admin consents People.Read

    try {
        const people = await graphJson(`${GRAPH_BASE}/me/people?$top=50`, scopes);

        const orgUsers = (people.value || []).filter(
            (p) => p.personType?.subclass === "OrganizationUser" && p.id
        );

        const selected = shuffle(orgUsers).slice(0, 10);

        const collegas = await Promise.all(
            selected.map(async (p) => {
                const photo = await graphPhotoObjectUrl(p.id, scopes);
                return toGameColleague(p, photo);
            })
        );

        return collegas;
    } catch (e) {
        // If access denied, fallback
        if (e?.status === 403) {
            return pickTenFromFallback();
        }
        // Other errors should still surface
        throw e;
    }
}
