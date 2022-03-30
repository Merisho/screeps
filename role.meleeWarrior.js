module.exports = {
    run(creep) {
        const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
        if (enemies.length === 0) {
            return;
        }

        if (creep.attack(enemies[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(enemies[0]);
        }
    }
};
