const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("virtualisation")
    .setDescription("💻 Lancer la procédure de transfert vers Lyoko"),

  async execute(interaction, client) {
    // Liste des territoires pour varier les plaisirs
    const territoires = ["le Territoire de la Montagne", "le Territoire de la Banquise", "le Territoire de la Forêt", "le Territoire du Désert", "le Cinquième Territoire"];
    const destination = territoires[Math.floor(Math.random() * territoires.length)];

    const embed = new EmbedBuilder()
      .setColor(client.color || "#FFCC00")
      .setTitle("⚡ TRANSFERT... SCANNER... VIRTUALISATION !")
      .setDescription(`Jérémie : *"Transfert activé. Tout le monde est en cabine ? Direction ${destination} !"*`)
      .setImage("https://media1.tenor.com/m/e71bQ_iZBLQAAAAd/code-lyoko.gif") // Ton lien
      .setFooter({ text: "Supercalculateur — Terminal de contrôle" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
