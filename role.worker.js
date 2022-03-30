module.exports = {
    run(creep) {
        if (creep.memory.task === 'build') {
            build(creep);
            return;
        }

        if (creep.memory.task === 'upgrade') {
            upgrade(creep);
            return;
        }


        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            const src = creep.pos.findClosestByPath(FIND_SOURCES);
            if (creep.harvest(src) == ERR_NOT_IN_RANGE) {
                creep.moveTo(src);
            }
        } else {
            const spawns = creep.room.find(FIND_MY_SPAWNS, {
                filter: spawn => spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            });
            let destinations;
            if (spawns.length === 0) {
                destinations = creep.room.find(FIND_MY_STRUCTURES, {
                    filter: struct => struct instanceof StructureExtension && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                });
            } else {
                destinations = spawns;
            }

            if (destinations.length === 0) {
                if (!build(creep)) {
                    upgrade(creep);
                }

                return;
            }

            const res = creep.transfer(destinations[0], RESOURCE_ENERGY);
            if (res === ERR_NOT_IN_RANGE) {
                creep.moveTo(destinations[0]);
            }
        }
    }
};

function build(creep) {
    creep.memory.task = 'build';

    const targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
    if (targets.length === 0) {
        creep.memory.task = '';
        return false;
    }

    const buildRes = creep.build(targets[0]);
    if (buildRes === ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0]);
        return true;
    } else if (buildRes !== OK) {
        creep.memory.task = '';
        return false;
    }

    return true;
}

function upgrade(creep) {
    creep.memory.task = 'upgrade';

    const res = creep.upgradeController(creep.room.controller);
    if (res === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller);
        return true;
    }

    if (res !== OK) {
        creep.memory.task = '';
        return false;
    }

    return true;
}
