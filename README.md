

---

# inSkrap

## Overview

**inSkrap** is a web-based application built with React and Vite, integrated with Electron for desktop deployment. The app is designed to scrape data based on user-provided keywords and locations. The data is then displayed in a table, and users can export the results to a PDF.

## Features

- **Data Display:** Visualize the scraped data in a dynamic table.
- **PDF Export:** Export the displayed data into a well-formatted PDF.
- **Electron Integration:** Package the web app as a cross-platform desktop application.

## Project Structure

```bash
inSkrap
├── src
│   ├── main          # Electron main process
│   │   ├── main.mjs  # Entry point for Electron main process
│   │   ├── preload.js  # Preload script for Electron
│   ├── renderer      # React components and views
│   │   ├── App.jsx
│   │   ├── main.jsx  # Entry point for React app
│   │   ├── components
│   │   ├── styles
│   │   └── index.html
├── public            # Static assets
├── build             # Build outputs
├── package.json
└── README.md
```

## Installation

### Prerequisites

- **Node.js** (version 18 or later)
- **npm** or **Yarn**
- **Git**

### Clone the Repository

```bash
git clone https://github.com/yourusername/inskrap.git
cd inskrap
```

### Install Dependencies

```bash
npm install
```

## Development

### Running the Application

You can run the application in development mode using Vite and Electron.

```bash
npm run electron-dev
```

This command will start the Vite development server for the React app and Electron for the desktop environment.

### Building the Application

To package the application as an executable for distribution:

```bash
npm run electron-build
```

This will generate the executables under the `dist/` directory.

## Usage

1. **Search for Locations:** Enter a keyword (e.g., "lawyer") and a location (e.g., "New York") in the input fields and click "Search."
2. **View Results:** The results will be displayed in a table format.
3. **Export to PDF:** Click the "Download PDF" button to export the displayed results to a PDF file.
4. **Using Electron:** You can use this application as a standalone desktop application by running the executable generated from the build process.

## Troubleshooting

### Common Issues

- **Module Not Found Errors:** Ensure that all dependencies are correctly installed. Run `npm install` to install any missing packages.
- **Vite Dev Server Not Found:** If you encounter issues with the Vite server, make sure the `vite.config.js` is correctly configured, and the development server is running on the specified port.
- **Electron Build Issues:** Ensure that Electron is listed as a `devDependency` in `package.json` and not as a `dependency`.


## Future Features
 - Google Voice Integration

