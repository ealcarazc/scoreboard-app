'use client';

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
const SCOPE = 'https://www.googleapis.com/auth/drive.file';
const FOLDER_NAME = 'Marcador App';
const FILE_NAME = 'data.json';

const TOKEN_KEY = 'driveAccessToken';
const TOKEN_EXPIRY_KEY = 'driveAccessTokenExpiry';
const EVER_SIGNED_IN_KEY = 'driveEverSignedIn';

const DRIVE_API = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3';

declare global {
  interface Window {
    google?: any;
  }
}

let gisReady: Promise<void> | null = null;

function loadGisScript(): Promise<void> {
  if (gisReady) return gisReady;
  gisReady = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return resolve();
    if (window.google?.accounts?.oauth2) return resolve();
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('No se pudo cargar Google Identity Services'));
    document.head.appendChild(script);
  });
  return gisReady;
}

function getCachedToken(): string | null {
  if (typeof window === 'undefined') return null;
  const token = sessionStorage.getItem(TOKEN_KEY);
  const expiry = sessionStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!token || !expiry) return null;
  if (Date.now() > Number(expiry)) return null;
  return token;
}

function storeToken(token: string, expiresInSeconds: number) {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(TOKEN_EXPIRY_KEY, String(Date.now() + expiresInSeconds * 1000 - 60_000));
  localStorage.setItem(EVER_SIGNED_IN_KEY, 'true');
}

export function hasEverSignedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(EVER_SIGNED_IN_KEY) === 'true';
}

export function isDriveConfigured(): boolean {
  return !!CLIENT_ID;
}

export function isDriveConnected(): boolean {
  return !!getCachedToken();
}

export function disconnectDrive() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
  localStorage.removeItem(EVER_SIGNED_IN_KEY);
}

// Must be called from within a user gesture (button click) — GIS may show
// a consent popup, which browsers block if not triggered by real user input.
export function requestDriveAccess(): Promise<string | null> {
  return new Promise((resolve) => {
    const cached = getCachedToken();
    if (cached) {
      resolve(cached);
      return;
    }
    if (!CLIENT_ID) {
      resolve(null);
      return;
    }
    loadGisScript()
      .then(() => {
        if (!window.google?.accounts?.oauth2) {
          resolve(null);
          return;
        }
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPE,
          callback: (response: any) => {
            if (response.error || !response.access_token) {
              resolve(null);
              return;
            }
            storeToken(response.access_token, response.expires_in || 3600);
            resolve(response.access_token);
          },
        });
        tokenClient.requestAccessToken({ prompt: '' });
      })
      .catch(() => resolve(null));
  });
}

async function driveFetch(url: string, token: string, options: RequestInit = {}): Promise<Response> {
  const res = await fetch(url, {
    ...options,
    headers: { ...(options.headers || {}), Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(`Drive API error ${res.status}: ${await res.text()}`);
  }
  return res;
}

async function findFile(token: string, query: string): Promise<string | null> {
  const res = await driveFetch(`${DRIVE_API}/files?q=${encodeURIComponent(query)}&fields=files(id,name)`, token);
  const data = await res.json();
  return data.files?.[0]?.id || null;
}

async function getOrCreateFolder(token: string): Promise<string> {
  const existing = await findFile(
    token,
    `mimeType='application/vnd.google-apps.folder' and name='${FOLDER_NAME}' and trashed=false`
  );
  if (existing) return existing;

  const res = await driveFetch(`${DRIVE_API}/files`, token, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: FOLDER_NAME, mimeType: 'application/vnd.google-apps.folder' }),
  });
  const data = await res.json();
  return data.id;
}

async function getOrCreateDataFile(token: string, folderId: string): Promise<{ id: string; isNew: boolean }> {
  const existing = await findFile(token, `name='${FILE_NAME}' and '${folderId}' in parents and trashed=false`);
  if (existing) return { id: existing, isNew: false };

  const metadata = { name: FILE_NAME, parents: [folderId], mimeType: 'application/json' };
  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', new Blob([JSON.stringify({})], { type: 'application/json' }));

  const res = await driveFetch(`${DRIVE_UPLOAD_API}/files?uploadType=multipart&fields=id`, token, {
    method: 'POST',
    body: form,
  });
  const data = await res.json();
  return { id: data.id, isNew: true };
}

export async function readDriveFile(token: string): Promise<any | null> {
  const folderId = await getOrCreateFolder(token);
  const { id, isNew } = await getOrCreateDataFile(token, folderId);
  if (isNew) return null;

  const res = await driveFetch(`${DRIVE_API}/files/${id}?alt=media`, token);
  const text = await res.text();
  if (!text.trim()) return null;
  return JSON.parse(text);
}

export async function writeDriveFile(token: string, content: unknown): Promise<void> {
  const folderId = await getOrCreateFolder(token);
  const { id } = await getOrCreateDataFile(token, folderId);
  await driveFetch(`${DRIVE_UPLOAD_API}/files/${id}?uploadType=media`, token, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(content, null, 2),
  });
}
