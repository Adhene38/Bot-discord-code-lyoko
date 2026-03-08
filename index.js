const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { Guilds, GuildMembers, GuildMessages, MessageContent } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const { loadEvents } = require("./Handlers/eventHandler");
const { loadCommands } = require("./Handlers/commandHandler");

const client = new Client({
	intents: [Guilds, GuildMembers, GuildMessages, MessageContent],
	partials: [User, Message, GuildMember, ThreadMember]
});

client.commands = new Collection();
client.config = require("./config.json");
client.color = "#FFCC00"; // Jaune interface Jérémie

process.env.GROQ_API_KEY = process.env.GROQ_API_KEY || client.config.groq.key;
const token = process.env.DISCORD_TOKEN || client.config.token;

client.login(token).then(() => {
    console.log("⚡ Transfert terminé : Jérémie est en ligne sur le Supercalculateur.");
	loadEvents(client);
	loadCommands(client);
}).catch((err) => console.log(err));
