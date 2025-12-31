global.chrome = {
    runtime: {
        onInstalled: { addListener: jest.fn() },
        onMessage: { addListener: jest.fn() },
    },
    contextMenus: {
        create: jest.fn(),
        onClicked: { addListener: jest.fn() },
    },
    declarativeNetRequest: {
        updateEnabledRulesets: jest.fn(),
    },
    storage: {
        sync: {
            get: jest.fn(),
            set: jest.fn(),
        },
        local: {
            get: jest.fn(),
            set: jest.fn(),
        }
    },
    notifications: {
        create: jest.fn()
    }
};
