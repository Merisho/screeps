module.exports = {
    run(creep) {
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0 && creep.memory.task !== 'build') {
            creep.memory.task = 'repair';
        } else if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
            creep.memory.task = 'harvest';
        }

        if (creep.memory.task === 'harvest') {
            harvest(creep);
        } else if (creep.memory.task === 'build') {
            const targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
            if (targets.length === 0) {
                creep.memory.task = 'repair';
                return;
            }

            const res = creep.build(targets[0]);
            if (res === ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            } else if (res !== OK) {
                console.log('unhandled builder role build error:', res);
            }
        } else if (creep.memory.task === 'repair') {
            const targets = creep.room.find(FIND_MY_STRUCTURES, {
                filter: struct => struct.hits < struct.hitsMax
            });
            if (targets.length === 0) {
                creep.memory.task = 'build';
                return;
            }

            const res = creep.repair(targets[0]);
            if (res === ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            } else if (res !== OK) {
                console.log('unhandled builder role repair error:', res);
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

function withdrawFromSource(creep) {
    const energySrc = creep.room.find(FIND_MY_STRUCTURES, {
        filter: struct => {
            return (struct instanceof StructureSpawn || struct instanceof StructureExtension || struct instanceof StructureStorage) && struct.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
        }
    });
    if (energySrc.length === 0) {
        return;
    }
    
    if (creep.withdraw(energySrc[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(energySrc[0]);
    }
}
