module FoodParent {
    export abstract class Command {
        public execute(): any {

        }
        public undo(): any {

        }
    }
    export class RemoveChildViewCommand implements Command {
        private _parent: BaseView;
        constructor(args?: any) {
            var self: RemoveChildViewCommand = this;
            self._parent = args.parent;
        }
        public execute(): any {
            var self: RemoveChildViewCommand = this;
            self._parent.removeAllChildren();
        }
        public undo(): any {

        }
    }
    export class RenderHomeViewCommand implements Command {
        private _el: JQuery;
        constructor(args?: any) {
            var self: RenderHomeViewCommand = this;
            self._el = args.el;
        }
        public execute(): any {
            var self: RenderHomeViewCommand = this;
            View.addChild(HomeViewFractory.create(self._el).render());
        }
        public undo(): any {

        }
    }
    export class RenderNavViewCommand implements Command {
        private _el: JQuery;
        private _viewStatus: VIEW_STATUS;
        constructor(args?: any) {
            var self: RenderNavViewCommand = this;
            self._el = args.el;
            self._viewStatus = args.viewStatus;
        }
        public execute(): any {
            var self: RenderNavViewCommand = this;
            if (View.getNavView()) {
                View.getNavView().render({ viewStatus: self._viewStatus });
            } else {
                View.setNavView(NavViewFractory.create(self._el).render({ viewStatus: self._viewStatus }));
            }
        }
        public undo(): any {

        }
    }

    export class RenderManageTreesViewCommand implements Command {
        private _el: JQuery;
        private _viewMode: VIEW_MODE;
        constructor(args?: any) {
            var self: RenderManageTreesViewCommand = this;
            self._el = args.el;
            self._viewMode = args.viewMode;
        }
        public execute(): any {
            var self: RenderManageTreesViewCommand = this;
            if (View.getManageTreesView()) {

            } else {
                var view: ManageTreesView = ManageTreesViewFractory.create(self._el, self._viewMode).render();
                View.addChild(view);
                View.setManageTreesView(view);
            }

            
        }
        public undo(): any {

        }
    }

    export class RenderAlertViewCommand implements Command {
        private _el: JQuery;
        private _errorMode: ERROR_MODE;
        constructor(args?: any) {
            var self: RenderAlertViewCommand = this;
            self._el = args.el;
            self._errorMode = args.errorMode;
        }
        public execute(): any {
            var self: RenderAlertViewCommand = this;
            var view: AlertView = AlertViewFractory.create(self._el, self._errorMode).render();
            View.setPopupView(view);
            switch (self._errorMode) {
                case ERROR_MODE.GEO_PERMISSION_ERROR:
                    View.setViewStatus(VIEW_STATUS.GEO_ERROR);
                    break;
                case ERROR_MODE.SEVER_CONNECTION_ERROR:
                    View.setViewStatus(VIEW_STATUS.NETWORK_ERROR);
                    break;
            }
            
        }
        public undo(): any {

        }
    }

    export class RemoveAlertViewCommand implements Command {
        private _delay: number;
        constructor(args?: any) {
            var self: RemoveAlertViewCommand = this;
            if (args != undefined && args.delay != undefined) {
                self._delay = args.delay;
            } else {
                self._delay = 0;
            }
        }
        public execute(): any {
            var self: RemoveAlertViewCommand = this;
            if (View.getPopupView()) {
                setTimeout(function () {
                    View.getPopupView().setInvisible();
                }, self._delay);
            }
            View.popViewStatus();
        }
        public undo(): any {

        }
    }

    export class FocusMenuLeftCommand implements Command {
        public execute(): any {
            var self: FocusMenuLeftCommand = this;
            View.getNavView().focusOnLeft();
        }
        public undo(): any {

        }
    }
    export class FocusMenuRightCommand implements Command {
        public execute(): any {
            var self: FocusMenuLeftCommand = this;
            View.getNavView().focusOnRight();
        }
        public undo(): any {

        }
    }
    export class NavigateCommand implements Command {
        private _hash: string;
        private _id: number;
        constructor(args?: any) {
            var self: NavigateCommand = this;
            self._hash = args.hash;
            if (args.id) {
                self._id = args.id;
            }
        }
        public execute(): any {
            var self: NavigateCommand = this;
            if (self._id) {
                Router.getInstance().navigate(self._hash + "/" + self._id, { trigger: true, replace: false });
            } else {
                Router.getInstance().navigate(self._hash, { trigger: true, replace: false });
            }
            
        }
        public undo(): any {

        }
    }

    export class MovePaceBarToTop implements Command {
        public execute(): any {
            var self: MovePaceBarToTop = this;
            var bFound: boolean = false;
            if ($('.pace-progress').length) {
                $('.pace-progress').css({ top: 0 });
            } else {
                setTimeout(function () {
                    new MovePaceBarToTop().execute();
                }, 100);
            }
        }
        public undo(): any {

        }
    }
    export class MovePaceBarToUnderNav implements Command {
        public execute(): any {
            var self: MovePaceBarToUnderNav = this;
            var bFound: boolean = false;
            if ($('.pace-progress').length) {
                $('.pace-progress').css({ top: '64px' });
            } else {
                setTimeout(function () {
                    new MovePaceBarToUnderNav().execute();
                }, 100);
            }
        }
        public undo(): any {

        }
    }

    export class UpdateTreeFlag implements Command {
        private _tree: Tree;
        private _flag: number;
        private _previousFlag: number;
        private _success: Function;
        private _error: Function;
        private _note: Note;
        constructor(args?: any, success?: Function, error?: Function) {
            var self: UpdateTreeFlag = this;
            if (args != undefined && args.tree != undefined && args.flag != undefined) {
                self._tree = args.tree;
                self._flag = args.flag;
            }
            if (success) {
                self._success = success;
            }
            if (error) {
                self._error = error;
            }
        }
        public execute(): any {
            var self: UpdateTreeFlag = this;
            self._previousFlag = self._tree.getFlagId();
            self._tree.save(
                {
                    'flag': self._flag,
                },
                {
                    wait: true,
                    success: function (tree: Tree, response: any) {
                        self._note = new Note({
                            type: NoteType.INFO,
                            tree: self._tree.getId(),
                            person: 0,
                            comment: "Status has changed from '" + Model.getFlags().findWhere({ id: self._previousFlag }).getName() 
                                    + "'to '" + Model.getFlags().findWhere({ id: self._flag }).getName() + "'",
                            picture: "",
                            rate: -1,
                            date: moment(new Date()).format(Setting.getDateTimeFormat()),
                        });
                        self._note.save(
                            {},
                            {
                                wait: true,
                                success: function (note: Note, response: any) {
                                    Model.getNotes().add(note);
                                    if (self._success) {
                                        self._success();
                                    }
                                },
                                error: function (error) {
                                    if (self._error) {
                                        self._error();
                                    }
                                },
                            }
                        );
                    },
                    error: function (error, response) {
                        if (self._error) {
                            self._error();
                        }
                    },
                }
            );
        }
        public undo(): any {
            var self: UpdateTreeFlag = this;
            self._tree.save(
                {
                    'flag': self._previousFlag,
                },
                {
                    wait: true,
                    success: function (tree: Tree, response: any) {
                        Model.getNotes().remove(self._note);
                        self._note.destroy({
                            wait: true,
                            success: function (note: Note, response: any) {
                                if (self._success) {
                                    self._success();
                                }
                            },
                            error: function (error) {
                                if (self._error) {
                                    self._error();
                                }
                            },
                        });
                    },
                    error: function (error, response) {
                        if (self._error) {
                            self._error();
                        }
                    },
                }
            );
        }
    }

    export class UpdateTreeOwnership implements Command {
        private _tree: Tree;
        private _ownership: number;
        private _previousOwnership: number;
        private _success: Function;
        private _error: Function;
        private _note: Note;
        constructor(args?: any, success?: Function, error?: Function) {
            var self: UpdateTreeOwnership = this;
            if (args != undefined && args.tree != undefined && args.ownership != undefined) {
                self._tree = args.tree;
                self._ownership = args.ownership;
            }
            if (success) {
                self._success = success;
            }
            if (error) {
                self._error = error;
            }
        }
        public execute(): any {
            var self: UpdateTreeOwnership = this;
            self._previousOwnership = self._tree.getOwnershipId();
            self._tree.save(
                {
                    'ownership': self._ownership,
                },
                {
                    wait: true,
                    success: function (tree: Tree, response: any) {
                        self._note = new Note({
                            type: NoteType.INFO,
                            tree: self._tree.getId(),
                            person: 0,
                            comment: "Ownership has changed from '" + Model.getOwnerships().findWhere({ id: self._previousOwnership }).getName()
                            + "'to '" + Model.getOwnerships().findWhere({ id: self._ownership }).getName() + "'",
                            picture: "",
                            rate: -1,
                            date: moment(new Date()).format(Setting.getDateTimeFormat()),
                        });
                        self._note.save(
                            {},
                            {
                                wait: true,
                                success: function (note: Note, response: any) {
                                    Model.getNotes().add(note);
                                    if (self._success) {
                                        self._success();
                                    }
                                },
                                error: function (error) {
                                    if (self._error) {
                                        self._error();
                                    }
                                },
                            }
                        );
                    },
                    error: function (error, response) {
                        if (self._error) {
                            self._error();
                        }
                    },
                }
            );
        }
        public undo(): any {
            var self: UpdateTreeOwnership = this;
            self._tree.save(
                {
                    'ownership': self._previousOwnership,
                },
                {
                    wait: true,
                    success: function (tree: Tree, response: any) {
                        Model.getNotes().remove(self._note);
                        self._note.destroy({
                            wait: true,
                            success: function (note: Note, response: any) {
                                if (self._success) {
                                    self._success();
                                }
                            },
                            error: function (error) {
                                if (self._error) {
                                    self._error();
                                }
                            },
                        });
                    },
                    error: function (error, response) {
                        if (self._error) {
                            self._error();
                        }
                    },
                }
            );
        }
    }

    export class UpdateTreeLocation implements Command {
        private _tree: Tree;
        private _marker: L.Marker;
        private _location: L.LatLng;
        private _prevLocation: L.LatLng;
        private _success: Function;
        private _error: Function;
        private _note: Note;
        constructor(args?: any, success?: Function, error?: Function) {
            var self: UpdateTreeLocation = this;
            if (args != undefined && args.tree != undefined && args.location != undefined) {
                self._tree = args.tree;
                self._marker = args.marker;
                self._location = args.location;
            }
            if (success) {
                self._success = success;
            }
            if (error) {
                self._error = error;
            }
        }
        public execute(): any {
            var self: UpdateTreeLocation = this;
            self._prevLocation = self._tree.getLocation();
            self._tree.save(
                {
                    'lat': self._location.lat,
                    'lng': self._location.lng
                },
                {
                    wait: true,
                    success: function (tree: Tree, response: any) {
                        self._note = new Note({
                            type: NoteType.INFO,
                            tree: self._tree.getId(),
                            person: 0,
                            comment: "Location has changed from '@ " + self._prevLocation.lat.toFixed(4) + ", " + self._prevLocation.lng.toFixed(4) 
                                    + "' to '" + '@ ' + self._location.lat.toFixed(4) + ", " + self._location.lng.toFixed(4) + "'",
                            picture: "",
                            rate: -1,
                            date: moment(new Date()).format(Setting.getDateTimeFormat()),
                        });
                        self._note.save(
                            {},
                            {
                                wait: true,
                                success: function (note: Note, response: any) {
                                    Model.getNotes().add(note);
                                    if (self._success) {
                                        self._success();
                                    }
                                },
                                error: function (error) {
                                    if (self._error) {
                                        self._error();
                                    }
                                },
                            }
                        );
                    },
                    error: function (error, response) {
                        if (self._error) {
                            self._error();
                        }
                    },
                }
            );
        }
        public undo(): any {
            var self: UpdateTreeLocation = this;
            self._tree.save(
                {
                    'lat': self._prevLocation.lat,
                    'lng': self._prevLocation.lng
                },
                {
                    wait: true,
                    success: function (tree: Tree, response: any) {
                        Model.getNotes().remove(self._note);
                        self._note.destroy({
                            wait: true,
                            success: function (note: Note, response: any) {
                                if (self._success) {
                                    self._success();
                                }
                                self._marker.setLatLng(self._prevLocation);
                            },
                            error: function (error) {
                                if (self._error) {
                                    self._error();
                                }
                            },
                        });
                    },
                    error: function (error, response) {
                        if (self._error) {
                            self._error();
                        }
                    },
                }
            );
        }
    }

    export class UpdateTreeFoodType implements Command {
        private _tree: Tree;
        private _food: number;
        private _previousFood: number;
        private _success: Function;
        private _error: Function;
        private _note: Note;
        constructor(args?: any, success?: Function, error?: Function) {
            var self: UpdateTreeFoodType = this;
            if (args != undefined && args.tree != undefined && args.food != undefined) {
                self._tree = args.tree;
                self._food = args.food;
            }
            if (success) {
                self._success = success;
            }
            if (error) {
                self._error = error;
            }
        }
        public execute(): any {
            var self: UpdateTreeFoodType = this;
            self._previousFood = self._tree.getFoodId();
            self._tree.save(
                {
                    'food': self._food,
                },
                {
                    wait: true,
                    success: function (tree: Tree, response: any) {
                        self._note = new Note({
                            type: NoteType.INFO,
                            tree: self._tree.getId(),
                            person: 0,
                            comment: "Food type has changed from '" + Model.getFoods().findWhere({ id: self._previousFood }).getName()
                            + "'to '" + Model.getFoods().findWhere({ id: self._food }).getName() + "'",
                            picture: "",
                            rate: -1,
                            date: moment(new Date()).format(Setting.getDateTimeFormat()),
                        });
                        self._note.save(
                            {},
                            {
                                wait: true,
                                success: function (note: Note, response: any) {
                                    Model.getNotes().add(note);
                                    if (self._success) {
                                        self._success();
                                    }
                                },
                                error: function (error) {
                                    if (self._error) {
                                        self._error();
                                    }
                                },
                            }
                        );
                    },
                    error: function (error, response) {
                        if (self._error) {
                            self._error();
                        }
                    },
                }
            );
        }
        public undo(): any {
            var self: UpdateTreeFoodType = this;
            self._tree.save(
                {
                    'food': self._food,
                },
                {
                    wait: true,
                    success: function (tree: Tree, response: any) {
                        Model.getNotes().remove(self._note);
                        self._note.destroy({
                            wait: true,
                            success: function (note: Note, response: any) {
                                if (self._success) {
                                    self._success();
                                }
                            },
                            error: function (error) {
                                if (self._error) {
                                    self._error();
                                }
                            },
                        });
                    },
                    error: function (error, response) {
                        if (self._error) {
                            self._error();
                        }
                    },
                }
            );
        }
    }

    export class RenderMessageViewCommand implements Command {
        private _el: JQuery;
        private _message: string;
        private _undoable: boolean;
        constructor(args?: any) {
            var self: RenderMessageViewCommand = this;
            self._el = args.el;
            self._message = args.message;
            self._undoable = args.undoable;
        }
        public execute(): any {
            var self: RenderMessageViewCommand = this;
            if (View.getMessageView()) {
                View.getMessageView().setInvisible();
            }
            var view: MessageView = MessageViewFractory.create(self._el, self._message, self._undoable).render();
            View.setMessageView(view);
        }
        public undo(): any {

        }
    }
}