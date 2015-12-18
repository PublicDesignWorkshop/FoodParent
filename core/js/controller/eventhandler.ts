module FoodParent {
    export enum ACTION_STATUS {
        NONE, IDLE, LOADING, LOADED, ERROR
    }
    export enum VIEW_STATUS {
        NONE, HOME
    }
    export class EventHandler {
        private static _instance: EventHandler = new EventHandler();
        private static TAG: string = "Controller - ";
        private bDebug: boolean = true;
        constructor(args?: any) {
            if (EventHandler._instance) {
                throw new Error("Error: Instantiation failed: Use EventHandler.getInstance() instead of new.");
            }
            EventHandler._instance = this;
        }
        public static getInstance(): EventHandler {
            return EventHandler._instance;
        }

        public static handleClickInput(): Command {

            return null;
        }

        public static handleNavigate(): Command {
            if (View.getViewStatus() == VIEW_STATUS.NONE) { // if first loading

            }
            return null;
        }
    }
}