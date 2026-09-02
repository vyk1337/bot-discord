const db = require('../database/db.js');

async function isOwner(userId) {
    const owners = (await db.get('owners')) || [];
    return owners.includes(userId);
}

async function isBlacklisted(userId) {
    const bl = (await db.get('blacklist')) || {};
    return !!bl[userId];
}

module.exports = { isOwner, isBlacklisted };
