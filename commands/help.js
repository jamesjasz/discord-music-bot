const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'help',
  description: 'List all commands and their descriptions',
  execute(message, args) {
    const commandFiles = fs.readdirSync(path.join(__dirname)).filter(file => file.endsWith('.js'));

    const commands = commandFiles.map(file => {
      const cmd = require(`./${file}`);
      return `\`${cmd.name}\` - ${cmd.description}`;
    });

    const helpMessage = `🤖 **Jasz Music Bot Commands**\n\n${commands.join('\n')}`;
    message.reply(helpMessage);
  }
};
