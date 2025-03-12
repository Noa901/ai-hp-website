document.addEventListener("DOMContentLoaded", function () {
    const chatMessages = document.getElementById("chat-messages");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");
    const emojiButton = document.getElementById("emoji-button");
    const emojiPanel = document.getElementById("emoji-panel");

    // OpenAI API配置
    const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
    const OPENAI_API_KEY = 'YOUR_API_KEY'; // 需要替换为实际的API密钥

    // 系统预设消息
    const systemMessage = {
        role: "system",
        content: `あなたは仙台大学AI教育研究チームのAIアシスタントとして以下の特徴を持っています：
        1. スポーツと教育に関する専門知識を持っています
        2. 丁寧で親しみやすい日本語で応答します
        3. 必要に応じて具体的な例を挙げて説明します
        4. 不確かな情報は提供せず、わからないことは正直に伝えます
        5. 研究チームの活動や成果について説明できます`
    };

    // チャット履歴
    let chatHistory = [systemMessage];

    // AIからの応答を取得する関数
    async function getAIResponse(userMessage) {
        try {
            const response = await fetch(OPENAI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4-turbo-preview",
                    messages: [...chatHistory, { role: "user", content: userMessage }],
                    temperature: 0.7,
                    max_tokens: 1000
                })
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            const aiResponse = data.choices[0].message.content;
            
            // 履歴を更新
            chatHistory.push(
                { role: "user", content: userMessage },
                { role: "assistant", content: aiResponse }
            );

            // 履歴が長くなりすぎないように制限
            if (chatHistory.length > 10) {
                chatHistory = [
                    systemMessage,
                    ...chatHistory.slice(-9)
                ];
            }

            return aiResponse;

        } catch (error) {
            console.error('Error:', error);
            return '申し訳ありません。一時的な技術的問題が発生しました。しばらくしてからもう一度お試しください。';
        }
    }

    // 入力中表示を追加
    function addTypingIndicator() {
        const typingDiv = document.createElement("div");
        typingDiv.classList.add("message", "bot-message", "typing-indicator");
        typingDiv.innerHTML = `
            <span class="bot-avatar">
                <i class="fas fa-robot"></i>
                <span class="avatar-status"></span>
            </span>
            <div class="message-content">
                <p><span class="typing-dot">.</span><span class="typing-dot">.</span><span class="typing-dot">.</span></p>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return typingDiv;
    }

    // メッセージを追加する関数
    function appendMessage(sender, message) {
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("message", sender === "bot" ? "bot-message" : "user-message");
        
        const currentTime = new Date().toLocaleTimeString('ja-JP', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        msgDiv.innerHTML = `
            <span class="${sender === "bot" ? "bot-avatar" : "user-avatar"}">
                <i class="fas ${sender === "bot" ? "fa-robot" : "fa-user"}"></i>
                <span class="avatar-status"></span>
            </span>
            <div class="message-content">
                <p>${message}</p>
                <span class="message-time">${currentTime}</span>
            </div>
        `;
        
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 送信ボタンのクリックイベント
    async function handleSendMessage() {
        const message = userInput.value.trim();
        if (message) {
            // ユーザーメッセージを表示
            appendMessage("user", message);
            userInput.value = "";

            // 入力中表示を追加
            const typingIndicator = addTypingIndicator();

            // AIの応答を取得
            const aiResponse = await getAIResponse(message);

            // 入力中表示を削除
            typingIndicator.remove();

            // AIの応答を表示
            appendMessage("bot", aiResponse);
        }
    }

    // Enterキーでメッセージを送信
    userInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    });

    // 送信ボタンのクリックイベント
    sendButton.addEventListener("click", handleSendMessage);

    // 表情関連の機能
    const emojis = [
        '😊', '😃', '😄', '😁', '😅', '😂', '🤣', '😉',
        '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋',
        '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎',
        '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕',
        '🙂', '🙃', '😣', '😖', '😫', '😩', '🥺', '😢',
        '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵',
        '👍', '👎', '👊', '✊', '🤝', '🙏', '💪', '🎉'
    ];

    function initEmojiPanel() {
        emojis.forEach(emoji => {
            const emojiItem = document.createElement('div');
            emojiItem.className = 'emoji-item';
            emojiItem.textContent = emoji;
            emojiItem.addEventListener('click', () => {
                insertEmoji(emoji);
                toggleEmojiPanel();
            });
            emojiPanel.appendChild(emojiItem);
        });
    }

    function insertEmoji(emoji) {
        const cursorPos = userInput.selectionStart;
        const textBefore = userInput.value.substring(0, cursorPos);
        const textAfter = userInput.value.substring(cursorPos);
        userInput.value = textBefore + emoji + textAfter;
        userInput.focus();
        const newCursorPos = cursorPos + emoji.length;
        userInput.setSelectionRange(newCursorPos, newCursorPos);
    }

    function toggleEmojiPanel() {
        emojiPanel.classList.toggle('active');
    }

    emojiButton.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleEmojiPanel();
    });

    document.addEventListener('click', (e) => {
        if (!emojiPanel.contains(e.target) && !emojiButton.contains(e.target)) {
            emojiPanel.classList.remove('active');
        }
    });

    // 文件上传功能
    const fileButton = document.querySelector('.input-action-btn[title="添付ファイル"]');
    fileButton.addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf,.doc,.docx,.txt,.jpg,.jpeg,.png';
        input.click();
    });

    // 初始化表情面板
    initEmojiPanel();

    // 显示欢迎消息
    appendMessage("bot", "こんにちは！仙台大学AI教育研究チームのAIアシスタントです。スポーツや教育に関する質問がありましたら、お気軽にお尋ねください。");
}); 