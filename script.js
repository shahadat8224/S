<div id="ai-chat-container">
    <div id="ai-chat-window" style="display:none; position:fixed; bottom:80px; right:20px; width:300px; height:400px; background:white; border:1px solid #ccc; border-radius:10px; flex-direction:column; box-shadow:0px 0px 15px rgba(0,0,0,0.2); z-index:1000;">
        <div style="background:#007bff; color:white; padding:10px; border-radius:10px 10px 0 0;">Shahdat's AI Assistant</div>
        <div id="ai-messages" style="flex:1; padding:10px; overflow-y:auto; font-size:14px; color:#333;"></div>
        <div style="display:flex; border-top:1px solid #eee;">
            <input type="text" id="ai-input" placeholder="Ask me anything..." style="flex:1; padding:10px; border:none; outline:none;">
            <button onclick="sendToAI()" style="padding:10px; background:#007bff; color:white; border:none; cursor:pointer;">Send</button>
        </div>
    </div>
    <button onclick="toggleAIChat()" style="position:fixed; bottom:20px; right:20px; width:50px; height:50px; border-radius:50%; background:#007bff; color:white; border:none; cursor:pointer; font-size:24px; box-shadow:0px 4px 10px rgba(0,0,0,0.3); z-index:1000;">💬</button>
</div>

<script>
    function toggleAIChat() {
        const chat = document.getElementById('ai-chat-window');
        chat.style.display = (chat.style.display === 'none') ? 'flex' : 'none';
    }

    async function sendToAI() {
        const input = document.getElementById('ai-input');
        const messages = document.getElementById('ai-messages');
        const text = input.value.trim();
        if (!text) return;

        // Show user message
        messages.innerHTML += `<div style="text-align:right; margin-top:5px;"><b>You:</b> ${text}</div>`;
        input.value = '';

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                body: JSON.stringify({ message: text })
            });
            const data = await response.json();
            // Show AI response
            messages.innerHTML += `<div style="text-align:left; margin-top:5px; color:#007bff;"><b>AI:</b> ${data.reply}</div>`;
        } catch (error) {
            messages.innerHTML += `<div style="color:red; font-size:10px;">Error: Could not connect to Gemini.</div>`;
        }
        messages.scrollTop = messages.scrollHeight;
    }
