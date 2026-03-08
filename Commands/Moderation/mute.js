const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("💻 Mettre en quarantaine (mute) un membre sur le réseau")
    .addUserOption((option) =>
      option
        .setName("membre")
        .setDescription("Le membre à mettre en sourdine")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("duree")
        .setDescription("Durée (ex: 10m, 1h, 1d)")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("raison")
        .setDescription("Raison de la mise en quarantaine")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction, client) {
    const membre = interaction.options.getMember("membre");
    const dureeStr = interaction.options.getString("duree");
    const raison =
      interaction.options.getString("raison") || "Aucune raison fournie";

    // Vérifications
    if (!membre) {
      return interaction.reply({
        content: "Erreur de liaison : Ce membre est introuvable dans la base de données ! 💻⚡",
        ephemeral: true,
      });
    }

    if (membre.id === interaction.user.id) {
      return interaction.reply({
        content: "Négatif !! 😱 Tu ne peux pas couper ton propre micro sur le Supercalculateur ! On a besoin de tes rapports ! 💻",
        ephemeral: true,
      });
    }

    if (membre.id === client.user.id) {
      return interaction.reply({
        content: "Tu essaies de me réduire au silence ? Si je ne peux plus parler, qui va guider Aelita sur Lyoko ? 😤💻",
        ephemeral: true,
      });
    }

    if (!membre.moderatable) {
      return interaction.reply({
        content: "Oups… ce membre possède un protocole de cryptage trop élevé, je ne peux pas le muter ! 😅⚡",
        ephemeral: true,
      });
    }

    // Convertir la durée en millisecondes
    const dureeMs = parseDuration(dureeStr);
    if (!dureeMs) {
      return interaction.reply({
        content: "Paramètre temporel invalide 😅💻 Utilise : `10m`, `1h`, `1d` (maximum 28 jours !)",
        ephemeral: true,
      });
    }

    if (dureeMs > 28 * 24 * 60 * 60 * 1000) {
      return interaction.reply({
        content: "Attention !! 😱 Le Supercalculateur ne peut pas gérer une quarantaine de plus de 28 jours ! 💻",
        ephemeral: true,
      });
    }

    try {
      await membre.timeout(dureeMs, raison);

      const embed = {
        color: 0xffcc00, // Jaune interface Jérémie
        title: "💻 Supercalculateur — Mise en quarantaine",
        description: `L'accès vocal de **${membre.user.tag}** a été suspendu pour maintenance. 🛠️`,
        fields: [
          { name: "👤 Utilisateur", value: `<@${membre.id}>`, inline: true },
          { name: "⏱️ Durée", value: dureeStr, inline: true },
          { name: "🛡️ Opérateur", value: `<@${interaction.user.id}>`, inline: true },
