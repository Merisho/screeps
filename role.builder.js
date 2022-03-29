module.exports = {
    run(creep) {
        const targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
        if (targets.length === 0) {
            return;
        }

        const buildRes = creep.build(targets[0]);
        if (buildRes === ERR_NOT_ENOUGH_RESOURCES) {
            withdrawFromSource(creep);
        } else if (buildRes === ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0]);
        } else if (buildRes !== 0) {
            console.log('unhandled builder role build error:', buildRes);
        }
    }
};

function withdrawFromSource(creep) {
    const energySrc = creep.room.find(FIND_MY_STRUCTURES, {
        filter: struct => {
            return (struct instanceof StructureSpawn || struct instanceof StructureExtension) && struct.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
        }
    });
    if (energySrc.length === 0) {
        return;
    }
    
    if (creep.withdraw(energySrc[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(energySrc[0]);
    }
}
