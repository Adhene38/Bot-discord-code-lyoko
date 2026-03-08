const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("💎 Bannir un membre du serveur")
    .addUserOption((option) =>
      option
        .setName("membre")
        .setDescription("Le membre à bannir")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("raison")
        .setDescription("Raison du ban")
        .setRequired(false)
    )
    .addIntegerOption((option) =>
      option
        .setName("supprimer_messages")
        .setDescription("Supprimer les messages des X derniers jours (0-7)")
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
        content: "Hé, ce membre n'existe pas ! 😅💎",
        ephemeral: true,
      });
    }

    if (membre.id === interaction.user.id) {
      return interaction.reply({
        content: "ATTENDS !! 😱 Tu peux pas te bannir toi-même !! Les Crystal Gems protègent tout le monde, même toi ! 💖",
        ephemeral: true,
      });
    }

    if (membre.id === client.user.id) {
      return interaction.reply({
        content: "Tu… tu veux me bannir MOI ?! 😭💎 Après tout ce qu'on a vécu ensemble !!",
        ephemeral: true,
      });
    }

    if (!membre.bannable) {
      return interaction.reply({
        content: "Oups… je peux pas bannir cette personne, elle a trop de pouvoir ! 😅✨ Demande à un admin !",
        ephemeral: true,
      });
    }

    try {
      // Envoyer un DM avant le ban
      try {
        await membre.send(
          `💎 Tu as été banni du serveur.\n📝 Raison : ${raison}\n\nJ'espère qu'on se reverra un jour, Gem… 💛`
        );
      } catch {}

      await membre.ban({
        reason: raison,
        deleteMessageDays: deleteMessageDays,
      });

      const embed = {
        color: 0xe74c3c,
        title: "💎 Crystal Gems — Bannissement",
        description: `**${membre.user.tag}** a été banni du serveur… C'était nécessaire pour protéger la communauté 💛`,
        fields: [
          { name: "👤 Membre", value: `${membre.user.tag}`, inline: true },
          { name: "🛡️ Modérateur", value: `<@${interaction.user.id}>`, inline: true },
          { name: "🗑️ Messages supprimés", value: `${deleteMessageDays} jour(s)`, inline: true },
          { name: "📝 Raison", value: raison },
        ],
        footer: { text: "Steven Universe Bot 💎✨" },
        timestamp: new Date().toISOString(),
      };

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "Oups ! Ma gemme a glitché 😅💎 J'ai pas pu bannir ce membre…",
        ephemeral: true,
      });
    }
  },
};
