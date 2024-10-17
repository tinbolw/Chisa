const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

// 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

module.exports = {
  data: new SlashCommandBuilder()
    .setName("askgpt")
    .setDescription("ask chatgpt"),
  async execute(interaction) {
    const args = interaction.options._hoistedOptions;
    var options = {
      // truncate if over 256 char
      message: args[0].value,
    };
    async function streamResponse(type, stream, thread, threadObj) {
      var message;
      let embed = new EmbedBuilder()
        .setTitle(args[0].value)
        // .setFooter({text: response[3]})
        .setDescription(" ");
      if (type.constructor.name == "ChatInputCommandInteraction") {
        await type.editReply({ embeds: [embed] });
      } else {
        await type.edit({ embeds: [embed] });
      }
      stream.on("data", async (data) => {
        message = data;
        let answer = JSON.parse(message.toString("utf8"));
        let embed = new EmbedBuilder()
          .setTitle(args[0].value)
          // .setFooter({text: response[3]})
          .setDescription(answer.message == "" ? " " : answer.message);
        // TODO make this not random and so it makes edits regularly per second
        if (type.constructor.name == "ChatInputCommandInteraction" && (Math.random()>0.95)) {
          await type.editReply({ embeds: [embed] });
        } else if (type.constructor.name == "Message" && (Math.random()>0.95)) {
          await type.edit({ embeds: [embed] });
        }
      });
      stream.on("end", async () => {
        let answer = JSON.parse(message.toString("utf8"));
        // if (threadObj != undefined)
        //   threadObj.edit({ name: `Conversation ${answer.conversationId}` });
        let embed = new EmbedBuilder()
          .setTitle(args[0].value)
          .setFooter(
            thread == true
              ? { text: answer.parentMessageId }
              : { text: answer.time }
          )
          .setDescription(answer.message);
        if (type.constructor.name == "ChatInputCommandInteraction") {
          await type.editReply({ embeds: [embed] });
        } else if (type.constructor.name == "Message") {
          await type.edit({ embeds: [embed] });
        }
        // clearInterval(limiter);
      });
    }

    if (
      interaction.channel.type == 11 &&
      interaction.channel.name.includes("Conversation") != false
    ) {
      let parentMessageId = await interaction.channel.messages
        .fetch({ limit: 10 })
        .then((messages) => {
          let responses = messages.filter(
            (message) => message.author.id == 751631739276886066
          );
          responses = messages.filter(
            (message) => message.embeds[0]?.data?.footer?.text != undefined
          );
          let latest = responses.first();
          return latest.embeds[0].data.footer.text;
        });
      options = {
        message: args[0].value,
        parentMessageId: parentMessageId,
      };
    }

    
    const response = await axios.post("http://192.168.0.24:1337", options, {
      responseType: "stream",
    });
    const stream = response.data;
    // somehow get parentmessageid before starting thread
    // without needing to create a whole new stream listener
    // could bundle whole thread logic into streamresponse function
    if (args[1]?.value == true) {
      let reply = await interaction.editReply("New Thread:");
      await reply
        .startThread({
          name: "Conversation",
        })
        .then(async (thread) => {
          let embed = new EmbedBuilder()
            .setTitle(args[0].value)
            .setDescription(" ");
          let startingMessage = await thread.send({ embeds: [embed] });
          streamResponse(startingMessage, stream, true, thread);
        });
    } else if (interaction.channel.name.includes("Conversation")) {
      // let embed = new EmbedBuilder()
      //     .setTitle(args[0].value)
      //     .setFooter({text: response[2]})
      //     .setDescription(response[0]);
      // await interaction.editReply({embeds: [embed]});
      streamResponse(interaction, stream, true);
    } else {
      streamResponse(interaction, stream, false);
    }
  },
};
