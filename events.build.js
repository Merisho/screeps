const events = require('events');

/**
 * {
 *  type: 'buildRoadFromSpawnToController',
 *  room: <room name>
 *  spawn: <spawn name>
 * }
 */
events.on('buildRoadFromSpawnToController', event => {
    const room = getRoom(event.room);
    if (!room) {
        console.log(`invalid room ${event.room}`);
        return true;
    }

    const spawn = getSpawn(room, event.spawn);
    if (!spawn) {
        console.log(`invalid spawn ${event.spawn}`);
        return true;
    }

    const path = spawn.pos.findPathTo(room.controller);
    buildRoad(room, path);
});

/**
 * {
 *  type: 'buildRoadsFromSpawnToEnergySources',
 *  room: <room name>
 *  spawn: <spawn name>
 * }
 */
events.on('buildRoadsFromSpawnToEnergySources', event => {
    const room = getRoom(event.room);
    if (!room) {
        console.log(`invalid room ${event.room}`);
        return true;
    }

    const spawn = getSpawn(room, event.spawn);
    if (!spawn) {
        console.log(`invalid spawn ${event.spawn}`);
        return true;
    }

    const srcs = room.find(FIND_SOURCES);
    srcs.forEach(src => {
        const path = spawn.pos.findPathTo(src);
        buildRoad(room, path);
    });
});

function getRoom(roomName) {
    if (!roomName || !Game.rooms[roomName]) {
        return null;
    }

    return Game.rooms[roomName];
}

function getSpawn(room, spawnName) {
    const spawns = room.find(FIND_MY_SPAWNS, {
        filter: s => s.name === spawnName
    });
    if (spawns.length === 0) {
        return null;
    }

    return spawns[0];
}

function buildRoad(room, path) {
    let ok = true;
    const namePrefix = '' + Math.floor(Math.random() * 1e9) + Date.now().toString();
    for (let i = 0; i < path.length; ++i) {
        const p = path[i];
        
        const pos = room.getPositionAt(p.x, p.y);
        if (thereIsRoad(pos)) {
            continue;
        }

        const res = room.createConstructionSite(p.x, p.y, STRUCTURE_ROAD, namePrefix + i);
        if (res !== OK) {
            console.log(`cannot create road consturction site: ${res}`);
            ok = false;
            break;
        }
    }

    if (!ok) {
        for (let siteName in Game.constructionSites) {
            if (siteName.startsWith(namePrefix)) {
                Game.constructionSites[siteName].remove();
            }
        }
    }

    return ok;
}

function thereIsRoad(pos) {
    return pos.look().some(o => (o.type === LOOK_STRUCTURES && o.structure instanceof StructureRoad)
                            || (o.type === LOOK_CONSTRUCTION_SITES && o.constructionSite.structureType === STRUCTURE_ROAD));
}
