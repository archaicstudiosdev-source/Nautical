import * as Minecraft from '@minecraft/server'

let tempPrefix = "n!"
let end = false;
let INTERVAL = 14077
let lastTick = Minecraft.system.run(() => {Minecraft.world.getTimeOfDay()});
let firstRun = true;

Minecraft.world.beforeEvents.chatSend.subscribe((data) => {
    if (data.message.startsWith(`${tempPrefix}music`)) {
        data.cancel = true;

        startAndLoop(data.sender)
    } else if (data.message.startsWith(`${tempPrefix} `) || data.message.startsWith(`${tempPrefix}help`)) {
        data.cancel = true;

        data.sender.sendMessage("§2n!music §rto start music \n§4n!stopmusic §rto stop music");
    } else if (data.message.startsWith(`${tempPrefix}stopmusic`)) {
        data.cancel = true;

        endSound(data.sender);
    }
});
/**
* @param {Minecraft.Player} Player
*/
function startAndLoop(player) {
    //Minecraft.system.runTimeout(() => {
        end = false;
        lastTick = Minecraft.world.getTimeOfDay();
        firstRun = true;

        function loopFunc() {
            if (end) return;

            const currentTick = Minecraft.world.getTimeOfDay();

            if ((currentTick - lastTick + 24000) % 24000 >= INTERVAL || firstRun) {
                Minecraft.system.run(() => {player.runCommand(`music play music.sealed_vessel_CL`)})
                firstRun = false;
                lastTick = currentTick
            }

            Minecraft.system.run(() => loopFunc());
        }
    //})

    loopFunc()
}

/**
* @param {Minecraft.Player} Player
*/
function endSound(player) {
    Minecraft.system.run(() => {
        player.runCommand(`music stop`);
        end = true;
    });
}