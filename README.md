# 🧠 InfoGenie – Ask Anything. Get Everything.

![InfoGenie Banner](https://img.shields.io/badge/AI%20Research-Assistant-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Building-brightgreen?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-orange?style=for-the-badge)

---

## 🔍 Overview
**InfoGenie** is an **AI-powered universal research assistant** that combines **live internet data** with **intelligent summarization**.  
Ask *anything* — academic, technical, or general — and get accurate, cited, and easy-to-understand results in seconds.

---

## 🎯 Core Features
- 🌐 **Multi-Source Research** – Fetches real-time data from Google, Wikipedia, YouTube, Scholar, and News APIs.  
- 🤖 **AI Summarization** – Uses GPT-4 / Gemini to simplify, explain, and organize answers.  
- 🧾 **Citations & Transparency** – Includes verified sources, publication dates, and bias indicators.  
- 💾 **Smart Memory** – Remembers previous queries and builds contextual understanding.  
- 🗣️ **Voice Input & Output** – Supports both speech recognition and AI voice response.  
- 📊 **Data Visualization** – Automatically generates charts, timelines, and structured reports.  
- 📑 **Export & Sync** – Save results as PDF/Docs and sync history with Google Login.

---

## ⚙️ How It Works
1. **User Query → AI Intent Detector**  
   - Understands query type (academic/news/tutorial) and extracts keywords.  
2. **Multi-Source Fetcher**  
   - Gathers results via Google Custom Search, Wikipedia, YouTube, News, and Scholar APIs.  
3. **AI Aggregator & Summarizer**  
   - Cleans, merges, and summarizes information for clarity.  
4. **Citation Engine**  
   - Links every fact to verified sources and generates APA/MLA citations.  
5. **Output Renderer**  
   - Displays results as text, visuals, or exportable notes.

---

## 🧩 Tech Stack
| Category | Technology |
|-----------|-------------|
| **Frontend** | React / Next.js |
| **Backend** | Node.js / Express |
| **AI Models** | GPT-4 / Gemini |
| **APIs** | Google Custom Search, Wikipedia, YouTube, News, Scholar |
| **Database & Auth** | Firebase / MongoDB |
| **Extras** | Voice APIs, Chart.js, D3.js |

---

## 🌐 Google Search Integration
InfoGenie uses the **Google Custom Search JSON API** to retrieve verified web results.

### Setup Steps
1. Create a project in [Google Cloud Console](https://console.cloud.google.com/).  
2. Enable **Custom Search JSON API**.  
3. Create your **API Key** and **Search Engine ID (cx)**.  
4. Add credentials in your `.env` file:
    ```bash
    GOOGLE_API_KEY=your_api_key
    GOOGLE_CX=your_search_engine_id
    ```

### Example (Node.js)
```js
import axios from "axios";

const searchGoogle = async (query) => {
  const apiKey = process.env.GOOGLE_API_KEY;
  const cx = process.env.GOOGLE_CX;
  const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${apiKey}&cx=${cx}`;

  try {
    const res = await axios.get(url);
    return res.data.items.map(item => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet
    }));
  } catch (err) {
    console.error("Google Search failed:", err.response?.data || err.message);
    return null;
  }
};

export default searchGoogle;
