document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("video-grid"); // Make sure your HTML grid has this ID

  fetch("videos.csv")
    .then(response => response.text())
    .then(csvText => {
      const videos = parseCSV(csvText);
      renderVideos(videos);
    })
    .catch(err => console.error("Error loading videos.csv:", err));
});

// Simple CSV parser function
function parseCSV(text) {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.trim());
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(",");
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentLine[j] ? currentLine[j].trim() : "";
    }
    result.push(obj);
  }
  return result;
}

function renderVideos(videos) {
  const grid = document.getElementById("video-grid");
  if (!grid) return;
  grid.innerHTML = "";

  videos.forEach(video => {
    const card = document.createElement("a");
    card.className = "video-card";
    card.href = `watch.html?url=${encodeURIComponent(video.videoUrl)}&title=${encodeURIComponent(video.title)}`;
    
    card.innerHTML = `
      <div class="thumb-wrapper">
        <img src="${video.thumbnail}" alt="${video.title}" loading="lazy" />
        <span class="duration">${video.duration}</span>
      </div>
      <div class="card-info">
        <div class="card-title">${video.title}</div>
      </div>
    `;
    grid.appendChild(card);
  });
}
