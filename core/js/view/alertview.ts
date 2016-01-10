declare var AdoptionColumn;

module FoodParent {
    export class PostNoteViewFactory {
        private static _instance: PostNoteViewFactory = new PostNoteViewFactory();
        private baseUrl: string;
        constructor(args?: any) {
            if (PostNoteViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use PostNoteViewFactory.getInstance() instead of new.");
            }
            PostNoteViewFactory._instance = this;
        }
        public static getInstance(): PostNoteViewFactory {
            return PostNoteViewFactory._instance;
        }
        public static create(el: JQuery, tree: Tree): PostNoteView {
            var view: PostNoteView = new PostNoteView({ el: el });
            view.setTree(tree);
            return view;
        }
    }

    export class ImageNoteViewFactory {
        private static _instance: ImageNoteViewFactory = new ImageNoteViewFactory();
        private baseUrl: string;
        constructor(args?: any) {
            if (ImageNoteViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use ImageNoteViewFactory.getInstance() instead of new.");
            }
            ImageNoteViewFactory._instance = this;
        }
        public static getInstance(): ImageNoteViewFactory {
            return ImageNoteViewFactory._instance;
        }
        public static create(el: JQuery, note: Note): ImageNoteView {
            var view: ImageNoteView = new ImageNoteView({ el: el });
            view.setNote(note);
            return view;
        }
    }

    export class AdoptionManageViewFactory {
        private static _instance: AdoptionManageViewFactory = new AdoptionManageViewFactory();
        private baseUrl: string;
        constructor(args?: any) {
            if (AdoptionManageViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use AdoptionManageViewFactory.getInstance() instead of new.");
            }
            AdoptionManageViewFactory._instance = this;
        }
        public static getInstance(): AdoptionManageViewFactory {
            return AdoptionManageViewFactory._instance;
        }
        public static create(el: JQuery, tree: number): AdoptionManageView {
            var view: AdoptionManageView = new AdoptionManageView({ el: el });
            console.log(tree);
            view.setTree(tree);
            return view;
        }
    }

    export class ConfirmViewFractory {
        private static _instance: ConfirmViewFractory = new ConfirmViewFractory();
        private baseUrl: string;
        constructor(args?: any) {
            if (ConfirmViewFractory._instance) {
                throw new Error("Error: Instantiation failed: Use ConfirmViewFractory.getInstance() instead of new.");
            }
            ConfirmViewFractory._instance = this;
        }
        public static getInstance(): ConfirmViewFractory {
            return ConfirmViewFractory._instance;
        }
        public static create(el: JQuery, message: string, command: Command): ConfirmView {
            var view: ConfirmView = new ConfirmView({ el: el });
            view.setMessage(message);
            view.setCommand(command);
            return view;
        }
    }

    export class AlertViewFractory {
        private static _instance: AlertViewFractory = new AlertViewFractory();
        private baseUrl: string;
        constructor(args?: any) {
            if (AlertViewFractory._instance) {
                throw new Error("Error: Instantiation failed: Use AlertViewFractory.getInstance() instead of new.");
            }
            AlertViewFractory._instance = this;
        }
        public static getInstance(): AlertViewFractory {
            return AlertViewFractory._instance;
        }
        public static create(el: JQuery, errorMode: ERROR_MODE): AlertView {
            var view: AlertView = new AlertView({ el: el });
            view.setErrorMode(errorMode);
            return view;
        }
    }

    export class PopupView extends BaseView {

    }

    export class ImageNoteView extends PopupView {
        private static TAG: string = "ImageNoteView - ";
        private _note: Note;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: ImageNoteView = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = <any>{
                "click .alert-confirm": "_mouseClick",
                "click .top-right-button": "_mouseClick",
                "click .prev-note": "_prevNote",
                "click .next-note": "_nextNote",
                "click .image-group img": "_changeCoverImage",
                "click .delete-note": "_deleteNote",
            };
            self.delegateEvents();
        }
        public setNote(note: Note): void {
            var self: ImageNoteView = this;
            self._note = note;
        }
        public render(args?: any): any {
            if (this.bRendered) {
                this.update(args);
                return;
            }
            this.bRendered = true;
            /////
            var self: ImageNoteView = this;
            if (self.bDebug) console.log(ImageNoteView.TAG + "render()");
            var tree: Tree = Model.getTrees().findWhere({ id: self._note.getTreeId() });
            var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
            var template = _.template(Template.getImageNoteViewTemplate());
            var data = {
                name: food.getName() + " " + tree.getName(),
                image: Setting.getBlankImagePath(),
                value: self._note.getRate(),
                comment: self._note.getComment(),
                date: self._note.getFormattedHourTime(),
            }
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-note'));

            /*
            //self.$('.wrapper-note-content img').attr('src', self._note.getPicturePath()).load(function () {

            }).error(function () {
                self.$('.wrapper-note-content img').attr('src', Setting.getBlankImagePath());
            });
            */
            self.renderImageNote(self._note);
            self.setVisible();

            return self;
        }

        public renderImageNote(note: Note) {
            var self: ImageNoteView = this;
            var tree: Tree = Model.getTrees().findWhere({ id: note.getTreeId() });
            var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
            self.$('.name').html(food.getName() + " " + tree.getName());
            self.$('.input-rating').replaceWith('<div class="input-rating"></div>');
            self.$('.input-rating').html(Math.ceil(note.getRate()).toFixed(2) + " / " + Setting.getMaxRating().toFixed(2));

            self.$('.input-rating-slider').html("");
            var rate = rating(self.$('.input-rating-slider')[0], note.getRate().toFixed(2), Setting.getMaxRating(), function (rate) {
                if (Math.ceil(note.getRate()) != rate) {
                    EventHandler.handleNoteData(self._note, DATA_MODE.UPDATE_RATING, { rate: rate }, function () {
                        EventHandler.handleDataChange("Rating of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
                        self.renderImageNote(self._note);
                    }, function () {
                        EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                    });
                } else {
                    self.renderImageNote(self._note);
                }
            });

            self.$('.input-comment').replaceWith('<div class="input-comment"></div>');
            self.$('.input-comment').html(htmlDecode(self._note.getComment()));
            self.$('.input-date').html(note.getFormattedHourTime());

            self.$('.input-comment').on('click', function (event) {
                //$(this).replaceWith("<input type='text' class='input-comment form-control' value='" + htmlEncode($(this).text()) + "' />");
                $(this).replaceWith("<textarea rows='5' class='input-comment form-control'>" + self._note.getComment() + "</textarea>");
                //self.$('.input-lat').css({ width: width });
                self.$('.input-comment').focus();
                self.$('.input-comment').on('focusout', function (event) {
                    var comment: string = self.$('.input-comment').val();
                    if (self._note.getComment().trim() != comment.trim()) {
                        EventHandler.handleNoteData(self._note, DATA_MODE.UPDATE_COMMENT, { comment: comment }, function () {
                            EventHandler.handleDataChange("Comment of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
                            self.renderImageNote(self._note);
                        }, function () {
                            EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    } else {
                        self.renderImageNote(self._note);
                    }
                });
            });

            var tag = '';
            $.each(note.getPictures(), function (index: number, filename: string) {
                if (index == note.getCover()) {
                    tag += '<img src="' + Setting.getBlankImagePath() + '" data-target="' + index + '" class="selected" />';
                } else {
                    tag += '<img src="' + Setting.getBlankImagePath() + '" data-target="' + index + '" />';
                }
            });
            self.$('.image-group').html(tag);
            $.each(self.$('.image-group img'), function (index: number, element: JQuery) {
                $(element).attr('src', Setting.getContentPictureDir() + note.getPictures()[index]).load(function () {

                }).error(function () {
                    $(element).attr('src', Setting.getBlankImagePath());
                });
            });
            
        }

        public update(args?: any): any {
            if (!this.bRendered) {
                this.render(args);
                return self;
            }
            /////
            return self;
        }

        public resize(): any {
            var self: ImageNoteView = this;
        }

        private _mouseEnter(event: Event): void {
            var self: ImageNoteView = this;
            EventHandler.handleMouseEnter($(event.currentTarget), self);
        }
        private _mouseClick(event: Event): void {
            var self: ImageNoteView = this;
            EventHandler.handleMouseClick($(event.currentTarget), self);
        }

        private _prevNote(event: Event): void {
            var self: ImageNoteView = this;
            var notes: Notes = new Notes(Model.getNotes().where({ tree: self._note.getTreeId(), type: NoteType.IMAGE }));
            notes.sortByAscendingDate();
            var bFound: boolean = false;
            $.each(notes.models, function (index: number, note: Note) {
                if (self._note.getId() == note.getId() && !bFound) {
                    bFound = true;
                    if (index == 0) {
                        self._note = notes.models[notes.models.length - 1];
                    } else {
                        self._note = notes.models[index - 1];
                    }
                    self.renderImageNote(self._note);
                    return;
                }
            });
        }

        private _nextNote(event: Event): void {
            var self: ImageNoteView = this;
            var notes: Notes = new Notes(Model.getNotes().where({ tree: self._note.getTreeId(), type: NoteType.IMAGE }));
            notes.sortByAscendingDate();
            var bFound: boolean = false;
            $.each(notes.models, function (index: number, note: Note) {
                if (self._note.getId() == note.getId() && !bFound) {
                    bFound = true;
                    if (index == notes.models.length - 1) {
                        self._note = notes.models[0];
                    } else {
                        self._note = notes.models[index + 1];
                    }
                    self.renderImageNote(self._note);
                    return;
                }
            });
        }

        private _changeCoverImage(event: Event) {
            var self: ImageNoteView = this;
            var cover: number = parseInt($(event.target).attr('data-target'));
            var tree: Tree = Model.getTrees().findWhere({ id: self._note.getTreeId() });
            var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
            if (self._note.getCover() != cover) {
                EventHandler.handleNoteData(self._note, DATA_MODE.UPDATE_COVER, { cover: cover }, function () {
                    EventHandler.handleDataChange("Cover picture of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
                    self.renderImageNote(self._note);
                }, function () {
                    EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
                /*
                
                */
            }
            /*
            $.each(self.$('.image-group img'), function (index: number, element: JQuery) {
                $(element).removeClass('selected');
            });
            $(event.target).addClass('selected');
            self._note.setCover();
            */
        }

        private _deleteNote(event: Event) {
            var self: ImageNoteView = this;
            var tree: Tree = Model.getTrees().findWhere({ id: self._note.getTreeId() });
            var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
            EventHandler.handleNoteData(self._note, DATA_MODE.DELETE, { }, function () {
                EventHandler.handleDataChange("Note of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has been deleted successfully.", true);
                if (View.getDetailTreeView()) {
                    (<DetailTreeGraphicView>View.getDetailTreeView()).refreshTreeInfo();
                }
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }

        public setVisible(): void {
            var self: ImageNoteView = this;
            Setting.getPopWrapperElement().removeClass('hidden');
        }
        public setInvisible(): void {
            var self: ImageNoteView = this;
            Setting.getPopWrapperElement().addClass('hidden');
        }
    }

    export class AlertView extends PopupView {
        private static TAG: string = "AlertView - ";
        private _errorMode: ERROR_MODE;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: AlertView = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = <any>{
                "click .alert-confirm": "_mouseClick",
                "click .alert-cancel": "_mouseClick",
            };
            self.delegateEvents();
        }
        public setErrorMode(errorMode: ERROR_MODE): void {
            var self: AlertView = this;
            self._errorMode = errorMode;
        }
        public render(args?: any): any {
            if (this.bRendered) {
                this.update(args);
                return;
            }
            this.bRendered = true;
            /////
            var self: AlertView = this;
            if (self.bDebug) console.log(AlertView.TAG + "render()");

            var template = _.template(Template.getAlertViewTemplate());
            var data: any;
            var tag: string = "";
            switch (self._errorMode) {
                case ERROR_MODE.GEO_PERMISSION_ERROR:
                    tag += "<p>The device cannot find its's location information.<br />Please turn Geolocation setting on & refresh the page.</p>"
                    tag += "<div class='button-outer-frame button1'><div class='button-inner-frame alert-confirm'>Confirm</div></div>";
                    break;
                case ERROR_MODE.SEVER_CONNECTION_ERROR:
                    tag += "<p>There is a server connection error.<br/>If the issue won't be solved by the refreshing page,";
                    tag += "<br/>please contact <a href='mailto:" + Setting.getDevContact() + "'>" + Setting.getDevContact() + "</a>.</p>";
                    tag += "<div class='button-outer-frame button1'><div class='button-inner-frame alert-confirm'>Confirm</div></div>";
                    break;
            }
            data = {
                content: tag,
            }
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-alert'));

            self.setVisible();

            return self;
        }

        public update(args?: any): any {
            if (!this.bRendered) {
                this.render(args);
                return;
            }
            /////
            var self: AlertView = this;
            if (self.bDebug) console.log(AlertView.TAG + "update()");
            return self;
        }
        private _mouseEnter(event: Event): void {
            var self: AlertView = this;
            EventHandler.handleMouseEnter($(event.currentTarget), self);
        }
        private _mouseClick(event: Event): void {
            var self: AlertView = this;
            EventHandler.handleMouseClick($(event.currentTarget), self);
        }

        public setVisible(): void {
            var self: AlertView = this;
            Setting.getPopWrapperElement().removeClass('hidden');
        }
        public setInvisible(): void {
            var self: AlertView = this;
            Setting.getPopWrapperElement().addClass('hidden');
        }
    }

    export class ConfirmView extends PopupView {
        private static TAG: string = "ConfirmView - ";
        private _message: string;
        private _command: Command;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: ConfirmView = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = <any>{
                "click .confirm-confirm": "_executeCommand",
                "click .confirm-cancel": "_mouseClick",
            };
            self.delegateEvents();
        }
        public setMessage(message: string): void {
            var self: ConfirmView = this;
            self._message = message;
        }
        public setCommand(command: Command): void {
            var self: ConfirmView = this;
            self._command = command;
        }
        public render(args?: any): any {
            if (this.bRendered) {
                this.update(args);
                return;
            }
            this.bRendered = true;
            /////
            var self: ConfirmView = this;
            if (self.bDebug) console.log(ConfirmView.TAG + "render()");


            var tag: string = "";
            tag += "<p>" + self._message + "<br/> This action cannot be undone.</p>";
            tag += "<div class='confirm-button-group'>";
            tag += "<div class='button-outer-frame button1'><div class='button-inner-frame confirm-confirm'>Confirm</div></div>";
            tag += "<div class='button-outer-frame button1'><div class='button-inner-frame confirm-cancel'>Cancel</div></div>";
            tag += "</div>";
            var template = _.template(Template.getConfirmViewTemplate());
            var data = {
                content: tag,
            }
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-confirm'));

            self.setVisible();

            return self;
        }

        public update(args?: any): any {
            if (!this.bRendered) {
                this.render(args);
                return;
            }
            /////
            var self: ConfirmView = this;
            if (self.bDebug) console.log(ConfirmView.TAG + "update()");
            return self;
        }
        private _mouseEnter(event: Event): void {
            var self: ConfirmView = this;
            EventHandler.handleMouseEnter($(event.currentTarget), self);
        }
        private _mouseClick(event: Event): void {
            var self: ConfirmView = this;
            EventHandler.handleMouseClick($(event.currentTarget), self);
        }
        private _executeCommand(event: Event): void {
            var self: ConfirmView = this;
            self._command.execute();
            EventHandler.handleMouseClick($(event.currentTarget), self);
        }

        public setVisible(): void {
            var self: ConfirmView = this;
            Setting.getPopWrapperElement().removeClass('hidden');
        }
        public setInvisible(): void {
            var self: ConfirmView = this;
            Setting.getPopWrapperElement().addClass('hidden');
        }
    }

    export class AdoptionManageView extends PopupView {
        private static TAG: string = "AdoptionManageView - ";
        private _tree: Tree;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: AdoptionManageView = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = <any>{
                "click .confirm-confirm": "_executeCommand",
                "click .confirm-cancel": "_mouseClick",
                "click .button-close": "_mouseClick",
                "click .filter-checkbox": "_applyFilter",
            };
            self.delegateEvents();
        }
        public setTree(treeId: number): void {
            var self: AdoptionManageView = this;
            console.log(treeId);
            self._tree = Model.getTrees().findWhere({ id: treeId });
        }

        public getTree(): Tree {
            var self: AdoptionManageView = this;
            return self._tree;
        }
       
        public render(args?: any): any {
            if (this.bRendered) {
                this.update(args);
                return;
            }
            this.bRendered = true;
            /////
            var self: AdoptionManageView = this;
            if (self.bDebug) console.log(AdoptionManageView.TAG + "render()");

            var food: Food = Model.getFoods().findWhere({ id: self._tree.getFoodId() });

            var template = _.template(Template.getManageAdoptionViewTemplate());
            var data = {
                treename: food.getName() + " " + self._tree.getName(),
                treeId: self._tree.getId(),
            }
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-manage-adoption'));
            self.renderPersons();
            
            self.setVisible();
            self.resize();
            return self;
        }

        public update(args?: any): any {
            if (!this.bRendered) {
                this.render(args);
                return;
            }
            /////
            var self: AdoptionManageView = this;
            if (self.bDebug) console.log(AdoptionManageView.TAG + "update()");
            return self;
        }

        public resize(): any {
            var self: AdoptionManageView = this;
            $('#content-manage-adoption-table').css({ width: self.getWidth() - $('#wrapper-tablemenu').outerWidth() });
            $('#wrapper-main').css({ height: View.getHeight() - 60 });
            $('#wrapper-mtrees').css({ height: View.getHeight() - 60 });
            $('.collapsible-list').css({ height: self.getHeight() - 34 * 2 - 30 });
        }

        private renderPersons = () => {
            var self: AdoptionManageView = this;
            Controller.fetchAllPersonsAndAuthsAndFoodAndTreesAndAdopts(function () {
                // add grid instance for existing data
                self.renderPersonsList(Model.getPersons());
                self.renderFilterList();
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }

        public renderFilterList = () => {
            var self: AdoptionManageView = this;
            var template = _.template(Template.getAdoptionFilterListTemplate());
            var data = {
                auths: Model.getAuths(),
            }
            self.$('#filter-list').html(template(data));
        }

        public renderPersonsList = (persons: Persons) => {
            var self: AdoptionManageView = this;

            var grid = new Backgrid.Grid({
                columns: AdoptionColumn,
                collection: persons,
                emptyText: Setting.getNoDataText(),
            });
            grid.render();
            grid.sort("name", "ascending");
            self.$(".list-adoption").html(grid.el);
        }

        private _mouseClick(event: Event): void {
            var self: AdoptionManageView = this;
            EventHandler.handleMouseClick($(event.currentTarget), self);
        }

        public setVisible(): void {
            var self: AdoptionManageView = this;
            Setting.getPopWrapperElement().removeClass('hidden');
        }
        public setInvisible(): void {
            var self: AdoptionManageView = this;
            Setting.getPopWrapperElement().addClass('hidden');
        }

        public _applyFilter(event?: Event): void {
            var self: AdoptionManageView = this;
            var persons: Persons = Model.getPersons();
            setTimeout(function () {
                // Filtering food type.
                if (event != undefined) {
                    if ($(event.target).find('input').prop('name') == 'authsall') {
                        if ($(event.target).find('input').prop('checked') == true) {
                            $('.filter-auth').addClass('active');
                            $('.filter-auth input').prop({ 'checked': 'checked' });
                        } else {
                            $('.filter-auth').removeClass('active');
                            $('.filter-auth input').prop({ 'checked': '' });
                        }
                    }
                }
                

                // Apply auth filtering
                var authIds = new Array<number>();
                $.each(self.$('.filter-auth input'), function (index: number, item: JQuery) {
                    if ($(item).prop('checked') == true) {
                        authIds.push(Math.floor($(item).prop('name')));
                    }
                });

                persons = persons.filterByAuthIds(authIds);

                // Filtering adoption status.
                if (event != undefined) {
                    if ($(event.target).find('input').prop('name') == 'adoptsall') {
                        if ($(event.target).find('input').prop('checked') == true) {
                            $('.filter-adopt').addClass('active');
                            $('.filter-adopt input').prop({ 'checked': 'checked' });
                        } else {
                            $('.filter-adopt').removeClass('active');
                            $('.filter-adopt input').prop({ 'checked': '' });
                        }
                    }
                }

                // Apply adopt filtering
                var adoptIds = new Array<number>();
                $.each(self.$('.filter-adopt input'), function (index: number, item: JQuery) {
                    console.log($(item).prop('checked'));
                    if ($(item).prop('checked') == true) {
                        adoptIds.push(Math.floor($(item).prop('name')));
                    }
                });

                persons = persons.filterByAdoptStatusForTree(adoptIds, self._tree.getId());

                // update markers
                self.renderPersonsList(persons);
            }, 1);
        }
    }
}