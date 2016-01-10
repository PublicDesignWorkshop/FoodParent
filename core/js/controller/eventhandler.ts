module FoodParent {
    /*
    export enum ACTION_STATUS {
        NONE, IDLE, LOADING, LOADED, ERROR
    }
    */
    export enum DATA_MODE {
        NONE, CREATE, DELETE, UPDATE_LOCATION, UPDATE_FLAG, UPDATE_OWNERSHIP, UPDATE_FOODTYPE, UPDATE_DESCRIPTION, 
        UPDATE_NAME, UPDATE_ADDRESS, UPDATE_CONTACT, UPDATE_NEIGHBORHOOD, UPDATE_AUTH,
        UPDATE_COMMENT, UPDATE_RATING, UPDATE_COVER, UPDATE_DATE
    }
    export enum VIEW_STATUS {
        NONE, HOME, MANAGE_TREES, PARENT_TREES, GEO_ERROR, NETWORK_ERROR, CONFIRM, MANAGE_PEOPLE, MANAGE_ADOPTION, DETAIL_TREE, IMAGENOTE_TREE, POST_NOTE
    }
    export enum VIEW_MODE {
        NONE, MAP, GRAPHIC, TABLE
    }
    export enum ERROR_MODE {
        NONE, GEO_PERMISSION_ERROR, SEVER_CONNECTION_ERROR
    }
    export class EventHandler {
        private static _instance: EventHandler = new EventHandler();
        private static TAG: string = "Controller - ";
        private bDebug: boolean = true;
        private _lastCommand: Command;
        constructor(args?: any) {
            if (EventHandler._instance) {
                throw new Error("Error: Instantiation failed: Use EventHandler.getInstance() instead of new.");
            }
            EventHandler._instance = this;
        }
        public static getInstance(): EventHandler {
            return EventHandler._instance;
        }

        public static undoLastCommand(): void {
            var self: EventHandler = EventHandler._instance;
            if (self._lastCommand) {
                self._lastCommand.undo();
                self._lastCommand = null;
            }
        }

        public static handleNavigate(viewStatus: VIEW_STATUS, option?: any): void {
            Controller.abortAllXHR();
            Pace.restart();
            new RemoveAlertViewCommand().execute();
            //if (View.getViewStatus() != viewStatus) {
                new RemoveChildViewCommand({ parent: View }).execute();
            //}
            
            new RenderNavViewCommand({ el: Setting.getNavWrapperElement(), viewStatus: viewStatus }).execute();
            if (viewStatus == VIEW_STATUS.HOME) {
                new MovePaceBarToTop().execute();
                new RenderHomeViewCommand({ el: Setting.getMainWrapperElement() }).execute();
            } else if (viewStatus == VIEW_STATUS.MANAGE_TREES) {
                new MovePaceBarToUnderNav().execute();
                new RenderManageTreesViewCommand({ el: Setting.getMainWrapperElement(), viewMode: option.viewMode, id: option.id }).execute();
            } else if (viewStatus == VIEW_STATUS.MANAGE_PEOPLE) {
                new MovePaceBarToUnderNav().execute();
                new RenderManagePeopleViewCommand({ el: Setting.getMainWrapperElement(), viewMode: option.viewMode, id: option.id }).execute();
            } else if (viewStatus == VIEW_STATUS.DETAIL_TREE) {
                new MovePaceBarToUnderNav().execute();
                new RenderDetailTreeViewCommand({ el: Setting.getMainWrapperElement(), viewMode: option.viewMode, id: option.id }).execute();
            }

            View.getNavView().setActiveNavItem(viewStatus);
            View.setViewStatus(viewStatus);
        }

        public static handleMouseClick(el: JQuery, view: BaseView, options?: any): void {
            // Execute undo command.
            if (el.hasClass('undo')) {
                EventHandler.undoLastCommand();
            }
            // Make MessageView invisible.
            if (View.getMessageView()) {
                View.getMessageView().setInvisible();
            }
            // Handle NavView
            if (view instanceof NavView) {
                if (el.hasClass('item-manage-title')) {
                    new NavigateCommand({ hash: '' }).execute();
                } else if (el.hasClass('trees')) {
                    new NavigateCommand({ hash: 'mtrees', viewMode: VIEW_MODE.MAP, id: 0 }).execute();
                } else if (el.hasClass('people')) {
                    new NavigateCommand({ hash: 'mpeople', viewMode: VIEW_MODE.TABLE, id: 0 }).execute();
                }
            }

            // Handle specific event on each view status.
            switch (View.getViewStatus()) {
                case VIEW_STATUS.NONE:
                    break;
                case VIEW_STATUS.HOME:
                    if (el.hasClass('home-menu-left')) {
                        new NavigateCommand({ hash: 'mtrees', viewMode: VIEW_MODE.MAP, id: 0 }).execute();
                    } else if (el.hasClass('home-menu-right')) {
                        new NavigateCommand({ hash: 'ptrees' }).execute();
                    }
                    break;
                case VIEW_STATUS.GEO_ERROR:
                case VIEW_STATUS.NETWORK_ERROR:
                    if (el.hasClass('alert-confirm')) {
                        new RemoveAlertViewCommand({ delay: Setting.getRemovePopupDuration() }).execute();
                    }
                    break;
                case VIEW_STATUS.CONFIRM:
                    if (el.hasClass('confirm-confirm') || el.hasClass('confirm-cancel')) {
                        new RemoveAlertViewCommand({ delay: Setting.getRemovePopupDuration() }).execute();
                    }
                    break;
                case VIEW_STATUS.MANAGE_TREES:
                    if (el.hasClass('marker-control-lock')) {
                        if (!options.marker.options.draggable) {
                            options.marker.options.draggable = true;
                            options.marker.dragging.enable();
                            el.html('<i class="fa fa-unlock-alt fa-2x"></i>');
                            options.marker._popup.setContent('<div class="marker-control-wrapper">' + $('.marker-control-wrapper').html() + '</div>');
                        } else {
                            options.marker.options.draggable = false;
                            options.marker.dragging.disable();
                            el.html('<i class="fa fa-lock fa-2x"></i>');
                            options.marker._popup.setContent('<div class="marker-control-wrapper">' + $('.marker-control-wrapper').html() + '</div>');
                        }
                    } else if (el.hasClass('marker-control-adoption')) {
                        new RenderManageAdoptionViewCommand({ el: Setting.getPopWrapperElement(), tree: options.tree }).execute();
                    } else if (el.hasClass('marker-control-info')) {
                        new NavigateCommand({ hash: 'mtree', viewMode: VIEW_MODE.GRAPHIC, id: options.tree }).execute();
                    } else if (el.hasClass('marker-control-delete')) {
                        var tree: Tree = Model.getTrees().findWhere({ id: options.marker.options.id });
                        (<ManageTreesMapView>view).deleteTree(tree);
                    } else if (el.hasClass('switch-table')) {   // Switch to table view.
                        new NavigateCommand({ hash: 'mtrees', viewMode: VIEW_MODE.TABLE, id: 0 }).execute();
                    } else if (el.hasClass('switch-map')) {   // Switch to table view.
                        new NavigateCommand({ hash: 'mtrees', viewMode: VIEW_MODE.MAP, id: 0 }).execute();
                    } else if (el.hasClass('mapview-item')) {   // Switch to map item view.
                        new NavigateCommand({ hash: 'mtrees', viewMode: VIEW_MODE.MAP, id: options.id }).execute();
                    } else if (el.hasClass('manage-adoption-item')) {
                        new RenderManageAdoptionViewCommand({ el: Setting.getPopWrapperElement(), tree: options.tree }).execute();
                    } else if (el.hasClass('tree-detail')) {
                        new NavigateCommand({ hash: 'mtree', viewMode: VIEW_MODE.GRAPHIC, id: options.tree }).execute();
                    }
                    break;
                case VIEW_STATUS.MANAGE_ADOPTION:
                    if (el.hasClass('button-close')) {
                        new RemoveAlertViewCommand({ delay: Setting.getRemovePopupDuration() }).execute();
                    }
                    break;
                case VIEW_STATUS.DETAIL_TREE:
                    if (el.hasClass('content-chart')) {
                        if (options.note) {
                            new RenderImageNoteViewCommand({ el: Setting.getPopWrapperElement(), note: options.note }).execute();
                        }
                    } else if (el.hasClass('button-manage-adoption')) {
                        new RenderManageAdoptionViewCommand({ el: Setting.getPopWrapperElement(), tree: options.tree.getId() }).execute();
                    } else if (el.hasClass('button-new-note')) {
                        new RenderPostNoteViewCommand({ el: Setting.getPopWrapperElement(), tree: options.tree }).execute();
                    }
                    break;
                case VIEW_STATUS.IMAGENOTE_TREE:
                    if (el.hasClass('button-close')) {
                        new RemoveAlertViewCommand({ delay: Setting.getRemovePopupDuration() }).execute();
                        if (View.getDetailTreeView()) {
                            (<DetailTreeGraphicView>View.getDetailTreeView()).refreshTreeInfo();
                        }
                    }
                    break;
                case VIEW_STATUS.POST_NOTE:
                     if (el.hasClass('button-close')) {
                        new RemoveAlertViewCommand({ delay: Setting.getRemovePopupDuration() }).execute();
                        if (View.getDetailTreeView()) {
                            (<DetailTreeGraphicView>View.getDetailTreeView()).refreshTreeInfo();
                        }
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

        public static handleDataChange(message: string, undoable?: boolean): void {
            var self: EventHandler = EventHandler._instance;
            if (self._lastCommand) {
                new RenderMessageViewCommand({ el: Setting.getMessageWrapperElement(), message: message, undoable: true }).execute();
            } else {
                new RenderMessageViewCommand({ el: Setting.getMessageWrapperElement(), message: message, undoable: false }).execute();
            }
        }

        public static handlePersonData(person: Person, dataMode: DATA_MODE, args: any, success?: Function, error?: Function, undoSuccess?: Function): void {
            var self: EventHandler = EventHandler._instance;
            self._lastCommand = null;
            switch (dataMode) {
                case DATA_MODE.UPDATE_NAME:
                    self._lastCommand = new UpdatePersonName({ person: person, name: args.name }, success, error);
                    break;
                case DATA_MODE.UPDATE_ADDRESS:
                    self._lastCommand = new UpdatePersonAddress({ person: person, address: args.address }, success, error);
                    break;
                case DATA_MODE.UPDATE_CONTACT:
                    self._lastCommand = new UpdatePersonContact({ person: person, contact: args.contact }, success, error);
                    break;
                case DATA_MODE.UPDATE_NEIGHBORHOOD:
                    self._lastCommand = new UpdatePersonNeightborhood({ person: person, neighborhood: args.neighborhood }, success, error);
                    break;
                case DATA_MODE.DELETE:
                    var command: Command = new DeletePerson({ person: person }, success, error);
                    new RenderConfirmViewCommand({ el: Setting.getPopWrapperElement(), message: "Are you sure to delete " + person.getName() + "?", command: command }).execute();
                    break;
                case DATA_MODE.UPDATE_AUTH:
                    self._lastCommand = new UpdatePersonAuth({ person: person, auth: args.auth }, success, error);
                    break;
                case DATA_MODE.CREATE:
                    self._lastCommand = new CreatePerson({ person: person }, success, error);
                    break;
            }
            if (self._lastCommand != undefined) {
                self._lastCommand.execute();
            }
        }

        public static handleNoteData(note: Note, dataMode: DATA_MODE, args: any, success?: Function, error?: Function, undoSuccess?: Function): void {
            var self: EventHandler = EventHandler._instance;
            self._lastCommand = null;
            switch (dataMode) {
                case DATA_MODE.UPDATE_COMMENT:
                    self._lastCommand = new UpdateNoteComment({ note: note, comment: args.comment }, success, error);
                    break;
                case DATA_MODE.UPDATE_RATING:
                    self._lastCommand = new UpdateNoteRating({ note: note, rate: args.rate }, success, error);
                    break;
                case DATA_MODE.UPDATE_COVER:
                    self._lastCommand = new UpdateNoteCover({ note: note, cover: args.cover }, success, error);
                    break;
                case DATA_MODE.UPDATE_DATE:
                    self._lastCommand = new UpdateNoteDate({ note: note, date: args.date }, success, error);
                    break;
                case DATA_MODE.CREATE:
                    new CreateNote({ note: note }, success, error).execute();
                    break;
                case DATA_MODE.DELETE:
                    View.popViewStatus();
                    var command: Command = new DeleteNote({ note: note }, success, error);
                    new RenderConfirmViewCommand({ el: Setting.getPopWrapperElement(), message: "Are you sure to delete this note?", command: command }).execute();
                    break;
            }
            if (self._lastCommand != undefined) {
                self._lastCommand.execute();
            }
        }

        public static handleTreeData(tree: Tree, dataMode: DATA_MODE, args: any, success?: Function, error?: Function, undoSuccess?: Function): void {
            var self: EventHandler = EventHandler._instance;
            self._lastCommand = null;
            switch (dataMode) {
                case DATA_MODE.UPDATE_LOCATION:
                    self._lastCommand = new UpdateTreeLocation({ tree: tree, marker: args.marker, location: args.location }, success, error);
                    break;
                case DATA_MODE.UPDATE_FLAG:
                    self._lastCommand = new UpdateTreeFlag({ tree: tree, flag: args.flag }, success, error);
                    break;
                case DATA_MODE.UPDATE_OWNERSHIP:
                    self._lastCommand = new UpdateTreeOwnership({ tree: tree, ownership: args.ownership }, success, error);
                    break;
                case DATA_MODE.UPDATE_FOODTYPE:
                    self._lastCommand = new UpdateTreeFoodType({ tree: tree, food: args.food }, success, error);
                    break;
                case DATA_MODE.UPDATE_DESCRIPTION:
                    self._lastCommand = new UpdateTreeDescription({ tree: tree, description: args.description }, success, error);
                    break;
                case DATA_MODE.CREATE:
                    self._lastCommand = new AddNewTree({ tree: tree }, success, error, undoSuccess);
                    break;
                case DATA_MODE.DELETE:
                    var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
                    var command: Command = new DeleteTree({ tree: tree }, success, error);
                    new RenderConfirmViewCommand({ el: Setting.getPopWrapperElement(), message: "Are you sure to delete " + food.getName() + " " + tree.getName() + "?", command: command }).execute();
                    break;
            }
            if (self._lastCommand != undefined) {
                self._lastCommand.execute();
            }
        }

        public static handleAdoptionData(tree: Tree, person: Person, dataMode: DATA_MODE, args: any, success?: Function, error?: Function, undoSuccess?: Function): void {
            var self: EventHandler = EventHandler._instance;
            self._lastCommand = null;
            switch (dataMode) {
                case DATA_MODE.CREATE:
                    self._lastCommand = new CreateAdoption({ tree: tree, person: person }, success, error, undoSuccess);
                    break;
                case DATA_MODE.DELETE:
                    self._lastCommand = new DeleteAdoption({ tree: tree, person: person }, success, error, undoSuccess);
                    break;

            }
            if (self._lastCommand != undefined) {
                self._lastCommand.execute();
            }
        }
    }
}