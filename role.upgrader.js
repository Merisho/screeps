module.exports = {
    run(creep) {
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
            creep.memory.task = 'upgrade';
        } else if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
            creep.memory.task = 'harvest';
        }

        if (creep.memory.task === 'harvest') {
            harvest(creep);
        } else {
            const res = creep.upgradeController(creep.room.controller);
            if (res === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            } else if (res !== 0) {
                console.log('unhandled builder role build error:', res);
            }
        }
    }
};

function harvest(creep) {
    const src = creep.pos.findClosestByPath(FIND_SOURCES);
    if (creep.harvest(src) == ERR_NOT_IN_RANGE) {
        creep.moveTo(src);
    }
}
