module FoodParent {
    export class Setting {
        private static _instance: Setting = new Setting();
        private baseUrl: string;
        constructor(args?: any) {
            if (Setting._instance) {
                throw new Error("Error: Instantiation failed: Use Setting.getInstance() instead of new.");
            }
            Setting._instance = this;
        }
        public static getInstance(): Setting {
            return Setting._instance;
        }
        public setBaseUrl(url: string) {
            return this.baseUrl = url;
        }
        public getBaseUrl(): string {
            return this.baseUrl;
        }
        public getTileMapAddress(): string {
            //return 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
            //return 'http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg'
            return 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        }
        public getDefaultMapZoomLevel(): number {
            return 18;
        }
        public getMapMinZoomLevel(): number {
            return 17;
        }
        public getMapMaxZoomLevel(): number {
            return 19;
        }
    }
}