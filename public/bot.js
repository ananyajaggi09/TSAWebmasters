function toggleChat() {
    const chat = document.getElementById('tsa-chat');
    if (chat.style.display === 'none' || chat.style.display === '') {
        chat.style.display = 'flex';
    } else {
        chat.style.display = 'none';
    }
}

function sendMessage() {
    const input = document.getElementById('user-input');
    const text = input.value.trim().toLowerCase();
    if (text === "") return;

    addMessage(input.value, 'user-msg');
    input.value = "";

    setTimeout(() => {
        let reply = "I'm not sure about that. Try asking about 'volunteering', 'Internship', or 'competition'.";

        if (text.includes("chapter") || text.includes("tsa") || text.includes("competition")) {
            reply = "Check the TSA Info page for more details!";
        } else if (text.includes("add event") || text.includes("my event")){
            reply = "To add your event, check out the Resource Improvement Form at the bottom of the 'Home Page'!";
        } else if (text.includes("sugar land") || text.includes("sltx")) {
            reply = "Welcome to Sugar Land! SLTX Connect is all about connecting you to Sugar Land's best spots! How can I help you today?";
        } else if (text.includes("park") || text.includes("leisure") || text.includes("internships") || text.includes("internship") || text.includes("food") || text.includes("restaurants") text.includes("restaurant") || text.includes("teens") || text.includes("children") || text.includes("seniors") || text.includes("adults")) {
            reply = "Check out the 'Leisure' page for the best spots in town.";
        } else if (text.includes("volunteering") || text.includes("events") || text.includes("service") || text.includes("support") || text.includes("donations") || text.includes("non-profit")) {
            reply = "Check out the 'Directory' page to find out more about this.";
        } else if (text.includes("hi") || text.includes("hello")) {
            reply = "Hello! Welcome to SLTX Connect. How can I help you navigate our community site?";
        } 

        addMessage(reply, 'bot-msg');
    }, 600);
}

function addMessage(text, className) {
    const msgDiv = document.createElement('div');
    msgDiv.className = className;
    msgDiv.innerText = text;
    const container = document.getElementById('chat-messages');
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
}