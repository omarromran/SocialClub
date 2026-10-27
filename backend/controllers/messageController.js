const prisma = require('../config/prisma');

function parseId(value) {
  try {
    const id = BigInt(value);
    return id > 0n ? id : null;
  } catch {
    return null;
  }
}

function formatUser(user) {
  if (!user) return null;
  return {
    id: Number(user.id),
    username: user.username,
    display_name: user.displayName || user.username,
    profile_photo_url: user.profilePhotoUrl || null,
    bio: user.bio || '',
  };
}

function formatMessage(msg, currentUserId) {
  return {
    id: Number(msg.id),
    sender_id: Number(msg.senderId),
    recipient_id: Number(msg.recipientId),
    content: msg.content,
    is_read: Boolean(msg.isRead),
    created_at: msg.createdAt,
    is_mine: msg.senderId === currentUserId,
  };
}

async function getConversations(req, res) {
  const currentUserId = BigInt(req.user.id);

  const messages = await prisma.directMessage.findMany({
    where: {
      OR: [
        { senderId: currentUserId },
        { recipientId: currentUserId },
      ],
    },
    orderBy: { createdAt: 'desc' },
    take: 500,
    include: {
      sender: {
        select: { id: true, username: true, displayName: true, profilePhotoUrl: true, bio: true },
      },
      recipient: {
        select: { id: true, username: true, displayName: true, profilePhotoUrl: true, bio: true },
      },
    },
  });

  const conversationMap = new Map();

  for (const msg of messages) {
    const isSender = msg.senderId === currentUserId;
    const partner = isSender ? msg.recipient : msg.sender;
    const partnerId = Number(partner.id);

    if (!conversationMap.has(partnerId)) {
      conversationMap.set(partnerId, {
        user: formatUser(partner),
        last_message: {
          id: Number(msg.id),
          content: msg.content,
          created_at: msg.createdAt,
          is_mine: isSender,
          is_read: msg.isRead,
        },
        unread_count: 0,
      });
    }

    if (!isSender && !msg.isRead) {
      const conv = conversationMap.get(partnerId);
      conv.unread_count += 1;
    }
  }

  res.json({ conversations: Array.from(conversationMap.values()) });
}

async function getMessages(req, res) {
  const partnerId = parseId(req.params.userId);
  if (!partnerId) {
    return res.status(400).json({ error: 'Invalid user ID.' });
  }

  const currentUserId = BigInt(req.user.id);
  if (partnerId === currentUserId) {
    return res.status(400).json({ error: 'Cannot open a conversation with yourself.' });
  }

  const partner = await prisma.user.findUnique({
    where: { id: partnerId },
    select: { id: true, username: true, displayName: true, profilePhotoUrl: true, bio: true },
  });

  if (!partner) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const messages = await prisma.directMessage.findMany({
    where: {
      OR: [
        { senderId: currentUserId, recipientId: partnerId },
        { senderId: partnerId, recipientId: currentUserId },
      ],
    },
    orderBy: { createdAt: 'asc' },
  });

  // Mark unread messages sent to current user as read
  await prisma.directMessage.updateMany({
    where: {
      senderId: partnerId,
      recipientId: currentUserId,
      isRead: false,
    },
    data: { isRead: true },
  });

  res.json({
    user: formatUser(partner),
    messages: messages.map((m) => formatMessage(m, currentUserId)),
  });
}

async function sendMessage(req, res) {
  const recipientId = parseId(req.body.recipientId);
  if (!recipientId) {
    return res.status(400).json({ error: 'Valid recipient is required.' });
  }

  const text = typeof req.body.content === 'string' ? req.body.content.trim() : '';
  if (!text) {
    return res.status(400).json({ error: 'Message cannot be empty.' });
  }
  if (text.length > 2000) {
    return res.status(400).json({ error: 'Message must be 2,000 characters or fewer.' });
  }

  const currentUserId = BigInt(req.user.id);
  if (recipientId === currentUserId) {
    return res.status(400).json({ error: 'You cannot send a message to yourself.' });
  }

  const recipient = await prisma.user.findUnique({
    where: { id: recipientId },
    select: { id: true, username: true, displayName: true, profilePhotoUrl: true, bio: true },
  });

  if (!recipient) {
    return res.status(404).json({ error: 'Recipient not found.' });
  }

  const message = await prisma.directMessage.create({
    data: {
      senderId: currentUserId,
      recipientId,
      content: text,
    },
  });

  res.status(201).json({
    message: formatMessage(message, currentUserId),
    recipient: formatUser(recipient),
  });
}

async function searchUsers(req, res) {
  const q = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase() : '';
  if (q.length > 80) return res.status(400).json({ error: 'Search text must be 80 characters or fewer.' });
  const currentUserId = BigInt(req.user.id);

  let users = [];

  if (q) {
    users = await prisma.user.findMany({
      where: {
        id: { not: currentUserId },
        OR: [
          { username: { contains: q, mode: 'insensitive' } },
          { displayName: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: 20,
      select: { id: true, username: true, displayName: true, profilePhotoUrl: true, bio: true },
      orderBy: { username: 'asc' },
    });
  } else {
    // Return users the current user is following or recent users
    const followingRows = await prisma.follow.findMany({
      where: { followerId: currentUserId },
      take: 15,
      select: {
        following: {
          select: { id: true, username: true, displayName: true, profilePhotoUrl: true, bio: true },
        },
      },
    });

    users = followingRows.map((row) => row.following);

    if (users.length === 0) {
      users = await prisma.user.findMany({
        where: { id: { not: currentUserId } },
        take: 10,
        select: { id: true, username: true, displayName: true, profilePhotoUrl: true, bio: true },
        orderBy: { createdAt: 'desc' },
      });
    }
  }

  res.json({ users: users.map(formatUser) });
}

async function getUserByUsername(req, res) {
  const username = typeof req.params.username === 'string' ? req.params.username.trim().toLowerCase() : '';
  if (!username) {
    return res.status(400).json({ error: 'Username is required.' });
  }
  if (!/^[a-z0-9_]{3,30}$/.test(username)) {
    return res.status(400).json({ error: 'Invalid username.' });
  }

  const currentUserId = BigInt(req.user.id);
  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true, username: true, displayName: true, profilePhotoUrl: true, bio: true },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  if (user.id === currentUserId) {
    return res.status(400).json({ error: 'Cannot message yourself.' });
  }

  res.json({ user: formatUser(user) });
}

async function getUnreadCount(req, res) {
  const count = await prisma.directMessage.count({
    where: {
      recipientId: BigInt(req.user.id),
      isRead: false,
    },
  });

  res.json({ unread_count: count });
}

module.exports = {
  getConversations,
  getMessages,
  sendMessage,
  searchUsers,
  getUserByUsername,
  getUnreadCount,
};
