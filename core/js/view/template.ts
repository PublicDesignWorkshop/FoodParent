module FoodParent {
    export class Template {
        private static _instance: Template = new Template();
        private baseUrl: string;
        constructor(args?: any) {
            if (Template._instance) {
                throw new Error("Error: Instantiation failed: Use Template.getInstance() instead of new.");
            }
            Template._instance = this;
        }
        public static getInstance(): Template {
            return Template._instance;
        }

        public static getHomeViewTemplate(): string {
            var template = '';
            template += '<div id="wrapper-home">';
            template +=     '<div id="wrapper-logo">';
            template +=         '<img id="content-logo" class="button-logo" src="<%= image %>" />';
            template +=         '<div id="wrapper-description">';
            template +=             '<%= description %>';
            template +=         '</div>';
            template +=     '</div>';
            template += '</div>';
            return template;
        }

        public static getManagePeopleTableViewTemplate(): string {
            var template = '';
            template += '<div id="wrapper-mpeople">';
            template +=     '<div id="wrapper-mpeople-table">';
            template +=         '<div id="wrapper-tablemenu">';
            //template +=             '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 switch-map">Switch to Map View</div></div>';
            template +=             '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 add-person">Add A New Person</div></div>';
            template +=             '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 collapsible-button" data-target="#filter-list">Filter List</div></div>';
            template +=             '<div id="filter-list" class="collapsible-list">';
            template +=             '</div>';
            template +=         '</div>';

            template +=         '<div id="content-mpeople-table">';
            template +=             '<div class="new-person hidden">';
            template +=             '</div>';
            template +=             '<div class="list-title">List of People</div>';
            template +=             '<div class="list-people">';
            template +=             '</div>';
            template +=         '</div>';

            template +=     '</div>';
            template += '</div>';
            return template;
        }

        public static getManageTreesTableViewTemplate(): string {
            var template = '';
            template += '<div id="wrapper-mtrees">';
            template +=     '<div id="wrapper-mtrees-table">';
            template +=         '<div id="wrapper-tablemenu">';
            template +=             '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 switch-map">Switch to Map View</div></div>';
            template +=             '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 add-tree">Add A New Tree</div></div>';
            template +=             '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 collapsible-button" data-target="#filter-list">Filter List</div></div>';
            template +=             '<div id="filter-list" class="collapsible-list">';
            template +=             '</div>';

            template +=             '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 collapsible-button" data-target="#forage-list">Foragable List</div></div>';
            template +=             '<div id="forage-list" class="collapsible-list hidden">';
            template +=             '</div>';
            template +=         '</div>';

            template +=         '<div id="content-mtrees-table">';
            template +=             '<div class="new-tree hidden">';
            template +=             '</div>';
            template +=             '<div class="list-title">List of Trees</div>';
            template +=             '<div class="list-tree">';
            template +=             '</div>';
            template +=         '</div>';

            template +=     '</div>';
            template += '</div>';
            return template;
        }

        public static getManageTreesMapViewTemplate(): string {
            var template = '';
            template += '<div id="wrapper-mtrees">';
            template +=     '<div id="content-map">';
            template +=     '</div>';
            template +=     '<div id="wrapper-mapmenu">';
            template +=         '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 switch-table">Switch to Table View</div></div>';
            template +=         '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 add-tree">Add A New Tree</div></div>';
            template +=         '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 collapsible-button" data-target="#filter-list">Filter List</div></div>';
            template +=         '<div id="filter-list" class="collapsible-list">';
            template +=         '</div>';

            template +=         '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 collapsible-button" data-target="#forage-list">Foragable List</div></div>';
            template +=         '<div id="forage-list" class="collapsible-list hidden">';
            template +=         '</div>';
            template +=     '</div>';
            template +=     '<div id="wrapper-treeinfo" class="hidden">';
            template +=     '</div>';
            template +=     '</div>';
            template += '</div>';
            return template;
        }

        public static getTreesMapViewWrapperTemplate(): string {
            var template = '';
            template += '<div id="wrapper-trees">';
            template += '</div>';   // end of #wrapper-trees
            return template;
        }

        public static getTreesMapViewTemplateForGuest(): string {
            var template = '';
            template += '<div id="content-map">';
            template += '</div>';   // end of #content-map

            template += '<div id="wrapper-mapfilter">';
            template +=     '<div id="content-mapfilter">';
            template +=     '</div>';
            template +=     '<div id="wrapper-btn-mapfilter">';
            template +=         '<div class="btn-mapfilter">';
            template +=             '<div class="icon-mapfilter-status"><i class="fa fa-filter"></i></div>';
            template +=             '<div class="text-mapfilter-status">off</div>';
            template +=         '</div>';
            template +=         '<div class="btn-location btn-action evt-location">';
            template +=             '<div class="icon-location"><i class="fa fa-location-arrow"></i></div>';
            template +=         '</div>';
            template +=         '<div class="deco-mapfilter">';
            template +=         '</div>';
            template +=     '</div>';   // end of #wrapper-treeinfo
            template += '</div>';   // end of #wrapper-mapfilter

            template += '<div id="wrapper-treeinfo" class="hidden">';
            template += '</div>';   // end of #wrapper-treeinfo

            template += '<div id="wrapper-mapmenu">';
            template +=     '<div id="wrapper-food-search">';
            template +=         '<div id="wrapper-list-food" class="hidden">';
            template +=             '<div id="list-food" class=""></div>';
            template +=         '</div>'; // end of #wrapper-list-food
            template +=         '<div class="bottom-filters">';
            template +=             '<div class="search-box form-group">';
            template +=                 '<input type="text" class="form-control" id="input-search-food" type="search" placeholder="Search by Food Name" value=""/>';
            template +=             '</div>';   // end of .form-group
            template +=         '</div>';   // end of .bottom-filters
            template +=     '</div>';   // end of #wrapper-food-search
            template += '</div>';   // end of #wrapper-mapmenu
            return template;
        }
        public static getTreesMapViewTemplateForParent(): string {
            var template = '';
            template += '<div id="content-map">';
            template += '</div>';   // end of #content-map

            template += '<div id="wrapper-mapfilter">';
            template +=     '<div id="content-mapfilter">';
            template +=     '</div>';
            template +=     '<div id="wrapper-btn-mapfilter">';
            template +=         '<div class="btn-mapfilter">';
            template +=             '<div class="icon-mapfilter-status"><i class="fa fa-filter"></i></div>';
            template +=             '<div class="text-mapfilter-status">off</div>';
            template +=         '</div>';
            template +=         '<div class="btn-location btn-action evt-location">';
            template +=             '<div class="icon-location"><i class="fa fa-location-arrow"></i></div>';
            template +=         '</div>';
            template +=         '<div class="deco-mapfilter">';
            template +=         '</div>';
            template +=     '</div>';   // end of #wrapper-treeinfo
            template += '</div>';   // end of #wrapper-mapfilter

            template += '<div id="wrapper-treeinfo" class="hidden">';
            template += '</div>';   // end of #wrapper-treeinfo
            template += '<div id="wrapper-mapmenu">';
            template +=     '<div id="wrapper-food-search">';
            template +=         '<div id="wrapper-list-food" class="hidden">';
            template +=             '<div id="list-food" class=""></div>';
            template +=         '</div>'; // end of #wrapper-list-food
            template +=         '<div class="bottom-filters">';
            template +=             '<input id="checkbox-mytrees" type="checkbox" data-toggle="toggle" />';
            template +=             '<div class="search-box form-group">';
            template +=                 '<input type="text" class="form-control" id="input-search-food" type="search" placeholder="Search by Food Name" value=""/>';
            template +=             '</div>';   // end of .form-group
            template +=         '</div>';   // end of .bottom-filters
            template +=     '</div>';   // end of #wrapper-food-search
            template += '</div>';   // end of #wrapper-mapmenu
            return template;
        }
        public static getTreesMapViewTemplateForAdmin(): string {
            var template = '';
            template += '<div id="content-map">';
            template += '</div>';   // end of #content-map

            template += '<div id="wrapper-mapfilter">';
            template +=     '<div id="content-mapfilter">';
            template +=     '</div>';
            template +=     '<div id="wrapper-btn-mapfilter">';
            template +=         '<div class="btn-mapfilter">';
            template +=             '<div class="icon-mapfilter-status"><i class="fa fa-filter"></i></div>';
            template +=             '<div class="text-mapfilter-status">off</div>';
            template +=         '</div>';
            template +=         '<div class="btn-location btn-action evt-location">';
            template +=             '<div class="icon-location"><i class="fa fa-location-arrow"></i></div>';
            template +=         '</div>';
            template +=         '<div class="btn-add-tree btn-action evt-add-tree">';
            template +=             '<div class="icon-add-tree"><i class="fa fa-plus"></i></div>';
            template +=         '</div>';
            template +=         '<div class="btn-tree-table btn-action evt-tree-table">';
            template +=             '<div class="icon-tree-table"><i class="fa fa-th-list"></i></div>';
            template +=         '</div>';
            template +=         '<div class="deco-mapfilter">';
            template +=         '</div>';
            template +=     '</div>';   // end of #wrapper-treeinfo
            template += '</div>';   // end of #wrapper-mapfilter

            template += '<div id="wrapper-treeinfo" class="hidden">';
            template += '</div>';   // end of #wrapper-treeinfo
            template += '<div id="wrapper-mapmenu">';
            template +=     '<div id="wrapper-food-search">';
            template +=         '<div id="wrapper-list-food" class="hidden">';
            template +=             '<div id="list-food" class=""></div>';
            template +=         '</div>'; // end of #wrapper-list-food
            template +=         '<div class="bottom-filters">';
            template +=             '<input id="checkbox-mytrees" type="checkbox" data-toggle="toggle" />';
            template +=             '<div class="search-box form-group">';
            template +=                 '<input type="text" class="form-control" id="input-search-food" type="search" placeholder="Search by Food Name" value=""/>';
            template +=             '</div>';   // end of .form-group
            template +=         '</div>';   // end of .bottom-filters
            template +=     '</div>';   // end of #wrapper-food-search
            template += '</div>';   // end of #wrapper-mapmenu
            return template;
        }
        

        public static getFoodItemTemplate(): string {
            var template = "";
            template += '<% _.each(foods.models, function (food) { %>';
            template += '<div class="item-food text-food" data-id="<%= food.getId() %>"><span><%= food.getName() %></span></div>';
            template += '<% }); %>';
            return template;
        }

        public static getNavViewTemplate(): string {
            var template = '';
            template += '<div id="content-nav">';
            template += '</div>';
            return template;
        }

        public static getNavViewTemplateForGuest(): string {
            var template = '';
            template += '<div class="item-nav text-title evt-title">FoodParent</div>';
            template += '<div class="item-nav evt-trees">TREES</div>';
            template += '<div class="deco-login"><div></div></div>';
            template += '<div class="item-nav text-login evt-login">PARENT IN</div>';
            return template;
        }

        public static getNavViewTemplateForParent(): string {
            var template = '';
            template += '<div class="item-nav text-title evt-title">FoodParent</div>';
            template += '<div class="item-nav evt-trees">TREES</div>';
            template += '<div class="deco-login"><div></div></div>';
            template += '<div class="item-nav text-parent evt-login"><div>you are logged in as:</div><div class="text-contact"><span><%= contact %></span></div></div>';
            return template;
        }

        public static getNavViewTemplateForAdmin(): string {
            var template = '';
            template += '<div class="item-nav text-title evt-title">FoodParent</div>';
            template += '<div class="item-nav evt-trees">TREES</div>';
            template += '<div class="item-nav evt-parents">PARENTS</div>';
            template += '<div class="item-nav evt-donations">DONATIONS</div>';
            template += '<div class="deco-login"><div></div></div>';
            template += '<div class="item-nav text-parent evt-login"><div>you are logged in as:</div><div class="text-contact"><span><%= contact %></span></div></div>';
            return template;
        }

        public static getNavViewManageItemsTemplate2(): string {
            var template = '';
            template += '<div class="item-nav title">FoodParent</div>';
            template += '<div class="item-nav trees">TREES</div>';
            template += '<div class="item-nav people">PARENTS</div>';
            template += '<div class="item-nav donations">DONATIONS</div>';
            template += '<div class="item-nav login"><div class="login-decoration"><div></div></div><div class="login-text loggedinas">you are logged in as: <br /> <%= contact %></div>';
            return template;
        }

        public static getNavViewManageItemsTemplate3(): string {
            var template = '';
            template += '<div class="item-nav title">FoodParent</div>';
            template += '<div class="item-nav trees">TREES</div>';

            template += '<div class="item-nav loggedin"><div class="login-decoration"><div></div></div><div class="login-text loggedinas">you are logged in as: <br/><span class="loggedin-contact"><%= contact %></span></div></div>';
            return template;
        }

        public static getConfirmViewTemplate(): string {
            var template = '';
            template += '<div id="wrapper-confirm" class="frame-pop">';
            template +=     '<div id="frame-confirm">';

            template +=         '<div id="content-header">';
            template +=             '<div class="text-header"><%= header %></div>';
            template +=             '<div class="btn-close evt-close">';
            template +=                 '<i class="fa fa-remove"></i>';
            template +=             '</div>';   // end of top-right-button button-close
            template +=         '</div>';   // end of #wrapper-header

            template +=         '<div class="info-group">';
            template +=             '<div class="text-label"><%= message %><br/><i>*This action cannot be undone.</i></div>';
            template +=         '</div>';   // end of .info-group
            template +=         '<hr />';

            template +=         '<div class="info-button-group">';
            template +=             '<div class="btn-brown btn-medium evt-submit">Submit</div>';
            template +=         '</div>';   // end of .info-button-group

            template +=         '<div class="info-button-group">';
            template +=             '<div class="btn-brown btn-medium evt-close">Cancel</div>';
            template +=         '</div>';   // end of .info-button-group
            template +=     '</div>';
            template += '</div>';
            return template;
        }

        public static getAlertViewTemplate(): string {
            var template = '';
            template += '<div id="wrapper-confirm" class="frame-pop">';
            template +=     '<div id="frame-confirm">';

            template +=         '<div id="content-header">';
            template +=             '<div class="text-header"><%= header %></div>';
            template +=             '<div class="btn-close evt-close">';
            template +=                 '<i class="fa fa-remove"></i>';
            template +=             '</div>';   // end of top-right-button button-close
            template +=         '</div>';   // end of #wrapper-header

            template +=         '<div class="info-group">';
            template +=             '<div class="text-label"><%= message %></div>';
            template +=         '</div>';   // end of .info-group
            template +=         '<hr />';

            template +=         '<div class="info-button-group">';
            template +=             '<div class="btn-brown btn-medium evt-close">Confirm</div>';
            template +=         '</div>';   // end of .info-button-group

            template +=     '</div>';
            template += '</div>';
            return template;
        }

        public static getMessageViewTemplate(): string {
            var template = '';
            template += '<div class="outer-frame">';
            template += '<div class="inner-frame">';
            template += '<%= content %>';
            template += '</div>';
            template += '</div>';
            return template;
        }

        public static getMessageUndoableViewTemplate(): string {
            var template = '';
            template += '<div class="outer-frame">';
            template += '<div class="inner-frame">';
            template += '<%= content %>';
            template += '<div class="undo">Undo change</div>';
            template += '</div>';
            template += '</div>';
            return template;
        }

        public static getManageTreesPopupTemplateForAdmin(): string {
            var template = '';
            template += '<div class="marker-control-wrapper">';
            template +=     '<div class="marker-control-item btn-action evt-marker-lock">';
            template +=         '<i class="fa fa-lock fa-2x"></i>';
            template +=     '</div>';
            template +=     '<div class="marker-control-item btn-action evt-manage-adopt">';
            template +=         '<i class="fa fa-users fa-2x"></i>';
            template +=     '</div>';
            template +=     '<div class="marker-control-text btn-action evt-detail">';
            template +=         '<i class="fa fa-heartbeat fa-2x"></i><i class="fa fa-remove"></i><span id="text-rating" class="text-marker-control"></span>';
            template +=     '</div>';
            template +=     '<div class="marker-control-item btn-action evt-tree-remove">';
            template +=         '<i class="fa fa-trash-o fa-2x"></i>';
            template +=     '</div>';
            template += '</div>';
            return template;
        }

        public static getManageTreesPopupTemplate2(): string {
            var template = '';
            template += '<div class="marker-control-wrapper">';
            template += '<div class="marker-control-item marker-control-plus">';
            template += '<i class="fa fa-plus fa-2x"></i>';
            template += '</div>';
            template += '</div>';
            return template;
        }

        public static getManageTreesPopupTemplateForGuestAndParent(): string {
            var template = '';
            template += '<div class="marker-control-wrapper">';
            template +=     '<div class="marker-control-text btn-action evt-detail">';
            template +=         '<i class="fa fa-heartbeat fa-2x"></i><i class="fa fa-remove"></i><span id="text-rating" class="text-marker-control"></span>';
            template +=     '</div>';
            template += '</div>';
            return template;
        }

        public static FoodSelectTemplate(): string {
            var template = '';

            template += '<select class="input-food selectpicker">';
            template +=     '<optgroup label="Food">';
            template +=     '<% _.each(foods.models, function (food) { %>';
            template +=         '<option value="<%= food.getId() %>"><%= food.getName() %></option>';
            template +=     '<% }); %>';
            template +=     '</optgroup>';
            template += '</select>';

            return template;
        }

        public static TreeSelectTemplate(): string {
            var template = '';

            template += '<select class="input-tree selectpicker" data-size="10">';
            template += '<option value="0" disabled>Add a Tree</option>';
            template += '<optgroup label="Tree">';
            template += '<% _.each(trees.models, function (tree) { %>';
            template += '<% var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() }); %>';
            template += '<option value="<%= tree.getId() %>"><%= food.getName() + " " + tree.getName() %></option>';
            template += '<% }); %>';
            template += '</optgroup>';
            template += '</select>';

            return template;
        }

        

        public static getTreeInfoTemplate(): string {
            var template = '';
            template += '<div class="tree-info-name"><div class="input-food"><%= foodname %></div>&nbsp;<%= treename %></div>';
            template += '<div class="tree-info-coordinate"><div>@&nbsp;</div><div class="input-lat"><%= lat %></div>,&nbsp;<div class="input-lng"><%= lng %></div></div>';
            
            template += '<div class="info-group">';
            template += '<div class="input-address">&nbsp;</div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-sticky-note fa-1x"></i> Description</div>';
            template += '<div class="info-group">';
            template += '<div class="input-description"><%= description %></div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-user fa-1x"></i> Parents</div>';
            template += '<div class="info-group info-group-flex">';
            template += '<% _.each(persons.models, function (person, index) { %>';
            template +=     '<% if (index < persons.models.length - 1) { %>';
            template +=         '<div><%= person.getName() %>,&nbsp;</div>';
            template +=     '<% } else { %>';
            template +=         '<div><%= person.getName() %></div>';
            template +=     '<% } %>';
            template += '<% }); %>';
            template += '</div>';
            
            

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-tag fa-1x"></i> Status</div>';
            template += '<div class="info-group">';
            template += '<div data-toggle="buttons">';
            template += '<% _.each(flags.models, function (flag) { %>';
            template +=     '<label class="btn flag-radio" data-target="<%= flag.getId() %>">';
            template +=     '<input type="checkbox" name="flag">';
            template +=     '<i class="fa fa-square-o fa-1x"></i>';
            template +=     '<i class="fa fa-check-square-o fa-1x"></i>';
            template +=     ' <%= flag.getName() %></label>';
            template += '<% }); %>';
            template += '</div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-home fa-1x"></i> Ownership</div>';
            template += '<div class="info-group">';
            template += '<div data-toggle="buttons">';
            template += '<% _.each(ownerships.models, function (ownership) { %>';
            template +=     '<label class="btn ownership-radio" data-target="<%= ownership.getId() %>">';
            template +=     '<input type="radio" name="ownership">';
            template +=     '<i class="fa fa-circle-o fa-1x"></i>';
            template +=     '<i class="fa fa-check-circle-o fa-1x"></i>';
            template +=     ' <%= ownership.getName() %></label>';
            template += '<% }); %>';
            template += '</div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-leaf fa-1x"></i> Recent Notes</div>';
            template += '<div id="list-activities" class="info-group">';
            template += '<div>&nbsp;</div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-button">';
            template += '<div class="button-outer-frame2 button5"><div class="button-inner-frame2 button-tree-detail"><i class="fa fa-heartbeat"></i> See Tree Detail</div></div>';
            template += '<div class="button-outer-frame2 button5"><div class="button-inner-frame2 button-manage-adoption"><i class="fa fa-user-plus"></i> Manage Adoption</div></div>';
            template += '<div class="button-outer-frame2 button5"><div class="button-inner-frame2 button-new-note"><i class="fa fa-sticky-note-o"></i> Post New Note</div></div>';
            return template;
        }

        public static getTreeBasicInfoTemplateForGuest(): string {
            var template = '';
            template += '<div id="content-header">';
            template +=     '<div class="tree-info-name"><div class="input-food"><%= foodname %></div>&nbsp;<%= treename %></div>';
            template += '</div>';   // end of #wrapper-header
            

            template += '<div class="info-group-flex">';
            template +=     '<i class="fa fa-at"></i>&nbsp<div class="tree-info-coordinate"><div class="input-lat"><%= lat %></div>,&nbsp;<div class="input-lng"><%= lng %></div></div>';
            template += '</div>';

            template += '<div class="info-group-flex">';
            template +=     '<i class="fa fa-map-marker"></i>&nbsp&nbsp<div class="input-address">&nbsp;</div>';
            template += '</div>';

            template += '<div class="info-group-flex">';
            template +=     '<i class="fa fa-sticky-note"></i>&nbsp&nbsp<div class="input-description"><%= description %></div>';
            template += '</div>';

            template += '<div class="content-status">';
            template +=     '<div class="info-group">';
            template +=         '<div data-toggle="buttons"><i class="fa fa-tag"></i> ';
            template +=         '<% _.each(flags.models, function (flag) { %>';
            template +=             '<label class="btn flag-radio" data-target="<%= flag.getId() %>">';
            template +=             '<input type="checkbox" name="flag">';
            template +=             '<i class="fa fa-square-o fa-1x"></i>';
            template +=             '<i class="fa fa-check-square-o fa-1x"></i>';
            template +=             ' <%= flag.getName() %></label>';
            template +=         '<% }); %>';
            template +=         '</div>';
            template +=     '</div>';
            template += '</div>';

            template += '<div class="info-group">';
            template +=     '<div data-toggle="buttons"><i class="fa fa-home"></i> ';
            template +=     '<% _.each(ownerships.models, function (ownership) { %>';
            template +=         '<label class="btn ownership-radio" data-target="<%= ownership.getId() %>">';
            template +=         '<input type="radio" name="ownership">';
            template +=         '<i class="fa fa-circle-o fa-1x"></i>';
            template +=         '<i class="fa fa-check-circle-o fa-1x"></i>';
            template +=         ' <%= ownership.getName() %></label>';
            template +=     '<% }); %>';
            template +=     '</div>';
            template += '</div>';
            return template;
        }

        public static getTreeInfoTemplate3(): string {
            var template = '';
            template += '<div class="tree-info-name"><div class="input-food"><%= foodname %></div>&nbsp;<%= treename %></div>';
            template += '<div class="tree-info-coordinate"><div>@&nbsp;</div><div class="input-lat"><%= lat %></div>,&nbsp;<div class="input-lng"><%= lng %></div></div>';
            
            template += '<div class="info-group">';
            template += '<div class="input-address">&nbsp;</div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-sticky-note fa-1x"></i> Description</div>';
            template += '<div class="info-group">';
            template += '<div class="input-description"><%= description %></div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-user fa-1x"></i> Parents</div>';
            template += '<div class="info-group info-group-flex">';
            template += '<% _.each(persons.models, function (person, index) { %>';
            template += '<% if (index < persons.models.length - 1) { %>';
            template += '<div><%= person.getName() %>,&nbsp;</div>';
            template += '<% } else { %>';
            template += '<div><%= person.getName() %></div>';
            template += '<% } %>';
            template += '<% }); %>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-leaf fa-1x"></i> Recent Notes</div>';
            template += '<div id="list-activities" class="info-group">';
            template += '<div>&nbsp;</div>';
            template += '</div>';


            return template;
        }

        public static getTreeInfoTemplateForGuest(): string {
            var template = '';
            template += '<div id="content-header">';
            template +=     '<div class="tree-info-name"><div class="input-food"><%= foodname %></div>&nbsp;<%= treename %></div>';
            template +=     '<div class="btn-close evt-close">';
            template +=         '<i class="fa fa-remove"></i>';
            template +=     '</div>';   // end of top-right-button button-close
            template += '</div>';   // end of #wrapper-header

            //template += '<div class="tree-info-name"><div class="input-food"><%= foodname %></div>&nbsp;<%= treename %></div>';
            //template += '<div class="tree-info-coordinate"><div>@&nbsp;</div><div class="input-lat"><%= lat %></div>,&nbsp;<div class="input-lng"><%= lng %></div></div>';

            template += '<div class="info-group">';
            template +=     '<div class="input-address">&nbsp;</div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-sticky-note fa-1x"></i> Description</div>';
            template += '<div class="info-group">';
            template +=     '<div class="input-description"><%= description %></div>';
            template += '</div>';

            template += '<div class="content-status">';
            template +=     '<div class="hr"><hr /></div>';
            template +=     '<div class="info-header"><i class="fa fa-tag fa-1x"></i> Status</div>';
            template +=     '<div class="info-group">';
            template +=         '<div data-toggle="buttons">';
            template +=         '<% _.each(flags.models, function (flag) { %>';
            template +=             '<label class="btn flag-radio" data-target="<%= flag.getId() %>">';
            template +=             '<input type="checkbox" name="flag">';
            template +=             '<i class="fa fa-square-o fa-1x"></i>';
            template +=             '<i class="fa fa-check-square-o fa-1x"></i>';
            template +=             ' <%= flag.getName() %></label>';
            template +=         '<% }); %>';
            template +=         '</div>';
            template +=     '</div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-leaf fa-1x"></i> Recent Notes</div>';
            template += '<div id="list-comments" class="info-group">';
            template +=     '<div>&nbsp;</div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-button">';
            template +=     '<div class="btn-white btn-small btn-action evt-detail"><i class="fa fa-heartbeat"></i> See Detail</div>';
            template +=     '<div class="btn-white btn-small btn-action evt-post"><i class="fa fa-sticky-note-o"></i> Post Note</div>';
            template += '</div>';
            return template;
        }

        public static getUnadoptedTreeInfoTemplateForParent(): string {
            var template = '';
            template += '<div id="content-header">';
            template +=     '<div class="tree-info-name"><div class="input-food"><%= foodname %></div>&nbsp;<%= treename %></div>';
            template +=     '<div class="btn-close evt-close">';
            template +=         '<i class="fa fa-remove"></i>';
            template +=     '</div>';   // end of top-right-button button-close
            template += '</div>';   // end of #wrapper-header

            template += '<div class="info-group">';
            template +=     '<div class="input-address">&nbsp;</div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-sticky-note fa-1x"></i> Description</div>';
            template += '<div class="info-group">';
            template +=     '<div class="input-description"><%= description %></div>';
            template += '</div>';

            template += '<div class="content-status">';
            template +=     '<div class="hr"><hr /></div>';
            template +=     '<div class="info-header"><i class="fa fa-tag fa-1x"></i> Status</div>';
            template +=     '<div class="info-group">';
            template +=         '<div data-toggle="buttons">';
            template +=         '<% _.each(flags.models, function (flag) { %>';
            template +=             '<label class="btn flag-radio" data-target="<%= flag.getId() %>">';
            template +=             '<input type="checkbox" name="flag">';
            template +=             '<i class="fa fa-square-o fa-1x"></i>';
            template +=             '<i class="fa fa-check-square-o fa-1x"></i>';
            template +=             ' <%= flag.getName() %></label>';
            template +=         '<% }); %>';
            template +=         '</div>';
            template +=     '</div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-leaf fa-1x"></i> Recent Notes</div>';
            template += '<div id="list-comments" class="info-group">';
            template +=     '<div>&nbsp;</div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-button">';
            template +=     '<div class="btn-white btn-small btn-action evt-detail"><i class="fa fa-heartbeat"></i> See Detail</div>';
            template +=     '<div class="btn-white btn-small btn-action evt-adopt"><i class="fa fa-user-plus"></i> Adopt Tree</div>';
            template +=     '<div class="btn-white btn-small btn-action evt-post"><i class="fa fa-sticky-note-o"></i> Post Note</div>';
            template += '</div>';
            return template;
        }

        public static getAdoptedTreeInfoTemplateForParent(): string {
            var template = '';
            template += '<div id="content-header">';
            template +=     '<div class="tree-info-name"><div class="input-food"><%= foodname %></div>&nbsp;<%= treename %></div>';
            template +=     '<div class="btn-close evt-close">';
            template +=         '<i class="fa fa-remove"></i>';
            template +=     '</div>';   // end of top-right-button button-close
            template += '</div>';   // end of #wrapper-header

            template += '<div class="info-group">';
            template +=     '<div class="input-address">&nbsp;</div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-sticky-note fa-1x"></i> Description</div>';
            template += '<div class="info-group">';
            template +=     '<div class="input-description"><%= description %></div>';
            template += '</div>';

            template += '<div class="content-status">';
            template +=     '<div class="hr"><hr /></div>';
            template +=     '<div class="info-header"><i class="fa fa-tag fa-1x"></i> Status</div>';
            template +=     '<div class="info-group">';
            template +=         '<div data-toggle="buttons">';
            template +=         '<% _.each(flags.models, function (flag) { %>';
            template +=             '<label class="btn flag-radio" data-target="<%= flag.getId() %>">';
            template +=             '<input type="checkbox" name="flag">';
            template +=             '<i class="fa fa-square-o fa-1x"></i>';
            template +=             '<i class="fa fa-check-square-o fa-1x"></i>';
            template +=             ' <%= flag.getName() %></label>';
            template +=         '<% }); %>';
            template +=         '</div>';
            template +=     '</div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-leaf fa-1x"></i> Recent Notes</div>';
            template += '<div id="list-comments" class="info-group">';
            template +=     '<div>&nbsp;</div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-button">';
            template +=     '<div class="btn-white btn-small btn-action evt-detail"><i class="fa fa-heartbeat"></i> See Detail</div>';
            template +=     '<div class="btn-white btn-small btn-action evt-unadopt"><i class="fa fa-user-times"></i> Unadopt Tree</div>';
            template +=     '<div class="btn-white btn-small btn-action evt-post"><i class="fa fa-sticky-note-o"></i> Post Note</div>';
            template += '</div>';
            return template;
        }

        public static getAdoptedTreeInfoTemplateForAdmin(): string {
            var template = '';
            template += '<div id="content-header">';
            template +=     '<div class="tree-info-name"><div class="input-food"><%= foodname %></div>&nbsp;<%= treename %></div>';
            template +=     '<div class="btn-close evt-close">';
            template +=         '<i class="fa fa-remove"></i>';
            template +=     '</div>';   // end of top-right-button button-close
            template += '</div>';   // end of #wrapper-header

            template += '<div class="tree-info-coordinate"><div>@&nbsp;</div><div class="input-lat"><%= lat %></div>,&nbsp;<div class="input-lng"><%= lng %></div></div>';

            template += '<div class="info-group">';
            template +=     '<div class="input-address">&nbsp;</div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-sticky-note fa-1x"></i> Description</div>';
            template += '<div class="info-group">';
            template +=     '<div class="input-description"><%= description %></div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-user fa-1x"></i> Parents</div>';
            template += '<div class="info-group info-group-flex btn-action evt-manage-adopt">';
            template += '<% _.each(persons.models, function (person, index) { %>';
            template +=     '<% if (index < persons.models.length - 1) { %>';
            template +=         '<div><%= person.getName() %>,&nbsp;</div>';
            template +=     '<% } else { %>';
            template +=         '<div><%= person.getName() %></div>';
            template +=     '<% } %>';
            template += '<% }); %>';
            template += '</div>';

            template += '<div class="content-status">';
            template +=     '<div class="hr"><hr /></div>';
            template +=     '<div class="info-header"><i class="fa fa-tag fa-1x"></i> Status</div>';
            template +=     '<div class="info-group">';
            template +=         '<div data-toggle="buttons">';
            template +=         '<% _.each(flags.models, function (flag) { %>';
            template +=             '<label class="btn flag-radio" data-target="<%= flag.getId() %>">';
            template +=             '<input type="checkbox" name="flag">';
            template +=             '<i class="fa fa-square-o fa-1x"></i>';
            template +=             '<i class="fa fa-check-square-o fa-1x"></i>';
            template +=             ' <%= flag.getName() %></label>';
            template +=         '<% }); %>';
            template +=         '</div>';
            template +=     '</div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-home fa-1x"></i> Ownership</div>';
            template += '<div class="info-group">';
            template +=     '<div data-toggle="buttons">';
            template +=     '<% _.each(ownerships.models, function (ownership) { %>';
            template +=         '<label class="btn ownership-radio" data-target="<%= ownership.getId() %>">';
            template +=         '<input type="radio" name="ownership">';
            template +=         '<i class="fa fa-circle-o fa-1x"></i>';
            template +=         '<i class="fa fa-check-circle-o fa-1x"></i>';
            template +=         ' <%= ownership.getName() %></label>';
            template +=     '<% }); %>';
            template +=     '</div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-leaf fa-1x"></i> Recent Notes</div>';
            template += '<div id="list-comments" class="info-group">';
            template +=     '<div>&nbsp;</div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-button">';
            template +=     '<div class="btn-white btn-small btn-action evt-detail"><i class="fa fa-heartbeat"></i> See Detail</div>';
            template +=     '<div class="btn-white btn-small btn-action evt-unadopt"><i class="fa fa-user-times"></i> Unadopt Tree</div>';
            template +=     '<div class="btn-white btn-small btn-action evt-post"><i class="fa fa-sticky-note-o"></i> Post Note</div>';
            template += '</div>';
            return template;
        }

        public static getUnadoptedTreeInfoTemplateForAdmin(): string {
            var template = '';
            template += '<div id="content-header">';
            template +=     '<div class="tree-info-name"><div class="input-food"><%= foodname %></div>&nbsp;<%= treename %></div>';
            template +=     '<div class="btn-close evt-close">';
            template +=         '<i class="fa fa-remove"></i>';
            template +=     '</div>';   // end of top-right-button button-close
            template += '</div>';   // end of #wrapper-header

            template += '<div class="tree-info-coordinate"><div>@&nbsp;</div><div class="input-lat"><%= lat %></div>,&nbsp;<div class="input-lng"><%= lng %></div></div>';

            template += '<div class="info-group">';
            template +=     '<div class="input-address">&nbsp;</div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-sticky-note fa-1x"></i> Description</div>';
            template += '<div class="info-group">';
            template +=     '<div class="input-description"><%= description %></div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-user fa-1x"></i> Parents</div>';
            template += '<div class="info-group info-group-flex  btn-action evt-manage-adopt">';
            template += '<% _.each(persons.models, function (person, index) { %>';
            template +=     '<% if (index < persons.models.length - 1) { %>';
            template +=         '<div><%= person.getName() %>,&nbsp;</div>';
            template +=     '<% } else { %>';
            template +=         '<div><%= person.getName() %></div>';
            template +=     '<% } %>';
            template += '<% }); %>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-tag fa-1x"></i> Status</div>';
            template += '<div class="info-group">';
            template +=     '<div data-toggle="buttons">';
            template +=     '<% _.each(flags.models, function (flag) { %>';
            template +=         '<label class="btn flag-radio" data-target="<%= flag.getId() %>">';
            template +=         '<input type="checkbox" name="flag">';
            template +=         '<i class="fa fa-square-o fa-1x"></i>';
            template +=         '<i class="fa fa-check-square-o fa-1x"></i>';
            template +=         ' <%= flag.getName() %></label>';
            template +=     '<% }); %>';
            template +=     '</div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-home fa-1x"></i> Ownership</div>';
            template += '<div class="info-group">';
            template +=     '<div data-toggle="buttons">';
            template +=     '<% _.each(ownerships.models, function (ownership) { %>';
            template +=         '<label class="btn ownership-radio" data-target="<%= ownership.getId() %>">';
            template +=         '<input type="radio" name="ownership">';
            template +=         '<i class="fa fa-circle-o fa-1x"></i>';
            template +=         '<i class="fa fa-check-circle-o fa-1x"></i>';
            template +=         ' <%= ownership.getName() %></label>';
            template +=     '<% }); %>';
            template +=     '</div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-leaf fa-1x"></i> Recent Notes</div>';
            template += '<div id="list-comments" class="info-group">';
            template +=     '<div>&nbsp;</div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-button">';
            template +=     '<div class="btn-white btn-small btn-action evt-detail"><i class="fa fa-heartbeat"></i> See Detail</div>';
            template +=     '<div class="btn-white btn-small btn-action evt-adopt"><i class="fa fa-user-plus"></i> Adopt Tree</div>';
            template +=     '<div class="btn-white btn-small btn-action evt-post"><i class="fa fa-sticky-note-o"></i> Post Note</div>';
            template += '</div>';
            return template;
        }

        public static getTreeInfoTemplate4(): string {
            var template = '';
            template += '<div class="tree-info-name"><div class="input-food"><%= foodname %></div>&nbsp;<%= treename %></div>';
            //template += '<div class="tree-info-coordinate"><div>@&nbsp;</div><div class="input-lat"><%= lat %></div>,&nbsp;<div class="input-lng"><%= lng %></div></div>';

            template += '<div class="info-group">';
            template += '<div class="input-address">&nbsp;</div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-sticky-note fa-1x"></i> Description</div>';
            template += '<div class="info-group">';
            template += '<div class="input-description"><%= description %></div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-leaf fa-1x"></i> Recent Notes</div>';
            template += '<div id="list-activities" class="info-group">';
            template += '<div>&nbsp;</div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-button">';

            template += '<div class="button-outer-frame2 button5"><div class="button-inner-frame2 button-tree-detail"><i class="fa fa-heartbeat"></i> See Tree Detail</div></div>';
            template += '<div class="button-outer-frame2 button5"><div class="button-inner-frame2 button-tree-adopt"><i class="fa  fa-user-plus"></i> Adopt This Tree</div></div>';
            template += '<div class="button-outer-frame2 button5"><div class="button-inner-frame2 button-new-note"><i class="fa fa-sticky-note-o"></i> Post New Note</div></div>';
            
            template += '</div>';


            return template;
        }

        public static getTreeInfoTemplate5(): string {
            var template = '';
            template += '<div class="tree-info-name"><div class="input-food"><%= foodname %></div>&nbsp;<%= treename %></div>';
            //template += '<div class="tree-info-coordinate"><div>@&nbsp;</div><div class="input-lat"><%= lat %></div>,&nbsp;<div class="input-lng"><%= lng %></div></div>';

            template += '<div class="info-group">';
            template += '<div class="input-address">&nbsp;</div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-sticky-note fa-1x"></i> Description</div>';
            template += '<div class="info-group">';
            template += '<div class="input-description"><%= description %></div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-leaf fa-1x"></i> Recent Notes</div>';
            template += '<div id="list-activities" class="info-group">';
            template += '<div>&nbsp;</div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-button">';
            template += '<div class="button-outer-frame2 button5"><div class="button-inner-frame2 button-tree-detail"><i class="fa fa-heartbeat"></i> See Tree Detail</div></div>';
            template += '<div class="button-outer-frame2 button5"><div class="button-inner-frame2 button-tree-unadopt"><i class="fa  fa-user-times"></i> Unadopt This Tree</div></div>';
            template += '<div class="button-outer-frame2 button5"><div class="button-inner-frame2 button-new-note"><i class="fa fa-sticky-note-o"></i> Post New Note</div></div>';

            template += '</div>';


            return template;
        }

        public static getRecentActivitiesTemplate(): string {
            var template = '';
            template += '<% _.each(notes.models, function (note, index) { %>';
            template += '<% if (index < size) { %>';
            template += '<% var person = FoodParent.Model.getPersons().findWhere({id: note.getPersonId() }); %>';
            template += '<% if (person != undefined) { %>';

            template += '<% if (person.getName() != "") { %>';
            template += '<div class="item-activity"><i class="fa fa-caret-right fa-1x"></i> <div><span class="treeinfocomment">"<%= note.getComment() %>"</span> by <i><%= person.getName() %></i> (<%= note.getFormattedDate() %>)</div></div>';
            template += '<% } else { %>';
            template += '<div class="item-activity"><i class="fa fa-caret-right fa-1x"></i> <div><span class="treeinfocomment">"<%= note.getComment() %>"</span> by <i><%= person.getContact() %></i> (<%= note.getFormattedDate() %>)</div></div>';
            template += '<% } %>';

            template += '<% } else { %>';
            template += '<div class="item-activity"><i class="fa fa-caret-right fa-1x"></i> <div><span class="treeinfocomment">"<%= note.getComment() %>"</span> (<%= note.getFormattedDate() %>)</div></div>';
            template += '<% } %>';
            template += '<% } %>';
            template += '<% }); %>';

            return template;
        }

        public static getRecentCommentsTemplate(): string {
            var template = '';
            template += '<% _.each(notes.models, function (note, index) { %>';
            template +=     '<% if (index < size) { %>';
            template +=     '<% var person = FoodParent.Model.getPersons().findWhere({id: note.getPersonId() }); %>';
            template +=         '<% if (person != undefined) { %>';

            template += '<% if (person.getName() != "") { %>';
            template += '<div class="item-activity btn-comment evt-note" data-target="<%= note.getId() %>"><i class="fa fa-caret-right fa-1x"></i> <div><span class="treeinfocomment">"<%= note.getComment() %>"</span> by <i><%= person.getName() %></i> (<%= note.getFormattedDate() %>)</div></div>';
            template += '<% } else { %>';
            template += '<div class="item-activity btn-comment evt-note" data-target="<%= note.getId() %>"><i class="fa fa-caret-right fa-1x"></i> <div><span class="treeinfocomment">"<%= note.getComment() %>"</span> by <i><%= person.getContact() %></i> (<%= note.getFormattedDate() %>)</div></div>';
            template += '<% } %>';
            
            template +=         '<% } else { %>';
            template +=             '<div class="item-activity btn-comment evt-note" data-target="<%= note.getId() %>"><i class="fa fa-caret-right fa-1x"></i> <div><span class="treeinfocomment">"<%= note.getComment() %>"</span> (<%= note.getFormattedDate() %>)</div></div>';
            template +=         '<% } %>';
            template +=     '<% } %>';
            template += '<% }); %>';
            return template;
        }

        public static getTreesFilterListTemplateForGuest(): string {
            var template = '';
            template += '<div class="frame-inner">';
            template += '<div class="text-header"><%= header %> <span class="icon-header evt-reset-filter"><i class="fa fa-refresh"></i></span></div>';
            template += '<div id="content-filter-list">';
            template +=     '<div class="text-label"><i class="fa fa-caret-right"></i> Adoption</div>';
            template +=     '<div class="btn-green btn-small btn-filter filter-adopt-all active">Adopted & Unadopted</div>';
            template +=     '<div class="info-button-group">';
            template +=         '<div class="btn-green btn-small btn-filter filter-adopt-item" data-id="1">Adopted</div>';
            template +=         '<div class="btn-green btn-small btn-filter filter-adopt-item" data-id="0">Unadopted</div>';
            template +=     '</div>';
            template +=     '<hr />';
            template +=     '<div class="text-label"><i class="fa fa-caret-right"></i> Owndership</div>';
            template +=     '<div class="btn-green btn-small btn-filter filter-owner-all active">All Ownerships</div>';
            template +=     '<div class="info-button-group">';
            template +=         '<% _.each(ownerships.models, function (ownership) { %>';
            template +=             '<div class="btn-green btn-small btn-filter filter-owner-item" data-id="<%= ownership.getId() %>"><%= ownership.getName() %></div>';
            template +=         '<% }); %>';
            template +=     '</div>';
            template +=     '<hr />';
            template +=     '<div class="text-label"><i class="fa fa-caret-right"></i> Status</div>';
            template +=     '<div class="btn-green btn-small btn-filter filter-flag-all active">All Statuses</div>';
            template +=     '<div class="info-button-group">';
            template +=         '<div class="btn-green btn-small btn-filter filter-flag-item" data-id="0">*Unknown</div>';
            template +=         '<% _.each(flags.models, function (flag) { %>';
            template +=             '<div class="btn-green btn-small btn-filter filter-flag-item" data-id="<%= flag.getId() %>"><%= flag.getName() %></div>';
            template +=         '<% }); %>';
            template +=     '</div>';
            template +=     '<hr />';
            template +=     '<div class="text-label"><i class="fa fa-caret-right"></i> Rating</div>';
            template +=     '<div class="btn-green btn-small btn-filter filter-rating-all active">All Ratings</div>';
            template +=     '<div class="info-button-group">';
            template +=         '<% for (var i=0; i<=10; i++) { %>';
            template +=             '<div class="btn-green btn-small btn-filter filter-rating-item" data-id="<%= i %>"><i class="fa fa-star"></i> x <%= i %></div>';
            template +=         '<% }; %>';
            template +=     '</div>';
            template +=     '<hr />';
            template +=     '<div class="text-label"><i class="fa fa-caret-right"></i> Last Updated</div>';
            template +=     '<div class="btn-green btn-small btn-filter filter-last-all active">All Dates</div>';
            template +=     '<div class="info-button-group">';
            template +=         '<div class="btn-green btn-small btn-filter filter-last-item" data-id="0">~1 week</div>';
            template +=         '<div class="btn-green btn-small btn-filter filter-last-item" data-id="1">~2 weeks</div>';
            template +=         '<div class="btn-green btn-small btn-filter filter-last-item" data-id="2">~1 month</div>';
            template +=         '<div class="btn-green btn-small btn-filter filter-last-item" data-id="3">~3 months</div>';
            template +=         '<div class="btn-green btn-small btn-filter filter-last-item" data-id="4">~6 months</div>';
            template +=     '</div>';
            template += '</div>';
            template += '</div>';
            return template;
        }
        public static getTreesFilterListTemplateForParent(): string {
            return Template.getTreesFilterListTemplateForGuest();
        }
        public static getTreesFilterListTemplateForAdmin(): string {
            return Template.getTreesFilterListTemplateForGuest();
        }

        public static getTreeFilterListTemplate(): string {
            var template = '';

            template += '<div data-toggle="buttons">';
            template += '<label class="btn filter-checkbox list-hiearchy1">';
            template += '<input type="checkbox" name="onlymine" data-target="<%= userid %>">';
            template += '<i class="fa fa-square-o fa-1x"></i>';
            template += '<i class="fa fa-check-square-o fa-1x"></i>';
            template += ' My children (only mine / show all)</label>';
            template += '</div>';

            template += '<div data-toggle="buttons">';
            template +=     '<label class="btn filter-checkbox active list-hiearchy1">';
            template +=         '<input type="checkbox" name="adoptsall" checked>';
            template +=         '<i class="fa fa-square-o fa-1x"></i>';
            template +=         '<i class="fa fa-check-square-o fa-1x"></i>';
            template +=     ' Adopting Status (show all / hide)</label>';
            template += '</div>';

            template += '<div data-toggle="buttons">';
            template +=     '<label class="btn filter-checkbox filter-adopt active list-hiearchy2">';
            template +=         '<input type="checkbox" name="1" checked>';
            template +=         '<i class="fa fa-square-o fa-1x"></i>';
            template +=         '<i class="fa fa-check-square-o fa-1x"></i>';
            template +=     ' Assigned</label>';
            template += '</div>';

            template += '<div data-toggle="buttons">';
            template +=     '<label class="btn filter-checkbox filter-adopt active list-hiearchy2">';
            template +=         '<input type="checkbox" name="0" checked>';
            template +=         '<i class="fa fa-square-o fa-1x"></i>';
            template +=         '<i class="fa fa-check-square-o fa-1x"></i>';
            template +=     ' Unassigned</label>';
            template += '</div>';



            template += '<hr />';

            template += '<div data-toggle="buttons">';
            template += '<label class="btn filter-checkbox active list-hiearchy1">';
            template += '<input type="checkbox" name="ownershipsall" checked>';
            template += '<i class="fa fa-square-o fa-1x"></i>';
            template += '<i class="fa fa-check-square-o fa-1x"></i>';
            template += ' Onwership Type (show all / hide)</label>';
            template += '</div>';

            template += '<% _.each(ownerships.models, function (ownership) { %>';

            template += '<div data-toggle="buttons">';
            template += '<label class="btn filter-checkbox filter-ownership active list-hiearchy2">';
            template += '<input type="checkbox" name="<%= ownership.getId() %>" checked>';
            template += '<i class="fa fa-square-o fa-1x"></i>';
            template += '<i class="fa fa-check-square-o fa-1x"></i>';
            template += ' <%= ownership.getName() %></label>';
            template += '</div>';

            template += '<% }); %>';




            template += '<hr />';

            template += '<div data-toggle="buttons">';
            template += '<label class="btn filter-checkbox active list-hiearchy1">';
            template += '<input type="checkbox" name="flagsall" checked>';
            template += '<i class="fa fa-square-o fa-1x"></i>';
            template += '<i class="fa fa-check-square-o fa-1x"></i>';
            template += ' Flag Type (show all / hide)</label>';
            template += '</div>';

            template += '<div data-toggle="buttons">';
            template += '<label class="btn filter-checkbox filter-flag active list-hiearchy2">';
            template += '<input type="checkbox" name="0" checked>';
            template += '<i class="fa fa-square-o fa-1x"></i>';
            template += '<i class="fa fa-check-square-o fa-1x"></i>';
            template += ' *unknown</label>';
            template += '</div>';

            template += '<% _.each(flags.models, function (flag) { %>';

            template += '<div data-toggle="buttons">';
            template += '<label class="btn filter-checkbox filter-flag active list-hiearchy2">';
            template += '<input type="checkbox" name="<%= flag.getId() %>" checked>';
            template += '<i class="fa fa-square-o fa-1x"></i>';
            template += '<i class="fa fa-check-square-o fa-1x"></i>';
            template += ' <%= flag.getName() %></label>';
            template += '</div>';

            template += '<% }); %>';




            template += '<hr />';

            template += '<div data-toggle="buttons">';
            template += '<label class="btn filter-checkbox active list-hiearchy1">';
            template += '<input type="checkbox" name="foodsall" checked>';
            template += '<i class="fa fa-square-o fa-1x"></i>';
            template += '<i class="fa fa-check-square-o fa-1x"></i>';
            template += ' Food Type (show all / hide)</label>';
            template += '</div>';

            template += '<% _.each(foods.models, function (food) { %>';

            template += '<div data-toggle="buttons">';
            template += '<label class="btn filter-checkbox filter-food active list-hiearchy2">';
            template += '<input type="checkbox" name="<%= food.getId() %>" checked>';
            template += '<i class="fa fa-square-o fa-1x"></i>';
            template += '<i class="fa fa-check-square-o fa-1x"></i>';
            template += ' <%= food.getName() %></label>';
            template += '</div>';

            template += '<% }); %>';

            
            return template;
        }

        public static getTreeFilterListTemplate2(): string {
            var template = '';

            template += '<div data-toggle="buttons">';
            template += '<label class="btn filter-checkbox active list-hiearchy1">';
            template += '<input type="checkbox" name="adoptsall" checked>';
            template += '<i class="fa fa-square-o fa-1x"></i>';
            template += '<i class="fa fa-check-square-o fa-1x"></i>';
            template += ' Adopting Status (show all / hide)</label>';
            template += '</div>';

            template += '<div data-toggle="buttons">';
            template += '<label class="btn filter-checkbox filter-adopt active list-hiearchy2">';
            template += '<input type="checkbox" name="1" checked>';
            template += '<i class="fa fa-square-o fa-1x"></i>';
            template += '<i class="fa fa-check-square-o fa-1x"></i>';
            template += ' Assigned</label>';
            template += '</div>';

            template += '<div data-toggle="buttons">';
            template += '<label class="btn filter-checkbox filter-adopt active list-hiearchy2">';
            template += '<input type="checkbox" name="0" checked>';
            template += '<i class="fa fa-square-o fa-1x"></i>';
            template += '<i class="fa fa-check-square-o fa-1x"></i>';
            template += ' Unassigned</label>';
            template += '</div>';


            template += '<hr />';

            template += '<div data-toggle="buttons">';
            template += '<label class="btn filter-checkbox active list-hiearchy1">';
            template += '<input type="checkbox" name="ownershipsall" checked>';
            template += '<i class="fa fa-square-o fa-1x"></i>';
            template += '<i class="fa fa-check-square-o fa-1x"></i>';
            template += ' Onwership Type (show all / hide)</label>';
            template += '</div>';

            template += '<% _.each(ownerships.models, function (ownership) { %>';

            template += '<div data-toggle="buttons">';
            template += '<label class="btn filter-checkbox filter-ownership active list-hiearchy2">';
            template += '<input type="checkbox" name="<%= ownership.getId() %>" checked>';
            template += '<i class="fa fa-square-o fa-1x"></i>';
            template += '<i class="fa fa-check-square-o fa-1x"></i>';
            template += ' <%= ownership.getName() %></label>';
            template += '</div>';

            template += '<% }); %>';


            template += '<hr />';

            template += '<div data-toggle="buttons">';
            template += '<label class="btn filter-checkbox active list-hiearchy1">';
            template += '<input type="checkbox" name="flagsall" checked>';
            template += '<i class="fa fa-square-o fa-1x"></i>';
            template += '<i class="fa fa-check-square-o fa-1x"></i>';
            template += ' Flag Type (show all / hide)</label>';
            template += '</div>';

            template += '<div data-toggle="buttons">';
            template += '<label class="btn filter-checkbox filter-flag active list-hiearchy2">';
            template += '<input type="checkbox" name="0" checked>';
            template += '<i class="fa fa-square-o fa-1x"></i>';
            template += '<i class="fa fa-check-square-o fa-1x"></i>';
            template += ' *unknown</label>';
            template += '</div>';

            template += '<% _.each(flags.models, function (flag) { %>';

            template += '<div data-toggle="buttons">';
            template += '<label class="btn filter-checkbox filter-flag active list-hiearchy2">';
            template += '<input type="checkbox" name="<%= flag.getId() %>" checked>';
            template += '<i class="fa fa-square-o fa-1x"></i>';
            template += '<i class="fa fa-check-square-o fa-1x"></i>';
            template += ' <%= flag.getName() %></label>';
            template += '</div>';

            template += '<% }); %>';


            template += '<hr />';

            template += '<div data-toggle="buttons">';
            template += '<label class="btn filter-checkbox active list-hiearchy1">';
            template += '<input type="checkbox" name="foodsall" checked>';
            template += '<i class="fa fa-square-o fa-1x"></i>';
            template += '<i class="fa fa-check-square-o fa-1x"></i>';
            template += ' Food Type (show all / hide)</label>';
            template += '</div>';

            template += '<% _.each(foods.models, function (food) { %>';

            template += '<div data-toggle="buttons">';
            template += '<label class="btn filter-checkbox filter-food active list-hiearchy2">';
            template += '<input type="checkbox" name="<%= food.getId() %>" checked>';
            template += '<i class="fa fa-square-o fa-1x"></i>';
            template += '<i class="fa fa-check-square-o fa-1x"></i>';
            template += ' <%= food.getName() %></label>';
            template += '</div>';

            template += '<% }); %>';


            return template;
        }

        public static getPersonFilterListTemplate(): string {
            var template = '';
            template += '<div data-toggle="buttons">';
            template += '<label class="btn filter-checkbox active list-hiearchy1">';
            template += '<input type="checkbox" name="adoptsall" checked>';
            template += '<i class="fa fa-square-o fa-1x"></i>';
            template += '<i class="fa fa-check-square-o fa-1x"></i>';
            template += ' Adopting Status (show all / hide)</label>';
            template += '</div>';

            template += '<div data-toggle="buttons">';
            template += '<label class="btn filter-checkbox filter-adopt active list-hiearchy2">';
            template += '<input type="checkbox" name="1" checked>';
            template += '<i class="fa fa-square-o fa-1x"></i>';
            template += '<i class="fa fa-check-square-o fa-1x"></i>';
            template += ' Adopt</label>';
            template += '</div>';

            template += '<div data-toggle="buttons">';
            template += '<label class="btn filter-checkbox filter-adopt active list-hiearchy2">';
            template += '<input type="checkbox" name="0" checked>';
            template += '<i class="fa fa-square-o fa-1x"></i>';
            template += '<i class="fa fa-check-square-o fa-1x"></i>';
            template += ' Unadopt</label>';
            template += '</div>';

            template += '<hr />';

            template += '<div data-toggle="buttons">';
            template += '<label class="btn filter-checkbox active list-hiearchy1">';
            template += '<input type="checkbox" name="authsall" checked>';
            template += '<i class="fa fa-square-o fa-1x"></i>';
            template += '<i class="fa fa-check-square-o fa-1x"></i>';
            template += ' Auth Type (show all / hide)</label>';
            template += '</div>';

            template += '<% _.each(auths.models, function (auth) { %>';

            template += '<div data-toggle="buttons">';
            template += '<label class="btn filter-checkbox filter-auth active list-hiearchy2">';
            template += '<input type="checkbox" name="<%= auth.getId() %>" checked>';
            template += '<i class="fa fa-square-o fa-1x"></i>';
            template += '<i class="fa fa-check-square-o fa-1x"></i>';
            template += ' <%= auth.getName() %></label>';
            template += '</div>';

            template += '<% }); %>';


            return template;
        }

        public static getAdoptionFilterListTemplate(): string {
            var template = '';
            template += '<div class="text-header"><%= header %> <span class="icon-header evt-reset-filter"><i class="fa fa-refresh"></i></span></div>';
            template += '<div id="content-adoptionfilter">';
            template +=     '<div class="text-label"><i class="fa fa-caret-right"></i> Parenting</div>';
            template +=     '<div class="btn-green btn-small btn-filter filter-parenting-all active">Parenting & Non-Parenting</div>';
            template +=     '<div class="info-button-group">';
            template +=         '<div class="btn-green btn-small btn-filter filter-parenting-item" data-id="1">Parenting</div>';
            template +=         '<div class="btn-green btn-small btn-filter filter-parenting-item" data-id="0">Non-Parenting</div>';
            template +=     '</div>';
            template +=     '<hr />';

            template +=     '<div class="text-label"><i class="fa fa-caret-right"></i> Authorization</div>';
            template +=     '<div class="btn-green btn-small btn-filter filter-auth-all active">All Authorizations</div>';
            template +=     '<div class="info-button-group">';
            template +=     '<% _.each(auths.models, function (auth) { %>';
            template +=         '<div class="btn-green btn-small btn-filter filter-auth-item" data-id="<%= auth.getId() %>"><%= auth.getName() %></div>';
            template +=     '<% }); %>';
            template +=     '</div>';
            template += '</div>';   //end of #content-adoptionfilter
            return template;
        }

        public static getAdoptTreeCellTemplate(): string {
            var template = "";
            template += '<% _.each(trees.models, function (tree) { %>';
            template +=     '<% var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() }); %>';
            template +=     '<div class="btn-tree" data-target="<%= tree.getId() %>"><%= food.getName() + tree.getName() %></div>';
            template += '<% }); %>';
            return template;
        }

        public static getAdoptPersonCellTemplate(): string {
            //<%= address %>
            var template = "";
            // template += '<div class="cell-group">';
            template += '<% _.each(persons.models, function (person) { %>';
            template += '<div class="btn-tree" data-target="<%= person.getId() %>"><%= person.getName() %></div>';
            template += '<% }); %>';
            //template += '<div class="cell-button cell-edit"><i class="fa fa-edit fa-1x"></i></div>';
            //template += '</div>';
            return template;
        }

        public static getTreesTableViewTemplateForAdmin(): string {
            var template = '';
            template += '<div id="wrapper-tree-list" class="frame-pop">';
            template += '<div id="frame-tree-list">';
            template +=     '<div id="content-header">';
            template +=         '<div class="text-header"><%= header %></div>';
            template +=         '<div class="btn-close evt-close">';
            template +=             '<i class="fa fa-remove"></i>';
            template +=         '</div>';   // end of top-right-button button-close
            template +=     '</div>';   // end of #wrapper-header
            template +=     '<hr />';

            template +=     '<div class="frame-flex-group">';
            template +=         '<div class="tree-filter">';
            template +=         '</div>';   // end of .adoption-filter

            template +=         '<div id="content-tree-list">';
            template +=             '<div class="btn-brown btn-medium btn-action evt-add-tree"><i class="fa fa-plus-square"></i> Add New Tree</div>';
            template +=             '<div class="info-group">';
            template +=                 '<div class="new-tree hidden"></div>';
            template +=             '</div>';   // end of .info-group

            template +=             '<div class="info-group">';
            template +=                 '<div class="list-tree">';
            template +=                 '</div>';
            template +=             '</div>';   // end of .info-button-group

            template +=         '</div>';   // end of #content-tree-list
            template +=     '</div>';   // end of .frame-flex-group
            template += '</div>';   // end of #frame-tree-list
            template += '</div>';   // end of #wrapper-tree-list
            return template;
        }


        public static getAdoptionManageViewTemplateForAdmin(): string {
            var template = '';
            template += '<div id="wrapper-manage-adoption" class="frame-pop">';
            template +=     '<div id="content-header">';
            template +=         '<div class="text-header"><%= header %></div>';
            template +=         '<div class="btn-close evt-close">';
            template +=             '<i class="fa fa-remove"></i>';
            template +=         '</div>';   // end of top-right-button button-close
            template +=     '</div>';   // end of #wrapper-header
            template +=     '<hr />';

            template +=     '<div class="frame-flex-group">';
            template +=         '<div class="adoption-filter">';
            template +=         '</div>';   // end of .adoption-filter

            template +=         '<div id="content-manage-adoption">';
            template +=             '<div class="info-group">';
            template +=                 '<div class="text-label"><i class="fa fa-caret-right"></i>  Click <i class="fa fa-plus-square fa-1x"></i> or <i class="fa fa-minus-square fa-1x"></i> icon to assign (or unassign) a parent for <strong><i><%= treename %></i></strong>.</div>';
            template +=             '</div>';   // end of .info-group

            template +=             '<div class="info-group">';
            template +=                 '<div class="list-adoption" data-target="<%= treeId %>">';
            template +=                 '</div>';
            template +=             '</div>';   // end of .info-button-group


            template +=         '</div>';   // end of #content-manage-adoption
            template +=     '</div>';   // end of .frame-flex-group
            template += '</div>';   // end of #wrapper-manage-adoption
            return template;
        }

        public static getDetailMenuTemplate(): string {
            var template = '';
            template += '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 button-back-map"><i class="fa fa-arrow-left"></i> Back To Tree List</div></div>';
            template += '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 button-new-note"><i class="fa fa-sticky-note-o"></i> Post New Note</div></div>';
            template += '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 button-manage-adoption"><i class="fa  fa-user-plus"></i> Manage Adoption</div></div>';
            template += '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 button-delete-tree"><i class="fa fa-remove"></i> Delete Tree*</div></div>';
            template += '<div class="button-description2">* marked operation cannot be undone.</div>';
            return template;
        }

        public static getDetailMenuTemplate2(): string {
            var template = '';
            template += '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 button-back-map"><i class="fa fa-arrow-left"></i> Back To List</div></div>';
            template += '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 button-tree-adopt"><i class="fa  fa-user-plus"></i> Adopt This Tree</div></div>';
            template += '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 button-new-note"><i class="fa fa-sticky-note-o"></i> Post New Note</div></div>';
            
            return template;
        }

        public static getDetailMenuTemplate3(): string {
            var template = '';
            template += '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 button-back-map"><i class="fa fa-arrow-left"></i> Back To List</div></div>';
            template += '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 button-tree-unadopt"><i class="fa  fa-user-times"></i> Unadopt This Tree</div></div>';
            template += '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 button-new-note"><i class="fa fa-sticky-note-o"></i> Post New Note</div></div>';

            return template;
        }

        public static getDetailTreeGraphicViewTemplate(): string {
            var template = '';
            template += '<div id="wrapper-mtree">';

            template += '<div id="wrapper-graph">';

            template +=     '<div id="wrapper-chart"></div>';

            template +=     '<div id="wrapper-tooltip" class="hidden"></div>';

            template +=     '<div id="wrapper-mapmenu">';
            template +=     '</div>';

            template +=     '<div id="wrapper-date-select">';
            template +=         '<div class="wrapper-date-preset">';
            template +=             '<div class="button-outer-frame2 button3 date-preset 2years"><div class="button-inner-frame2">2 Year</div></div>';
            template +=             '<div class="button-outer-frame2 button3 date-preset 1years"><div class="button-inner-frame2">1 Year</div></div>';
            template +=             '<div class="button-outer-frame2 button3 date-preset 6months"><div class="button-inner-frame2">6 months</div></div>';
            template +=             '<div class="button-outer-frame2 button3 date-preset 3months"><div class="button-inner-frame2">3 months</div></div>';
            template +=             '<div class="button-outer-frame2 button3 date-preset 1month"><div class="button-inner-frame2">1 month</div></div>';
            template +=         '</div>';
            template +=         '<div class="wrapper-date-select-item"><input type="text" class="form-control tree-graph-start" /></div>';
            template +=         '<div class="wrapper-date-select-item"><span class="date-select-label">~</span><input type="text" class="form-control tree-graph-end" /></div>';
            template +=     '</div>';

            
            template += '</div>';   // end of #wrapper-graph



            template += '<div id="wrapper-tree-detail">';

            template += '<div class="content-tree-info">';
            template += '</div>';   // end of .content-tree-info

            template += '<div class="content-tree-recentcomments">';
            template += '<div class="info-header"><i class="fa fa-comments fa-1x"></i> Recent Notes</div>';
            template += '<div id="list-comments" class="info-group">';
            template += '</div>';
            template += '</div>';   // end of .content-tree-recentcomments

            template += '<div class="content-tree-recentactivities">';
            template +=     '<div class="info-header"><i class="fa fa-leaf fa-1x"></i> Recent Changes</div>';
            template +=     '<div id="list-activities" class="info-group">';
            template +=     '</div>';
            template += '</div>';   // end of .content-tree-recentactivities

            
            /*
            template += '<div class="content-tree-control">';
            template +=     '<div class="button-outer-frame2 button4"><div class="button-inner-frame2 button-new-note">Post New Note</div></div>';
            template +=     '<div class="button-outer-frame2 button4"><div class="button-inner-frame2 button-manage-adoption">Manage Adoption</div></div>';
            template +=     '<div class="button-outer-frame2 button4"><div class="button-inner-frame2 button-delete-tree">Delete Tree*</div></div>';
            template +=     '<div class="button-description">* marked operation cannot be undone.</div>';
            template += '</div>';   // end of .tree-control
            */
            
            template += '</div>';   // end of #wrapper-tree-detail

            
            template += '</div>';   // end of #wrapper-mtree
            return template;
        }

        public static getTreeGraphicViewTemplate(): string {
            var template = '';
            template += '<div id="wrapper-tree">';
            template +=     '<div id="wrapper-graph">';

            template +=         '<div id="wrapper-chart" class="evt-chart">';
            template +=         '</div>';   // end of #wrapper-chart
            template +=         '<div id="wrapper-tooltip" class="hidden">';
            template +=         '</div>';

            template +=         '<div id="content-treemenu">';
            template +=         '</div>';   // end of #content-treeinfo

            template +=         '<div id="wrapper-date-select">';
            template +=             '<div class="wrapper-date-preset">';
            template +=                 '<div class="btn-brown btn-small btn-date 2years">2 Year</div>';
            template +=                 '<div class="btn-brown btn-small btn-date 1years">1 Year</div>';
            template +=                 '<div class="btn-brown btn-small btn-date 6months">6 months</div>';
            template +=                 '<div class="btn-brown btn-small btn-date 3months">3 months</div>';
            template +=                 '<div class="btn-brown btn-small btn-date 1month">1 month</div>';
            template +=             '</div>';
            template +=             '<div class="wrapper-date-select-item"><input type="text" class="form-control tree-graph-start" /></div>';
            template +=             '<div class="wrapper-date-select-item"><span class="date-select-label">~</span><input type="text" class="form-control tree-graph-end" /></div>';
            template +=         '</div>';

            template +=     '</div>';   // end of #wrapper-graph

            template +=     '<div id="wrapper-treedetail">';
            template +=         '<div class="content-tree-basicinfo">';
            template +=         '</div>';   // end of .content-tree-info

            template +=         '<div class="content-tree-recentcomments">';
            template +=             '<div class="text-header"><i class="fa fa-comments fa-1x"></i> Recent Notes</div>';
            template +=             '<div id="list-comments" class="info-group">';
            template +=             '</div>';   // end of #list-comments
            template +=         '</div>';   // end of .content-tree-recentcomments

            template +=         '<div class="content-tree-recentactivities">';
            template +=             '<div class="text-header"><i class="fa fa-leaf fa-1x"></i> Recent Changes</div>';
            template +=             '<div id="list-activities" class="info-group">';
            template +=             '</div>';   // end of #list-activities
            template +=         '</div>';   // end of .content-tree-recentactivities
            template +=     '</div>';   // end of #wrapper-treeinfo

            template += '</div>';   // end of #wrapper-tree
            return template;
        }

        public static getToolTipTemplate(): string {
            var template = '';
            template += '<img src="<%= image %>" />';
            template += '<div class="rate"><i class="fa fa-star-half-o"></i> <%= value %></div>';
            template += '<div class="comment"><i class="fa fa-comment"></i> <%= comment %></div>';
            template += '<div class="date"><%= date %></div>';
            return template;
        }

        public static getToolTipTemplate2(): string {
            var template = '';
            template += '<div class="rate"><%= value %> libs. <span class="startdate">from <%= startdate %></span></div>';
            template += '<img src="<%= image %>" />';
            template += '<div class="comment"><i class="fa fa-ambulance"></i> <%= comment %></div>';
            template += '<div class="date"><%= date %></div>';
            return template;
        }

        public static getImageNoteViewTemplate(): string {
            var template = '';
            template += '<div id="wrapper-note">';
            template +=     '<div class="outer-frame">';
            template +=         '<div class="inner-frame">';
            template +=             '<div class="wrapper-note-content">';
            template +=                 '<div class="image-wrapper">';

            template += '<div class="wrapper-input-upload-picture">';
            template += '<input class="input-upload-picture fileupload" type="file" accept="image/*" capture="camera" />';
            template += '</div>';
            template += '<div class="wrapper-uploading-picture hidden">';
            template += '<div class="uploading-picture">Uploading...</div>';
            template += '</div>';
            template += '<div class="info-header"><i class="fa fa-image"></i> Select Cover Picture</div>';

            template +=                     '<div class="image-group"></div>';
            template +=                 '</div>';   // end of .image-wrapper

            template +=                 '<div class="wrapper-note-info">';


            template +=                     '<div class="name"><%= name %></div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-button-group">';
            template += '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 prev-note"><i class="fa fa-caret-left"></i></div></div>';
            template += '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 next-note"><i class="fa fa-caret-right"></i></div></div>';
            template += '</div>';
            
            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-star-half-o"></i> Rating</div>';
            template += '<div class="info-group">';
            template += '<div class="input-rating"><%= value %></div>';
            template += '<div class="input-rating-slider"></div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-comment"></i> Comment</div>';
            template += '<div class="info-group">';
            template += '<div class="input-comment"><%= comment %></div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-calendar-o"></i> Date</div>';
            template += '<div class="info-group">';
            template += '<input type="text" class="form-control input-date" />';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-user"></i> Author</div>';
            template += '<div class="info-group">';
            template += '<div class="input-author"><%= author %></div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-button-group">';
            template += '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 delete-note"><i class="fa fa-remove"></i> Delete</div></div>';
            template += '</div>';
            

            template +=                 '</div>';

            template +=             '</div>';   // end of .wrapper-note-content
            template +=         '</div>';   // end of .inner-frame
            template +=         '<div class="top-right-button button-close">';
            template +=             '<i class="fa fa-remove fa-2x"></i>';
            template +=         '</div>';   // end of top-right-button button-close
            template +=     '</div>';   // end of .outer-frame
            template += '</div>';   // end of #wrapper-note
            return template;
        }

        public static getImageNoteViewTemplate2(): string {
            var template = '';
            template += '<div id="wrapper-note">';
            template += '<div class="outer-frame">';
            template += '<div class="inner-frame">';
            template += '<div class="wrapper-note-content">';
            template += '<div class="image-wrapper">';

            template += '<div class="image-group"></div>';
            template += '</div>';   // end of .image-wrapper

            template += '<div class="wrapper-note-info">';


            template += '<div class="name"><%= name %></div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-button-group">';
            template += '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 prev-note"><i class="fa fa-caret-left"></i></div></div>';
            template += '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 next-note"><i class="fa fa-caret-right"></i></div></div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-star-half-o"></i> Rating</div>';
            template += '<div class="info-group">';
            template += '<div class="input-rating"><%= value %></div>';
            template += '<div class="input-rating-slider"></div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-comment"></i> Comment</div>';
            template += '<div class="info-group">';
            template += '<div class="text-comment"><%= comment %></div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-calendar-o"></i> Date</div>';
            template += '<div class="info-group">';
            template += '<div class="text-date"><%= date %></div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-user"></i> Author</div>';
            template += '<div class="info-group">';
            template += '<div class="input-author"><%= author %></div>';
            template += '</div>';


            template += '</div>';

            template += '</div>';   // end of .wrapper-note-content
            template += '</div>';   // end of .inner-frame
            template += '<div class="top-right-button button-close">';
            template += '<i class="fa fa-remove fa-2x"></i>';
            template += '</div>';   // end of top-right-button button-close
            template += '</div>';   // end of .outer-frame
            template += '</div>';   // end of #wrapper-note
            return template;
        }

        public static getPostNoteViewTemplate(): string {
            var template = '';
            template += '<div id="wrapper-note">';
            template +=     '<div class="outer-frame">';
            template +=         '<div class="inner-frame">';
            template +=             '<div class="wrapper-post-note-content">';

            template +=                 '<div class="image-wrapper">';

            
            template +=                     '<div class="wrapper-input-upload-picture">';
            template +=                         '<input class="input-upload-picture fileupload" type="file" accept="image/*" capture="camera" />';
            template +=                     '</div>';
            template +=                     '<div class="wrapper-uploading-picture hidden">';
            template +=                         '<div class="uploading-picture">Uploading...</div>';
            template +=                     '</div>';
            template +=                     '<div class="info-header"><i class="fa fa-image"></i> Select Cover Picture</div>';
            template +=                     '<div class="image-group"></div>';

            template +=                 '</div>';   // end of .image-wrapper


            template +=                 '<div class="wrapper-note-info">';

            template += '<div class="name"><%= name %></div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-star-half-o"></i> Rating</div>';
            template += '<div class="info-group">';
            template += '<div class="input-rating"></div>';
            template += '<div class="input-rating-slider"></div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-comment"></i> Comment</div>';
            template += '<div class="info-group">';
            template += '<div class="input-comment">&nbsp;</div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-calendar-o"></i> Date</div>';
            template += '<div class="info-group">';
            template += '<input type="text" class="form-control input-date" />';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-user"></i> Author</div>';
            template += '<div class="info-group">';
            template += '<div class="input-author"><%= author %></div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-button-group">';
            template += '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 create-note"><i class="fa fa-save"></i> Save</div></div>';
            template += '</div>';

            template +=                 '</div>';   // .wrapper-note-info

            template +=             '</div>';   // end of .wrapper-post-note-content

            template +=         '</div>';   // end of .inner-frame
            template +=         '<div class="top-right-button button-close">';
            template +=         '<i class="fa fa-remove fa-2x"></i>';
            template +=         '</div>';   // end of top-right-button button-close
            template +=     '</div>';   // end of .outer-frame
            template += '</div>';   // end of #wrapper-note

            return template;
        }

        public static getPostNoteViewForParent(): string {
            var template = '';
            template += '<div id="wrapper-post-note" class="frame-pop">';

            template +=     '<div id="content-header">';
            template +=         '<div class="text-header"><%= header %></div>';
            template +=         '<div class="btn-close evt-close">';
            template +=             '<i class="fa fa-remove"></i>';
            template +=         '</div>';   // end of top-right-button button-close
            template +=     '</div>';   // end of #wrapper-header

            template +=     '<div class="info-group">';
            template +=         '<div class="text-label center">Upload pictures, select a rating, enter a commment for \'<%= name %>\'.</div>';
            template +=     '</div>';   // end of .info-group

            template +=     '<hr />';

            template +=     '<div class="frame-flex-group">';
            template +=         '<div id="content-image">';
            template +=             '<input class="input-upload-picture fileupload" type="file" accept="image/*" capture="camera" />';
            template +=             '<div class="wrapper-uploading-picture hidden">';
            template +=                 '<div class="uploading-picture">Uploading...</div>';
            template +=             '</div>';   // end of .wrapper-uploading-picture

            template +=             '<div class="info-group">';
            template +=                 '<div class="text-label"><i class="fa fa-caret-right"></i> Click a picture to set as a cover picture.</div>';
            template +=             '</div>';   // end of .info-group

            template +=             '<div class="image-group">';
            template +=             '</div>';   // end of .image-group

            template +=         '</div>';   // end of #content-image

            template +=         '<div id="content-post">';
            template +=             '<div class="info-header"><i class="fa fa-star-half-o fa-1x"></i> Raiting</div>';
            template +=             '<div class="input-rating"></div>';
            template +=             '<div class="input-rating-slider"></div>';

            template +=             '<hr />';
            template +=             '<div class="info-header"><i class="fa fa-comment fa-1x"></i> Comment</div>';
            template +=             '<div class="info-group">';
            template +=                 '<div class="input-comment">&nbsp;</div>';
            template +=             '</div>';

            template +=             '<hr />';
            template +=             '<div class="info-header"><i class="fa fa-calendar-o fa-1x"></i> Date</div>';
            template +=             '<div class="info-group">';
            template +=                 '<input type="text" class="form-control input-date" />';
            template +=             '</div>';

            template +=             '<hr />';
            template +=             '<div class="info-header"><i class="fa fa-user fa-1x"></i> Author</div>';
            template +=             '<div class="info-group">';
            template +=                 '<div class="input-contact">&nbsp;</div>';
            template +=             '</div>';

            template +=             '<hr />';
            template +=             '<div class="info-button-group">';
            template +=                 '<div class="btn-brown btn-medium evt-submit">Submit</div>';
            template +=             '</div>';   // end of .info-button-group

            template +=             '<div class="info-button-group">';
            template +=                 '<div class="btn-brown btn-medium evt-close">Cancel</div>';
            template +=             '</div>';   // end of .info-button-group

            template +=         '</div>';   // end of #content-post
            template +=     '</div>';   // end of .frame-flex-group
            template += '</div>';   // end of #wrapper-post-note

            return template;
        }

        public static getPostNoteViewForGuest(): string {
            var template = '';
            template += '<div id="wrapper-post-note" class="frame-pop">';

            template +=     '<div id="content-header">';
            template +=         '<div class="text-header"><%= header %></div>';
            template +=         '<div class="btn-close evt-close">';
            template +=             '<i class="fa fa-remove"></i>';
            template +=         '</div>';   // end of top-right-button button-close
            template +=     '</div>';   // end of #wrapper-header

            template +=     '<div class="info-group">';
            template +=         '<div class="text-label center">Upload pictures, select a rating, enter a commment for \'<%= name %>\'.</div>';
            template +=     '</div>';   // end of .info-group

            template +=     '<hr />';

            template +=     '<div class="frame-flex-group">';
            template +=         '<div id="content-image">';
            template +=             '<input class="input-upload-picture fileupload" type="file" accept="image/*" capture="camera" />';
            template +=             '<div class="wrapper-uploading-picture hidden">';
            template +=                 '<div class="uploading-picture">Uploading...</div>';
            template +=             '</div>';   // end of .wrapper-uploading-picture

            template +=             '<div class="info-group">';
            template +=                 '<div class="text-label"><i class="fa fa-caret-right"></i> Click a picture to set as a cover picture.</div>';
            template +=             '</div>';   // end of .info-group

            template +=             '<div class="image-group">';
            template +=             '</div>';   // end of .image-group

            template +=         '</div>';   // end of #content-image

            template +=         '<div id="content-post">';
            template +=             '<div class="info-header"><i class="fa fa-star-half-o fa-1x"></i> Raiting</div>';
            template +=             '<div class="input-rating"></div>';
            template +=             '<div class="input-rating-slider"></div>';

            template +=             '<hr />';
            template +=             '<div class="info-header"><i class="fa fa-comment fa-1x"></i> Comment</div>';
            template +=             '<div class="info-group">';
            template +=                 '<div class="input-comment">&nbsp;</div>';
            template +=             '</div>';

            template +=             '<hr />';
            template +=             '<div class="info-header"><i class="fa fa-calendar-o fa-1x"></i> Date</div>';
            template +=             '<div class="info-group">';
            template +=                 '<input type="text" class="form-control input-date" />';
            template +=             '</div>';

            template +=             '<hr />';
            template +=             '<div class="info-header"><i class="fa fa-user fa-1x"></i> Author</div>';
            template +=             '<div class="info-group">';
            template +=                 '<input type="email" name="email" class="form-control input-contact" placeholder="e-mail address" autocomplete="on" />';
            template +=                 '<div class="text-label">*The <strong>e-mail address</strong> that you enter will be stored as a perspective parent. You can <strong>become a parent</strong> later using the same e-mail address.</div>';            
            template +=             '</div>';

            template +=             '<hr />';
            template +=             '<div class="info-button-group">';
            template +=                 '<div class="btn-brown btn-medium evt-submit">Submit</div>';
            template +=             '</div>';   // end of .info-button-group

            template +=             '<div class="info-button-group">';
            template +=                 '<div class="btn-brown btn-medium evt-close">Cancel</div>';
            template +=             '</div>';   // end of .info-button-group

            template +=         '</div>';   // end of #content-post
            template +=     '</div>';   // end of .frame-flex-group
            template += '</div>';   // end of #wrapper-post-note

            return template;
        }

        public static getPostNoteViewForAdmin(): string {
            return Template.getPostNoteViewForParent();
        }

        public static getEditNoteViewForGuest(): string {
            var template = '';
            template += '<div id="wrapper-post-note" class="frame-pop">';

            template +=     '<div id="content-header">';
            template +=         '<div class="btn-post evt-prev">';
            template +=             '<i class="fa fa-arrow-left"></i>';
            template +=         '</div>';   // end of top-right-button button-close
            template +=         '<div class="btn-post evt-next">';
            template +=             '<i class="fa fa-arrow-right"></i>';
            template +=         '</div>';   // end of top-right-button button-close
            template +=         '<div class="text-header text-header2"><%= header %></div>';
            template +=         '<div class="btn-close evt-close">';
            template +=             '<i class="fa fa-remove"></i>';
            template +=         '</div>';   // end of top-right-button button-close
            template +=     '</div>';   // end of #wrapper-header

            template +=     '<div class="info-group">';
            template +=         '<div class="text-label center">Note for \'<%= name %>\' on <span class="text-note-date"></span>.</div>';
            template +=     '</div>';   // end of .info-group

            template +=     '<hr />';

            template +=     '<div class="frame-flex-group">';
            template +=         '<div id="content-image">';
            /*
            template +=             '<input class="input-upload-picture fileupload" type="file" accept="image/*" capture="camera" />';
            template +=             '<div class="wrapper-uploading-picture hidden">';
            template +=                 '<div class="uploading-picture">Uploading...</div>';
            template +=             '</div>';   // end of .wrapper-uploading-picture

            template +=             '<div class="info-group">';
            template +=                 '<div class="text-label"><i class="fa fa-caret-right"></i> Click a picture to set as a cover picture.</div>';
            template +=             '</div>';   // end of .info-group
            */
            template +=             '<div class="image-group">';
            template +=             '</div>';   // end of .image-group

            template +=         '</div>';   // end of #content-image

            template +=         '<div id="content-post">';
            template +=             '<div class="info-header"><i class="fa fa-star-half-o fa-1x"></i> Raiting</div>';
            template +=             '<div class="input-rating"></div>';
            template +=             '<div class="input-rating-slider"></div>';

            template +=             '<hr />';
            template +=             '<div class="info-header"><i class="fa fa-comment fa-1x"></i> Comment</div>';
            template +=             '<div class="info-group">';
            template +=                 '<div class="input-comment">&nbsp;</div>';
            template +=             '</div>';

            template +=             '<hr />';
            template +=             '<div class="info-header"><i class="fa fa-calendar-o fa-1x"></i> Date</div>';
            template +=             '<div class="info-group">';
            template +=                 '<input type="text" class="form-control input-date" disabled />';
            template +=             '</div>';

            template +=             '<hr />';
            template +=             '<div class="info-header"><i class="fa fa-user fa-1x"></i> Author</div>';
            template +=             '<div class="info-group">';
            template +=                 '<div class="input-contact">&nbsp;</div>';
            template +=             '</div>';
            /*
            template +=             '<hr />';
            template +=             '<div class="info-button-group">';
            template +=                 '<div class="btn-brown btn-medium evt-submit">Save</div>';
            template +=             '</div>';   // end of .info-button-group

            template +=             '<div class="info-button-group">';
            template +=                 '<div class="btn-brown btn-medium evt-close">Cancel</div>';
            template +=             '</div>';   // end of .info-button-group
            */
            template +=         '</div>';   // end of #content-post
            template +=     '</div>';   // end of .frame-flex-group
            template += '</div>';   // end of #wrapper-post-note

            return template;
        }

        public static getEditNoteViewForAdmin(): string {
            var template = '';
            template += '<div id="wrapper-post-note" class="frame-pop">';

            template +=     '<div id="content-header">';
            template +=         '<div class="btn-post evt-prev">';
            template +=             '<i class="fa fa-arrow-left"></i>';
            template +=         '</div>';   // end of top-right-button button-close
            template +=         '<div class="btn-post evt-next">';
            template +=             '<i class="fa fa-arrow-right"></i>';
            template +=         '</div>';   // end of top-right-button button-close
            template +=         '<div class="text-header text-header2"><%= header %></div>';
            template +=         '<div class="btn-close evt-close">';
            template +=             '<i class="fa fa-remove"></i>';
            template +=         '</div>';   // end of top-right-button button-close
            template +=     '</div>';   // end of #wrapper-header

            template +=     '<div class="info-group">';
            template +=         '<div class="text-label center">Note for \'<%= name %>\' on <span class="text-note-date"></span>.</div>';
            template +=     '</div>';   // end of .info-group

            template +=     '<hr />';

            template +=     '<div class="frame-flex-group">';
            template +=         '<div id="content-image">';
            
            template +=             '<input class="input-upload-picture fileupload" type="file" accept="image/*" capture="camera" />';
            template +=             '<div class="wrapper-uploading-picture hidden">';
            template +=                 '<div class="uploading-picture">Uploading...</div>';
            template +=             '</div>';   // end of .wrapper-uploading-picture

            template +=             '<div class="info-group">';
            template +=                 '<div class="text-label"><i class="fa fa-caret-right"></i> Click a picture to set as a cover picture.</div>';
            template +=             '</div>';   // end of .info-group
            
            template +=             '<div class="image-group">';
            template +=             '</div>';   // end of .image-group

            template +=         '</div>';   // end of #content-image

            template +=         '<div id="content-post">';
            template +=             '<div class="info-header"><i class="fa fa-star-half-o fa-1x"></i> Raiting</div>';
            template +=             '<div class="input-rating"></div>';
            template +=             '<div class="input-rating-slider"></div>';

            template +=             '<hr />';
            template +=             '<div class="info-header"><i class="fa fa-comment fa-1x"></i> Comment</div>';
            template +=             '<div class="info-group">';
            template +=                 '<div class="input-comment">&nbsp;</div>';
            template +=             '</div>';

            template +=             '<hr />';
            template +=             '<div class="info-header"><i class="fa fa-calendar-o fa-1x"></i> Date</div>';
            template +=             '<div class="info-group">';
            template +=                 '<input type="text" class="form-control input-date" />';
            template +=             '</div>';

            template +=             '<hr />';
            template +=             '<div class="info-header"><i class="fa fa-user fa-1x"></i> Author</div>';
            template +=             '<div class="info-group">';
            template +=                 '<div class="input-contact">&nbsp;</div>';
            template +=             '</div>';
            
            template +=             '<hr />';
            template +=             '<div class="info-group">';
            template +=             '</div>';
            template +=             '<div class="info-button-group delete-group">';
            template +=                 '<div class="btn-brown btn-large evt-delete">Delete</div>';
            template +=                 '<div class="text-label">*This action cannot be undone.</div>';
            template +=             '</div>';   // end of .info-button-group
            /*
            template +=             '<div class="info-button-group">';
            template +=                 '<div class="btn-brown btn-medium evt-close">Cancel</div>';
            template +=             '</div>';   // end of .info-button-group
            */
            template +=         '</div>';   // end of #content-post
            template +=     '</div>';   // end of .frame-flex-group
            template += '</div>';   // end of #wrapper-post-note

            return template;
        }

        public static getPostNoteViewTemplate2(): string {
            var template = '';
            template += '<div id="wrapper-note">';
            template += '<div class="outer-frame">';
            template += '<div class="inner-frame">';
            template += '<div class="wrapper-post-note-content">';

            template += '<div class="image-wrapper">';


            template += '<div class="wrapper-input-upload-picture">';
            template += '<input class="input-upload-picture fileupload" type="file" accept="image/*" capture="camera" />';
            template += '</div>';
            template += '<div class="wrapper-uploading-picture hidden">';
            template += '<div class="uploading-picture">Uploading...</div>';
            template += '</div>';
            template += '<div class="info-header"><i class="fa fa-image"></i> Select Cover Picture</div>';
            template += '<div class="image-group"></div>';

            template += '</div>';   // end of .image-wrapper


            template += '<div class="wrapper-note-info">';

            template += '<div class="name"><%= name %></div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-star-half-o"></i> Rating</div>';
            template += '<div class="info-group">';
            template += '<div class="input-rating"></div>';
            template += '<div class="input-rating-slider"></div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-comment"></i> Comment</div>';
            template += '<div class="info-group">';
            template += '<div class="input-comment">&nbsp;</div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-calendar-o"></i> Date</div>';
            template += '<div class="info-group">';
            template += '<input type="text" class="form-control input-date" />';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-user"></i> Author\'s E-mail Address</div>';
            template += '<div class="info-group">';
            template += '<input type="email" name="email" class="form-control input-author" placeholder="e-mail address" autocomplete="on"/>';
            template += '<div class="button-description2">* The <strong>e-mail address</strong> that you enter will be stored as a perspective foodparent. You can <strong>become a parent</strong> using the same e-mail address that you provide.</div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-button-group">';
            template += '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 create-note"><i class="fa fa-save"></i> Save</div></div>';
            template += '</div>';

            template += '</div>';   // .wrapper-note-info

            template += '</div>';   // end of .wrapper-post-note-content

            template += '</div>';   // end of .inner-frame
            template += '<div class="top-right-button button-close">';
            template += '<i class="fa fa-remove fa-2x"></i>';
            template += '</div>';   // end of top-right-button button-close
            template += '</div>';   // end of .outer-frame
            template += '</div>';   // end of #wrapper-note

            return template;
        }

        public static getManageDonationsTableViewTemplate(): string {
            var template = '';
            template += '<div id="wrapper-mdonations">';
            template += '<div id="wrapper-mdonations-table">';
            template += '<div id="wrapper-tablemenu">';
            template += '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 switch-map">Switch to Map View</div></div>';
            template += '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 add-location">Add A New Location</div></div>';
            template += '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 collapsible-button" data-target="#filter-list">Filter List</div></div>';
            template += '<div id="filter-list" class="collapsible-list">';
            template += '</div>';
            template += '</div>';

            template += '<div id="content-location-table">';
            template += '<div class="new-location hidden">';
            template += '</div>';
            template += '<div class="list-title">List of Locations</div>';
            template += '<div class="list-location">';
            template += '</div>';
            template += '</div>';

            template += '</div>';
            template += '</div>';
            return template;
        }

        public static getManageDonationViewTemplate(): string {
            var template = '';
            template += '<div id="wrapper-manage-donation">';
            template += '<div class="outer-frame">';
            template += '<div class="inner-frame">';


            template += '<div id="wrapper-manage-donation-table">';
            template += '<div id="wrapper-tablemenu">';

            template += '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 switch-map">Switch to Map View</div></div>';

            template += '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 collapsible-button" data-target="#filter-list">Filter List</div></div>';
            template += '<div id="filter-list" class="collapsible-list">';
            template += '</div>';

            template += '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 collapsible-button" data-target="#forage-list">Foragable List</div></div>';
            template += '<div id="forage-list" class="collapsible-list hidden">';
            template += '</div>';
            template += '</div>';

            template += '<div id="content-manage-adoption-table">';
            template += '<div class="view-title">Food Donation</div>';
            template += '<div class="view-description">Click <i class="fa fa-plus-square fa-1x"></i> icon to donate food for <strong><i><%= placename %></i></strong>.</div>';
            
            template += '<div id="list-donation" class="list-donation" data-target="<%= placeid %>"></div>';
            template += '<hr>';

            template += '<div class="new-donation" data-target="<%= placeid %>"></div>';
            


            template += '<div class="wrapper-input-upload-picture">';
            template += '<input class="input-upload-picture fileupload" type="file" accept="image/*" capture="camera" />';
            template += '</div>';
            template += '<div class="wrapper-uploading-picture hidden">';
            template += '<div class="uploading-picture">Uploading...</div>';
            template += '</div>';
            template += '<div class="info-header"><i class="fa fa-image"></i> Select Cover Picture</div>';
            template += '<div class="image-group"></div>';   // end of .image-wrapper

            //template += '</div>';   // end of .image-wrapper
            template += '<hr>';
            template += '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 button-submit-donation">Submit Donations</div></div>';

            template += '</div>';
            template += '</div>';

            template += '<div class="top-right-button button-close">';
            template += '<i class="fa fa-remove fa-2x"></i>';
            template += '</div>';


            template += '</div>';
            template += '</div>';
            template += '</div>';
            return template;
        }

        public static getAddNewDonationTreeTemplate(): string {
            var template = '';
            template += '<% _.each(trees, function (tree) { %>';
            template += '<% var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() }); %>';
            template += '<div class="cell-link cell-tree-detail" data-target="<%= tree.getId() %>"><%= food.getName() + " " + tree.getName() %><i class="fa fa-remove fa-1x"></i></div>';
            template += '<% }); %>';
            return template;
        }


        public static getDetailDonationGraphicViewTemplate(): string {
            var template = '';
            template += '<div id="wrapper-mdonation">';

            template += '<div id="wrapper-graph">';

            template += '<div id="wrapper-chart"></div>';

            template += '<div id="wrapper-tooltip" class="hidden"></div>';

            template += '<div id="wrapper-mapmenu">';
            template += '<div class="button-outer-frame2 button3"><div class="button-inner-frame2"><i class="fa fa-arrow-left"></i> Back to List</div></div>';
            template += '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 button-new-donation"><i class="fa fa-sticky-note-o"></i> Post New Donation</div></div>';
            template += '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 button-delete-location"><i class="fa fa-remove"></i> Delete Place*</div></div>';
            template += '<div class="button-description2">* marked operation cannot be undone.</div>';
            template += '</div>';

            template += '<div id="wrapper-date-select">';
            template += '<div class="wrapper-date-preset">';
            template += '<div class="button-outer-frame2 button3 date-preset 2years"><div class="button-inner-frame2">2 Year</div></div>';
            template += '<div class="button-outer-frame2 button3 date-preset 1years"><div class="button-inner-frame2">1 Year</div></div>';
            template += '<div class="button-outer-frame2 button3 date-preset 6months"><div class="button-inner-frame2">6 months</div></div>';
            template += '<div class="button-outer-frame2 button3 date-preset 3months"><div class="button-inner-frame2">3 months</div></div>';
            template += '<div class="button-outer-frame2 button3 date-preset 1month"><div class="button-inner-frame2">1 month</div></div>';
            template += '</div>';
            template += '<div class="wrapper-date-select-item"><input type="text" class="form-control donation-graph-start" /></div>';
            template += '<div class="wrapper-date-select-item"><span class="date-select-label">~</span><input type="text" class="form-control donation-graph-end" /></div>';
            template += '</div>';


            template += '</div>';   // end of #wrapper-graph



            template += '<div id="wrapper-donation-detail">';

            template += '<div class="content-donation-info">';
            template += '</div>';   // end of .content-donation-info

            template += '<div class="content-donation-recentdonations">';
            template += '<div class="info-header"><i class="fa fa-leaf fa-1x"></i> Recent Donations</div>';
            template += '<div id="list-donations" class="info-group">';
            template += '</div>';
            template += '</div>';   // end of .content-donation-recentactivities
            /*
            template += '<div class="content-donation-control">';
            template += '<div class="button-outer-frame2 button4"><div class="button-inner-frame2 button-new-donation">Post New Donation</div></div>';
            template += '<div class="button-outer-frame2 button4"><div class="button-inner-frame2 button-delete-location">Delete Place*</div></div>';
            template += '<div class="button-description">* marked operation cannot be undone.</div>';
            template += '</div>';   // end of .donation-control
            */
            template += '</div>';   // end of #wrapper-donation-detail

            
            template += '</div>';   // end of #wrapper-mtree
            return template;
        }

        public static getPlaceInfoTemplate2(): string {
            var template = '';
            template += '<div class="donation-info-name"><div class="info-group-flex"><div class="input-food"><%= placename %></div></div>';
            template += '<div class="donation-info-coordinate">@&nbsp;<div class="input-lat"><%= lat %></div>,&nbsp;<div class="input-lng"><%= lng %></div></div>';
            template += '</div>';

            template += '<div class="donation-info-address"><div>&nbsp;</div></div>';
            template += '<div class="info-group info-group-flex">';
            template += '<i class="fa fa-sticky-note fa-1x"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<div class="input-description"><%= description %></div>';
            template += '</div>';

            return template;
        }

        public static getRecentDonationsTemplate(): string {
            var template = '';
            template += '<% _.each(donations.models, function (donation, index) { %>';
            template += '<% if (index < size) { %>';
            template += '<div class="item-activity"><i class="fa fa-caret-right fa-1x"></i> <div><%= donation.getCommentWithDate() %></div></div>';
            template += '<% } %>';
            template += '<% }); %>';
            return template;
        }

        public static getEditDonationViewTemplate(): string {
            var template = '';
            template += '<div id="wrapper-donation">';
            template += '<div class="outer-frame">';
            template += '<div class="inner-frame">';
            template += '<div class="wrapper-note-content">';
            template += '<div class="image-wrapper">';

            template += '<div class="wrapper-input-upload-picture">';
            template += '<input class="input-upload-picture fileupload" type="file" accept="image/*" capture="camera" />';
            template += '</div>';
            template += '<div class="wrapper-uploading-picture hidden">';
            template += '<div class="uploading-picture">Uploading...</div>';
            template += '</div>';
            template += '<div class="info-header"><i class="fa fa-image"></i> Select Cover Picture</div>';

            template += '<div class="image-group"></div>';
            template += '</div>';   // end of .image-wrapper

            template += '<div class="wrapper-note-info">';





            template += '<div class="name"><%= name %></div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-button-group">';
            template += '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 prev-note"><i class="fa fa-caret-left"></i></div></div>';
            template += '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 next-note"><i class="fa fa-caret-right"></i></div></div>';
            template += '</div>';

            /*
            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-star-half-o"></i> Rating</div>';
            template += '<div class="info-group">';
            template += '<div class="input-rating"><%= value %></div>';
            template += '<div class="input-rating-slider"></div>';
            template += '</div>';

            
            */

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-ambulance"></i> Amount</div>';
            template += '<div class="info-group">';
            template += '<div class="input-amount"><%= amount %> lbs.</div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-ambulance"></i> Trees</div>';
            template += '<div class="info-group">';
            template += '<div class="new-donation-trees"></div>';
            template += '<div class="add-donation-tree"></div>';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-calendar-o"></i> Date</div>';
            template += '<div class="info-group">';
            template += '<input type="text" class="form-control input-date" />';
            template += '</div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-button-group">';
            template += '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 delete-donation"><i class="fa fa-remove"></i> Delete</div></div>';
            template += '</div>';


            template += '</div>';

            template += '</div>';   // end of .wrapper-note-content
            template += '</div>';   // end of .inner-frame
            template += '<div class="top-right-button button-close">';
            template += '<i class="fa fa-remove fa-2x"></i>';
            template += '</div>';   // end of top-right-button button-close
            template += '</div>';   // end of .outer-frame
            template += '</div>';   // end of #wrapper-note
            return template;
        }


        public static getLogInViewTemplate(): string {
            var template = '';
            template += '<div id="wrapper-login" class="frame-pop">';
            template += '<div id="frame-login">';

            template +=     '<div id="content-header">';
            template +=         '<div class="text-header"><%= header %></div>';
            template +=         '<div class="btn-close evt-close">';
            template +=             '<i class="fa fa-remove"></i>';
            template +=         '</div>';   // end of top-right-button button-close
            template +=     '</div>';   // end of #wrapper-header

            template +=     '<hr />';

            template +=     '<div id="content-login">';
            template +=         '<div class="info-group">';
            template +=             '<div class="text-label"><i class="fa fa-caret-right"></i> Please put your e-mail address to log in.</div>';
            template +=         '</div>';   // end of .info-group
            
            template +=         '<div class="info-group">';
            template +=             '<input type="email" name="email" class="form-control input-contact" placeholder="e-mail address" autocomplete="on"/>';
            template +=         '</div>';   // end of .info-group

            template +=         '<div class="info-group invisible">';
            template +=             '<input type="password" name="password" class="form-control input-password" placeholder="password"/>';
            template +=         '</div>';   // end of .info-group

            template +=         '<div class="info-group">';
            template +=             '<div data-toggle="buttons">';
            template +=                 '<label class="btn evt-manager">';
            template +=                 '<input type="checkbox" name="manager" />';
            template +=                 '<i class="fa fa-square-o fa-1x"></i>';
            template +=                 '<i class="fa fa-check-square-o fa-1x"></i>';
            template +=                     ' I am a manager';
            template +=                 '</label>';
            template +=             '</div>';
            template +=         '</div>';   // end of .info-group

            template +=         '<hr />';

            template +=         '<div class="info-button-group">';
            template +=             '<div class="btn-brown btn-medium evt-submit">Submit</div>';
            template +=         '</div>';   // end of .info-button-group

            template +=         '<div class="info-button-group">';
            template +=             '<div class="btn-brown btn-medium evt-close">Cancel</div>';
            template +=         '</div>';   // end of .info-button-group

            template +=         '<hr />';

            template +=         '<div class="info-button-group">';
            template +=             '<div class="btn-brown btn-medium evt-signup">Become a Parent!</div>';
            template +=         '</div>';   // end of .info-button-group

            template +=     '</div>';   // end of .content-login
            template += '</div>';   // end of #frame-login
            template += '</div>';   // end of #wrapper-login
            return template;
        }


        public static getAccountViewTemplateForParent(): string {
            var template = '';
            template += '<div id="wrapper-login" class="frame-pop">';
            template += '<div id="frame-login">';
            template +=     '<div id="content-header">';
            template +=         '<div class="text-header"><%= header %></div>';
            template +=         '<div class="btn-close evt-close">';
            template +=             '<i class="fa fa-remove"></i>';
            template +=         '</div>';   // end of top-right-button button-close
            template +=     '</div>';   // end of #wrapper-header

            template +=     '<hr />';

            template +=     '<div id="content-login">';
            template +=         '<div class="info-group">';
            template +=             '<div class="text-label"><i class="fa fa-caret-right"></i> <i>Account: </i><strong><%= contact %></strong></div>';
            template +=         '</div>';   // end of .info-group

            template +=         '<hr />';
            template +=         '<div class="info-group">';
            template +=             '<div class="text-label"><i class="fa fa-caret-right"></i> Information</div>';
            template +=         '</div>';   // end of .info-group
            template +=         '<div class="info-group">';
            template +=             '<input type="text" class="form-control input-name" placeholder="first & last name" />';
            template +=         '</div>';   // end of .info-group
            template +=         '<div class="info-group">';
            template +=             '<input type="text" class="form-control input-neighborhood" placeholder="name of place near you (street, park)" />';
            template +=         '</div>';   // end of .info-group

            template +=         '<hr />';

            template +=         '<div class="info-button-group">';
            template +=             '<div class="btn-brown btn-medium evt-logout">Log Out</div>';
            template +=         '</div>';   // end of .info-button-group

            template +=         '<div class="info-button-group">';
            template +=             '<div class="btn-brown btn-medium evt-detail">See Parent Detail</div>';
            template +=         '</div>';   // end of .info-button-group

            template +=         '<div class="info-button-group">';
            template +=             '<div class="btn-brown btn-medium evt-close">Cancel</div>';
            template +=         '</div>';   // end of .info-button-group

            template +=     '</div>';   // end of .content-login
            template += '</div>';   // end of #frame-login
            template += '</div>';   // end of #wrapper-login
            return template;

            /*
            template += '<% if (auth < 3) { %>';
            template += '<div class="info-group">';
            template += '<div data-toggle="buttons">';
            template += '<label class="btn filter-checkbox2 filter-manager">';
            template += '<input type="checkbox" name="changepassword">';
            template += '<i class="fa fa-square-o fa-1x"></i>';
            template += '<i class="fa fa-check-square-o fa-1x"></i>';
            template += ' change password</label>';
            template += '</div>';
            template += '</div>';
            template += '<div class="info-group hidden">';
            template += '<input type="text" class="form-control input-password" placeholder="password"/>';
            template += '<input type="text" class="form-control input-password2" placeholder="confirm password"/>';
            template += '</div>';
            template += '<% } %>';
            */
        }

        public static getAccountViewTemplateForAdmin(): string {
            return Template.getAccountViewTemplateForParent();
        }


        public static getLoggedInViewTemplate(): string {
            var template = '';
            template += '<div id="wrapper-login" class="frame-pop">';
            template += '<div class="outer-frame">';
            template += '<div class="inner-frame">';
            template += '<div class="wrapper-login-content">';

            template += '<div class="info-group">';
            template += '<div class="name"><i>You are logged in as </i><strong><%= contact %></strong></div>';
            template += '</div>';

            template += '<div class="info-button-group">';
            template += '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 logged-logout">Log Out</div></div>';
            template += '</div>';

            /*
            template += '<div class="hr"><hr /></div>';

            template += '<div class="info-group">';
            template += '<input type="text" class="form-control input-name" placeholder="name"/>';
            template += '</div>';

            template += '<div class="info-group">';
            template += '<input type="text" class="form-control input-address" placeholder="address"/>';
            template += '</div>';

            template += '<div class="info-group">';
            template += '<input type="text" class="form-control input-neighborhood" placeholder="neighborhood"/>';
            template += '</div>';
            */

            
            template += '<% if (auth < 3) { %>';
            template += '<div class="info-group">';
            template += '<div data-toggle="buttons">';
            template += '<label class="btn filter-checkbox2 filter-manager">';
            template += '<input type="checkbox" name="changepassword">';
            template += '<i class="fa fa-square-o fa-1x"></i>';
            template += '<i class="fa fa-check-square-o fa-1x"></i>';
            template += ' change password</label>';
            template += '</div>';
            template += '</div>';
            template += '<div class="info-group hidden">';
            template += '<input type="text" class="form-control input-password" placeholder="password"/>';
            template += '<input type="text" class="form-control input-password2" placeholder="confirm password"/>';
            template += '</div>';
            template += '<% } %>';

            
            template += '<div class="info-button-group">';
            template += '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 logged-submit">See Parent Detail</div></div>';
            template += '</div>';
            
            

            template += '<div class="info-button-group">';
            template += '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 logged-cancel">Cancel</div></div>';
            template += '</div>';

            /*
            template += '<div class="hr"><hr /></div>';

            template += '<br />';
            template += '<div class="info-button-group">';
            template += '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 logged-delete">Delete Account*</div></div>';
            template += '<div class="button-description2">* marked operation cannot be undone.</div>';
            template += '</div>';
            */


            template += '</div>';   // end of .wrapper-login-content
            template += '</div>';   // end of .inner-frame
            template += '<div class="top-right-button button-close">';
            template += '<i class="fa fa-remove fa-2x"></i>';
            template += '</div>';   // end of top-right-button button-close
            template += '</div>';   // end of .outer-frame
            template += '</div>';   // end of #wrapper-note
            return template;
        }

        /*

        public static getSignUpViewTemplate(): string {
            var template = '';
            template += '<div id="wrapper-signup">';
            template += '<div class="outer-frame">';
            template += '<div class="inner-frame">';
            template += '<div class="wrapper-signup-content">';

            template += '<div class="info-group">';
            template += '<div class="name"><i>E-mail address</i></div>';
            template += '</div>';

            template += '<div class="info-group">';
            template += '<input type="email" name="email" class="form-control input-contact" placeholder="e-mail address" autocomplete="on"/>';
            template += '</div>';            

            template += '<div class="hr"><hr /></div>';

            template += '<div class="info-group">';
            template += '<div class="name">Information</div>';
            template += '</div>';

            template += '<div class="info-group">';
            template += '<input type="text" class="form-control input-name" placeholder="first & last name"/>';
            template += '</div>';

            template += '<div class="info-group">';
            template += '<input type="text" class="form-control input-neighborhood" placeholder="name of place near you (street, park)"/>';
            template += '</div>';
            
            template += '<div class="hr"><hr /></div>';

            template += '<div class="info-button-group">';
            template += '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 signup-submit">Sign Up</div></div>';
            template += '</div>';

            template += '<div class="info-button-group">';
            template += '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 signup-cancel">Cancel</div></div>';
            template += '</div>';

            template += '</div>';   // end of .wrapper-login-content
            template += '</div>';   // end of .inner-frame
            template += '<div class="top-right-button button-close">';
            template += '<i class="fa fa-remove fa-2x"></i>';
            template += '</div>';   // end of top-right-button button-close
            template += '</div>';   // end of .outer-frame
            template += '</div>';   // end of #wrapper-note
            return template;
        }
        */
        public static getSignUpViewTemplate(): string {
            var template = '';
            template += '<div id="wrapper-signup" class="frame-pop">';
            template += '<div id="frame-signup">';

            template +=     '<div id="content-header">';
            template +=         '<div class="text-header"><%= header %></div>';
            template +=         '<div class="btn-close evt-close">';
            template +=             '<i class="fa fa-remove"></i>';
            template +=         '</div>';   // end of top-right-button button-close
            template +=     '</div>';   // end of #wrapper-header

            template +=     '<hr />';

            template +=     '<div id="content-login">';
            template +=         '<div class="info-group">';
            template +=             '<div class="text-label"><i class="fa fa-caret-right"></i> Please put your e-mail address to sign up.</div>';
            template +=         '</div>';   // end of .info-group
            
            template +=         '<div class="info-group">';
            template +=             '<input type="email" class="form-control input-contact" placeholder="e-mail address" autocomplete="on"/>';
            template +=         '</div>';   // end of .info-group for e-mail

            template +=         '<hr />';

            template +=         '<div class="info-group">';
            template +=             '<div class="text-label"><i class="fa fa-caret-right"></i> Personal Information</div>';
            template +=         '</div>';   // end of .info-group grab info

            template +=         '<div class="info-group">';
            template +=             '<input type="text" class="form-control input-name" placeholder="Name" autocomplete="on"/>';
            template +=         '</div>';   // end of .info-group for e-mail

            template +=         '<div class="info-group">';
            template +=             '<input type="text" class="form-control input-neighborhood" placeholder="Nearby place (street, park, etc)" autocomplete="on"/>';
            template +=         '</div>';   // end of .info-group for e-mail

            template += '<hr />';

            template +=         '<div class="info-button-group">';
            template +=             '<div class="btn-brown btn-medium evt-submit">Sign Up</div>';
            template +=         '</div>';   // end of .info-button-group submit button

            template +=         '<div class="info-button-group">';
            template +=             '<div class="btn-brown btn-medium evt-close">Cancel</div>';
            template +=         '</div>';   // end of .info-button-group cancel button


            template +=     '</div>';   // end of .content-signup
            template += '</div>';   // end of #frame-signup
            template += '</div>';   // end of #wrapper-signup
            return template;
        }

        public static getAdoptTreeViewTemplate(): string {
            var template = '';
            template += '<div id="wrapper-tree-adopt" class="frame-pop">';
            template += '<div id="frame-tree-adopt">';
            template +=     '<div id="content-header">';
            template +=         '<div class="text-header"><%= header %></div>';
            template +=         '<div class="btn-close evt-close">';
            template +=             '<i class="fa fa-remove"></i>';
            template +=         '</div>';   // end of top-right-button button-close
            template +=     '</div>';   // end of #wrapper-header

            template +=     '<hr />';
            template +=     '<div id="content-login">';
            template +=         '<div class="info-group">';
            template +=             '<div class="text-label">Do you want to adopt <i><strong>\'<%= treename %>\'</strong></i> ?</div>';
            template +=         '</div>';   // end of .info-group

            template +=         '<hr />';

            template +=         '<div class="info-button-group">';
            template +=             '<div class="btn-brown btn-medium evt-submit">Adopt</div>';
            template +=         '</div>';   // end of .info-button-group
            
            template +=         '<div class="info-button-group">';
            template +=             '<div class="btn-brown btn-medium evt-close">Cancel</div>';
            template +=         '</div>';   // end of .info-button-group

            template +=     '</div>';   // end of .content-login
            template += '</div>';   // end of #frame-tree-adopt
            template += '</div>';   // end of #wrapper-tree-adopt
            return template;
        }


        public static getUnadoptTreeViewTemplate(): string {
        var template = '';
            template += '<div id="wrapper-tree-adopt" class="frame-pop">';
            template += '<div id="frame-tree-adopt">';
            template +=     '<div id="content-header">';
            template +=         '<div class="text-header"><%= header %></div>';
            template +=         '<div class="btn-close evt-close">';
            template +=             '<i class="fa fa-remove"></i>';
            template +=         '</div>';   // end of top-right-button button-close
            template +=     '</div>';   // end of #wrapper-header

            template +=     '<hr />';
            template +=     '<div id="content-login">';
            template +=         '<div class="info-group">';
            template +=             '<div class="text-label">Do you want to unadopt <i><strong>\'<%= treename %>\'</strong></i> ?</div>';
            template +=         '</div>';   // end of .info-group

            template +=         '<hr />';

            template +=         '<div class="info-button-group">';
            template +=             '<div class="btn-brown btn-medium evt-submit">Unadopt</div>';
            template +=         '</div>';   // end of .info-button-group
            
            template +=         '<div class="info-button-group">';
            template +=             '<div class="btn-brown btn-medium evt-close">Cancel</div>';
            template +=         '</div>';   // end of .info-button-group

            template +=     '</div>';   // end of .content-login
            template += '</div>';   // end of #frame-tree-adopt
            template += '</div>';   // end of #wrapper-tree-adopt
            return template;
        }

        public static getChangePasswordViewTemplate(): string {
            var template = '';
            template += '<div id="wrapper-change-password">';
            template += '<div class="outer-frame">';
            template += '<div class="inner-frame">';
            template += '<div class="wrapper-change-password-content">';

            template += '<div class="info-group">';
            template += '<div class="name">Please enter a new password for <i><strong><%= personname %></strong></i>.</div>';
            template += '</div>';

            template += '<div class="info-group">';
            template += '<input type="password" class="form-control input-password" placeholder="password"/>';
            template += '<input type="password" class="form-control input-password2" placeholder="confirm password"/>';
            template += '<div class="button-description2">* The password should be longer than 6 characters.</div>';
            template += '<div class="button-description2">* Changing your own password will sign you out automatically.</div>';
            template += '</div>';

            template += '<div class="info-button-group">';
            template += '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 password-submit">Change</div></div>';
            template += '</div>';

            template += '<div class="info-button-group">';
            template += '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 password-cancel">Cancel</div></div>';
            template += '</div>';

            template += '</div>';   // end of .wrapper-login-content
            template += '</div>';   // end of .inner-frame
            template += '<div class="top-right-button button-close">';
            template += '<i class="fa fa-remove fa-2x"></i>';
            template += '</div>';   // end of top-right-button button-close
            template += '</div>';   // end of .outer-frame
            template += '</div>';   // end of #wrapper-note
            return template;
        }
    }
}