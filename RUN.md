# 🚀 How to Run InfoGenie App

## Option 1: Run Both Servers Manually (Recommended)

### Terminal 1 - Web API Server
```bash
cd /Users/princesingh123/Downloads/create-anything/apps/web
npm run dev
```
This will start the web API server (usually on port 4000, 4001, or 4002)

### Terminal 2 - Mobile Expo App
```bash
cd /Users/princesingh123/Downloads/create-anything/apps/mobile
mkdir -p caches
npx expo start --web
```
This will start the Expo development server on `http://localhost:8081`

---

## Option 2: Quick Start Script

Run the start script:
```bash
cd /Users/princesingh123/Downloads/create-anything
./start.sh
```

---

## 📝 Notes

- Make sure both servers are running before testing the app
- The mobile app will be available at: `http://localhost:8081`
- The web API will be available at: `http://localhost:4000` (or 4001/4002 if 4000 is in use)
- If you see port conflicts, kill the existing process or use a different port

## 🛑 To Stop Servers

Press `Ctrl+C` in each terminal window, or kill the processes:
```bash
# Find and kill Expo process
lsof -ti:8081 | xargs kill -9

# Find and kill Web API process
lsof -ti:4000 | xargs kill -9
lsof -ti:4001 | xargs kill -9
lsof -ti:4002 | xargs kill -9
```

