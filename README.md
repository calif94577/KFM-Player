# Kenku FM Owlbear Rodeo Extension

A lightweight audio control interface for [Kenku FM](https://github.com/calif94577/kenku-fm), designed to integrate seamlessly with [Owlbear Rodeo](https://www.owlbear.rodeo/), a virtual tabletop platform. This extension allows you to manage playlists, control playback, adjust volume, and more—all from a sleek, transparent popup within Owlbear Rodeo.

---

## Features
- **Playlist Selection**: Choose from your Kenku FM playlists via a dropdown.
- **Track Control**: Play, pause, skip to next/previous tracks, and select specific tracks from a scrollable list.
- **Volume Management**: Adjust volume with a slider and toggle mute.
- **Playback Options**: Enable shuffle and set repeat modes (off, track, playlist).
- **Integrated UI**: All this from within OBR so you don't have to leave to change your music.

---

## Requirements
To use this extension, you’ll need:
1. **Owlbear Rodeo**: Access to the platform at [owlbear.rodeo](https://www.owlbear.rodeo/).
2. **Modified Kenku FM**: This extension requires a specific version of Kenku FM with adjusted CORS settings to allow requests from the hosted extension. Download it from my fork here:
   - [https://github.com/calif94577/kenku-fm](https://github.com/calif94577/kenku-fm)
   - **Why Modified?**: The default Kenku FM restricts CORS to `https://www.owlbear.rodeo`. My version allows requests from `https://kfm-player.onrender.com`, where the extension is hosted.

---

## Installation
1. **Run Kenku FM**:
   - Download my modified Kenku FM from [https://github.com/calif94577/kenku-fm](https://github.com/calif94577/kenku-fm), or download source and build your own. (only Apple Silicone build currently available.)
   - Add your playlists (these will port over if you already had the unmodified version of Kenku.FM set up with tracks), and start the server (default: Address: 127.0.0.1 - Port: 3333 | `http://127.0.0.1:3333/v1`).
2. **Add the Extension to Owlbear Rodeo**:
   - Open Owlbear Rodeo in your browser.
   - Go to **Extensions** → **Add Custom Extension** via the top right + button.
   - Enter this URL: `https://kfm-player.onrender.com/manifest.json`.
   - Click **Add**.
   - Then enable the extension.

---

## How It Works
- **Loading**: On startup, the extension fetches your playlists and playback state from Kenku FM.
- **Controls**: Use the buttons and sliders to manage playback:
  - **Play/Pause**: Toggles playback of the current track or playlist.
  - **Next/Previous**: Skips tracks in the active playlist.
  - **Track List**: Click a track to play it immediately.
  - **Volume**: Slide to adjust or click mute.
  - **Shuffle/Repeat**: Toggle shuffle or set repeat mode.
- **Real-Time Updates**: The UI refreshes every second when a track is playing, showing progress and current track info.

---

## Credits
This extension was built with **significant assistance from Grok**, an AI created by xAI. I had a vision, but my last coding class was 20 years ago lol. Though in retrospect I feel like it took me just as long to hold it's hand and tell it where all it's errors were than just teaching myself javascript "-_- 

---

## Support
If you run into issues or need help:
- **Contact Me**: Reach out on Discord as `calif94577` in [OBR Server](https://discord.gg/u5RYMkV98s). I’m happy to assist with setup, troubleshooting, or any questions!
- **Issues/Suggestions**: Feel free to open an issue on this GitHub repo or just reach out to me and I will see what I can do.

---

## Development Notes
- **Hosting**: The extension is hosted on Render.com at `https://kfm-player.onrender.com`.
- **Tech Stack**: Built with vanilla JavaScript, styled with inline CSS, and uses Vite for local development (see `package.json`).
- **Source**: Find the full code in this repository.

*Please note this is my first OBR extension and last time I even tried to code anyting was 2 decades ago. So be kind and I am so sorry for the absolute mess the code and files are in. I am almost certain half the files arent even necessary and are just hold overs from the example template.

Enjoy enhancing your Owlbear Rodeo sessions with Kenku FM audio control!
