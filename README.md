# Real-Time Chat Application

A responsive real-time chat application built with:
- **Frontend**: React.js (HTML/CSS/JavaScript)
- **Backend**: Node.js with Socket.io for WebSocket communication
- **Features**: Message history, responsive design, and user persistence

## Features

✅ Real-time messaging using WebSockets  
✅ Message history for new users  
✅ Responsive design (mobile & desktop)  
✅ Username persistence (localStorage)  
✅ Auto-scrolling to newest messages  

## Tech Stack

**Frontend**:
- React.js
- Socket.io-client
- CSS3 (Flexbox/Grid)

**Backend**:
- Node.js
- Express
- Socket.io
- CORS middleware

## Configuration

**Backend**:
Edit server/index.js to:

- Update Socket.io server URL if needed

  const serverUrl = 'http://your-server-ip:5000';

  ## Deployment

  **Option 1: Local Development:**

  - Run both servers as shown in Installation
 
  **Option 2: Deploy to Heroku/Vercel:**

  - Deploy backend to Heroku
  - Deploy frontend to Vercel/Netlify
  - Update frontend's server URL to point to deployed backend
 
  ## Troubleshooting

  **Common Issues:**

  - Connection errors:
 
    * Verify both servers are running
    * Check CORS settings in server/index.js
   
  - Styling issues:
 
    * Clear browser cache
    * Verify all CSS classes match in components
