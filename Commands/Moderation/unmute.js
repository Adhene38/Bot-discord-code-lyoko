const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("💻 Lever la quarantaine (unmute) d'un membre")
    .addUserOption((option) =>
      option
        .setName("membre")
        .setDescription("Le membre à réactiver")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("raison")
        .setDescription("Raison de la levée de quarantaine")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction, client) {
    const membre = interaction.options.getMember("membre");
    const raison =
      interaction.options.getString("raison") || "Aucune raison fournie";

    if (!membre) {
      return interaction.reply({
        content: "Erreur de scanner : Sujet introuvable dans la base de données ! 😅💻",
        ephemeral: true,
      });
    }

    if (!membre.isCommunicationDisabled()) {
      return interaction.reply({
        content: `Le protocole de communication de **${membre.user.tag}** est déjà opérationnel ! 💻✅`,
        ephemeral: true,
      });
    }

    try {
      await membre.timeout(null, raison);

      const embed = {
        color: 0x58d68d, // Vert pour le rétablissement du système
        title: "💻 Supercalculateur — Quarantaine Levée",
        description: `Transfert réussi !! **${membre.user.tag}** peut à nouveau communiquer sur le réseau !! 🎉⚡`,
        fields: [
          { name: "👤 Membre", value: `<@${membre.id}>`, inline: true },
          { name: "🛡️ Opérateur", value: `<@${interaction.user.id}>`, inline: true },
          { name: "📝 Rapport technique", value: raison },
        ],
        footer: { text: "Interface Jérémie Belpois — Code Lyoko" },
        timestamp: new Date().toISOString(),
      };

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "Erreur critique ! 😅💻 Le Supercalculateur a glitch
