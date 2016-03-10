module FoodParent {
    export class NavViewFractory {
        private static _instance: NavViewFractory = new NavViewFractory();
        private baseUrl: string;
        constructor(args?: any) {
            if (NavViewFractory._instance) {
                throw new Error("Error: Instantiation failed: Use NavViewFractory.getInstance() instead of new.");
            }
            NavViewFractory._instance = this;
        }
        public static getInstance(): NavViewFractory {
            return NavViewFractory._instance;
        }
        public static create(el: JQuery): NavView {
            var view: NavView = new NavView({ el: el });
            return view;
        }
    }

    export class NavView extends BaseView {
        private static TAG: string = "NavView - ";
        private _contact: string;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: NavView = this;
            self.bDebug = true;
            self._contact = "";
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = <any>{
                "click .item-nav": "_mouseClick",

            };
            self.delegateEvents();
        }
        public render(args?: any): any {
            super.render(args);
            var self: NavView = this;
            if (self.bDebug) console.log(NavView.TAG + "render()");
            var template = _.template(Template.getNavViewTemplate());
            self.$el.html(template({}));
            self.setElement(Setting.getNavWrapperElement());
            self.renderNavItems();
            return self;
        }

        public update(args?: any): any {
            super.update(args);
            var self: NavView = this;
            if (self.bDebug) console.log(NavView.TAG + "update()");
            self.renderNavItems();
            return self;
        }

        public resize(): any {
            var self: NavView = this;
            if (self.bDebug) console.log(NavView.TAG + "resize()");
            self.$('.text-contact').html('');
            $.each(self.$('#content-nav .item-nav'), function () {
                $(this).removeAttr('style');
            });
            $.each(self.$('#content-nav .item-nav'), function () {
                $(this).css({
                    width: $(this).outerWidth(),
                });
            });
            self.$('.text-contact').html('<span>' + self._contact + '</span>');
            self.$('.text-contact').textfill({ maxFontPixels: 16 });
        }

        /**
         * Render navigation menu items based on login / admin status
         */
        public renderNavItems(): void {
            var self: NavView = this;
            var template: any;
            Controller.checkIsLoggedIn(function (response) {
                self._contact = response.contact;
                Controller.checkIsAdmin(function () {
                    if (self.bDebug) console.log(NavView.TAG + "Logged in as admin");
                    template = _.template(Template.getNavViewTemplateForAdmin());
                    self.$('#content-nav').html(template({
                        contact: "",
                    }));
                    self.resize();
                    self.setActiveNavItem(View.getViewStatus());
                }, function () {
                    if (self.bDebug) console.log(NavView.TAG + "Logged in as parent");
                    template = _.template(Template.getNavViewTemplateForParent());
                    self.$('#content-nav').html(template({
                        contact: "",
                    }));
                    self.resize();
                    self.setActiveNavItem(View.getViewStatus());
                }, function () {
                    if (self.bDebug) console.log(NavView.TAG + "Error occured");
                });
            }, function () {
                if (self.bDebug) console.log(NavView.TAG + "Not logged in");
                template = _.template(Template.getNavViewTemplateForGuest());
                self.$('#content-nav').html(template({}));
                self.resize();
                self.setActiveNavItem(View.getViewStatus());
            }, function () {
                if (self.bDebug) console.log(NavView.TAG + "Error occured");
            });


            /*
            Controller.checkLogin(function (data) {
                if (data.result == true || data.result == 'true') {   // Is signed in
                    Controller.checkAdmin(function (data2) {
                        if (data2.result == true || data2.result == 'true') {   // Is admin
                            template = _.template(Template.getNavViewManageItemsTemplate2());
                            self.$('#list-nav').html(template({
                                contact: data2.contact,
                            }));
                        } else if (data2.result == false || data2.result == 'false') {   // Not admin
                            template = _.template(Template.getNavViewManageItemsTemplate3());
                            self.$('#list-nav').html(template({
                                contact: data.contact,
                            }));
                        }
                        self.setActiveNavItem(View.getViewStatus());
                    }, function () {

                    });
                } else if (data.result == false || data.result == 'false') {   // Not signed in
                    template = _.template(Template.getNavViewManageItemsTemplate());
                    self.$('#list-nav').html(template({}));
                    self.setActiveNavItem(View.getViewStatus());
                }
            }, function () {

            });
            */
        }

        public setActiveNavItem(viewStatus: VIEW_STATUS) {
            var self: NavView = this;
            if (self.bDebug) console.log(NavView.TAG + "setActiveNavItem()");
            if (viewStatus) {
                var _viewStatus = viewStatus;
            } else {
                var _viewStatus = View.getViewStatus();
            }
            switch (_viewStatus) {
                case VIEW_STATUS.HOME:
                    self.$el.addClass('hidden');
                    break;
                case VIEW_STATUS.TREES:
                case VIEW_STATUS.DETAIL_TREE:
                    self.$el.removeClass('hidden');
                    self.$('.item-nav').removeClass('active');
                    self.$('.evt-trees').addClass('active');
                    break;
                case VIEW_STATUS.MANAGE_PEOPLE:
                    self.$el.removeClass('hidden');
                    self.$('.item-nav').removeClass('active');
                    self.$('.people').addClass('active');
                    break;
                case VIEW_STATUS.LOGIN:
                    self.$el.removeClass('hidden');
                    self.$('.item-nav').removeClass('active');
                    self.$('.evt-login').addClass('active');
                    break;
            }
        }

        private _mouseClick(event: Event): void {
            var self: NavView = this;
            EventHandler.handleMouseClick($(event.currentTarget), self);
        }
    }
}