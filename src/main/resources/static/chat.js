let stompClient = null;

function connect() {
    const socket = new SockJS('/chat-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, onConnected, onError);
}

function onConnected() {
    const username = document.getElementById('username').value;
    stompClient.send("/app/chat.addUser", {}, JSON.stringify({ sender: username }));
    stompClient.subscribe('/topic/public', onMessageReceived);
}

function onMessageReceived(payload) {
    const message = JSON.parse(payload.body);
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.textContent = `${message.sender}: ${message.content}`;
    chatMessages.appendChild(messageElement);
}

function onError(error) {
    console.error(error);
}

document.addEventListener('DOMContentLoaded', () => {
    connect();

    const sendButton = document.getElementById('send-button');
    sendButton.addEventListener('click', () => {
        const username = document.getElementById('username').value;
        const messageInput = document.getElementById('message');
        const message = messageInput.value;
        if (message.trim() !== '') {
            stompClient.send("/app/chat.sendMessage", {}, JSON.stringify({ sender: username, content: message }));
            messageInput.value = '';
        }
    });
});