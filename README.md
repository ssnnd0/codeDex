# CodeSync

CodeSync is an interactive presentation tool with code editing and compilation capabilities. It allows users to create, import, and manage presentations with real-time collaboration features.

## Features

- Create and manage presentations
- Import PowerPoint presentations
- Real-time collaboration
- Code editing with syntax highlighting
- Code compilation and execution
- Responsive design

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

## Installation

You can install CodeSync using one of the following methods:

### Using install.sh (for Unix-like systems)

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/codesync.git
   cd codesync
   ```

2. Run the install script:
   ```
   chmod +x install.sh
   ./install.sh
   ```

### Using install.bat (for Windows)

1. Clone the repository:
   ```
   git clone https://github.com/ssnnd0/codeDex.git
   cd codesync
   ```

2. Run the install script:
   ```
   install.bat
   ```

### Manual Installation

1. Clone the repository:
   ```
   git clone https://github.com/ssnnd0/codeDex.git
   cd codesync
   ```

2. Install dependencies:
   ```
   npm install
   cd frontend
   npm install
   cd ..
   ```

3. Create a `.env` file in the root directory and add your RapidAPI key:
   ```
   RAPIDAPI_KEY=your_rapidapi_key_here
   ```

## Usage

1. Start the development server:
   ```
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:5173`

3. Create a new presentation or import an existing PowerPoint file

4. Share the presentation URL with others for real-time collaboration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
