const { ButtonStyle, ActionRowBuilder, ButtonBuilder, Interaction, APIEmbed } = require("discord.js");

class BinaryEmbed {
  /**
   * Represents an Embed with two possible states with a button to toggle between them.
   * @param {Interaction} interaction The interaction for which to use the embed for
   * @param {APIEmbed} defaultEmbedState The initial state of the embed (state 1)
   * @param {APIEmbed} otherEmbedState The other state of the embed (state 2)
   * @param {string} defaultButtonText The button label to switch to state 2
   * @param {string} otherButtonText The button label to switch to state 1
   */
  constructor(interaction, defaultEmbedState, otherEmbedState, defaultButtonText, otherButtonText) {
    this.interaction = interaction;
    this.defaultEmbedState = defaultEmbedState;
    this.otherEmbedState = otherEmbedState;
    this.defaultButtonText = defaultButtonText;
    this.otherButtonText = otherButtonText;
  }
  /**
   * Creates a message with the embed with a button to toggle between the states. Also handles the
   * state changes.
   */
  async init() {
    const changeEmbedStateButton = new ButtonBuilder()
      .setCustomId('swapEmbedState')
      .setStyle(ButtonStyle.Primary)
      .setLabel(this.defaultButtonText);
    const row = new ActionRowBuilder()
      .addComponents(changeEmbedStateButton);
    const response = await this.interaction.editReply({ embeds: [this.defaultEmbedState], components:[row] });
    const binaryCollector = async () => {
      const collectorFilter = i => i.user.id === this.interaction.user.id;
      try {
        const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 30_000 });
        if (confirmation.customId === 'swapEmbedState') {
          let defaultStateActive = response.components[0].components[0].label === this.defaultButtonText;
          const changeEmbedStateButton = new ButtonBuilder()
            .setCustomId('swapEmbedState')
            .setStyle(ButtonStyle.Primary)
            .setLabel(defaultStateActive ? this.otherButtonText : this.defaultButtonText);
          const row = new ActionRowBuilder()
            .addComponents(changeEmbedStateButton);
          await confirmation.update({ embeds: [defaultStateActive ? this.otherEmbedState : this.defaultEmbedState], components: [row] });
          await binaryCollector();
        }
      } catch (err) {
        if (err.message === "Collector received no interactions before ending with reason: time") { // collector timeout
          await this.interaction.editReply({ components: [] });
        } else {
          console.error(err);
        }
      }
    }
    binaryCollector();
  }
}

module.exports = {
  BinaryEmbed,
}