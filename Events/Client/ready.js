module.exports = {
	name: "ready",
	once: true,
	execute(client) {
		console.log(`[READY] ${client.user.tag} est prêt à contrer XANA ! 💻⚡`);
		client.user.setActivity("Aide Mon Createur (Adhene)");
	}
}
