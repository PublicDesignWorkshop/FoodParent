module FoodParent {
    export class Controller {
        private static _instance: Controller = new Controller();
        private static TAG: string = "Controller - ";
        private bDebug: boolean = true;
        private xhrPool: Array<JQueryXHR>;
        constructor(args?: any) {
            if (Controller._instance) {
                throw new Error("Error: Instantiation failed: Use Controller.getInstance() instead of new.");
            }
            Controller._instance = this;
            Controller._instance.xhrPool = new Array<JQueryXHR>();
        }
        public static getInstance(): Controller {
            return Controller._instance;
        }
        public static pushXHR(xhr: JQueryXHR) {
            var self: Controller = Controller._instance;
            self.xhrPool.push(xhr);
        }
        public static removeXHR(xhr: JQueryXHR) {
            var self: Controller = Controller._instance;
            var index = self.xhrPool.indexOf(xhr);
            if (index > -1) {
                self.xhrPool.splice(index, 1);
            }
        }
        public static abortAllXHR() {
            var self: Controller = Controller._instance;
            $.each(self.xhrPool, function (index: number, xhr: JQueryXHR) {
                if (xhr != undefined) {
                    xhr.abort();
                }
            });
            self.xhrPool = new Array<JQueryXHR>();
        }
        public static updateGeoLocation(success?: PositionCallback, error?: PositionErrorCallback) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(success, error);
            } else {
                /*  Modern browser doesn't reach since it already supports geolocation service.
                if (success) {
                    success({ coords: { accuracy: 4196, altitude: null, altitudeAccuracy: null, heading: null, latitude: 33.7946333, longitude: -84.448771, speed: null }, timestamp: new Date().valueOf() });
                }
                */
            }
        }
        public static fetchAllTrees(success?: any, error?: any) {
            var xhr1: JQueryXHR = Model.fetchAllFoods();
            var xhr2: JQueryXHR = Model.fetchAllTrees();
            var xhr3: JQueryXHR = Model.fetchAllAdopts();
            var xhr4: JQueryXHR = Model.fetchAllPersons();
            Controller.pushXHR(xhr1);
            Controller.pushXHR(xhr2);
            Controller.pushXHR(xhr3);
            Controller.pushXHR(xhr4);
            $.when(
                xhr1, xhr2, xhr3, xhr4
            ).then(function () {
                Controller.removeXHR(xhr1);
                Controller.removeXHR(xhr2);
                Controller.removeXHR(xhr3);
                Controller.removeXHR(xhr4);
                Model.getTrees().updateParents();
                if (success) {
                    success();
                }
            }, function () {
                Controller.removeXHR(xhr1);
                Controller.removeXHR(xhr2);
                Controller.removeXHR(xhr3);
                Controller.removeXHR(xhr4);
                if (error) {
                    error(ERROR_MODE.SEVER_CONNECTION_ERROR);
                }
            });
        }
        public static fetchAllFlagsAndOwners(success?: any, error?: any) {
            var xhr1: JQueryXHR = Model.fetchAllFlags();
            var xhr2: JQueryXHR = Model.fetchAllOwnerships();
            Controller.pushXHR(xhr1);
            Controller.pushXHR(xhr2);
            $.when(
                xhr1, xhr2
            ).then(function () {
                Controller.removeXHR(xhr1);
                Controller.removeXHR(xhr2);
                if (success) {
                    success();
                }
            }, function () {
                Controller.removeXHR(xhr1);
                Controller.removeXHR(xhr2);
                if (error) {
                    error(ERROR_MODE.SEVER_CONNECTION_ERROR);
                }
            });
        }

        public static fetchAllPersonsAndAuthsAndFoodAndTreesAndAdopts(success?: any, error?: any) {
            var xhr1: JQueryXHR = Model.fetchAllAuths();
            var xhr2: JQueryXHR = Model.fetchAllPersons();
            var xhr3: JQueryXHR = Model.fetchAllAdopts();
            var xhr4: JQueryXHR = Model.fetchAllTrees();
            var xhr5: JQueryXHR = Model.fetchAllFoods();
            Controller.pushXHR(xhr1);
            Controller.pushXHR(xhr2);
            Controller.pushXHR(xhr3);
            Controller.pushXHR(xhr4);
            Controller.pushXHR(xhr5);
            $.when(
                xhr1, xhr2, xhr3, xhr4, xhr5
            ).then(function () {
                Controller.removeXHR(xhr1);
                Controller.removeXHR(xhr2);
                Controller.removeXHR(xhr3);
                Controller.removeXHR(xhr4);
                Controller.removeXHR(xhr5);
                Model.getPersons().updateTrees();
                if (success) {
                    success();
                }
            }, function () {
                Controller.removeXHR(xhr1);
                Controller.removeXHR(xhr2);
                Controller.removeXHR(xhr3);
                Controller.removeXHR(xhr4);
                Controller.removeXHR(xhr5);
                if (error) {
                    error(ERROR_MODE.SEVER_CONNECTION_ERROR);
                }
            });
        }

        public static fetchImageNotesOfTreesDuringPeriod(trees: Array<Tree>, startDate: string, endDate: string, size: number, offset: number, success?: any, error?: any) {
            var ids: Array<number> = new Array<number>();
            $.each(trees, function (index: number, tree: Tree) {
                ids.push(tree.getId());
            });
            var xhr1: JQueryXHR = Model.fetchImageNotesOfTreesDuringPeriod(ids, startDate, endDate, size, offset);
            //var xhr1: JQueryXHR = Model.fetchImageNotesOfTreesDuringPeriod(ids, moment(new Date()).subtract(2, 'years').startOf('day').format(Setting.getDateTimeFormat()), endDate, size, offset);
            Controller.pushXHR(xhr1);
            $.when(
                xhr1
            ).then(function () {
                Controller.removeXHR(xhr1);
                if (success) {
                    success();
                }
            }, function () {
                Controller.removeXHR(xhr1);
                if (error) {
                    error(ERROR_MODE.SEVER_CONNECTION_ERROR);
                }
            });
        }

        public static fetchNotesOfTrees(trees: Array<Tree>, size: number, offset: number, success?: any, error?: any) {
            var ids: Array<number> = new Array<number>();
            $.each(trees, function (index: number, tree: Tree) {
                ids.push(tree.getId());
            });
            var xhr1: JQueryXHR = Model.fetchNotesOfTrees(ids, size, offset);
            Controller.pushXHR(xhr1);
            $.when(
                xhr1
            ).then(function () {
                Controller.removeXHR(xhr1);
                if (success) {
                    success();
                }
            }, function () {
                Controller.removeXHR(xhr1);
                if (error) {
                    error(ERROR_MODE.SEVER_CONNECTION_ERROR);
                }
            });
        }

        public static uploadFile(file: any, success?: Function, error?: Function) {
            // Create a formdata object and add the files
            var data = new FormData();
            data.append("filename", file);

            var xhr1: JQueryXHR = $.ajax({
                url: Setting.getFileUploadPath() + "?files",
                type: "POST",
                data: data,
                cache: false,
                dataType: "json",
                processData: false, // Don't process the files
                contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                success: function (data, textStatus, jqXHR) {
                    Controller.removeXHR(xhr1);
                    if (typeof data.error === "undefined") {
                        if (success) {
                            success(data.files[0].replace(Setting.getRelativeFileUploadPath(), ""));
                        }
                    } else {
                        if (error) {
                            error();
                        }
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    Controller.removeXHR(xhr1);
                    if (error) {
                        error();
                    }
                }
            });
            Controller.pushXHR(xhr1);
        }
    }

    export class Router extends Backbone.Router {
        private static _instance: Router = new Router();
        private static TAG: string = "Router - ";
        constructor(options?: Backbone.RouterOptions) {
            if (Router._instance) {
                throw new Error("Error: Instantiation failed: Use Router.getInstance() instead of new.");
            }
            Router._instance = this;
            // Setup Router parameters
            this.routes = {
                "": "home",
                "mtrees/:viewMode/:id": "manageTrees",
                "mtree/:viewMode/:id": "manageTree",
                "mpeople/:viewMode/:id": "managePeople",
                "ptrees": "parentTrees",
            }
            super(options);
        }
        public static getInstance(): Router {
            return Router._instance;
        }
        home() {
            console.log(Router.TAG + "we have loaded the home page.");
            EventHandler.handleNavigate(VIEW_STATUS.HOME);
        }
        manageTrees(viewMode: VIEW_MODE, id: number) {
            console.log(Router.TAG + "we have loaded the manage trees page.");
            EventHandler.handleNavigate(VIEW_STATUS.MANAGE_TREES, { viewMode: viewMode, id: id });
        }
        manageTree(viewMode: VIEW_MODE, id: number) {
            console.log(Router.TAG + "we have loaded the manage tree page.");
            EventHandler.handleNavigate(VIEW_STATUS.DETAIL_TREE, { viewMode: viewMode, id: id });
        }
        managePeople(viewMode: VIEW_MODE, id: number) {
            console.log(Router.TAG + "we have loaded the manage trees page.");
            EventHandler.handleNavigate(VIEW_STATUS.MANAGE_PEOPLE, { viewMode: viewMode, id: id });
        }
    }
} 