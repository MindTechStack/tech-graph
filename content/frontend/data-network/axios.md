---
id: axios
name: Axios
kind: library
status: work
tags: [http-client, rest-api, interceptors, networking, promise]
what: "Promise-based HTTP client for node.js and the browser with automatic JSON transformation and request and response interceptors."
why: "Simplifies network architectures with centralized request and response interceptors, automatic error throwing on non-2xx status codes, and unified config."
problem: "Vanilla fetch requires manual boilerplate for JSON stringifying and parsing, base URL prepending, HTTP error rejection, and auth token injection."
relations:
  - { to: fetch-api, label: "wraps and abstracts" }
  - { to: api-error-layer, label: "interceptors power" }
  - { to: typescript, label: "typed with" }
links:
  - { title: "Axios Documentation", url: https://axios-http.com/docs/intro }
alsoIn: []
source: work
---

## Example
```ts
import axios, { type AxiosError, type AxiosInstance } from "axios";

export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor: attach bearer token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: unwraps data or standardizes error
apiClient.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new CustomEvent("auth:expired"));
    }
    return Promise.reject(error);
  },
);
```

## Key points
- **Interceptors pipeline**: Intercept requests to attach Authorization headers and CSRF tokens; intercept responses to refresh expired JWTs or normalize error payloads globally.
- **Automatic status code rejection**: Unlike native fetch, Axios automatically rejects the promise for status codes outside the 2xx range, standardizing error handling.
- **Cross-platform isomorphism**: Works in both browser runtimes (using XMLHttpRequest/Fetch) and Node.js environments (using native `http` module), enabling shared API client packages.
