#!/bin/sh

# Generate runtime config from Cloud Run environment variables
# This creates a JS file that injects env vars into window.__RUNTIME_CONFIG__
cat <<EOF > /usr/share/nginx/html/config.js
window.__RUNTIME_CONFIG__ = {
  VITE_GEMINI_API_KEY_PRIMARY: "${_VITE_GEMINI_API_KEY_PRIMARY:-}",
  VITE_GEMINI_API_KEY_FALLBACK: "${_VITE_GEMINI_API_KEY_FALLBACK:-}"
};
EOF

# Start nginx
exec nginx -g 'daemon off;'
