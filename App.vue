<template>
  <div class="chat-app">
    <div class="chat-container">
      <div class="message-history" ref="messageContainer">
        <div 
          v-for="message in messages" 
          :key="message.id"
          :class="['message', { 'own-message': message.sender === username }]"
        >
          <div class="message-header">
            <span class="sender">{{ message.sender }}</span>
            <span class="timestamp">{{ formatTime(message.timestamp) }}</span>
          </div>
          <div class="message-content">{{ message.content }}</div>
        </div>
      </div>

      <div class="message-input">
        <input
          v-model="newMessage"
          @keyup.enter="sendMessage"
          placeholder="Type a message..."
          :disabled="!username"
        />
        <button @click="sendMessage" :disabled="!newMessage.trim() || !username">
          Send
        </button>
      </div>

      <div class="user-info">
        <input
          v-model="username"
          @change="saveUsername"
          placeholder="Enter your username"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { io } from 'socket.io-client';

export default {
  data() {
    return {
      socket: null,
      messages: [],
      newMessage: '',
      username: localStorage.getItem('chatUsername') || '',
      serverUrl: 'http://localhost:3000'
    };
  },
  mounted() {
    this.socket = io(this.serverUrl);

    this.socket.on('messageHistory', (history) => {
      this.messages = history;
      this.scrollToBottom();
    });

    this.socket.on('newMessage', (message) => {
      this.messages.push(message);
      this.scrollToBottom();
    });
  },
  methods: {
    sendMessage() {
      if (!this.newMessage.trim() || !this.username) return;

      this.socket.emit('sendMessage', {
        sender: this.username,
        content: this.newMessage.trim()
      });

      this.newMessage = '';
    },
    saveUsername() {
      localStorage.setItem('chatUsername', this.username);
    },
    formatTime(timestamp) {
      return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messageContainer;
        container.scrollTop = container.scrollHeight;
      });
    }
  },
  beforeUnmount() {
    if (this.socket) this.socket.disconnect();
  }
};
</script>

<style>
/* Responsive Chat Styles */
.chat-app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.message-history {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: #f9f9f9;
}

.message {
  margin-bottom: 12px;
  padding: 10px 14px;
  border-radius: 8px;
  background: #e3e3e3;
  max-width: 70%;
}

.own-message {
  margin-left: auto;
  background: #007bff;
  color: white;
}

.message-input {
  display: flex;
  padding: 12px;
  border-top: 1px solid #eee;
  background: white;
}

.message-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.message-input button {
  margin-left: 8px;
  padding: 10px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

@media (max-width: 600px) {
  .message {
    max-width: 85%;
  }
}
</style>
