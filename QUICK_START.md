# 🚀 Quick Start Commands

## Run the Application

### Step 1: Start Web API Server
Open Terminal 1 and run:
```bash
cd /Users/princesingh123/Downloads/create-anything/apps/web
npm run dev
```
**Note:** The server will start on port 4000, 4001, 4002, or 4003 (whichever is available).
**Remember the port number shown in the terminal output!**

### Step 2: Start Mobile Expo App
Open Terminal 2 and run:
```bash
cd /Users/princesingh123/Downloads/create-anything/apps/mobile
mkdir -p caches
npx expo start --web
```
The app will be available at: `http://localhost:8081`

### Step 3: Update API Port (if needed)
If the web server started on a different port (e.g., 4003), update the mobile app:
1. Edit: `apps/mobile/src/utils/searchApi.js`
2. Change line 15: `return 'http://localhost:4003';` (replace 4003 with your actual port)

## Access the App
- **Mobile App (Web):** http://localhost:8081
- **Web API Server:** http://localhost:4000 (or 4001/4002/4003)

## Stop Servers
Press `Ctrl+C` in each terminal, or run:
```bash
# Kill Expo
lsof -ti:8081 | xargs kill -9

# Kill Web Server
lsof -ti:4000,4001,4002,4003 | xargs kill -9
```

## Troubleshooting
- **Port conflicts:** Kill existing processes on the ports
- **API not connecting:** Check the port number in the web server terminal and update `searchApi.js`
- **Gemini errors:** The API key is already configured in the code

