# 🎙️ Listen & Think

A powerful voice recorder web application with **real-time transcription** and **AI-powered intelligent notes** for maximum productivity.

## ✨ Features

- **🎤 Voice Recording**: Record your voice directly in the browser
- **📝 Real-time Transcription**: Automatic verbatim transcription as you speak using Web Speech API
- **🤖 AI-Powered Notes**: Intelligent notes with actual insights, not just text extraction
  - Rephrases and corrects grammar from speech-to-text
  - Generates executive summaries
  - Extracts actionable items and key decisions
  - Identifies questions and important details
  - Professional, well-structured output
- **🔄 Auto-Update**: Notes automatically regenerate at customizable intervals
- **🔌 Multiple AI Providers**: Support for OpenAI, Anthropic (Claude), OpenRouter, and local LLMs
- **📚 Session History**: Save and revisit previous recordings with AI notes
- **📋 Copy to Clipboard**: Easy copying of transcripts and notes
- **🌙 Dark Theme**: Modern, easy-on-the-eyes interface
- **🔒 Privacy First**: All data stored locally in your browser, API keys never leave your machine

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome or Edge recommended for best speech recognition)
- Microphone access
- API key for your chosen AI provider (or local LLM setup)

### Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd listen_think
```

2. Start a local server:
```bash
python3 -m http.server 8000
# or
npm start
# or use any other local server
```

3. Open your browser and navigate to:
```
http://localhost:8000
```

4. Configure your AI provider (see AI Configuration below)
5. Grant microphone access when prompted

## 🤖 AI Configuration

The app supports multiple AI providers for generating intelligent notes:

### Option 1: OpenAI (Recommended for beginners)

1. Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. In the app, click "⚙️ AI Configuration"
3. Select "OpenAI (GPT-4/3.5)"
4. Enter your API key
5. Choose a model:
   - **GPT-4o** - Best quality (recommended)
   - **GPT-4o Mini** - Faster and cheaper
   - **GPT-3.5 Turbo** - Most affordable
6. Click "Save Configuration"
7. Click "Test API" to verify

**Cost**: ~$0.01-0.05 per recording session (depending on length and model)

### Option 2: Anthropic (Claude)

1. Get an API key from [Anthropic Console](https://console.anthropic.com/)
2. Select "Anthropic (Claude)" in AI Configuration
3. Enter your API key
4. Choose a model:
   - **Claude 3.5 Sonnet** - Best balance (recommended)
   - **Claude 3.5 Haiku** - Faster
   - **Claude 3 Opus** - Most capable
5. Save and test

**Cost**: ~$0.01-0.03 per recording session

### Option 3: OpenRouter (Access to multiple models)

1. Get an API key from [OpenRouter](https://openrouter.ai/keys)
2. Select "OpenRouter" in AI Configuration
3. Enter your API key
4. Choose from various models (Claude, GPT-4, Gemini, Llama, etc.)
5. Save and test

**Cost**: Varies by model, starting from ~$0.001 per session

### Option 4: Local LLM (Free, private, offline)

For complete privacy and zero API costs, run a local LLM:

1. **Install Ollama** (easiest):
   ```bash
   # macOS/Linux
   curl -fsSL https://ollama.ai/install.sh | sh

   # Pull a model
   ollama pull llama3.1
   ```

2. **Or install LM Studio**: Download from [lmstudio.ai](https://lmstudio.ai)

3. In the app:
   - Select "Local API (Ollama/LM Studio)"
   - Enter your local API URL (default: `http://localhost:11434/api/generate`)
   - Save and test

**Pros**: Free, private, works offline
**Cons**: Requires powerful hardware, slower than cloud APIs

## 📖 How to Use

### Initial Setup

1. Click **⚙️ AI Configuration** at the top
2. Configure your preferred AI provider
3. Test the connection
4. You're ready to record!

### Recording

1. Click **"Start Recording"** to begin
2. Speak naturally - transcription appears in real-time
3. Watch as AI generates intelligent notes automatically
4. Click **"Stop Recording"** when finished

### Transcription Panel (Left)

- Shows verbatim speech-to-text transcription
- Final text in regular font
- Interim results in italic (gray)
- Click 📋 to copy raw transcript

### Smart Notes Panel (Right)

**With AI configured**, you get:
- 📝 **Executive Summary**: Cleaned-up overview with corrected grammar
- 🎯 **Key Points**: Main ideas rephrased clearly
- ✅ **Action Items**: Tasks and to-dos extracted
- 💡 **Important Details**: Numbers, dates, names highlighted
- ❓ **Questions & Decisions**: Critical points identified

**Without AI**, falls back to basic text extraction (less intelligent)

### Controls

- **Update Notes**: Manually regenerate AI notes
- **Auto-update**: Toggle automatic note generation every X seconds
- **Update interval**: Set how often (10-300 seconds)
- **Clear All**: Reset current session
- **Copy**: Copy transcript or notes to clipboard

### Session History

- All recordings automatically saved with AI notes
- Click any session to reload it
- Up to 20 recent sessions stored locally
- Click 🗑️ to clear history

## 🛠️ Technical Details

### Technologies Used

- **Web Audio API**: Browser-based audio recording
- **Web Speech API**: Real-time speech-to-text
- **AI APIs**: OpenAI, Anthropic, OpenRouter, or local LLMs
- **LocalStorage**: Session persistence (100% local)
- **Vanilla JavaScript**: No dependencies, lightweight
- **Modern CSS**: Responsive dark theme

### Browser Compatibility

| Feature | Chrome | Edge | Firefox | Safari |
|---------|--------|------|---------|--------|
| Recording | ✅ | ✅ | ✅ | ✅ |
| Transcription | ✅ | ✅ | ⚠️ Limited | ⚠️ Limited |
| AI Notes | ✅ | ✅ | ✅ | ✅ |

**Note**: Speech recognition works best in Chrome and Edge.

### Data Privacy & Security

- **✅ 100% Local Data**: All transcripts and notes stored in browser LocalStorage
- **✅ No Server**: App runs entirely in your browser
- **✅ Secure API Keys**: Keys stored locally, never sent anywhere except chosen AI provider
- **✅ HTTPS Required**: AI APIs require HTTPS (use `localhost` or secure hosting)
- **✅ No Tracking**: Zero analytics or data collection
- **⚠️ API Provider Privacy**: When using cloud AI, transcripts are sent to the AI provider (OpenAI, Anthropic, etc.) for processing. Use local LLM for complete privacy.

## 💡 Use Cases

- **Meeting Notes**: Record meetings, get instant AI summaries and action items
- **Brainstorming**: Capture ideas, let AI organize and clarify them
- **Interviews**: Transcribe interviews with automatic question extraction
- **Lectures**: Record lectures, get structured notes automatically
- **Voice Journaling**: Daily journals with AI-enhanced insights
- **Task Planning**: Speak your tasks, get them organized by AI
- **Content Creation**: Draft blog posts, scripts, or articles by speaking
- **Research**: Capture thoughts during research, AI organizes key findings

## 🎯 Tips for Best Results

### For Better Transcription
1. **Speak Clearly**: Enunciate for accurate speech-to-text
2. **Reduce Background Noise**: Use a quiet environment
3. **Good Microphone**: Better mic = better transcription
4. **Natural Pace**: Don't speak too fast or too slow
5. **Chrome/Edge Browser**: Best speech recognition support

### For Better AI Notes
1. **Be Specific**: Mention specific tasks, dates, and names
2. **Natural Language**: Speak as you would write
3. **Clear Structure**: Separate different topics naturally
4. **Longer Sessions**: AI works better with more context (>100 words)
5. **Review & Regenerate**: Click "Update Notes" if first pass isn't perfect

## 🔧 Advanced Configuration

### Customizing AI Prompts

Want different note formats? Edit the `generateAINotes()` function in `app.js`:

```javascript
const prompt = `Analyze the following voice transcript and...
// Customize this prompt for your specific needs
`;
```

### Changing Language

To transcribe in a different language, modify `app.js`:

```javascript
this.recognition.lang = 'en-US'; // Change to your language code
// Examples: 'es-ES' (Spanish), 'fr-FR' (French), 'de-DE' (German)
```

### Local LLM Configuration

For Ollama, use different models:
```bash
ollama pull llama3.1:70b     # Larger, more capable
ollama pull mistral          # Fast, efficient
ollama pull codellama        # Better at structured output
```

Update the API endpoint in AI Configuration if using custom ports.

## 🐛 Troubleshooting

### Microphone Not Working
- Check browser permissions (camera icon in address bar)
- Ensure mic isn't used by another app
- Try refreshing the page
- Check system mic settings

### Transcription Not Appearing
- Verify internet connection (speech recognition needs internet)
- Use Chrome or Edge browser
- Check microphone is working
- Speak louder or closer to mic

### AI Notes Not Generating
- Verify API key is correct in configuration
- Click "Test API" to check connection
- Check browser console for errors (F12)
- Ensure you have API credits/quota remaining
- For local LLM: verify Ollama/LM Studio is running

### "API Key Not Configured" Error
- Click ⚙️ AI Configuration
- Enter your API key
- Click "Save Configuration"
- Click "Test API" to verify

### Slow Note Generation
- Switch to faster model (GPT-4o Mini, Claude Haiku)
- Reduce update interval for auto-updates
- Use local LLM for instant processing (with good hardware)

## 💰 Cost Estimates

Approximate costs per 30-minute recording session:

| Provider | Model | Cost | Quality |
|----------|-------|------|---------|
| OpenAI | GPT-4o | $0.03-0.05 | Excellent |
| OpenAI | GPT-4o Mini | $0.005-0.01 | Very Good |
| OpenAI | GPT-3.5 Turbo | $0.001-0.003 | Good |
| Anthropic | Claude 3.5 Sonnet | $0.02-0.04 | Excellent |
| Anthropic | Claude 3.5 Haiku | $0.005-0.01 | Very Good |
| OpenRouter | Varies | $0.001-0.05 | Varies |
| Local (Ollama) | Free | $0.00 | Good-Excellent |

*Costs depend on transcript length and note complexity*

## 📄 License

MIT License - Free for personal and commercial use

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs or issues
- Suggest new features
- Submit pull requests
- Improve documentation

## 🔮 Future Enhancements

Potential features for future versions:
- ✨ Custom AI prompt templates
- 📤 Export to PDF/Markdown/Notion
- 🗣️ Speaker diarization (multi-speaker detection)
- 🌍 Multi-language support in UI
- 🔍 Search across all sessions
- ☁️ Optional cloud sync
- 🎨 Customizable themes
- 📊 Analytics dashboard (word count trends, etc.)
- 🔗 Integration with productivity tools (Todoist, Trello, etc.)
- 🎙️ Upload audio files for transcription

## 📞 Support

Having issues? Check:
1. This README's Troubleshooting section
2. Browser console (F12) for error messages
3. GitHub Issues for similar problems

Found a bug? Please open an issue with:
- Browser and version
- Error message (if any)
- Steps to reproduce

---

**Built with ❤️ for productivity enthusiasts. Happy recording! 🎤✨**
