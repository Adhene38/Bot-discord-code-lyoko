const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("💻 Dévirtualiser (bannir) un membre du réseau")
    .addUserOption((option) =>
      option
        .setName("membre")
        .setDescription("Le membre à dévirtualiser")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("raison")
        .setDescription("Raison de la dévirtualisation")
        .setRequired(false)
    )
    .addIntegerOption((option) =>
      option
        .setName("supprimer_messages")
        .setDescription("Supprimer les archives des X derniers jours (0-7)")
        .setMinValue(0)
        .setMaxValue(7)
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction, client) {
    const membre = interaction.options.getMember("membre");
    const raison =
      interaction.options.getString("raison") || "Aucune raison fournie";
    const deleteMessageDays =
      interaction.options.getInteger("supprimer_messages") || 0;

    if (!membre) {
      return interaction.reply({
        content: "Erreur de scanner : ce membre n'est pas détecté dans le secteur ! 💻⚡",
        ephemeral: true,
      });
    }

    if (membre.id === interaction.user.id) {
      return interaction.reply({
        content: "Procédure impossible !! 😱 Tu ne peux pas te dévirtualiser toi-même ! On a besoin de toi sur Lyoko ! ⚡",
        ephemeral: true,
      });
    }

    if (membre.id === client.user.id) {
      return interaction.reply({
        content: "Tu veux éteindre le Supercalculateur ?! 😭 Sans moi, plus personne ne pourra contrer XANA !!",
        ephemeral: true,
      });
    }

    if (!membre.bannable) {
      return interaction.reply({
        content: "Accès refusé… ce membre possède un pare-feu trop puissant ! 😅💻 Demande à un administrateur du système !",
        ephemeral: true,
      });
    }

    try {
      // Envoyer un DM avant le ban
      try {
        await membre.send(
          `⚡ Ton accès au Supercalculateur a été révoqué.\n📝 Raison : ${raison}\n\nFin du transfert, liaison rompue… 💻`
        );
      } catch {}

      await membre.ban({
        reason: raison,
        deleteMessageDays: deleteMessage
