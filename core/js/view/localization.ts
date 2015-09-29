module FoodParent {
    export class Localization {
        private static _instance: Localization = new Localization();
        private baseUrl: string;
        constructor(args?: any) {
            if (Localization._instance) {
                throw new Error("Error: Instantiation failed: Use Localization.getInstance() instead of new.");
            }
            Localization._instance = this;
        }
        public static getInstance(): Localization {
            return Localization._instance;
        }

        public getSiteText(): string {
            return "FoodParent";
        }
        public getTreesText(): string {
            return "Trees";
        }
        public getNoteText(): string {
            return "Note";
        }
        public getAboutText(): string {
            return "About";
        }
    }
}