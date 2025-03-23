document.addEventListener("DOMContentLoaded", function () {
    setupChat(
        document.getElementById("chat-box"),
        document.getElementById("user-input"),
        document.getElementById("send-btn"),
        document.getElementById("new-chat-btn")
    );

    const fullscreenBtn = document.getElementById("fullscreen-btn");
    const minimizeBtn = document.getElementById("minimize-btn");

    if (fullscreenBtn) {
        fullscreenBtn.addEventListener("click", () => {
            chrome.tabs.create({
                url: chrome.runtime.getURL("fullscreen.html")
            });
        });
    }

    if (minimizeBtn) {
        minimizeBtn.addEventListener("click", () => {
            window.close(); // Closes the popup window
        });
    }
});

