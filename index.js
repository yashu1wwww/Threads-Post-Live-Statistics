const express = require("express");
const puppeteer = require("puppeteer"); 

const app = express();
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
	   <link rel="icon" href="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpd-5fn7poj3u9XQoq2nR5OTwxnXgSZJ1GCg&s" type="image/x-icon">
      <title>Threads Post Stats</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .container {
          width: 100%;
          max-width: 900px;
          text-align: center;
        }

        .logo-container {
          margin-bottom: 30px;
          animation: fadeInDown 0.8s ease-out;
        }

        .logo {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          transition: transform 0.3s ease;
        }

        .logo:hover {
          transform: scale(1.1) rotate(5deg);
        }

        .title {
          color: white;
          font-size: 2.5rem;
          font-weight: 700;
          margin: 20px 0;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          animation: fadeInDown 0.8s ease-out 0.2s both;
        }

        .subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.1rem;
          margin-bottom: 40px;
          animation: fadeInDown 0.8s ease-out 0.4s both;
        }

        .form-card {
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          margin-bottom: 40px;
          animation: fadeInUp 0.8s ease-out 0.6s both;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 20px;
          align-items: center;
        }

        input {
          width: 100%;
          max-width: 500px;
          padding: 16px 20px;
          font-size: 1rem;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          transition: all 0.3s ease;
          outline: none;
        }

        input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        }

        button {
          padding: 16px 40px;
          font-size: 1.1rem;
          font-weight: 600;
          color: white;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }

        button:active {
          transform: translateY(0);
        }

        .stats-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
          animation: fadeInUp 0.8s ease-out;
        }

        .stat-bubble {
          background: white;
          border-radius: 20px;
          padding: 30px 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
          animation: popIn 0.5s ease-out both;
        }

        .stat-bubble:nth-child(1) { animation-delay: 0.1s; }
        .stat-bubble:nth-child(2) { animation-delay: 0.2s; }
        .stat-bubble:nth-child(3) { animation-delay: 0.3s; }
        .stat-bubble:nth-child(4) { animation-delay: 0.4s; }
        .stat-bubble:nth-child(5) { animation-delay: 0.5s; }

        .stat-bubble:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        }

        .stat-icon {
          font-size: 2.5rem;
          margin-bottom: 10px;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #666;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: #333;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .loading {
          color: white;
          font-size: 1.2rem;
          margin: 20px 0;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .footer {
          color: white;
          font-size: 1rem;
          margin-top: 40px;
          opacity: 0.9;
          animation: fadeIn 1s ease-out 1s both;
        }

        .footer a {
          color: white;
          text-decoration: none;
          font-weight: 600;
          border-bottom: 2px solid rgba(255, 255, 255, 0.5);
          transition: all 0.3s ease;
        }

        .footer a:hover {
          border-bottom-color: white;
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @media (max-width: 768px) {
          .title {
            font-size: 2rem;
          }

          .subtitle {
            font-size: 1rem;
          }

          .form-card {
            padding: 30px 20px;
          }

          .stats-container {
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 15px;
          }

          .stat-bubble {
            padding: 20px 15px;
          }

          .stat-icon {
            font-size: 2rem;
          }

          .stat-value {
            font-size: 1.5rem;
          }

          .logo {
            width: 60px;
            height: 60px;
          }
        }

        @media (max-width: 480px) {
          .title {
            font-size: 1.5rem;
          }

          .stats-container {
            grid-template-columns: 1fr 1fr;
          }

          .stat-bubble:last-child {
            grid-column: 1 / -1;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo-container">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpd-5fn7poj3u9XQoq2nR5OTwxnXgSZJ1GCg&" alt="Threads Logo" class="logo">
        </div>

        <h1 class="title">Threads Post Live Stats</h1>
        <p class="subtitle">Get real-time analytics for any Threads post</p>

        <div class="form-card">
          <form id="threadForm">
            <input type="text" id="url" placeholder="https://www.threads.com/@username/post/POSTID" required>
            <button type="submit">Fetch Stats</button>
          </form>
        </div>

        <div id="loading" class="loading" style="display: none;">Fetching stats...</div>

        <div class="stats-container" id="result"></div>

        <div class="footer">
          Designed & Developed by Yashwanth R
        </div>
      </div>

      <script>
        const form = document.getElementById('threadForm');
        const resultDiv = document.getElementById('result');
        const loadingDiv = document.getElementById('loading');

        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          const url = document.getElementById('url').value;

          if (!/^https:\\/\\/www\\.threads\\.com\\/@[a-zA-Z0-9._]+\\/post\\/.+/.test(url)) {
            alert("Only Valid Thread Post Acceptable");
            return;
          }

          loadingDiv.style.display = 'block';
          resultDiv.innerHTML = '';

          try {
            const response = await fetch("/fetch?url=" + encodeURIComponent(url));
            const data = await response.json();

            loadingDiv.style.display = 'none';

            if (data.error) {
              alert(data.error);
              return;
            }

            resultDiv.innerHTML = \`
              <div class="stat-bubble">
                <div class="stat-icon">❤️</div>
                <div class="stat-label">Likes</div>
                <div class="stat-value">\${data.likes}</div>
              </div>
              <div class="stat-bubble">
                <div class="stat-icon">💬</div>
                <div class="stat-label">Replies</div>
                <div class="stat-value">\${data.replies}</div>
              </div>
              <div class="stat-bubble">
                <div class="stat-icon">🔁</div>
                <div class="stat-label">Reposts</div>
                <div class="stat-value">\${data.reposts}</div>
              </div>
              <div class="stat-bubble">
                <div class="stat-icon">🔗</div>
                <div class="stat-label">Shares</div>
                <div class="stat-value">\${data.shares}</div>
              </div>
              <div class="stat-bubble">
                <div class="stat-icon">👀</div>
                <div class="stat-label">Views</div>
                <div class="stat-value">\${data.views}</div>
              </div>
            \`;
          } catch (err) {
            loadingDiv.style.display = 'none';
            alert("Error fetching post stats");
          }
        });
      </script>
    </body>
    </html>
  `);
});

app.get("/fetch", async (req, res) => {
  const postUrl = req.query.url;

  if (!postUrl || !/^https:\/\/www\.threads\.com\/@[a-zA-Z0-9._]+\/post\/.+/.test(postUrl)) {
    return res.json({ error: "Only Valid Thread Post Acceptable" });
  }

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(postUrl, { waitUntil: "networkidle2" });

    const stats = await page.evaluate(() => {
      const likeCount = document.querySelector('svg[aria-label="Like"] + span');
      const replyCount = document.querySelector('span.x1o0tod.x10l6tqk.x13vifvy'); // Updated selector
      const repostCount = document.querySelector('svg[aria-label="Repost"] + span');
      const shareCount = document.querySelector('svg[aria-label="Share"] + span');
      const viewsCount = Array.from(document.querySelectorAll("span")).find(el => /views/i.test(el.textContent));

      return {
        likes: likeCount ? likeCount.textContent.trim() : "0",
        replies: replyCount ? replyCount.textContent.trim() : "0",
        reposts: repostCount ? repostCount.textContent.trim() : "0",
        shares: shareCount ? shareCount.textContent.trim() : "0",
        views: viewsCount ? viewsCount.textContent.trim() : "0"
      };
    });

    await browser.close();
    res.json(stats);
  } catch (err) {
    res.json({ error: "Failed to fetch post stats" });
  }
});


app.listen(3000, () => console.log("Server running on http://localhost:3000"));
