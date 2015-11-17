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
            return "FoodParent&#153;";
        }
        public getTreesText(): string {
            return "Trees";
        }
        public getPeopleText(): string {
            return "People";
        }
        public getNoteText(): string {
            return "Note";
        }
        public getAboutText(): string {
            return "About";
        }
        public getFlagText(): string {
            return "Flag";
        }
        public getOwnershipText(): string {
            return "Ownership";
        }
        public getRecentText(): string {
            return "Recent Activities";
        }
        public getRipeningText(): string {
            return "Ripnening";
        }
        public getTreeListText(): string {
            return "Tree List";
        }
        public getPeopleListText(): string {
            return "People List";
        }
        public getDeleteConfirmText(): string {
            return "Are you sure to delete this item?";
        }
        public getNoDataText(): string {
            return "No Data";
        }
        public getNoteDetailText(): string {
            return "Note Detail";
        }
        public getAddNoteText(): string {
            return "Add Note";
        }
        public getDeleteNoteText(): string {
            return "Delete Note";
        }
    }
}