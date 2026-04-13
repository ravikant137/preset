#!/bin/bash
# Build frontend and copy to backend/public for unified serving
cd ../frontend
npm install
npm run build
cp -r .next/static ../backend/public/
cp -r public/* ../backend/public/
cd ../backend
npm install
npm run build
node dist/index.js
