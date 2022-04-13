const { Client, Collection, Intents, MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs");
const { Manager } = require("erela.js");
const express = require('express');
const server = express();
server.all('/', (req, res)=>{
    res.send('Your bot is alive!')
})

server.all('/lavalinks', (req, res)=>{
    res.sendFile(__dirname + '/index.html')
})

function keepAlive(){
    server.listen(process.env.PORT || 3000, ()=>{console.log("Server is Ready!")});
};
const { token, nodes } = require('./config.json')
const client = new Client({
    disableMentions: "everyone",
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    ws: { intents: Intents.ALL }
});
client.manager = new Manager({
        nodes,
        send: (id, payload) => {
        const guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
    },
});

  
readdirSync("./Events/").forEach(file => {
    const event = require(`./Events/${file}`);
    let eventName = file.split(".")[0];
    console.log(`Loading Events Client ${eventName}`, "event");
    client.on(eventName, event.bind(null, client));
});

 

  client.login(process.env.TOKEN);
