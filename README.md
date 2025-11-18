# ECommerce App (Vite + React + TypeScript)

This repository contains a small demo e-commerce frontend (Metro Accessories) using React + TypeScript + Vite.
The UI uses Tailwind via CDN for styling and lucide-react for icons.

## How to run (locally)
1. Install dependencies: `npm ci`
2. Dev server: `npm run dev` (port 5173)

## Docker (production)
Build the image and run:
```
docker build -t ecommerce-app .
docker run -p 80:80 ecommerce-app
```
Then open `http://<your-ec2-ip>/`.

The project includes the ECommerce component with all features you provided.
