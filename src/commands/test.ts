import { CommandRunEvent } from "../index";
import { MessageEmbed } from "discord.js";

export function Run(e: CommandRunEvent) 
{
    if (!e.other.admin && adminCommand)
        return;

    const guild = e.msg.guild;
    const date = guild.createdAt;
    const formattedDate = date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear();

    const statEmbedMsg = new MessageEmbed()
        .setColor("#ff584d")
        .setAuthor(guild.name + " server stats", guild.iconURL())
        .addFields(
            { name: "Server creation date", value: formattedDate, inline: true },
            { name: "Server region", value: guild.region, inline: true },
            { name: "Total members", value: guild.memberCount, inline: false },
        )
        .setFooter("github.com/lexonegit/discobot")
        .setTimestamp();

    e.msg.channel.send(statEmbedMsg);
}

//Command properties
export const alias = ["test"];
const adminCommand = false;