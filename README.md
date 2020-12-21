# discobot
Simple Discord bot template made using <a href="https://discord.js.org/#/">discord.js</a> and Typescript.


## Main features

- Command handler (loads commands from separate typescript files)
- Admin only commands
- Automatic role assigning to new members

## Install instructions

1. `git clone https://github.com/lexonegit/discobot`
2. Inside the directory do `npm install`
3. Enter your **bot token** and **main server id** to the config file (src/json/config.json)
4. Use `npm run start` to run the bot.
5. For development purposes you can use `npm run dev` to run the bot with Nodemon (automatic restart after changes)
6. Inside the commands directory (src/commands/), you can create more command files. Two example commands are included.
