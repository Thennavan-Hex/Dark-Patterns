# Dark Patterns Finder Extension

## Installation & Setup

### Extension Installation:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/dark-patterns-finder-extension.git
   ```

2. **Load the Extension in Chrome**:
   - Open Chrome or a Chromium-based browser.
   - Navigate to `chrome://extensions/`.
   - Enable "Developer mode" (usually a toggle switch in the top right corner).
   - Click on "Load unpacked" and select the cloned repository directory.

### Node.js Server Setup:

1. **Navigate to Server Directory**:
   ```bash
   cd dark-patterns-finder-extension/server
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Server**:
   ```bash
   node server.js
   ```

4. **Verify Server**:
   - Once the server is running, you should see a message indicating that the server has started, typically on `http://localhost:3000`.
   - Ensure that the extension's API calls point to this server URL for processing.
