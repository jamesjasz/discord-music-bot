module.exports = {
  name: 'stop',
  description: 'Stop the music and leave the voice channel',
  execute(message, args) {
    const { getVoiceConnection } = require('@discordjs/voice');
    const connection = getVoiceConnection(message.guild.id);
    if (!connection) return message.reply('❌ I\'m not in a voice channel.');

    connection.destroy();
    message.reply('🛑 Music stopped and left the voice channel.');
  }
};
