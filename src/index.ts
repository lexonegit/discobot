import { Channel, Client, Collection, Guild, Message, MessageEmbed, Role, TextChannel } from "discord.js";
import * as fs from "fs";
import * as path from "path";

import config from "./json/config.json"; //Config file

const client = new Client();
const commandsCache: Collection<string[], (e: CommandRunEvent) => any> = new Collection();
var mainGuild: Guild;
var newMemberRoles: Role[] = new Array();

if (config.token == "" || config.id.mainGuild == "") 
{
    console.error("ERROR: Token or mainGuild ID not set in JSON config file (src/json/config.json)");
    process.exit(0);
}

interface Other {
    admin: boolean
}

export interface CommandRunEvent {
    msg: Message,
    client: Client,
    args: string[],
    other: Other
}

function ReloadCommands()
{
    commandsCache.clear(); //Clear commands

    //Read commands directory
    const p = path.join(__dirname, "commands")
    let files: string[];
    try {
        files = fs.readdirSync(p);
    } catch (err) {
        return console.log("Error reading files: " + err);
    }
    
    //Filter out non .ts files
    files = files.filter(f => f.split(".").pop() == "ts"); 
    if (files.length <= 0)
        return console.log("No .ts command files found!");

    //Cache new commands
    files.forEach(file => {
        const properties = require(p + "/" + file) as { alias: string[], Run: (e: CommandRunEvent) => any };
        commandsCache.set(properties.alias, properties.Run);
    });

    console.log("Commands reloaded!");
}

function FetchNewMemberRoles()
{
    //Find each role listed in config.json
    config.id.newMemberRoles.forEach(role => {
        mainGuild.roles.fetch(role)
            .then(r => newMemberRoles.push(r));
    });
}

client.on("ready", () => 
{
    ReloadCommands();
    client.user.setActivity("Active!");

    mainGuild = client.guilds.cache.get(config.id.mainGuild);
    FetchNewMemberRoles();
    
    console.log("Ready! Connected as " + client.user.tag);
});

client.on("message", (msg) => 
{
    //Ignore self messages or messages without prefix
    if (msg.author == client.user || msg.content[0] != config.prefix)
        return;

    let com = msg.content.substring(1); //Substring prefix
    com = com.indexOf(" ") > 0 ? com.substring(0, com.indexOf(" ")) : com;
    let args = msg.content.split(" ").slice(1); //Split arguments

    // Formatting example
    //
    // INPUT = "!ping test 123"
    // com = "ping"
    // args = ["test", "123"]
    //

    const other: Other = {
        admin: config.id.admins.includes(msg.author.id) ? true : false
    };

    //Try finding a command if it exists
    const command: any = commandsCache.find((b, a) => a.includes(com));
    if (command)
        return command({ msg, client, args, other }); //Command found -> Run it


    //#region Hardcoded admin stuff
    if (!other.admin) return;

    if (com == "reload") {
        ReloadCommands();
        FetchNewMemberRoles();
        return;
    }

    if (com == "eval") //This is a dangerous command, never let others use it.
        return console.log("eval: " + eval(args.join("")));

    //#endregion
});

//In order for this to work, you need to enable "SERVER MEMBERS INTENT" for your bot at https://discord.com/developers
client.on("guildMemberAdd", (member) => 
{
    console.log(member.user.username + " joined");

    member.roles.add(newMemberRoles); //Give new member roles
});

client.on("guildMemberRemove", (member) => 
{
    console.log(member.user.username + " left the server");
});

client.login(config.token);