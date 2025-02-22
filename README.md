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
   git clone https://github.com/ssnnd0/codeDex.git
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
   Remember to set up your `RAPIDAPI_KEY` environment variable for the code compilation to work. You can get this key by signing up for the Judge0 API on RapidAPI.

## Running the Application

The application consists of three parts that need to be running simultaneously:

1. Backend server:
   ```
   cd backend
   npm start
   ```
   The backend will run on port 3000.

2. Main application (Management Dashboard):
   ```
   cd frontend
   npm run dev
   ```
   The main application will be available at `http://localhost:5731`

3. Join page:
   ```
   cd frontend
   npm run dev:join
   ```
   The join page will be available at `http://localhost:5732/join`

## Usage

### For Presenters

1. Access the main application at `http://localhost:5731`
2. Create a new presentation or import an existing PowerPoint file
3. Share the generated 6-digit code with participants
4. Use the Management Console to:
   - Select programming language
   - Enable/disable compiler
   - Add different types of slides (text, code, MCQ, short answer)
   - Navigate through slides

### For Participants

1. Access the join page at `http://localhost:5732/join`
2. Enter the 6-digit code provided by the presenter
3. Enter your name
4. Participate in the presentation by:
   - Viewing slides in real-time
   - Writing and running code (when enabled)
   - Answering MCQs and short answer questions

## Slide Types

1. **Text Slides**
   - Basic text content
   - Supports formatting

2. **Code Slides**
   - Syntax highlighting
   - Code compilation (when enabled)
   - Real-time code editing

3. **Multiple Choice Questions (MCQ)**
   - Multiple options
   - Immediate feedback
   - Results visible to presenter

4. **Short Answer Questions**
   - Free-form text responses
   - Submissions collected for presenter review

## Development

### Project Structure

```
codesync/
├── backend/
│   ├── routes/
│   │   ├── api.js
│   │   ├── presentations.js
│   │   └── compile.js
│   ├── utils/
│   │   ├── presentationParser.js
│   │   └── codeGenerator.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.vue
│   │   │   ├── Presentation.vue
│   │   │   ├── CodeEditor.vue
│   │   │   ├── MCQSlide.vue
│   │   │   ├── ShortAnswerSlide.vue
│   │   │   ├── ManagementConsole.vue
│   │   │   └── JoinPage.vue
│   │   ├── router/
│   │   │   └── index.js
│   │   ├── App.vue
│   │   └── main.js
│   ├── vite.config.js
│   └── vite.config.join.js
├── install.sh
├── install.bat
└── README.md
```

## License

This project is licensed under the GNU General Public License v3.0.


## Acknowledgments

- Monaco Editor for code editing
- Socket.IO for real-time communication
- Judge0 API for code compilation
- Vue.js team for the framework
