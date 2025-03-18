chrome.identity.getAuthToken({ interactive: true }, function (token) {
    if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
    } else {
        fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => response.json())
            .then(userInfo => {
                console.log("User Info:", userInfo);
                chrome.storage.sync.set({ user: userInfo });
            })
            .catch(error => console.error("Error fetching user info:", error));
    }
});
