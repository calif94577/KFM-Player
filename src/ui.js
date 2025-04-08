/*
 * Kenku FM Player Owlbear Rodeo Extension
 * Version: v11-white-transparent-bg-final
 * Author: calif94577 on Discord
 * Description: A minimal audio control interface for Kenku FM within Owlbear Rodeo.
 * Dependencies: Requires Kenku FM running locally (default: http://127.0.0.1:3333/v1).
 * Usage: Load via manifest URL. Enter your Kenku FM API URL when prompted.
 */
console.log("ui.js loaded - v11-white-transparent-bg-final-proxy");

(function renderUI() {
  console.log("Rendering UI");
  const PROXY_URL = "https://kfm-player-proxy.onrender.com/proxy"; // Replace with your proxy URL
  const KENKU_API = localStorage.getItem("kenkuApiUrl") || prompt("Enter your Kenku FM API URL", "http://127.0.0.1:3333/v1");
  localStorage.setItem("kenkuApiUrl", KENKU_API);
  let playbackState = { playing: false, muted: false, volume: 1, shuffle: false, repeat: "off", track: null };
  let allPlaylists = [];

  document.body.innerHTML = `
    <div class="control-bar">
      <select id="playlist-select">
        <option value="">Select a Playlist</option>
      </select>
      <div class="track-info">
        <span id="track-title">No track playing</span>
        <progress id="track-progress" value="0" max="100"></progress>
      </div>
      <div class="buttons">
        <button id="prev-btn">Previous</button>
        <button id="play-pause-btn">Play</button>
        <button id="next-btn">Next</button>
      </div>
      <div class="volume-control">
        <label for="volume-slider">Volume:</label>
        <input type="range" id="volume-slider" min="0" max="1" step="0.01" value="1">
        <button id="mute-btn">Mute</button>
      </div>
      <div class="shuffle-repeat">
        <button id="shuffle-btn">Shuffle: Off</button>
        <select id="repeat-select">
          <option value="off">Repeat: Off</option>
          <option value="track">Repeat: Track</option>
          <option value="playlist">Repeat: Playlist</option>
        </select>
      </div>
      <div class="track-list-container">
        <ul id="track-list"></ul>
      </div>
    </div>
  `;
  const style = document.createElement("style");
  style.textContent = `
    body { 
      font-family: Arial, sans-serif; 
      padding: 10px; 
      background: transparent; 
      margin: 0; 
      color: #fff; 
    }
    .control-bar { display: flex; flex-direction: column; gap: 10px; align-items: center; }
    .track-info { text-align: center; width: 100%; }
    #track-title { 
      display: block; 
      font-size: 14px; 
      margin-bottom: 5px; 
      background: rgba(0, 0, 0, 0); 
      padding: 2px 5px; 
      border-radius: 3px; 
      color: #fff; 
    }
    #track-progress { width: 100%; max-width: 300px; height: 10px; }
    .buttons { display: flex; gap: 5px; }
    .volume-control { display: flex; align-items: center; gap: 5px; }
    .shuffle-repeat { display: flex; gap: 10px; align-items: center; }
    .track-list-container { 
      width: 100%; 
      max-width: 300px; 
      max-height: 150px; 
      overflow-y: auto; 
      background: rgba(0, 0, 0, 0); 
      border-radius: 5px; 
    }
    #track-list { list-style: none; padding: 0; margin: 0; }
    #track-list li { 
      padding: 5px; 
      cursor: pointer; 
      background: transparent; 
      border-bottom: 1px solid #fff; 
      color: #fff; 
    }
    #track-list li:hover { background: rgba(255, 255, 255, 0.2); }
    .control-bar button { 
      padding: 5px 10px; 
      font-size: 14px; 
      cursor: pointer; 
      background: transparent; 
      color: #fff; 
      border: 1px solid #fff; 
      border-radius: 3px; 
    }
    .control-bar button:hover { background: rgba(255, 255, 255, 0.2); }
    select { 
      padding: 5px; 
      font-size: 14px; 
      color: #fff; 
      background: transparent; 
      border: 1px solid #fff; 
    }
    input[type="range"] { 
      padding: 5px; 
      font-size: 14px; 
      background: rgba(0, 0, 0, 0.5); 
      border: 1px solid #fff; 
    }
    select option { 
      background: #1F2230; 
      color: #fff; 
    }
    label { color: #fff; }
  `;
  document.head.appendChild(style);

  function fetchPlaylists() {
    fetch(`${PROXY_URL}/playlist`, {
      headers: { "X-Kenku-API-URL": KENKU_API }
    })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        console.log("Playlists fetched:", data);
        allPlaylists = data;
        if (data.playlists && Array.isArray(data.playlists)) {
          const select = document.getElementById("playlist-select");
          select.innerHTML = '<option value="">Select a Playlist</option>';
          data.playlists.forEach((playlist) => {
            const option = document.createElement("option");
            option.value = playlist.id;
            option.text = playlist.title;
            select.appendChild(option);
          });
        } else {
          console.error("Expected playlists array, got:", data);
        }
        updateTrackList();
      })
      .catch((error) => console.error("Error fetching playlists:", error));
  }

  function updatePlaybackState() {
    return fetch(`${PROXY_URL}/playlist/playback`, {
      headers: { "X-Kenku-API-URL": KENKU_API }
    })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        playbackState = {
          playing: data.playing,
          muted: data.muted,
          volume: data.volume,
          shuffle: data.shuffle,
          repeat: data.repeat,
          track: data.track || null
        };
        console.log("Playback state:", playbackState);
        updateUI();
        return data;
      })
      .catch((error) => {
        console.error("Error fetching playback state:", error);
        return null;
      });
  }

  function updateUI() {
    document.getElementById("play-pause-btn").textContent = playbackState.playing ? "Pause" : "Play";
    document.getElementById("mute-btn").textContent = playbackState.muted ? "Unmute" : "Mute";
    document.getElementById("volume-slider").value = playbackState.volume;
    document.getElementById("shuffle-btn").textContent = `Shuffle: ${playbackState.shuffle ? "On" : "Off"}`;
    document.getElementById("repeat-select").value = playbackState.repeat;
    const trackTitle = document.getElementById("track-title");
    const trackProgress = document.getElementById("track-progress");
    if (playbackState.track) {
      trackTitle.textContent = playbackState.track.title || "Unknown Track";
      const progressPercent = (playbackState.track.progress / playbackState.track.duration) * 100 || 0;
      trackProgress.value = progressPercent;
      trackProgress.max = 100;
    } else {
      trackTitle.textContent = "No track playing";
      trackProgress.value = 0;
    }
  }

  function updateTrackList() {
    const playlistId = document.getElementById("playlist-select").value;
    const trackList = document.getElementById("track-list");
    trackList.innerHTML = "";
    if (!playlistId || !allPlaylists.playlists) return;

    const playlist = allPlaylists.playlists.find(p => p.id === playlistId);
    if (playlist && playlist.tracks && allPlaylists.tracks) {
      playlist.tracks.forEach((trackId) => {
        const track = allPlaylists.tracks.find(t => t.id === trackId);
        if (track) {
          const li = document.createElement("li");
          li.textContent = track.title || "Unnamed Track";
          li.dataset.trackId = track.id;
          li.addEventListener("click", () => {
            sendCommand("/playlist/play", "PUT", { id: track.id })
              .then(() => setTimeout(updatePlaybackState, 25));
          });
          trackList.appendChild(li);
        }
      });
    }
  }

  function sendCommand(endpoint, method = "POST", body = null) {
    const options = { 
      method,
      headers: { 
        "Content-Type": "application/json",
        "X-Kenku-API-URL": KENKU_API
      }
    };
    if (body) options.body = JSON.stringify(body);
    console.log("Sending request:", { url: `${PROXY_URL}${endpoint}`, ...options });
    return fetch(`${PROXY_URL}${endpoint}`, options)
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errData) => {
            throw new Error(`HTTP error! status: ${response.status}, details: ${JSON.stringify(errData)}`);
          });
        }
        console.log("Command sent:", endpoint);
        return updatePlaybackState();
      })
      .catch((error) => {
        console.error("Error:", error);
        throw error;
      });
  }

  fetchPlaylists();
  updatePlaybackState();

  setInterval(() => {
    if (playbackState.playing) {
      updatePlaybackState();
    }
  }, 1000);

  document.getElementById("play-pause-btn").addEventListener("click", () => {
    const playlistId = document.getElementById("playlist-select").value;
    updatePlaybackState().then((state) => {
      if (!state) {
        if (playlistId) {
          sendCommand("/playlist/play", "PUT", { id: playlistId });
        } else {
          console.log("No playlist selected and no state to resume");
        }
      } else if (!state.playing && !state.playlist && playlistId) {
        sendCommand("/playlist/play", "PUT", { id: playlistId });
      } else if (!state.playing) {
        sendCommand("/playlist/playback/play", "PUT");
      } else {
        sendCommand("/playlist/playback/pause", "PUT");
      }
    });
  });

  document.getElementById("next-btn").addEventListener("click", () => {
    updatePlaybackState().then((state) => {
      if (state && state.playing) {
        sendCommand("/playlist/playback/next", "POST");
      } else {
        console.log("Nothing playing to skip");
      }
    });
  });

  document.getElementById("prev-btn").addEventListener("click", () => {
    updatePlaybackState().then((state) => {
      if (state && state.playing) {
        sendCommand("/playlist/playback/previous", "POST");
      } else {
        console.log("Nothing playing to go back");
      }
    });
  });

  document.getElementById("mute-btn").addEventListener("click", () => {
    updatePlaybackState().then((state) => {
      if (state) {
        sendCommand("/playlist/playback/mute", "PUT", { mute: !state.muted });
      }
    });
  });

  document.getElementById("volume-slider").addEventListener("input", (e) => {
    const volume = parseFloat(e.target.value);
    sendCommand("/playlist/playback/volume", "PUT", { volume });
  });

  document.getElementById("shuffle-btn").addEventListener("click", () => {
    updatePlaybackState().then((state) => {
      if (state) {
        sendCommand("/playlist/playback/shuffle", "PUT", { shuffle: !state.shuffle });
      }
    });
  });

  document.getElementById("repeat-select").addEventListener("change", (e) => {
    const repeat = e.target.value;
    sendCommand("/playlist/playback/repeat", "PUT", { repeat });
  });

  document.getElementById("playlist-select").addEventListener("change", () => {
    updatePlaybackState();
    updateTrackList();
  });
})();