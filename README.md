# Real Estate Listing Platform

A modern real estate listing platform built with React, TypeScript, and Vite. Features property management with CSV-based data storage.

## Features

- Property listing with detailed information
- Add new properties with form validation
- CSV-based data persistence
- Responsive design with Chakra UI
- TypeScript for type safety
- Modern development setup with Vite

## Tech Stack

- React 18
- TypeScript
- Vite
- Chakra UI
- Papa Parse for CSV handling

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/niceliubing/real-estate.git
cd real-estate
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
RealEstate/
├── public/
├── src/
│   ├── assets/         # Static assets
│   ├── components/     # React components
│   ├── data/          # CSV data storage
│   ├── services/      # Business logic and data handling
│   └── types/         # TypeScript type definitions
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Features

### Property Management
- View property listings
- Add new properties
- Property details include:
  - Title and address
  - Price
  - Number of bedrooms and bathrooms
  - Square footage
  - Property type (house, condo, etc.)
  - Status (for sale, for rent, sold)
  - Images
  - Features and amenities

### Data Persistence
- CSV-based storage
- Automatic data loading and saving
- Data validation and type checking

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Bing Liu (@niceliubing)
