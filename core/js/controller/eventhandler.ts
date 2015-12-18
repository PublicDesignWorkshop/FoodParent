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

        public static handleClick(): Command {

            return null;
        }

        public static handleNavigate(viewStatus: VIEW_STATUS, option?: any): Command {
            if (View.getViewStatus() == VIEW_STATUS.NONE) { // if it's the first time loading

            }
            
            new CreateNavViewCommand({ el: Setting.getNavWrapperElement() }).execute();
            new CreateHomeViewCommand({ el: Setting.getMainWrapperElement() }).execute();

            View.setViewStatus(viewStatus);

            return null;
        }

        public static handleMouseOver(el: JQuery, view: BaseView): Command {
            switch (View.getViewStatus()) {
                case VIEW_STATUS.NONE:
                    break;
                case VIEW_STATUS.HOME:
                    if (el.hasClass('home-menu-left')) {
                        new FocusMenuLeftCommand().execute();
                    } else if (el.hasClass('home-menu-right')) {
                        new FocusMenuRightCommand().execute();
                    }
                    break;
            }
            return null;
        }
    }
}