## Prompt

You have been hired by the City of Los Angeles to build a web application to find project synergies between the city's various departments. One such opportunity is increasing capacity at existing EV chargers within the city as they are undertaking other capital improvements.

In the `data` folder, there are two datasets in GeoJSON format:

- `cip_projects.json`: Capital Improvement Projects (CIP) in the City of Los Angeles
- `ev_chargers.json`: Electric Vehicle (EV) chargers in the City of Los Angeles

Your task is to build a tool that enables the city manager to view the areas where CIP projects are scheduled to take place and highlight EV chargers within that area.

## Rules

- The application should be built using React and TypeScript. Feel free to use any other libraries or frameworks
- The end product should be deployed and accessible at a public facing link (eg. [Render](https://render.com), [Netlify](https://netlify.com))
- We ask that you time-box it to 3 hours of focused effort. We use the time constraint to understand how you prioritize and communicate trade-offs. It’s okay if it’s not a finished product!

## Next steps

## Civil Grid Implementation

This project visualizes Capital Improvement Projects (CIP) and EV Chargers in Los Angeles to identify synergies.

### Features
- **Interactive Map**: Displays CIP Projects (Blue polygons) and EV Chargers (Green points).
- **Search**: Filter projects by title or number, and chargers by ID.
- **Details Sidebar**: View comprehensive details for selected features.
- **Responsive Layout**: Sidebar + Map view.

### Tech Stack
- React + TypeScript (Vite)
- Leaflet + React-Leaflet
- Tailwind CSS

### How to Run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

### Deployment
The `dist` folder created by `npm run build` can be deployed to any static host (Netlify, Render, Vercel).
