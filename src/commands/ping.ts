import { CommandRunEvent } from "../index";
import { MessageEmbed } from "discord.js";
import * as tools from "../utils/tools";

export function Run(e: CommandRunEvent) 
{
    if (!e.other.admin && adminCommand)
        return;

    const timeArray = tools.GetHMS(e.client.uptime);
    const pingEmbed = new MessageEmbed()
        .setAuthor("👍", "https://cdn.discordapp.com/emojis/384151837604970516.png")
        .setTimestamp()
        .setDescription(`Uptime: ${timeArray[0]} hours, ${timeArray[1]} minutes and ${timeArray[2]} seconds.`);

    e.msg.channel.send(pingEmbed);
}

//Command properties
export const alias = ["ping", "pong"];
const adminCommand = false;