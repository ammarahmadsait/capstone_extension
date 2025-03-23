document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");
    const newChatBtn = document.getElementById("new-chat-btn"); // Button to reset chat

    // Load chat history when popup opens
    chrome.storage.local.get("chatHistory", function (data) {
        if (data.chatHistory) {
            data.chatHistory.forEach(({ sender, message }) => appendMessage(sender, message));
        }
    });

    sendBtn.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    newChatBtn.addEventListener("click", function () {
        chatBox.innerHTML = ""; // Clear UI chat
        chrome.storage.local.set({ "chatHistory": [] }); // Reset stored chat
    });

    function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        appendMessage("You", message);
        saveChatHistory("You", message);
        userInput.value = "";

        fetch("http://192.168.1.90:8000/chatbot", {  // Ensure VM IP is correct
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        })
            .then(response => response.json())
            .then(data => {
                appendMessage("Mr. White", data.response);
                saveChatHistory("Mr. White", data.response);
            })
            .catch(error => appendMessage("Mr. White", "Error: Unable to connect to server"));
    }

    function appendMessage(sender, message) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function saveChatHistory(sender, message) {
        chrome.storage.local.get("chatHistory", function (data) {
            let chatHistory = data.chatHistory || [];
            chatHistory.push({ sender, message });

            // Limit history to last 100 messages
            if (chatHistory.length > 100) {
                chatHistory.shift();
            }

            chrome.storage.local.set({ "chatHistory": chatHistory });
        });
    }

    document.getElementById("fullscreen-btn").addEventListener("click", () => {
        chrome.tabs.create({ url: chrome.runtime.getURL("fullscreen.html") });
    });

    document.getElementById("minimize-btn").addEventListener("click", () => {
        window.close(); // closes the popup
    });

});

