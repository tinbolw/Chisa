const debounce = require('debounce-promise');
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    // GatewayIntentBits.MessageContent,
    // GatewayIntentBits.GuildMembers,
    // GatewayIntentBits.GuildPresences,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
  partials: ["CHANNEL"],
});

require('dotenv').config();
const botPackage = require("./package.json");

// const checkMessageType = require("./resources/dailymessagestats/checkMessageType.js");
// const priceTracker = require("./resources/pricetracker.js");
// const player = require("./resources/player.js")

const fs = require("fs");
const path = require("node:path");
const moment = require("moment-timezone");

var emojis = [];

client.once("ready", async () => {
  console.log(
    `${moment().tz("America/Los_Angeles").format("HH:mm")} => ${client.user.tag
    } ${botPackage.version} is a go`
  );
  client.user.setActivity("/help");
  // const guild = await client.guilds.fetch("288143162394804224");
  // const guildMembers = await guild.members.fetch();
  // Chisa emoji servers
  // const guilds = await client.guilds.fetch();
  // let len = guilds.size;
  // let collect = [];
  // guilds.forEach(async (guild) => {
  //   if (guild.id == 288143162394804224) return;
  //   let g = await guild.fetch();
  //   let emojis = guild.emojis.cache;
  //   collect.push(...emojis);
  //   len--;
  //   if (len == 1) {
  //     emojis = new Map(collect);
  //   }
  // });
  // console.log(emojis);
  // let sale = await priceTracker.run(954850);
  // if (sale) {
  //   let channel = await client.channels.fetch('412081820771942410');
  //   channel.send(sale);
  //   console.log(sale);
  // }
  // setInterval(async function () {
  //   let sale = await priceTracker.run(954850);
  //   if (sale) {
  //     let channel = await client.channels.fetch('412081820771942410');
  //     channel.send(sale);
  //     console.log(sale);
  //   }
  // }, 3600000);
  // Reset and send message stats at 12 am
  // let channel = await client.channels.fetch('412081820771942410');
  // setInterval(async function () {
  //   if (moment.tz('America/Los_Angeles').format('HH:mm') == '00:00') {
  //     let embed = await checkMessageType.embed(guildMembers);
  //     channel.send({ embeds: [embed] });
  //     fs.writeFileSync('./resources/dailymessagestats/dailymessagestats.json', JSON.stringify([]));
  //   }
  // }, 60000)
});
client.commands = new Collection();

// reads folders in /slashcommands, for each file, set as command

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
      );
    }
  }
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand() && !interaction.isAutocomplete) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
  } 
  if (interaction.isAutocomplete()) {
    try {
      //* should probably make it differentiate between expensive and nonexpensive calls
      // debounce-promise
      const debouncer = debounce(() => command.autocomplete(interaction), 250);
      return debouncer();
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  } else {
    if (command.execute.toString().includes("editReply")) await interaction.deferReply();
    try {
      await command.execute(interaction);
    } catch (error) {
      if (command.data.name == "askgpt") {
        return;
      } else {
        console.error(error);
        if (command.execute.toString().includes("editReply")) {
          await interaction.editReply({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        }

      }
    }
  }
});

// Message commands
client.on("messageCreate", async (message) => {
  // Filter bot messages, send message if in DMs
  if (message.author.bot) return;
  if (message.guildId === null)
    return message.channel.send("<:gay:976320149684617257>");
  //TODO map of names and just send image link
  // emojis.forEach((emoji) => {
  //   if (`:${emoji.name.toLowerCase()}:` == `${message.content.toLowerCase()}`) {
  //     message.delete();
  //     message.channel.send(`${emoji}`);
  //   }
  // });
  // if (message.content == "!corn") {
  //   player.run(message);
  //   message.channel.send("ed beef");
  // }
  // if (message.content == "!carrot") {
  //   message.channel.send("brotato");
  // }
  // Filter out mudae commands
  // const mudaeFilter = [
  //   "$wa",
  //   "$w",
  //   "$ha",
  //   "$h",
  //   "$mml",
  //   "$dk",
  //   "$tu",
  //   "$mm",
  //   "$kakera",
  //   "$daily",
  //   "rolls",
  // ];
  // if (mudaeFilter.indexOf(message.content) == -1) checkMessageType.run(message);
});

client.login(process.env.TOKEN);
