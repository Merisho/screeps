if (!Memory.events || !Array.isArray(Memory.events)) {
    Memory.events = [];
}

module.exports = {
    handlers: {},

    on(eventType, handler) {
        if (this.handlers[eventType]) {
            throw new Error(`event ${eventType} already has a handler`);
        }

        this.handlers[eventType] = handler;
    },

    handle() {
        while (Memory.events.length > 0) {
            const event = Memory.events.shift();
            if (this.handlers[event.type]) {
                this.handlers[event.type](event);
            } else {
                console.log(`undefined handler for ${event.type} event`);
            }
        }
    }
};
