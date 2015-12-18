module FoodParent {
    export class Setting {
        private static _instance: Setting = new Setting();
        private _baseUrl: string;
        constructor(args?: any) {
            if (Setting._instance) {
                throw new Error("Error: Instantiation failed: Use Setting.getInstance() instead of new.");
            }
            Setting._instance = this;
        }
        public static getInstance(): Setting {
            return Setting._instance;
        }
        public static setBaseUrl(url: string) {
            return Setting._instance._baseUrl = url;
        }
        public static getBaseUrl(): string {
            return Setting._instance._baseUrl;
        }
        public static getPhpDir(): string {
            return Setting._instance._baseUrl + "core/php/";
        }
        public static getContentsImageDir(): string {
            return Setting._instance._baseUrl + "content/image/";
        }
        public static getCoreImageDir(): string {
            return Setting._instance._baseUrl + "core/image/";
        }
        public static getNavWrapperElement(): JQuery {
            return $('#wrapper-nav');
        }
        public static getMainWrapperElement(): JQuery {
            return $('#wrapper-main');
        }
        public static getPopWrapperElement(): JQuery {
            return $('#wrapper-pop');
        }
    }
}