import { world, system } from "@minecraft/server";

let activeStormDimension = null;

system.runInterval(() => {
    const players = world.getPlayers();
    let targetDimension = null;

    for (const player of players) {
        try {
            const biome = player.dimension.getBiome(player.location);
            if (biome && biome.id === "nautical:storm_island") {
                targetDimension = player.dimension;
                break;
            }
        } catch (e) {}
    }

    if (targetDimension) {
        if (activeStormDimension !== targetDimension) {
            targetDimension.setWeather("Thunder", 200000);
            activeStormDimension = targetDimension;
        }
    } else {
        if (activeStormDimension) {
            activeStormDimension.setWeather("Clear", 200000);
            activeStormDimension = null;
        }
    }
}, 20);