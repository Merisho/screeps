const pops = require('pops');
const workerRole = require('role.worker');
const upgraderRole = require('role.upgrader');
const builderRole = require('role.builder');

const roles = {
    worker: workerRole,
    upgrader: upgraderRole,
    builder: builderRole,
};

for (let i in Game.creeps) {
    const creep = Game.creeps[i];
    const role = roles[creep.memory.role];
    if (role) {
        role.run(creep);
    }
}

pops.spawn();
