const wa = require("whatsapp-web.js");
const client = new wa.Client();
const config = require("./config.json");
const qrcode = require("qrcode-terminal")
const request = require("request");

client.on("qr", (qr) => {
	qrcode.generate(qr, {small: true})
})

client.on("ready", () => {
	console.log("Ready!")
})

client.on("message", (msg) => {
	let args = msg.body.slice(config.prefix.length).split(' ');
	let command = args.shift().toLowerCase();

	if(command === "ping") {
		msg.reply("Pong!");
	}
	if(command === "covid") {
		if(!args[0]) msg.reply("Tidak ada argument, tolong masukan satu misalkan *Indonesia*");
		if(args[1]) msg.reply("Argument kedua tidak diperbolehkan");

		// API Call
		request({
			url: `https://disease.sh/v3/covid-19/countries/${args[0]}`,
			method: "GET",
			json: true
		}, function(err, res, body) {
			msg.reply(`
*Total Covid Di ${body.country}*
Confirmed: ${body.cases}
Deaths: ${body.deaths}
Recovered: ${body.recovered}
`)
		})

	}
})

client.initialize();