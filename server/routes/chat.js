const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// Get all conversations for the current user
router.get('/conversations', auth, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id
    })
    .populate('participants', 'name email profilePicture')
    .populate({
      path: 'messages',
      options: { sort: { timestamp: -1 }, limit: 1 }
    });

    const formattedConversations = conversations.map(conv => {
      const otherParticipant = conv.participants.find(p => p._id.toString() !== req.user.id);
      return {
        id: conv._id,
        user: {
          id: otherParticipant._id,
          name: otherParticipant.name,
          initials: otherParticipant.name.split(' ').map(n => n[0]).join(''),
          online: false, // This should be implemented with WebSocket
          lastSeen: '2m ago' // This should be implemented with WebSocket
        },
        messages: conv.messages.map(msg => ({
          id: msg._id,
          senderId: msg.sender.toString(),
          content: msg.content,
          timestamp: msg.timestamp,
          status: msg.status
        }))
      };
    });

    res.json(formattedConversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new conversation
router.post('/conversations', auth, async (req, res) => {
  try {
    const { participantId } = req.body;

    // Check if conversation already exists
    const existingConversation = await Conversation.findOne({
      participants: { $all: [req.user.id, participantId] }
    });

    if (existingConversation) {
      return res.json(existingConversation);
    }

    const conversation = new Conversation({
      participants: [req.user.id, participantId],
      messages: []
    });

    await conversation.save();
    res.json(conversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get messages for a conversation
router.get('/conversations/:conversationId/messages', auth, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId)
      .populate('messages');

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Check if user is a participant
    if (!conversation.participants.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const messages = conversation.messages.map(msg => ({
      id: msg._id,
      senderId: msg.sender.toString(),
      content: msg.content,
      timestamp: msg.timestamp,
      status: msg.status
    }));

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send a message
router.post('/messages', auth, async (req, res) => {
  try {
    const { conversationId, content } = req.body;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Check if user is a participant
    if (!conversation.participants.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const message = new Message({
      conversation: conversationId,
      sender: req.user.id,
      content,
      timestamp: new Date(),
      status: 'sent'
    });

    await message.save();
    conversation.messages.push(message._id);
    await conversation.save();

    // Emit message to other participant (WebSocket implementation needed)
    // io.to(conversationId).emit('newMessage', message);

    res.json({
      id: message._id,
      senderId: message.sender.toString(),
      content: message.content,
      timestamp: message.timestamp,
      status: message.status
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update message status (read/delivered)
router.patch('/messages/:messageId/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user is a participant in the conversation
    const conversation = await Conversation.findById(message.conversation);
    if (!conversation.participants.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    message.status = status;
    await message.save();

    res.json(message);
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 