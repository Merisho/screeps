module.exports = {
    run(creep) {
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            const src = creep.pos.findClosestByPath(FIND_SOURCES);
            if (creep.harvest(src) == ERR_NOT_IN_RANGE) {
                creep.moveTo(src);
            }
        } else {
            const spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS);
            if (creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(spawn);
            }
        }
    }
};
