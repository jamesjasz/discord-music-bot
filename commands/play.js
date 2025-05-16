const { joinVoiceChannel } = require('@discordjs/voice');
const { getQueue, createGuildQueue, playNext } = require('../music/queue');
const { EmbedBuilder } = require('discord.js');
const ytdl = require('@distube/ytdl-core');

module.exports = {
  name: 'play',
  aliases: ['p'],
  description: 'Play or queue a YouTube song',
  async execute(message, args) {
    const query = args.join(' ');
    if (!query) return message.reply('❌ Please provide a YouTube URL or search term.');

    let url = query;

    if (!ytdl.validateURL(query)) {
      const yts = require('yt-search');
      const result = await yts(query);
      if (!result || !result.videos.length) {
        return message.reply('❌ No results found.');
      }
      url = result.videos[0].url;
    }

    const voiceChannel = message.member?.voice.channel;
    if (!voiceChannel) return message.reply('❌ You need to be in a voice channel.');

    let queue = getQueue(message.guild.id);
    if (!queue) {
      queue = createGuildQueue(message.guild.id);
      queue.voiceChannel = voiceChannel;
      queue.connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator
      });
    }

    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, {
        filter: 'audioonly',
        quality: 'highestaudio',
        highWaterMark: 1 << 25,
    });
    queue.songs.push({ url: url, title: info.videoDetails.title });

    const embed = new EmbedBuilder()
      .setTitle(queue.playing ? '✅ Queued' : '🎶 Now Playing')
      .setDescription(`**${info.videoDetails.title}**\nBy: ${info.videoDetails.author.name}`)
      .addFields({ name: 'Bitrate', value: `${format.audioBitrate} kbps`, inline: true })
      .setColor(0x1DB954)
      .setURL(url);

    if (!queue.playing) {
      playNext(message.guild.id);
    }

    message.reply({ embeds: [embed] });
  }
};

