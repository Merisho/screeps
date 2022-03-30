const creeps = require('creeps');
const workerRole = require('role.worker');
const upgraderRole = require('role.upgrader');
const builderRole = require('role.builder');
const meleeWarriorRole = require('role.meleeWarrior');

require('events.build');

const events = require('events');

const roles = {
    [creeps.WORKER_CREEP]: workerRole,
    [creeps.UPGRADER_CREEP]: upgraderRole,
    [creeps.BUILDER_CREEP]: builderRole,
    [creeps.MELEE_WARRIOR_CREEP]: meleeWarriorRole,
};

memorizeEnergySources();
cleanupDead();

events.handle();

creeps.spawn();

for (let i in Game.creeps) {
    const creep = Game.creeps[i];
    const role = roles[creep.memory.role];
    if (role) {
        role.run(creep);
    }
}


function memorizeEnergySources() {
    for (let r in Game.rooms) {
        const room = Game.rooms[r];
        if (!room.memory.sources) {
            room.memory.sources = room.find(FIND_SOURCES);
        }
    }
}

function cleanupDead() {
    let k = 0;
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
            ++k;
        }
    }

    if (k > 0) {
        console.log(`cleaned up ${k} dead creeps`);
    }
}
