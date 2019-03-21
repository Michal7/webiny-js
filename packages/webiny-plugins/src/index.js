// @flow
import type { PluginType } from "webiny-plugins/types";

const __plugins = {};
const __loaded = {};

const _register = plugins => {
    for (let i = 0; i < plugins.length; i++) {
        let plugin = plugins[i];
        if (Array.isArray(plugin)) {
            _register(plugin);
            continue;
        }

        const name = plugin._name || plugin.name;
        if (!name) {
            throw Error(`Plugin must have a "name" or "_name" key.`);
        }

        __plugins[name] = plugin;
        __loaded[name] = !plugin.factory;
    }
};

export const registerPlugins = (...args: any): void => _register(args);

export const getPlugins = async (type: string | Object): Promise<Array<PluginType>> => {
    const values: Array<PluginType> = (Object.values(__plugins): any);

    if (typeof type === "string") {
        const plugins = values.filter((plugin: PluginType) => (type ? plugin.type === type : true));
        const loaded = await Promise.all(plugins.map(pl => getPlugin(pl.name)));

        return [...loaded.filter(Boolean)];
    }

    const loaded: Object = {};
    await Promise.all(
        Object.keys(type).map(async name => {
            // $FlowFixMe
            loaded[name] = await getPlugins(type[name]);
        })
    );

    return loaded;
};

export const getPluginsSync = (type: string): Array<PluginType> => {
    const values: Array<PluginType> = (Object.values(__plugins): any);
    return values.filter((plugin: PluginType) => (type ? plugin.type === type : true));
};

export const getPlugin = async (name: string): Promise<PluginType | null> => {
    if (!__plugins[name]) {
        return null;
    }

    if (!__loaded[name]) {
        const loaded = await __plugins[name].factory();
        __plugins[name] = { ...__plugins[name], ...loaded };
        __loaded[name] = true;
    }
    return __plugins[name];
};

export const getPluginSync = (name: string): PluginType | null => {
    if (!__plugins[name]) {
        return null;
    }

    if (!__loaded[name]) {
        const loaded = __plugins[name].factory();
        __plugins[name] = { ...__plugins[name], ...loaded };
        __loaded[name] = true;
    }
    return __plugins[name];
};

export const unregisterPlugin = (name: string): void => {
    delete __plugins[name];
};
