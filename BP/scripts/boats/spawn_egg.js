import { world, system, GameMode } from "@minecraft/server";

const BOAT_ITEM_ID = "nautical:cobalt_sail_boat_egg";
const BOAT_ENTITY_ID = "nautical:cobalt_sail_boat";

world.afterEvents.itemStartUse.subscribe((event) => {
  const player = event.source;
  const item = event.itemStack;

  if (!player || !item) return;
  if (item.typeId !== BOAT_ITEM_ID) return;

  const dimension = player.dimension;

  const hit = player.getBlockFromViewDirection({
    maxDistance: 6,
    includeLiquidBlocks: true
  });

  if (!hit || !hit.block) return;

  const block = hit.block;
  const blockType = block.typeId;

  const isLiquid =
    block.isLiquid ||
    blockType === "minecraft:water" ||
    blockType === "minecraft:flowing_water" ||
    blockType === "minecraft:lava" ||
    blockType === "minecraft:flowing_lava";

  console.warn(" Is it liquid?" + isLiquid); // using warn to add emphasis

  const isSolid = !block.isAir && !block.isLiquid;

  if (!isLiquid && !isSolid) return;

  const spawnPos = {
    x: block.location.x + 0.5,
    y: block.location.y + (isLiquid ? 0.5 : 1),
    z: block.location.z + 0.5,
  };

  dimension.spawnEntity(BOAT_ENTITY_ID, spawnPos);

  if (
    player.getGameMode() === GameMode.Survival ||
    player.getGameMode() === GameMode.Adventure
  ) {
    const inv = player.getComponent("inventory").container;
    const slot = player.selectedSlotIndex;

    if (item.amount > 1) {
      item.amount--;
      inv.setItem(slot, item);
    } else {
      inv.setItem(slot, undefined);
    }
  }
});

console.log("spawn_egg.js executed sucsessfully");
