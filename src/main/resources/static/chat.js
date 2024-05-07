let stompClient = null;

function connect() {
    const socket = new SockJS('/chat-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, onConnected, onError);
}

function onConnected() {
    stompClient.subscribe('/topic/public', onMessageReceived);
}

function onMessageReceived(payload) {
    const message = JSON.parse(payload.body);
    const chatMessages = document.getElementById('chat-messages');

    // Verificar si el mensaje tiene contenido antes de crear el elemento
    if (message.content) {
        const messageElement = document.createElement('div');
        messageElement.textContent = `${message.sender}: ${message.content}`;
        chatMessages.appendChild(messageElement);
    }
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
            const chatMessage = { sender: username, content: message };
            /*stompClient.send("/app/chat.addUser", {}, JSON.stringify(chatMessage));*/
            stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
            messageInput.value = '';
        }
    });
});