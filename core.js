function setupChat(chatBox, userInput, sendBtn, newChatBtn) {
    // Load chat history
    chrome.storage.local.get("chatHistory", function (data) {
        if (data.chatHistory) {
            data.chatHistory.forEach(({ sender, message }) =>
                appendMessage(chatBox, sender, message)
            );
        }
    });

    sendBtn.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    newChatBtn.addEventListener("click", () => {
        chatBox.innerHTML = "";
        chrome.storage.local.set({ chatHistory: [] });
    });

    function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        appendMessage(chatBox, "You", message);
        saveChatHistory("You", message);
        userInput.value = "";

        // Show "thinking" message
        const thinkingStatus = document.getElementById("thinking-status");
        thinkingStatus.style.display = "block";
        thinkingStatus.textContent = "Mr. White is thinking...";

        // Disable input and buttons
        userInput.disabled = true;
        sendBtn.disabled = true;
        newChatBtn.disabled = true;

        fetch("http://192.168.1.90:8000/chatbot", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        })
            .then((response) => response.json())
            .then((data) => {
                appendMessage(chatBox, "Mr. White", data.response);
                saveChatHistory("Mr. White", data.response);
            })
            .catch(() => {
                appendMessage(chatBox, "Mr. White", "Error: Unable to connect to server");
            })
            .finally(() => {
                // Hide "thinking", re-enable input
                thinkingStatus.style.display = "none";
                userInput.disabled = false;
                sendBtn.disabled = false;
                newChatBtn.disabled = false;
                userInput.focus();
            });
    }

    function appendMessage(container, sender, message) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
        container.appendChild(messageElement);
        container.scrollTop = container.scrollHeight;
    }

    function saveChatHistory(sender, message) {
        chrome.storage.local.get("chatHistory", function (data) {
            let chatHistory = data.chatHistory || [];
            chatHistory.push({ sender, message });

            if (chatHistory.length > 100) {
                chatHistory.shift();
            }

            chrome.storage.local.set({ chatHistory });
        });
    }
}
