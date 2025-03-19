document.addEventListener("DOMContentLoaded", function () {
    console.log("Popup loaded!");

    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");
    const newChatBtn = document.getElementById("new-chat-btn");

   
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
        chatBox.innerHTML = ""; // Clear the chat box
        chrome.storage.local.set({ "chatHistory": [] }); // Reset chat history in storage
    });

    function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        appendMessage("You", message);
        userInput.value = "";

        console.log("Sending request to server:", message);

        fetch("http://192.168.1.90:8000/chatbot", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        })
            .then(response => response.json())
            .then(data => {
                console.log("Received response:", data);
                appendMessage("Mr. White", data.response);

                // Save chat history
                chrome.storage.local.get("chatHistory", function (storedData) {
                    let chatHistory = storedData.chatHistory || [];
                    chatHistory.push({ sender: "You", message });
                    chatHistory.push({ sender: "Mr. White", message: data.response });
                    chrome.storage.local.set({ "chatHistory": chatHistory });
                });
            })
            .catch(error => {
                console.error("Error:", error);
                appendMessage("Mr. White", "Error: Unable to connect to server");
            });
    }

    function appendMessage(sender, message) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});