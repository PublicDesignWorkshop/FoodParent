module FoodParent {
    export enum ACTION_STATUS {
        NONE, IDLE, LOADING, LOADED, ERROR
    }
    export enum VIEW_STATUS {
        NONE, HOME, MANAGE_TREES, PARENT_TREES, GEO_ERROR
    }
    export enum VIEW_MODE {
        NONE, MAP, GRAPHIC, TABLE
    }
    export enum ERROR_MODE {
        NONE, GEO_PERMISSION_ERROR
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

        public static handleNavigate(viewStatus: VIEW_STATUS, option?: any): void {
            if (View.getViewStatus() != viewStatus) {
                new RemoveChildViewCommand({ parent: View }).execute();
            }
            new RenderNavViewCommand({ el: Setting.getNavWrapperElement(), viewStatus: viewStatus }).execute();
            if (viewStatus == VIEW_STATUS.HOME) {
                new MovePaceBarToTop().execute();
                new RenderHomeViewCommand({ el: Setting.getMainWrapperElement() }).execute();
            } else if (viewStatus == VIEW_STATUS.MANAGE_TREES) {
                new MovePaceBarToUnderNav().execute();
                new RenderManageTreesViewCommand({ el: Setting.getMainWrapperElement(), viewMode: VIEW_MODE.MAP }).execute();
            }
            View.getNavView().setActiveNavItem(viewStatus);
            View.setViewStatus(viewStatus);
        }

        public static handleMouseClick(el: JQuery, view: BaseView): void {
            switch (View.getViewStatus()) {
                case VIEW_STATUS.NONE:
                    break;
                case VIEW_STATUS.HOME:
                    if (el.hasClass('home-menu-left')) {
                        new NavigateCommand({ hash: 'mtrees' }).execute();
                    } else if (el.hasClass('home-menu-right')) {
                        new NavigateCommand({ hash: 'ptrees' }).execute();
                    }
                    break;
                case VIEW_STATUS.GEO_ERROR:
                    if (el.hasClass('alert-confirm')) {
                        new RemoveAlertViewCommand().execute();
                    }
                    break;
            }
        }

        public static handleMouseEnter(el: JQuery, view: BaseView): void {
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
        }

        public static handleError(errorMode: ERROR_MODE): void {
            new RenderAlertViewCommand({ el: Setting.getPopWrapperElement(), errorMode: errorMode }).execute();
        }
    }
}