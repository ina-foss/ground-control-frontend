import _ from 'lodash';
let config = {};

export const initApplicationConfiguration = async () => {
    try {
        const timeStamp = new Date().getTime();
        let configUrl = '/config.json';
        const cbParam = configUrl.indexOf('?') !== -1 ? `&cb=${timeStamp}` : `?cb=${timeStamp}`;
        configUrl = `${configUrl}${cbParam}`;
        const response = await fetch(configUrl)
        const data = await response.json()
        const runtimeConfig = useRuntimeConfig()
        _.assignInWith(config, data, (objValue, srcValue) => {
            return objValue || srcValue;
        });
        _.assignInWith(config,  Object.assign({}, runtimeConfig.public), (objValue, srcValue) => {
            return objValue || srcValue;
        });
        console.log("ApplicationConfiguration loaded",  Object.assign({}, runtimeConfig.public), config);
    } catch (error) {
        console.error(error);
        const runtimeConfig = useRuntimeConfig()
        _.assignInWith(config, runtimeConfig.public, (objValue, srcValue) => {
            return objValue || srcValue;
        });
    }
};

export const getApplicationConfiguration = () => {
    return config;
};
