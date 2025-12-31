// Voice Recorder with AI-Powered Transcription and Notes
class VoiceRecorder {
    constructor() {
        this.isRecording = false;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.recognition = null;
        this.transcript = '';
        this.startTime = null;
        this.timerInterval = null;
        this.autoUpdateInterval = null;
        this.currentSessionStart = null;
        this.aiConfig = this.loadConfig();

        this.initializeElements();
        this.initializeSpeechRecognition();
        this.setupEventListeners();
        this.loadHistory();
        this.loadSavedConfig();
    }

    initializeElements() {
        this.elements = {
            // Config elements
            toggleConfig: document.getElementById('toggleConfig'),
            configContent: document.getElementById('configContent'),
            aiProvider: document.getElementById('aiProvider'),
            apiKey: document.getElementById('apiKey'),
            toggleApiKey: document.getElementById('toggleApiKey'),
            modelName: document.getElementById('modelName'),
            localUrl: document.getElementById('localUrl'),
            saveConfig: document.getElementById('saveConfig'),
            testApi: document.getElementById('testApi'),
            configStatus: document.getElementById('configStatus'),
            modelOption: document.getElementById('modelOption'),
            localUrlOption: document.getElementById('localUrlOption'),

            // Recording elements
            startBtn: document.getElementById('startBtn'),
            stopBtn: document.getElementById('stopBtn'),
            clearBtn: document.getElementById('clearBtn'),
            timer: document.getElementById('timer'),
            recordingStatus: document.getElementById('recordingStatus'),
            statusIndicator: document.querySelector('.status-indicator'),
            statusText: document.querySelector('.status-text'),
            transcription: document.getElementById('transcription'),
            notes: document.getElementById('notes'),
            history: document.getElementById('history'),
            copyTranscript: document.getElementById('copyTranscript'),
            copyNotes: document.getElementById('copyNotes'),
            updateNotes: document.getElementById('updateNotes'),
            autoUpdate: document.getElementById('autoUpdate'),
            updateInterval: document.getElementById('updateInterval'),
            clearHistory: document.getElementById('clearHistory')
        };
    }

    loadConfig() {
        const stored = localStorage.getItem('aiConfig');
        return stored ? JSON.parse(stored) : {
            provider: 'openai',
            apiKey: '',
            model: 'gpt-4o-mini',
            localUrl: 'http://localhost:11434/api/generate'
        };
    }

    saveConfig() {
        localStorage.setItem('aiConfig', JSON.stringify(this.aiConfig));
    }

    loadSavedConfig() {
        this.elements.aiProvider.value = this.aiConfig.provider;
        this.elements.apiKey.value = this.aiConfig.apiKey;
        this.elements.modelName.value = this.aiConfig.model;
        this.elements.localUrl.value = this.aiConfig.localUrl;
        this.updateProviderUI();
    }

    initializeSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            this.showError('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }

            if (finalTranscript) {
                this.transcript += finalTranscript;
                this.updateTranscription(finalTranscript, interimTranscript);
            } else {
                this.updateTranscription('', interimTranscript);
            }
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'no-speech') {
                if (this.isRecording) {
                    this.recognition.start();
                }
            }
        };

        this.recognition.onend = () => {
            if (this.isRecording) {
                try {
                    this.recognition.start();
                } catch (e) {
                    console.error('Error restarting recognition:', e);
                }
            }
        };
    }

    setupEventListeners() {
        // Config listeners
        this.elements.toggleConfig.addEventListener('click', () => this.toggleConfig());
        this.elements.saveConfig.addEventListener('click', () => this.saveConfiguration());
        this.elements.testApi.addEventListener('click', () => this.testApiConnection());
        this.elements.toggleApiKey.addEventListener('click', () => this.toggleApiKeyVisibility());
        this.elements.aiProvider.addEventListener('change', () => this.updateProviderUI());

        // Recording listeners
        this.elements.startBtn.addEventListener('click', () => this.startRecording());
        this.elements.stopBtn.addEventListener('click', () => this.stopRecording());
        this.elements.clearBtn.addEventListener('click', () => this.clearAll());
        this.elements.copyTranscript.addEventListener('click', () => this.copyToClipboard(this.transcript, 'Transcript'));
        this.elements.copyNotes.addEventListener('click', () => this.copyToClipboard(this.elements.notes.innerText, 'Notes'));
        this.elements.updateNotes.addEventListener('click', () => this.updateNotes());
        this.elements.clearHistory.addEventListener('click', () => this.clearHistory());

        this.elements.autoUpdate.addEventListener('change', () => {
            if (this.elements.autoUpdate.checked && this.isRecording) {
                this.startAutoUpdate();
            } else {
                this.stopAutoUpdate();
            }
        });

        this.elements.updateInterval.addEventListener('change', () => {
            if (this.elements.autoUpdate.checked && this.isRecording) {
                this.stopAutoUpdate();
                this.startAutoUpdate();
            }
        });
    }

    toggleConfig() {
        this.elements.configContent.classList.toggle('expanded');
        this.elements.toggleConfig.textContent =
            this.elements.configContent.classList.contains('expanded') ? '🔼' : '🔽';
    }

    updateProviderUI() {
        const provider = this.elements.aiProvider.value;

        // Update model options based on provider
        if (provider === 'openai') {
            this.elements.modelName.innerHTML = `
                <option value="gpt-4o">GPT-4o (Recommended)</option>
                <option value="gpt-4o-mini">GPT-4o Mini (Faster/Cheaper)</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Budget)</option>
            `;
            this.elements.modelOption.style.display = 'flex';
            this.elements.localUrlOption.style.display = 'none';
        } else if (provider === 'anthropic') {
            this.elements.modelName.innerHTML = `
                <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet (Recommended)</option>
                <option value="claude-3-5-haiku-20241022">Claude 3.5 Haiku (Faster)</option>
                <option value="claude-3-opus-20240229">Claude 3 Opus (Most Capable)</option>
            `;
            this.elements.modelOption.style.display = 'flex';
            this.elements.localUrlOption.style.display = 'none';
        } else if (provider === 'openrouter') {
            this.elements.modelName.innerHTML = `
                <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</option>
                <option value="openai/gpt-4o">GPT-4o</option>
                <option value="google/gemini-pro-1.5">Gemini Pro 1.5</option>
                <option value="meta-llama/llama-3.1-70b-instruct">Llama 3.1 70B</option>
            `;
            this.elements.modelOption.style.display = 'flex';
            this.elements.localUrlOption.style.display = 'none';
        } else if (provider === 'local') {
            this.elements.modelOption.style.display = 'none';
            this.elements.localUrlOption.style.display = 'flex';
        }
    }

    toggleApiKeyVisibility() {
        const type = this.elements.apiKey.type;
        this.elements.apiKey.type = type === 'password' ? 'text' : 'password';
        this.elements.toggleApiKey.textContent = type === 'password' ? '🙈' : '👁️';
    }

    saveConfiguration() {
        this.aiConfig = {
            provider: this.elements.aiProvider.value,
            apiKey: this.elements.apiKey.value,
            model: this.elements.modelName.value,
            localUrl: this.elements.localUrl.value
        };
        this.saveConfig();
        this.showConfigStatus('Configuration saved!', 'success');
    }

    async testApiConnection() {
        const testBtn = this.elements.testApi;
        const originalText = testBtn.innerHTML;
        testBtn.innerHTML = '<span class="loading-spinner"></span> Testing...';
        testBtn.disabled = true;

        try {
            const result = await this.callAI('Say "API connection successful!" if you can read this.');
            if (result) {
                this.showConfigStatus('✓ API connection successful!', 'success');
            } else {
                this.showConfigStatus('✗ API test failed', 'error');
            }
        } catch (error) {
            this.showConfigStatus(`✗ Error: ${error.message}`, 'error');
        } finally {
            testBtn.innerHTML = originalText;
            testBtn.disabled = false;
        }
    }

    showConfigStatus(message, type) {
        this.elements.configStatus.textContent = message;
        this.elements.configStatus.className = `config-status ${type}`;
        setTimeout(() => {
            this.elements.configStatus.textContent = '';
            this.elements.configStatus.className = 'config-status';
        }, 5000);
    }

    async callAI(prompt) {
        const config = this.aiConfig;

        if (!config.apiKey && config.provider !== 'local') {
            throw new Error('Please configure your API key first');
        }

        switch (config.provider) {
            case 'openai':
                return await this.callOpenAI(prompt);
            case 'anthropic':
                return await this.callAnthropic(prompt);
            case 'openrouter':
                return await this.callOpenRouter(prompt);
            case 'local':
                return await this.callLocal(prompt);
            default:
                throw new Error('Unknown AI provider');
        }
    }

    async callOpenAI(prompt) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.aiConfig.apiKey}`
            },
            body: JSON.stringify({
                model: this.aiConfig.model,
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert note-taker. Create clear, well-structured notes from transcripts.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'OpenAI API request failed');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    async callAnthropic(prompt) {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.aiConfig.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: this.aiConfig.model,
                max_tokens: 4096,
                messages: [
                    {
                        role: 'user',
                        content: `You are an expert note-taker. Create clear, well-structured notes from transcripts.\n\n${prompt}`
                    }
                ]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Anthropic API request failed');
        }

        const data = await response.json();
        return data.content[0].text;
    }

    async callOpenRouter(prompt) {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.aiConfig.apiKey}`,
                'HTTP-Referer': window.location.href,
                'X-Title': 'Listen & Think'
            },
            body: JSON.stringify({
                model: this.aiConfig.model,
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert note-taker. Create clear, well-structured notes from transcripts.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'OpenRouter API request failed');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    async callLocal(prompt) {
        const response = await fetch(this.aiConfig.localUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama2', // Default model, user should configure
                prompt: `You are an expert note-taker. Create clear, well-structured notes from transcripts.\n\n${prompt}`,
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error('Local API request failed');
        }

        const data = await response.json();
        return data.response;
    }

    async startRecording() {
        // Check if AI is configured
        if (!this.aiConfig.apiKey && this.aiConfig.provider !== 'local') {
            if (confirm('AI is not configured. Notes will be basic text extraction. Configure AI in settings?')) {
                this.toggleConfig();
            }
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];
            this.transcript = '';
            this.currentSessionStart = new Date();

            this.mediaRecorder.ondataavailable = (event) => {
                this.audioChunks.push(event.data);
            };

            this.mediaRecorder.onstop = () => {
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                stream.getTracks().forEach(track => track.stop());
            };

            this.mediaRecorder.start();
            this.recognition.start();

            this.isRecording = true;
            this.updateUI();
            this.startTimer();

            if (this.elements.autoUpdate.checked) {
                this.startAutoUpdate();
            }

            this.elements.transcription.innerHTML = '<p class="placeholder">Listening...</p>';
            this.elements.notes.innerHTML = '<p class="placeholder">AI-generated notes will appear as you speak...</p>';

        } catch (error) {
            console.error('Error starting recording:', error);
            this.showError('Could not access microphone. Please grant permission and try again.');
        }
    }

    stopRecording() {
        if (!this.isRecording) return;

        this.isRecording = false;

        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
        }

        if (this.recognition) {
            this.recognition.stop();
        }

        this.stopTimer();
        this.stopAutoUpdate();
        this.updateUI();

        if (this.transcript.trim()) {
            this.updateNotes();
            this.saveToHistory();
        }
    }

    updateTranscription(finalText, interimText) {
        const transcriptionDiv = this.elements.transcription;

        const interim = transcriptionDiv.querySelector('.interim');
        if (interim) {
            interim.remove();
        }

        if (finalText.trim()) {
            const p = document.createElement('p');
            p.textContent = finalText.trim();
            transcriptionDiv.appendChild(p);

            const placeholder = transcriptionDiv.querySelector('.placeholder');
            if (placeholder) {
                placeholder.remove();
            }
        }

        if (interimText.trim()) {
            const interimP = document.createElement('p');
            interimP.className = 'interim';
            interimP.textContent = interimText.trim();
            transcriptionDiv.appendChild(interimP);
        }

        transcriptionDiv.scrollTop = transcriptionDiv.scrollHeight;
        this.elements.updateNotes.disabled = false;
    }

    async updateNotes() {
        if (!this.transcript.trim()) return;

        const notesDiv = this.elements.notes;
        const updateBtn = this.elements.updateNotes;
        const originalText = updateBtn.innerHTML;

        updateBtn.innerHTML = '<span class="loading-spinner"></span> Generating...';
        updateBtn.disabled = true;

        try {
            const notes = await this.generateAINotes(this.transcript);
            notesDiv.innerHTML = notes;
        } catch (error) {
            console.error('Error generating notes:', error);
            notesDiv.innerHTML = `<p class="placeholder" style="color: var(--danger);">Error generating AI notes: ${error.message}<br><br>Using basic extraction instead...</p>`;
            // Fallback to basic extraction
            const basicNotes = this.generateBasicNotes(this.transcript);
            notesDiv.innerHTML += basicNotes;
        } finally {
            updateBtn.innerHTML = originalText;
            updateBtn.disabled = false;
        }
    }

    async generateAINotes(transcript) {
        const prompt = `Analyze the following voice transcript and create comprehensive, well-structured notes. Your response should be in HTML format and include:

1. **Executive Summary**: A 2-3 sentence overview rewritten in clear, grammatically correct language
2. **Key Points**: Main ideas and insights (not just extracted sentences - rephrase for clarity)
3. **Action Items**: Specific tasks, to-dos, or next steps mentioned
4. **Important Details**: Numbers, dates, names, or other critical information
5. **Questions & Decisions**: Any questions raised or decisions made

Format your response with proper HTML using:
- <h3> for section headers
- <p> for paragraphs
- <ul> and <li> for lists
- <strong> for emphasis
- Use clear, professional language
- Fix any grammar or speech-to-text errors
- Be concise but comprehensive

Transcript:
${transcript}`;

        const aiResponse = await this.callAI(prompt);

        return `<div class="generated-notes">${aiResponse}</div>`;
    }

    generateBasicNotes(transcript) {
        if (!transcript.trim()) {
            return '<p class="placeholder">Notes will be generated as you speak...</p>';
        }

        const sentences = transcript.match(/[^.!?]+[.!?]+/g) || [transcript];
        const keyPoints = [];
        const actionItems = [];
        const questions = [];
        const numbers = [];

        sentences.forEach(sentence => {
            const trimmed = sentence.trim();

            if (trimmed.includes('?')) {
                questions.push(trimmed);
            }

            const actionVerbs = ['need to', 'should', 'must', 'have to', 'going to', 'will', 'want to', 'plan to'];
            if (actionVerbs.some(verb => trimmed.toLowerCase().includes(verb))) {
                actionItems.push(trimmed);
            }

            const numberMatch = trimmed.match(/\b\d+[.,]?\d*\b|\b(january|february|march|april|may|june|july|august|september|october|november|december)\b|\b\d{1,2}:\d{2}\b/gi);
            if (numberMatch) {
                numbers.push({ text: trimmed, numbers: numberMatch });
            }
        });

        const importantSentences = sentences
            .filter(s => s.trim().split(' ').length > 5)
            .slice(-10);

        let notesHTML = '<div class="generated-notes">';

        notesHTML += '<h3>📋 Key Points</h3><ul>';
        importantSentences.forEach(sentence => {
            notesHTML += `<li>${sentence.trim()}</li>`;
        });
        notesHTML += '</ul>';

        if (actionItems.length > 0) {
            notesHTML += '<h3>✅ Action Items</h3><ul>';
            actionItems.forEach(item => {
                notesHTML += `<li>${item}</li>`;
            });
            notesHTML += '</ul>';
        }

        if (questions.length > 0) {
            notesHTML += '<h3>❓ Questions</h3><ul>';
            questions.forEach(q => {
                notesHTML += `<li>${q}</li>`;
            });
            notesHTML += '</ul>';
        }

        const wordCount = transcript.trim().split(/\s+/).length;
        notesHTML += `<p style="margin-top: 20px; color: var(--text-secondary); font-size: 0.9rem;">📊 Word count: ${wordCount}</p>`;
        notesHTML += '</div>';

        return notesHTML;
    }

    startTimer() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            const elapsed = Date.now() - this.startTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            this.elements.timer.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    startAutoUpdate() {
        const interval = parseInt(this.elements.updateInterval.value) * 1000;
        this.autoUpdateInterval = setInterval(() => {
            if (this.transcript.trim()) {
                this.updateNotes();
            }
        }, interval);
    }

    stopAutoUpdate() {
        if (this.autoUpdateInterval) {
            clearInterval(this.autoUpdateInterval);
            this.autoUpdateInterval = null;
        }
    }

    updateUI() {
        if (this.isRecording) {
            this.elements.startBtn.disabled = true;
            this.elements.stopBtn.disabled = false;
            this.elements.statusIndicator.classList.add('recording');
            this.elements.statusText.textContent = 'Recording...';
            this.elements.timer.classList.add('recording');
        } else {
            this.elements.startBtn.disabled = false;
            this.elements.stopBtn.disabled = true;
            this.elements.statusIndicator.classList.remove('recording');
            this.elements.statusText.textContent = 'Ready to record';
            this.elements.timer.classList.remove('recording');
        }
    }

    clearAll() {
        if (confirm('Clear current transcription and notes?')) {
            this.transcript = '';
            this.elements.transcription.innerHTML = '<p class="placeholder">Your transcription will appear here as you speak...</p>';
            this.elements.notes.innerHTML = '<p class="placeholder">AI-generated notes and key points will appear here...</p>';
            this.elements.timer.textContent = '00:00';
            this.elements.updateNotes.disabled = true;
        }
    }

    saveToHistory() {
        const sessions = this.getHistorySessions();

        const session = {
            id: Date.now(),
            timestamp: this.currentSessionStart,
            duration: this.elements.timer.textContent,
            transcript: this.transcript,
            notes: this.elements.notes.innerHTML
        };

        sessions.unshift(session);

        if (sessions.length > 20) {
            sessions.splice(20);
        }

        localStorage.setItem('voiceRecorderHistory', JSON.stringify(sessions));
        this.loadHistory();
    }

    getHistorySessions() {
        const stored = localStorage.getItem('voiceRecorderHistory');
        return stored ? JSON.parse(stored) : [];
    }

    loadHistory() {
        const sessions = this.getHistorySessions();

        if (sessions.length === 0) {
            this.elements.history.innerHTML = '<p class="placeholder">Previous recordings will appear here...</p>';
            return;
        }

        this.elements.history.innerHTML = '';

        sessions.forEach(session => {
            const item = document.createElement('div');
            item.className = 'history-item';

            const date = new Date(session.timestamp);
            const preview = session.transcript.substring(0, 100) + (session.transcript.length > 100 ? '...' : '');

            item.innerHTML = `
                <div class="history-item-header">
                    <span>${date.toLocaleString()}</span>
                    <span>Duration: ${session.duration}</span>
                </div>
                <div class="history-item-preview">${preview}</div>
            `;

            item.addEventListener('click', () => {
                this.transcript = session.transcript;
                this.elements.transcription.innerHTML = `<p>${session.transcript}</p>`;
                this.elements.notes.innerHTML = session.notes;
                this.elements.updateNotes.disabled = false;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            this.elements.history.appendChild(item);
        });
    }

    clearHistory() {
        if (confirm('Clear all session history? This cannot be undone.')) {
            localStorage.removeItem('voiceRecorderHistory');
            this.loadHistory();
        }
    }

    async copyToClipboard(text, label) {
        try {
            // Strip HTML tags for plain text copy
            const plainText = text.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
            await navigator.clipboard.writeText(plainText);
            alert(`${label} copied to clipboard!`);
        } catch (error) {
            console.error('Failed to copy:', error);
            alert('Failed to copy to clipboard');
        }
    }

    showError(message) {
        alert(message);
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new VoiceRecorder();
});
