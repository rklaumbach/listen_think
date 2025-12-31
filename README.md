# 🎙️ Listen & Think

A powerful voice recorder web application with real-time transcription and AI-generated notes for productivity.

## ✨ Features

- **🎤 Voice Recording**: Record your voice directly in the browser
- **📝 Real-time Transcription**: Automatic verbatim transcription as you speak
- **💡 Smart Notes**: Auto-generated notes with key points, action items, and questions
- **🔄 Auto-Update**: Notes automatically update at customizable intervals
- **📚 Session History**: Save and revisit previous recordings
- **📋 Copy to Clipboard**: Easy copying of transcripts and notes
- **🌙 Dark Theme**: Easy on the eyes with a modern dark interface
- **💾 Local Storage**: All data stored locally in your browser

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome or Edge recommended for best speech recognition)
- Microphone access

### Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd listen_think
```

2. Start a local server:
```bash
npm start
# or
python3 -m http.server 8000
# or any other local server
```

3. Open your browser and navigate to:
```
http://localhost:8000
```

4. Grant microphone access when prompted

## 📖 How to Use

### Recording

1. Click **"Start Recording"** to begin
2. Speak naturally - the transcription will appear in real-time
3. Click **"Stop Recording"** when finished

### Transcription

- The **left panel** shows your verbatim transcription
- Text appears as you speak
- Final text is shown in regular font, interim results in italic
- Click 📋 to copy the transcript to clipboard

### Notes

- The **right panel** displays AI-generated notes including:
  - 📋 Summary of key points
  - ✅ Action items (tasks, to-dos)
  - ❓ Questions raised
  - 🔢 Key numbers and dates
  - 📊 Word count

- **Auto-update**: Notes refresh automatically every 30 seconds (customizable)
- **Manual update**: Click "Update Notes" anytime
- Click 📋 to copy notes to clipboard

### Session History

- All recordings are automatically saved
- Click any previous session to view its transcript and notes
- Up to 20 most recent sessions are stored
- Click 🗑️ to clear history

### Controls

- **Clear All**: Reset current transcription and notes
- **Auto-update toggle**: Enable/disable automatic note updates
- **Update interval**: Set how often notes refresh (10-300 seconds)

## 🛠️ Technical Details

### Technologies Used

- **Web Audio API**: For audio recording
- **Web Speech API**: For speech-to-text transcription
- **LocalStorage**: For session persistence
- **Vanilla JavaScript**: No dependencies required
- **Modern CSS**: Responsive design with CSS Grid

### Browser Compatibility

| Feature | Chrome | Edge | Firefox | Safari |
|---------|--------|------|---------|--------|
| Recording | ✅ | ✅ | ✅ | ✅ |
| Transcription | ✅ | ✅ | ⚠️ Limited | ⚠️ Limited |

**Note**: Speech recognition works best in Chrome and Edge. Firefox and Safari have limited support for the Web Speech API.

### Data Privacy

- **100% Local**: All data is stored in your browser's LocalStorage
- **No Server**: No data is sent to any server
- **No Account Required**: No sign-up or login needed
- **Offline Capable**: Works offline once loaded (except speech recognition needs internet)

## 💡 Use Cases

- **Meeting Notes**: Record meetings and get instant summaries
- **Brainstorming**: Capture ideas and automatically organize them
- **Interviews**: Transcribe interviews with automatic question detection
- **Lectures**: Record lectures and extract key points
- **Voice Journaling**: Daily voice journals with searchable transcripts
- **Task Planning**: Speak your tasks and get them organized
- **Content Creation**: Draft blog posts, scripts, or articles by speaking

## 🎯 Tips for Best Results

1. **Speak Clearly**: Enunciate for better transcription accuracy
2. **Pause Between Ideas**: Helps with sentence detection and note organization
3. **Use Action Words**: Say "need to", "should", "must" for action item detection
4. **Ask Questions**: End questions with "?" for automatic question extraction
5. **Mention Numbers**: Dates, times, and numbers are automatically highlighted
6. **Regular Updates**: Keep auto-update on for continuous note refinement

## 📝 Customization

### Adjust Update Interval

Change the auto-update interval (10-300 seconds) based on your needs:
- **10-30s**: Fast-paced meetings or brainstorming
- **30-60s**: Normal conversations (default: 30s)
- **60-300s**: Long-form content or lectures

### Language Support

To change the transcription language, modify `app.js`:

```javascript
this.recognition.lang = 'en-US'; // Change to your language code
```

Supported languages include: `en-US`, `en-GB`, `es-ES`, `fr-FR`, `de-DE`, etc.

## 🐛 Troubleshooting

### Microphone Not Working

- Check browser permissions (camera icon in address bar)
- Ensure microphone is not used by another application
- Try refreshing the page

### Transcription Not Appearing

- Check internet connection (speech recognition requires internet)
- Use Chrome or Edge for best results
- Speak louder or closer to the microphone

### History Not Saving

- Check if LocalStorage is enabled
- Browser may be in private/incognito mode
- LocalStorage may be full (try clearing history)

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## 🔮 Future Enhancements

Potential features for future versions:
- Export to PDF/Markdown
- Custom AI note templates
- Multiple language support in UI
- Audio file upload for transcription
- Speaker diarization
- Search across all sessions
- Cloud sync option
- Integration with note-taking apps

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Enjoy productive voice recording! 🎤✨**
