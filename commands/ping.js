const os = require('os');
const settings = require('../settings.js');

function formatTime(seconds) {
    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds %= (24 * 60 * 60);
    
    const hours = Math.floor(seconds / (3600));
    seconds %= 3600;
    
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);

    let time = '';
    if (days > 0) time += `${days}d `;
    if (hours > 0) time += `${hours}h `;
    if (minutes > 0) time += `${minutes}m `;
    if (seconds > 0 || time === '') time += `${seconds}s`;

    return time.trim();
}

async function pingCommand(sock, chatId, message) {
    try {
        const start = Date.now();
        await sock.sendMessage(chatId, { text: 'Pong!' }, { quoted: message });
        const end = Date.now();

        // Ping ko round-trip time ka half maana jaata hai (better accuracy)
        const ping = Math.round((end - start) / 2);

        const uptimeInSeconds = process.uptime();
        const uptimeFormatted = formatTime(uptimeInSeconds);

        const botInfo = `
╔════════════════════════════════════╗
║         SHYAM-42-MODE            ║
║     DEX-BOT-MD v${settings.version}     ║
╠════════════════════════════════════╣
║  PING  : ${ping} ms                ║
║  UPTIME: ${uptimeFormatted}        ║
║                                    ║
║  ᴰᵉˣ-ᴮᵒᵗ-ᴹᴰ ᵏᵉ ᵘᵖᵃʳ ᴬᵃʲ ᵀᵃᵏ        ║
║  ᴷᴼᴵ ᴮᴼᵀ ᴺᴬᴴᴵᴺ ᴮᴬᴺᴬʸᴬ ʜᴀɪ..      ║
║  😈🔥 𝑫𝑬𝑿-𝑺𝑯𝒀𝑨𝑴 𝙇𝙀𝙑𝙀𝙇-𝟎𝟕 🔥😈      ║
╚════════════════════════════════════╝`.trim();

        // Original message ko quote karke reply
        await sock.sendMessage(chatId, { 
            text: botInfo 
        }, { 
            quoted: message 
        });

    } catch (error) {
        console.error('Error in ping command:', error);
        await sock.sendMessage(chatId, { 
            text: '❌ Failed to get bot status.' 
        }, { 
            quoted: message 
        });
    }
}

module.exports = pingCommand;