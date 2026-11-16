document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("videos.json");
    const videos = await response.json();

    // Check if we are on the Homepage (index.html)
    const videoGrid = document.getElementById("videoGrid");
    if (videoGrid) {
      const searchInput = document.getElementById("searchInput");
      const statusMsg = document.getElementById("statusMsg");

      const renderVideos = (list) => {
        videoGrid.innerHTML = "";
        if (list.length === 0) {
          statusMsg.style.display = "block";
          return;
        }
        statusMsg.style.display = "none";

        list.forEach((video) => {
          const card = document.createElement("a");
          card.className = "video-card";
          card.href = `watch.html?id=${encodeURIComponent(video.id)}`;
          card.innerHTML = `
            <div class="thumb-wrapper">
              <img src="${video.thumbnail}" alt="${video.title}" loading="lazy" />
              <span class="duration">${video.duration}</span>
            </div>
            <div class="card-info">
              <div class="card-title">${video.title}</div>
            </div>
          `;
          videoGrid.appendChild(card);
        });
      };

      renderVideos(videos);

      searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        const filtered = videos.filter((v) =>
          v.title.toLowerCase().includes(query)
        );
        renderVideos(filtered);
      });
    }

    // Check if we are on the Watch Page (watch.html)
    const videoPlayer = document.getElementById("videoPlayer");
    if (videoPlayer) {
      const params = new URLSearchParams(window.location.search);
      const videoId = params.get("id");
      const video = videos.find((v) => v.id === videoId) || videos[0];

      if (video) {
        document.title = video.title;
        document.getElementById("videoTitle").textContent = video.title;
        videoPlayer.src = video.videoUrl;
        videoPlayer.poster = video.thumbnail;

        const streamBtn = document.getElementById("streamBtn");
        streamBtn.addEventListener("click", () => {
          videoPlayer.play();
        });

        const downloadBtn = document.getElementById("downloadBtn");
        downloadBtn.href = video.videoUrl;
        downloadBtn.setAttribute(
          "download",
          `${video.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.mp4`
        );
      }
    }
  } catch (err) {
    console.error("Failed to load videos.json:", err);
  }
});
