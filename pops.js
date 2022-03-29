const WORKER_POP = 'worker';
const UPGRADER_POP = 'upgrader';
const MEELE_WARRIOR_POP = 'meele_warrior';
const BUILDER_POP = 'builder';

const popsBodies = {
    [WORKER_POP]: [WORK, CARRY, MOVE],
    [UPGRADER_POP]: [WORK, CARRY, MOVE],
    [MEELE_WARRIOR_POP]: [MOVE, ATTACK, ATTACK],
    [BUILDER_POP]: [MOVE, CARRY, WORK],
};

const pops = {
    [WORKER_POP]: 2,
    [UPGRADER_POP]: 1,
    [MEELE_WARRIOR_POP]: 2,
    [BUILDER_POP]: 1,
};


const autoSpawn = [WORKER_POP, UPGRADER_POP, BUILDER_POP, MEELE_WARRIOR_POP];

module.exports = {
    spawn() {
        for (const roomName in Game.rooms) {
            const room = Game.rooms[roomName];

            for (const pop of autoSpawn) {
                provideAvailability(pops, popsBodies, room, pop);
            }
        }
    }
};

function provideAvailability(pops, popsBodies, room, role) {
    if (!role || !pops[role]) {
        console.log('provideAvailability: invalid role given:', role);
        return;
    }

    let creepsCount = room.find(FIND_MY_CREEPS, {
        filter: creep => creep.memory.role === role
    }).length;

    const spawns = room.find(FIND_MY_SPAWNS);
    for (const s of spawns) {
        if (s.spawning && s.spawning.name.includes(role)) {
            creepsCount++;
        } 
    }

    if (creepsCount < pops[role]) {
        const d = pops[role] - creepsCount;
        if (d > 0) {
            console.log(`room ${room.name} lacks ${d} ${role} creeps`);
        }

        spawn(spawns[0], popsBodies[role], role, d);
    }
}

function spawn(spawnStruct, body, role, num = 1) {
    role = '' + role;
    for (let i = 0; i < num; i++) {
        const name = role + Math.floor(Math.random() * 1e9) + Date.now().toString();
        const res = spawnStruct.spawnCreep(body, name, { memory: { role } });
        if (res !== 0) {
            console.log(`couldn't spawn ${role} creep: ${res}`);
        }
    }
}
