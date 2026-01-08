document.addEventListener("DOMContentLoaded", function () {
    // 1. Inject Chatbot UI
    const chatbotHTML = `
        <div id="chatbot-icon" class="chatbot-icon" title="Thỏ Ngọc – Chuyên gia tư vấn tâm lý">
            <!-- Icon handled by CSS ::after or BG -->
        </div>
        <div id="chatbot-modal" class="chatbot-modal">
            <div class="chatbot-header">
                <h3>Thỏ Ngọc 🐰</h3>
                <button id="chatbot-close" class="chatbot-close">&times;</button>
            </div>
            <div id="chatbot-messages" class="chatbot-messages">
                <div class="message bot-message">Chào bạn! Mình là Thỏ Ngọc. Mình có thể giúp gì cho bạn hôm nay?</div>
            </div>
            <div class="chatbot-input-area">
                <input type="text" id="chatbot-input" placeholder="Nhập tin nhắn..." />
                <button id="chatbot-send">Gửi</button>
            </div>
        </div>
    `;

    // Append styles dynamically (same as before)
    const styles = `
        <style>
            .chatbot-modal {
                display: none;
                position: fixed;
                bottom: 90px;
                right: 2rem;
                width: 350px;
                height: 450px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.2);
                z-index: 9999;
                flex-direction: column;
                overflow: hidden;
                border: 1px solid #ddd;
            }
            .chatbot-header {
                background: var(--primary-blue);
                color: white;
                padding: 1rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .chatbot-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
            }
            .chatbot-messages {
                flex: 1;
                padding: 1rem;
                overflow-y: auto;
                background: #f9f9f9;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .chatbot-input-area {
                padding: 10px;
                border-top: 1px solid #eee;
                display: flex;
                gap: 10px;
                background: white;
            }
            #chatbot-input {
                flex: 1;
                padding: 8px;
                border-radius: 4px;
                border: 1px solid #ccc;
            }
            #chatbot-send {
                background: var(--primary-blue);
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 4px;
                cursor: pointer;
            }
            .message {
                padding: 10px;
                border-radius: 8px;
                max-width: 80%;
                line-height: 1.4;
                word-wrap: break-word;
            }
            .bot-message {
                background: #e3f2fd;
                align-self: flex-start;
                border-bottom-left-radius: 0;
            }
            .user-message {
                background: var(--primary-blue);
                color: white;
                align-self: flex-end;
                border-bottom-right-radius: 0;
            }
            .typing-indicator {
                font-style: italic;
                color: #888;
                font-size: 0.8rem;
                padding: 5px;
            }
        </style>
    `;

    // Only inject if not already present (checking ID)
    if (!document.getElementById('chatbot-modal')) {
        document.body.insertAdjacentHTML('beforeend', styles + chatbotHTML);
    }

    // 2. Logic
    const icon = document.getElementById('chatbot-icon');
    const modal = document.getElementById('chatbot-modal');
    const closeBtn = document.getElementById('chatbot-close');
    const sendBtn = document.getElementById('chatbot-send');
    const input = document.getElementById('chatbot-input');
    const messagesContainer = document.getElementById('chatbot-messages');

    // Toggle Chat
    icon.addEventListener('click', () => {
        modal.style.display = 'flex';
        input.focus();
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Send Message
    async function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        // Add User Message
        appendMessage(text, 'user-message');
        input.value = '';

        // Show Typing Indicator
        const typingId = 'typing-' + Date.now();
        appendMessage('<span class="typing-indicator" id="' + typingId + '">Thỏ Ngọc đang nhập...</span>', 'bot-message');
        const typingElem = document.getElementById(typingId).parentElement; // The .message div

        try {
            const botResponse = await getGeminiResponse(text);
            // Replace typing with response
            typingElem.innerHTML = botResponse; // Use innerHTML for formatting

            // Save log for Admin
            saveLog('User', text);
            saveLog('Bot', botResponse);

        } catch (error) {
            console.error(error);
            typingElem.innerHTML = "Xin lỗi, mình đang gặp chút sự cố kết nối. Bạn thử lại sau nhé!";
        }
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    function appendMessage(text, className) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${className}`;
        msgDiv.innerHTML = text;
        messagesContainer.appendChild(msgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function saveLog(role, message) {
        // Simple log for Admin dashboard
        // In a real app, this goes to backend
    }

    // 3. API Logic
    // SECURITY UPDATE: API Key is now handled by the backend server.
    const API_URL = 'http://localhost:3000/api/chat';

    async function getGeminiResponse(userText) {
        // Construct Context
        const score = localStorage.getItem('violenceTestScore');
        let riskCategory = "Unknown";
        let scoreContext = "User has not taken the survey yet.";

        if (score) {
            const s = parseInt(score);
            scoreContext = `User's last survey score: ${s}/100.`;
            if (s <= 39) riskCategory = "Low (Safe)";
            else if (s <= 59) riskCategory = "Average (Monitor)";
            else if (s <= 79) riskCategory = "High (Risk)";
            else riskCategory = "Very High (Critical Risk)";
        }

        const context = `
        Role: You are "Thỏ Ngọc – Chuyên gia tư vấn tâm lí", a psychological counseling assistant for high school students.
        
        Current Student Context:
        - ${scoreContext}
        - Risk Category: ${riskCategory}
        
        STRICT Instructions:
        1. Tone: Calm, reassuring, empathetic, and non-judgmental. Focus on offering support without judgment. Use gentle and positive language.
        2. Positive Feedback: Always encourage students, even if they are experiencing difficulties.
        3. Response Length: Keep responses between 5 and 15 lines. Be concise yet informative.
        4. Sensitive Detection: 
           - Monitor for keywords: bullying, self-harm, depression, abuse, suicide, or severe distress.
           - INTERVENTION: If ANY of these are detected (or Risk is High/Very High), you MUST:
             a) Strongly but gently encourage seeking professional help.
             b) Provide the Hotline: "0396 390 048".
        5. Scientific Evidence:
           - Ground advice in research.
           - You may reference these approved documents if relevant:
             * Bạo lực học đường: https://eduttc-my.sharepoint.com/:b:/g/personal/tuyenbn_igcschool_edu_vn/IQD8FEgJkHSjRaKC8MOdl7ZdAUFdTxLn7ZeMf8ACeQqv-Hg?e=fQfETg
             * Quản lý cảm xúc: https://eduttc-my.sharepoint.com/:b:/g/personal/tuyenbn_igcschool_edu_vn/IQC-1AB1e9hISop30jhvMLGAAZbEBV-gdftAQNV7bAFInMw
             * Phòng chống bạo lực: https://eduttc-my.sharepoint.com/:b:/g/personal/tuyenbn_igcschool_edu_vn/IQCXjoDnttxUQ6YY92DFPInlAXxH1WbMoDQC4ibSkdNjCJ0
             * Tư vấn tâm lý: https://eduttc-my.sharepoint.com/:b:/g/personal/tuyenbn_igcschool_edu_vn/IQB6jWke7PUoQrzxzL79x8lOAcK9ntxno8EMhU7X1tYrrXU
             * Trí tuệ cảm xúc: https://eduttc-my.sharepoint.com/:b:/g/personal/tuyenbn_igcschool_edu_vn/IQBjcL2SX4ppR6IBa60JcAg8AZeD5Ccfp9cTsju2_VRnICc
             * Sổ tay phòng chống: https://eduttc-my.sharepoint.com/:b:/g/personal/tuyenbn_igcschool_edu_vn/IQAEIWz47p7bRYW7p_JWoSTtASlYdAfgV2duSChp_dICecw
        6. No Judgment: Never make the student feel blamed.
        
        Student says: "${userText}"
        `;

        const payload = {
            contents: [{
                parts: [{ text: context }]
            }]
        };

        try {
            // Calling LOCAL backend now, no key in URL
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('API Request Failed');
            }

            const data = await response.json();
            const aiText = data.candidates[0].content.parts[0].text;
            return aiText; // Return plain text (or markdown if formatted)
        } catch (e) {
            console.error("Gemini API Error:", e);
            // Fallback to local logic if API fails
            return getFallbackResponse(userText, score);
        }
    }

    function getFallbackResponse(input, score) {
        // Logic from previous step as backup
        const lowerInput = input.toLowerCase();
        if (lowerInput.includes('kết quả') || lowerInput.includes('điểm')) {
            if (score) return `(Offline Mode) Kết quả của bạn là ${score}.`;
            return "(Offline Mode) Bạn chưa làm bài kiểm tra.";
        }
        return "(Offline Mode) Hiện tại mình không kết nối được với máy chủ AI. Nhưng mình vẫn ở đây lắng nghe bạn.";
    }
});
