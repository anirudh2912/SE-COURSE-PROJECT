const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent'
  },
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'file', 'link']
    },
    url: String,
    name: String,
    size: Number
  }]
});

// Create indexes for better query performance
messageSchema.index({ conversation: 1, timestamp: -1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ status: 1 });

module.exports = mongoose.model('Message', messageSchema); 