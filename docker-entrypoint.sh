#!/bin/bash
set -e

# Rebuild native modules if needed
if [ ! -d "node_modules/better-sqlite3" ] || [ ! -d "node_modules/node-pty" ]; then
    echo "Rebuilding native modules..."
    npm rebuild better-sqlite3 node-pty
fi

# Start the development server with Xvfb
exec xvfb-run -a npm run dev
