const { Client, GatewayIntentBits, Partials, Collection, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('./db.js');


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User, Partials.GuildMember]
});

client.commands = new Collection();
client.snipes = new Collection();
client.joinTracker = new Map();
client.banTracker = new Map();

// Charger les commandes
const commandsPath = path.join(__dirname, 'commands');
const loadCommands = (dir) => {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
        const filePath = path.join(dir, file.name);
        if (file.isDirectory()) {
            loadCommands(filePath);
        } else if (file.name.endsWith('.js')) {
            const command = require(filePath);
            if (command.name) {
                client.commands.set(command.name, command);
            }
        }
    }
};
if (fs.existsSync(commandsPath)) {
    loadCommands(commandsPath);
}

// Ready Event
client.once('ready', () => {
    console.log(`[BOT ONLINE] Connecté en tant que ${client.user.tag}`);
    client.user.setActivity('+help | Bot Secur & Management');
});

// Message Event (Prefix handler + Blacklist check)
client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.guild) return;

    const prefix = process.env.PREFIX || '+';

    // Anti-everyone / Anti-here check
    const antiEveryone = await db.get(`antiraid_${message.guild.id}.antieveryone`);
    if (antiEveryone && (message.content.includes('@everyone') || message.content.includes('@here'))) {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            await message.delete().catch(() => {});
            if (antiEveryone === 'max') {
                await message.member.timeout(10 * 60 * 1000, 'Antieveryone activé').catch(() => {});
            }
            return;
        }
    }

    if (!message.content.startsWith(prefix)) return;

    // Check Blacklist globale
    const bl = (await db.get('blacklist')) || {};
    if (bl[message.author.id]) {
        return message.reply({ content: '❌ Tu es dans la blacklist du bot.' }).catch(() => {});
    }

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Support commande multi-mots (ex: "server pic", "end giveaway")
    let command = client.commands.get(commandName);

    if (!command) {
        // Tenter de matcher deux mots (ex: +server pic -> command "server pic")
        const twoWordCmd = `${commandName} ${args[0]}`.toLowerCase();
        if (client.commands.has(twoWordCmd)) {
            command = client.commands.get(twoWordCmd);
            args.shift();
        }
    }

    if (!command) return;

    try {
        await command.execute(message, args, client);
    } catch (error) {
        console.error(`Erreur lors de l'exécution de la commande ${commandName}:`, error);
        message.reply({ content: 'Une erreur est survenue.' }).catch(() => {});

    }
});

// Message Delete (Snipe & Messagelog)
client.on('messageDelete', async (message) => {
    if (!message.guild || message.author?.bot) return;

    // Snipe update
    client.snipes.set(message.channel.id, {
        content: message.content || '[Image/Embed]',
        author: message.author,
        image: message.attachments.first()?.url || null,
        date: Date.now()
    });

    // Messagelog
    const logChannelId = await db.get(`logs_${message.guild.id}.messagelog`);
    if (logChannelId) {
        const logChannel = message.guild.channels.cache.get(logChannelId);
        if (logChannel) {
            const embed = new EmbedBuilder()
                .setTitle('🗑️ Message Supprimé')
                .setColor('#ff4757')
                .addFields(
                    { name: 'Auteur', value: `${message.author} (\`${message.author.id}\`)`, inline: true },
                    { name: 'Salon', value: `${message.channel}`, inline: true },
                    { name: 'Contenu', value: message.content || '*Aucun texte*' }
                )
                .setTimestamp();
            logChannel.send({ embeds: [embed] }).catch(() => {});
        }
    }
});

// Member Add (Antibot, Antitoken, Raidlog)
client.on('guildMemberAdd', async (member) => {
    const guild = member.guild;

    // Check Blacklist
    const bl = (await db.get('blacklist')) || {};
    if (bl[member.id]) {
        await member.ban({ reason: `Blacklisted: ${bl[member.id].reason}` }).catch(() => {});
        return;
    }

    // Antibot
    const antibot = await db.get(`antiraid_${guild.id}.antibot`);
    if (member.user.bot && antibot) {
        await member.kick('Antibot Actif').catch(() => {});
        return;
    }

    // Antitoken
    const antitoken = await db.get(`antiraid_${guild.id}.antitoken`);
    if (antitoken === 'lock') {
        await member.kick('Serveur en mode verrouillé (Antitoken Lock)').catch(() => {});
        return;
    }

    if (antitoken && typeof antitoken === 'object') {
        const now = Date.now();
        const windowMs = (antitoken.duration || 10) * 1000;
        const limit = antitoken.limit || 5;

        if (!client.joinTracker.has(guild.id)) client.joinTracker.set(guild.id, []);
        const joins = client.joinTracker.get(guild.id).filter(t => now - t < windowMs);
        joins.push(now);
        client.joinTracker.set(guild.id, joins);

        if (joins.length >= limit) {
            await member.kick('Antitoken déclenché (Raid détecté)').catch(() => {});
            const raidLogId = await db.get(`antiraid_${guild.id}.raidlog`);
            if (raidLogId) {
                const logChan = guild.channels.cache.get(raidLogId);
                if (logChan) logChan.send(`⚠️ **RAID DÉTECTÉ** : Antitoken déclenché suite à une vague de rejoignements.`).catch(() => {});
            }
        }
    }
});

// Channel Protection (Antichannel)
client.on('channelCreate', async (channel) => {
    if (!channel.guild) return;
    const antichannel = await db.get(`antiraid_${channel.guild.id}.antichannel`);
    if (!antichannel) return;

    const audit = await channel.guild.fetchAuditLogs({ type: 10, limit: 1 }).catch(() => null);
    const entry = audit?.entries.first();
    if (entry && entry.executor.id !== client.user.id) {
        const owners = (await db.get('owners')) || [];
        if (!owners.includes(entry.executor.id) && entry.executor.id !== channel.guild.ownerId) {
            await channel.delete().catch(() => {});
            if (antichannel === 'max') {
                const member = await channel.guild.members.fetch(entry.executor.id).catch(() => null);
                if (member) await member.ban({ reason: 'Antichannel activé' }).catch(() => {});
            }
        }
    }
});

// Voice Log
client.on('voiceStateUpdate', async (oldState, newState) => {
    const guild = newState.guild || oldState.guild;
    const logChanId = await db.get(`logs_${guild.id}.voicelog`);
    if (!logChanId) return;
    const logChan = guild.channels.cache.get(logChanId);
    if (!logChan) return;

    if (!oldState.channelId && newState.channelId) {
        logChan.send(`🔊 **${newState.member.user.tag}** a rejoint le salon vocal <#${newState.channelId}>`).catch(() => {});
    } else if (oldState.channelId && !newState.channelId) {
        logChan.send(`🔇 **${oldState.member.user.tag}** a quitté le salon vocal <#${oldState.channelId}>`).catch(() => {});
    } else if (oldState.channelId !== newState.channelId) {
        logChan.send(`🔄 **${newState.member.user.tag}** a changé de salon vocal : <#${oldState.channelId}> ➔ <#${newState.channelId}>`).catch(() => {});
    }
});

client.login(process.env.DISCORD_TOKEN);
