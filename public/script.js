const urlForm = document.getElementById("urlForm");
const urlInput = document.getElementById("url");
const message = document.getElementById("message");
const result = document.getElementById("result");
const shortUrl = document.getElementById("shortUrl");
const copyButton = document.getElementById("copyButton");
const openLink = document.getElementById("openLink");

urlForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const originalUrl = urlInput.value.trim();

    message.textContent = "";
    result.style.display = "none";

    if (!originalUrl) {
        message.textContent = "Please enter a URL";
        return;
    }

    try {
        const response = await fetch("/api/shorten", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                originalUrl
            })
        });

        const data = await response.json();

        if (!response.ok) {
            message.textContent = data.message;
            return;
        }

        shortUrl.value = data.shortUrl;
        openLink.href = data.shortUrl;

        result.style.display = "block";
        message.textContent = "URL shortened successfully";

        urlForm.reset();

    } catch (error) {
        message.textContent = "Could not connect to server";
    }
});

copyButton.addEventListener("click", async function() {
    await navigator.clipboard.writeText(shortUrl.value);

    copyButton.textContent = "Copied";

    setTimeout(function() {
        copyButton.textContent = "Copy";
    }, 1500);
});