// Voice Recorder with Transcription and Notes
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

        this.initializeElements();
        this.initializeSpeechRecognition();
        this.setupEventListeners();
        this.loadHistory();
    }

    initializeElements() {
        this.elements = {
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

    initializeSpeechRecognition() {
        // Check if browser supports Web Speech API
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
                // Restart recognition if no speech detected
                if (this.isRecording) {
                    this.recognition.start();
                }
            }
        };

        this.recognition.onend = () => {
            // Restart recognition if still recording
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

    async startRecording() {
        try {
            // Request microphone access
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
                // Could save the audio blob if needed
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
            this.elements.notes.innerHTML = '<p class="placeholder">Notes will be generated as you speak...</p>';

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

        // Final notes update
        if (this.transcript.trim()) {
            this.updateNotes();
            this.saveToHistory();
        }
    }

    updateTranscription(finalText, interimText) {
        const transcriptionDiv = this.elements.transcription;

        // Remove previous interim results
        const interim = transcriptionDiv.querySelector('.interim');
        if (interim) {
            interim.remove();
        }

        // Add final text if any
        if (finalText.trim()) {
            const p = document.createElement('p');
            p.textContent = finalText.trim();
            transcriptionDiv.appendChild(p);

            // Remove placeholder if exists
            const placeholder = transcriptionDiv.querySelector('.placeholder');
            if (placeholder) {
                placeholder.remove();
            }
        }

        // Add interim text
        if (interimText.trim()) {
            const interimP = document.createElement('p');
            interimP.className = 'interim';
            interimP.textContent = interimText.trim();
            transcriptionDiv.appendChild(interimP);
        }

        // Auto-scroll to bottom
        transcriptionDiv.scrollTop = transcriptionDiv.scrollHeight;

        // Enable update notes button
        this.elements.updateNotes.disabled = false;
    }

    updateNotes() {
        if (!this.transcript.trim()) return;

        const notes = this.generateNotes(this.transcript);
        this.elements.notes.innerHTML = notes;
    }

    generateNotes(transcript) {
        if (!transcript.trim()) {
            return '<p class="placeholder">Notes will be generated as you speak...</p>';
        }

        // Split into sentences
        const sentences = transcript.match(/[^.!?]+[.!?]+/g) || [transcript];

        // Extract key information
        const keyPoints = [];
        const actionItems = [];
        const questions = [];
        const numbers = [];

        sentences.forEach(sentence => {
            const trimmed = sentence.trim();

            // Detect questions
            if (trimmed.includes('?')) {
                questions.push(trimmed);
            }

            // Detect action items (imperative sentences or containing action verbs)
            const actionVerbs = ['need to', 'should', 'must', 'have to', 'going to', 'will', 'want to', 'plan to', 'remember to', 'don\'t forget'];
            if (actionVerbs.some(verb => trimmed.toLowerCase().includes(verb))) {
                actionItems.push(trimmed);
            }

            // Extract numbers/dates/times
            const numberMatch = trimmed.match(/\b\d+[.,]?\d*\b|\b(january|february|march|april|may|june|july|august|september|october|november|december)\b|\b\d{1,2}:\d{2}\b/gi);
            if (numberMatch) {
                numbers.push({ text: trimmed, numbers: numberMatch });
            }
        });

        // Generate bullet points from longer sentences
        const importantSentences = sentences
            .filter(s => s.trim().split(' ').length > 5) // Longer sentences tend to be more informative
            .slice(-10); // Get last 10 important sentences

        // Build notes HTML
        let notesHTML = '<div class="generated-notes">';

        // Summary
        notesHTML += '<h3>📋 Summary</h3>';
        notesHTML += '<ul>';
        importantSentences.forEach(sentence => {
            notesHTML += `<li>${sentence.trim()}</li>`;
        });
        notesHTML += '</ul>';

        // Action Items
        if (actionItems.length > 0) {
            notesHTML += '<h3>✅ Action Items</h3>';
            notesHTML += '<ul>';
            actionItems.forEach(item => {
                notesHTML += `<li>${item}</li>`;
            });
            notesHTML += '</ul>';
        }

        // Questions Raised
        if (questions.length > 0) {
            notesHTML += '<h3>❓ Questions</h3>';
            notesHTML += '<ul>';
            questions.forEach(q => {
                notesHTML += `<li>${q}</li>`;
            });
            notesHTML += '</ul>';
        }

        // Numbers & Dates
        if (numbers.length > 0) {
            notesHTML += '<h3>🔢 Key Numbers/Dates</h3>';
            notesHTML += '<ul>';
            numbers.forEach(item => {
                notesHTML += `<li>${item.text} <span style="color: var(--primary);">[${item.numbers.join(', ')}]</span></li>`;
            });
            notesHTML += '</ul>';
        }

        // Word count
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

        sessions.unshift(session); // Add to beginning

        // Keep only last 20 sessions
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

                // Scroll to top
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
            await navigator.clipboard.writeText(text);
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
