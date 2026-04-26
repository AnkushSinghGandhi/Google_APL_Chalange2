#!/bin/sh

# Resolve API keys — check both with and without underscore prefix
PRIMARY_KEY="${VITE_GEMINI_API_KEY_PRIMARY:-${_VITE_GEMINI_API_KEY_PRIMARY:-}}"
FALLBACK_KEY="${VITE_GEMINI_API_KEY_FALLBACK:-${_VITE_GEMINI_API_KEY_FALLBACK:-}}"

# Generate runtime config from Cloud Run environment variables
cat <<EOF > /usr/share/nginx/html/config.js
window.__RUNTIME_CONFIG__ = {
  VITE_GEMINI_API_KEY_PRIMARY: "${PRIMARY_KEY}",
  VITE_GEMINI_API_KEY_FALLBACK: "${FALLBACK_KEY}"
};
EOF

# Start nginx
exec nginx -g 'daemon off;'
