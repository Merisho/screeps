module.exports = {
    run(creep) {
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        } else {
            const energySrc = creep.room.find(FIND_MY_STRUCTURES, {
                filter: struct => {
                    return (struct instanceof StructureSpawn || struct instanceof StructureExtension || struct instanceof StructureContainer) && struct.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (energySrc.length === 0) {
                return;
            }
            
            if (creep.withdraw(energySrc[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(energySrc[0]);
            }
        }
    }
};
