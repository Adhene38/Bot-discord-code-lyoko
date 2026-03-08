const { Client } = require("discord.js")

module.exports = {
	name: "ready",
	once: true,
	/**
	 * 
	 * @param {Client} client 
	 */
	execute(client) {
		console.log(`[READY] ${client.user.tag} est prêt à sauver Beach City ! 💎✨`)
		client.user.setActivity("avec les Crystal Gems 💎")
	}
}
