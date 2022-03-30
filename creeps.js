const WORKER_CREEP = 'worker';
const UPGRADER_CREEP = 'upgrader';
const MELEE_WARRIOR_CREEP = 'melee_warrior';
const BUILDER_CREEP = 'builder';

const creepsBodies = {
    [WORKER_CREEP]: [WORK, WORK, CARRY, MOVE],
    [UPGRADER_CREEP]: [WORK, CARRY, MOVE],
    [MELEE_WARRIOR_CREEP]: [MOVE, ATTACK, ATTACK],
    [BUILDER_CREEP]: [MOVE, CARRY, WORK, WORK],
};

const creepsDesiredNumbers = {
    [WORKER_CREEP]: 4,
    [UPGRADER_CREEP]: 1,
    [BUILDER_CREEP]: 2,
    [MELEE_WARRIOR_CREEP]: 3,
};

const autoSpawn = [WORKER_CREEP, UPGRADER_CREEP, BUILDER_CREEP];

module.exports = {
    WORKER_CREEP,
    UPGRADER_CREEP,
    MELEE_WARRIOR_CREEP,
    BUILDER_CREEP,

    spawn() {
        for (const roomName in Game.rooms) {
            const room = Game.rooms[roomName];

            for (const creepRole of autoSpawn) {
                const creeps = provideDesiredCreeps(creepsDesiredNumbers, creepsBodies, room, creepRole);
                balancedSpawn(room, creeps);
            }
        }

    }
};

function provideDesiredCreeps(desiredCreeps, creepsBodies, room, role) {
    if (!role || !desiredCreeps[role]) {
        console.log('provideAvailability: invalid role given:', role);
        return;
    }

    const creepsCount = countAliveCreeps(room, role) + countSpawningCreeps(room, role);

    const d = desiredCreeps[role] - creepsCount;
    const creeps = [];
    if (d > 0) {
        console.log(`room ${room.name} lacks ${d} ${role} creeps`);

        for (let i = 0; i < d; ++i) {
            creeps.push({
                role,
                body: creepsBodies[role],
                name: role + Math.floor(Math.random() * 1e9) + Date.now().toString(),
            });
        }
    }

    return creeps;
}

function countAliveCreeps(room, role) {
    return room.find(FIND_MY_CREEPS, {
        filter: creep => creep.memory.role === role
    }).length
}

function countSpawningCreeps(room, role) {
    const spawningCreeps = room.find(FIND_MY_SPAWNS).reduce((cnt, s) => s.spawning && s.spawning.name.includes(role) ? cnt + 1 : cnt, 0);
    return spawningCreeps;
}

function balancedSpawn(room, creeps) {
    const spawns = room.find(FIND_MY_SPAWNS);
    let spawnIdx = 0;

    creeps.forEach(creep => {
        let res;
        let initSpawn = spawnIdx;
        do {
            res = spawns[spawnIdx].spawnCreep(creep.body, creep.name, { memory: { role: creep.role } });
            console.log(`could not spawn ${creep.role} creep: ${res}`);
            spawnIdx = (spawnIdx + 1) % spawns.length;
        } while(spawnIdx !== initSpawn && res !== OK);
    });
}
