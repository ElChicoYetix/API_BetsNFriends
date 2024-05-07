// public/chat.js
const socket = io('/');

let userName = '';

const getUserName = () => {
    userName = localStorage.getItem('username');
    if (userName) {
        document.getElementById('user').innerText = userName;
        localStorage.setItem('username', userName);
    } else {
        console.log("What's your name then?", userName);
        window.location.href = '';
    }
}

const initSocketEventListeners = () => {
    socket.emit('newUser', {
        user: userName,
        chat: window.location.href.split('/').pop() // Chat id
    });
    
    socket.on('newUser', (data) => {
        sendNewUserMessage(data.user);
    });
    
    socket.on('newMessage', (data) => {
        sendNewMessage(data);
    });
    
    socket.on('userLeft', (data) => {
        sendUserLeftMessage(data.user);
    });
}

const sendNewUserMessage = (name) => {
    const p = document.createElement('p');
    p.className = 'new-user';
    p.innerText = `${name} joined the chat`;
    document.getElementById('messages').append(p);
}

const sendUserLeftMessage = (name) => {
    const p = document.createElement('p');
    p.className = 'user-left';
    p.innerText = `${name} left the chat`;
    document.getElementById('messages').append(p);
}

const sendNewMessage = (data, mine) => {
    const p = document.createElement('p');
    let name = data.user;
    if (mine) {
        p.className = 'message mine';
        name = 'You';
    } else {
        p.className = 'message';
    }

    p.innerHTML = `<span>${name}</span><p>${data.message}</p>`;
    p.id = new Date().getTime();
    document.getElementById('messages').append(p);  
    document.getElementById(p.id).scrollIntoView();
}

// Se crean dos manejadores separados para cada botón
// public/chat.js
const initMessageForm = () => {
    const form = document.querySelector('form');
    
    form.querySelector('.bet-button').addEventListener('click', (event) => {
        event.preventDefault();
        const input = form.querySelector('input[type="text"]');
        const teamSelect = form.querySelector('select[name="team"]');
        const betSelect = form.querySelector('select[name="bet"]');
        
        const message = input.value || ""; // Permitir apuestas sin mensaje
        const team = teamSelect.value;
        const bet = betSelect.value;

        const completeMessage = `${message} -.bet ${team} $${bet} dls.-`;

        // Emitir evento 'newBetMessage' para indicar que es una apuesta
        socket.emit('newBetMessage', {
            user: userName,
            message: completeMessage
        });

        sendNewMessage({ message: completeMessage, user: userName }, true);

        input.value = ''; // Limpia el campo de texto
    });

    // Para el botón de chat (sin cambios)
    form.querySelector('.chat-button').addEventListener('click', (event) => {
        event.preventDefault();
        const input = form.querySelector('input[type="text"]');

        const message = input.value;
        if (!message) return;

        sendNewMessage({ message, user: userName }, true);

        socket.emit('newMessage', {
            user: userName,
            message
        });

        input.value = ''; // Limpia el campo después de enviar el mensaje
    });
};

// Inicialización
(() => {
    getUserName();
    initSocketEventListeners();
    initMessageForm();
    sendNewUserMessage('You'); 

    window.onbeforeunload = () => {
        return 'Are you sure you want to leave?';
    };
})();
