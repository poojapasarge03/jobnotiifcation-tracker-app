# Quick Start Guide - KodNest Premium Build System

## Method 1: Open Directly in Browser (Simplest)

1. **Navigate to the examples folder**
   - Open File Explorer
   - Go to: `c:\Users\DELL\OneDrive\Desktop\kodnest\examples`

2. **Open the HTML files**
   - Double-click `layout-example.html` to see the full layout structure
   - Double-click `components-example.html` to see all components

3. **That's it!** The CSS files will load automatically.

---

## Method 2: Using a Local Server (Recommended for Development)

### Option A: Using Python (if installed)

1. **Open PowerShell or Command Prompt**
   - Press `Win + X` and select "Windows PowerShell" or "Terminal"

2. **Navigate to the project folder**
   ```powershell
   cd "c:\Users\DELL\OneDrive\Desktop\kodnest"
   ```

3. **Start a simple HTTP server**
   
   **Python 3:**
   ```powershell
   python -m http.server 8000
   ```
   
   **Python 2 (if Python 3 not available):**
   ```powershell
   python -m SimpleHTTPServer 8000
   ```

4. **Open your browser**
   - Go to: `http://localhost:8000/examples/layout-example.html`
   - Or: `http://localhost:8000/examples/components-example.html`

5. **Stop the server**
   - Press `Ctrl + C` in the terminal

### Option B: Using Node.js (if installed)

1. **Install a simple server globally** (one-time setup)
   ```powershell
   npm install -g http-server
   ```

2. **Navigate to the project folder**
   ```powershell
   cd "c:\Users\DELL\OneDrive\Desktop\kodnest"
   ```

3. **Start the server**
   ```powershell
   http-server -p 8000
   ```

4. **Open your browser**
   - Go to: `http://localhost:8000/examples/layout-example.html`

### Option C: Using VS Code Live Server Extension

1. **Install the extension**
   - Open VS Code
   - Go to Extensions (Ctrl + Shift + X)
   - Search for "Live Server" by Ritwick Dey
   - Click Install

2. **Open the HTML file**
   - Right-click on `examples/layout-example.html`
   - Select "Open with Live Server"

---

## Method 3: Using the Provided Start Script

We've created a simple start script for you:

1. **Double-click** `start-server.bat` in the project root
2. **Wait** for the browser to open automatically
3. **Navigate** to the examples folder in the browser

---

## What to Expect

### Layout Example (`layout-example.html`)
- Complete page structure with Top Bar, Context Header, Workspace, Panel, and Proof Footer
- Shows how all components work together

### Components Example (`components-example.html`)
- Showcase of all individual components
- Buttons, inputs, cards, badges, checkboxes, etc.

---

## Troubleshooting

**CSS not loading?**
- Make sure you're opening the HTML files from the `examples` folder
- The CSS path is relative: `../design-system/index.css`
- If using a server, make sure you're in the project root directory

**Fonts look different?**
- The system uses system fonts (Georgia for headings, system sans-serif for body)
- This is intentional - no external font dependencies

**Colors look off?**
- Make sure your browser isn't applying dark mode or color filters
- The background should be `#F7F6F3` (off-white)

---

## Next Steps

Once you can view the examples:
1. Read `design-system/DESIGN_SYSTEM.md` for full documentation
2. Use `design-system/index.css` in your own projects
3. Customize the design tokens in `design-system/tokens.css` if needed
