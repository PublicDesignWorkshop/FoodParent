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
            template +=     '<div class="home-menu-left">';
            template +=         '<div class="title-left">Food</div>';
            template +=         '<div class="enter-left"><i class="fa fa-angle-left"></i> managing food assets</div>';
            template +=     '</div>';
            template +=     '<div class="home-menu-right">';
            template +=         '<div class="title-right">Parent</div>';
            template +=         '<div class="enter-left">parenting & caring food assets <i class="fa fa-angle-right"></i></div>';
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

        public static getNavViewHomeTemplate(): string {
            var template = '';
            template += '<div id="background-nav-right">';
            template += '</div>';
            template += '<div id="background-nav-left">';
            template += '</div>';
            template += '<div id="list-nav">';
            template += '</div>';
            return template;
        }

        public static getNavViewManageTemplate(): string {
            var template = '';
            template += '<div id="background-nav-right">';
            template += '</div>';
            template += '<div id="background-nav-left">';
            template += '</div>';
            template += '<div id="list-nav">';
            template += '</div>';
            return template;
        }

        public static getNavViewManageItemsTemplate(): string {
            var template = '';
            template += '<div class="item-nav item-manage-title">FoodParent</div>';
            template += '<div class="item-nav item-manage trees">TREES</div>';
            template += '<div class="item-nav item-manage people">PEOPLE</div>';
            template += '<div class="item-nav item-manage adops">ADOPTS</div>';
            template += '<div class="item-nav item-manage donations">DONATIONS</div>';
            template += '<div class="item-nav item-manage-parent parent"><div>PARENT</div></div>';
            return template;
        }

        public static getAlertViewTemplate(): string {
            var template = '';
            template += '<div id="wrapper-alert">';
            template +=     '<div class="outer-frame">';
            template +=         '<div class="inner-frame">';
            template +=             '<%= content %>';
            template +=         '</div>';
            template +=     '</div>';
            template += '</div>';
            return template;
        }

        public static getConfirmViewTemplate(): string {
            var template = '';
            template += '<div id="wrapper-confirm">';
            template += '<div class="outer-frame">';
            template += '<div class="inner-frame">';
            template += '<%= content %>';
            template += '</div>';
            template += '</div>';
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

        public static getManageTreesPopupTemplate(): string {
            var template = '';
            template += '<div class="marker-control-wrapper">';
            template +=     '<div class="marker-control-item marker-control-lock">';
            template +=         '<i class="fa fa-lock fa-2x"></i>';
            template +=     '</div>';
            template +=     '<div class="marker-control-item marker-control-adoption">';
            template +=         '<i class="fa fa-user-plus fa-2x"></i>';
            template +=     '</div>';
            template +=     '<div class="marker-control-item marker-control-info">';
            template +=         '<i class="fa fa-arrow-circle-right fa-2x"></i>';
            template +=     '</div>';
            template +=     '<div class="marker-control-item marker-control-delete">';
            template +=         '<i class="fa fa-remove fa-2x"></i>';
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

        public static getTreeInfoTemplate(): string {
            var template = '';
            template += '<div class="tree-info-name"><div class="input-food"><%= foodname %></div>&nbsp;<%= treename %></div>';
            template += '<div class="tree-info-coordinate"><div>@&nbsp;</div><div class="input-lat"><%= lat %></div>,&nbsp;<div class="input-lng"><%= lng %></div></div>';
            template += '<div class="tree-info-address"><div>&nbsp;</div><div>&nbsp;</div></div>';

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
            template +=     '<input type="radio" name="flag">';
            template +=     '<i class="fa fa-circle-o fa-1x"></i>';
            template +=     '<i class="fa fa-check-circle-o fa-1x"></i>';
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
            template += '<div class="info-header"><i class="fa fa-leaf fa-1x"></i> Recent Activities</div>';
            template += '<div id="list-activities" class="info-group">';
            template += '<div>&nbsp;</div>';
            template += '</div>';


            return template;
        }

        public static getTreeInfoTemplate2(): string {
            var template = '';
            template += '<div class="tree-info-name"><div class="info-group-flex"><div class="input-food"><%= foodname %></div>&nbsp;<%= treename %></div>';
            template +=     '<div class="tree-info-coordinate">@&nbsp;<div class="input-lat"><%= lat %></div>,&nbsp;<div class="input-lng"><%= lng %></div></div>';
            template += '</div>';

            template += '<div class="tree-info-address"><div>&nbsp;</div></div>';
            template += '<div class="info-group info-group-flex">';
            template +=     '<i class="fa fa-sticky-note fa-1x"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<div class="input-description"><%= description %></div>';
            template += '</div>';

            template += '<div class="info-group info-group-flex"><i class="fa fa-user fa-1x"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
            template += '<% _.each(persons.models, function (person, index) { %>';
            template += '<% if (index < persons.models.length - 1) { %>';
            template += '<div><%= person.getName() %>,&nbsp;</div>';
            template += '<% } else { %>';
            template += '<div><%= person.getName() %></div>';
            template += '<% } %>';
            template += '<% }); %>';
            template += '</div>';

            template += '<div class="info-group info-group-flex"><div class="button-group-tag"><i class="fa fa-tag fa-1x"></i>&nbsp;</div>';
            template += '<div data-toggle="buttons">';
            template += '<% _.each(flags.models, function (flag) { %>';
            template += '<label class="btn flag-radio" data-target="<%= flag.getId() %>">';
            template += '<input type="radio" name="flag">';
            template += '<i class="fa fa-circle-o fa-1x"></i>';
            template += '<i class="fa fa-check-circle-o fa-1x"></i>';
            template += ' <%= flag.getName() %></label>';
            template += '<% }); %>';
            template += '</div>';
            template += '</div>';

            template += '<div class="info-group info-group-flex"><div class="button-group-tag"><i class="fa fa-home fa-1x"></i>&nbsp;</div>';
            template += '<div data-toggle="buttons">';
            template += '<% _.each(ownerships.models, function (ownership) { %>';
            template += '<label class="btn ownership-radio" data-target="<%= ownership.getId() %>">';
            template += '<input type="radio" name="ownership">';
            template += '<i class="fa fa-circle-o fa-1x"></i>';
            template += '<i class="fa fa-check-circle-o fa-1x"></i>';
            template += ' <%= ownership.getName() %></label>';
            template += '<% }); %>';
            template += '</div>';
            template += '</div>';

            return template;
        }

        public static getRecentActivitiesTemplate(): string {
            var template = '';
            template += '<% _.each(notes.models, function (note, index) { %>';
            template += '<% if (index < size) { %>';
            template +=     '<div class="item-activity"><i class="fa fa-caret-right fa-1x"></i> <div><%= note.getComment() %></div></div>';
            template += '<% } %>';
            template += '<% }); %>';
            return template;
        }

        public static getTreeFilterListTemplate(): string {
            var template = '';
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
            template += '<div data-toggle="buttons">';
            template += '<label class="btn filter-checkbox active list-hiearchy1">';
            template += '<input type="checkbox" name="adoptsall" checked>';
            template += '<i class="fa fa-square-o fa-1x"></i>';
            template += '<i class="fa fa-check-square-o fa-1x"></i>';
            template += ' Parenting Status (show all / hide)</label>';
            template += '</div>';

            template += '<div data-toggle="buttons">';
            template += '<label class="btn filter-checkbox filter-adopt active list-hiearchy2">';
            template += '<input type="checkbox" name="1" checked>';
            template += '<i class="fa fa-square-o fa-1x"></i>';
            template += '<i class="fa fa-check-square-o fa-1x"></i>';
            template += ' Parenting</label>';
            template += '</div>';

            template += '<div data-toggle="buttons">';
            template += '<label class="btn filter-checkbox filter-adopt active list-hiearchy2">';
            template += '<input type="checkbox" name="0" checked>';
            template += '<i class="fa fa-square-o fa-1x"></i>';
            template += '<i class="fa fa-check-square-o fa-1x"></i>';
            template += ' Non-Parenting</label>';
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

        public static getAdoptTreeCellTemplate(): string {
            //<%= address %>
            var template = "";
           // template += '<div class="cell-group">';
            template += '<% _.each(trees.models, function (tree) { %>';
            template +=     '<% var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() }); %>';
            template +=     '<div class="cell-link cell-tree-detail" data-target="<%= tree.getId() %>"><%= food.getName() + " " + tree.getName() %></div>';
            template += '<% }); %>';
            //template += '<div class="cell-button cell-edit"><i class="fa fa-edit fa-1x"></i></div>';
            //template += '</div>';
            return template;
        }

        public static getAdoptPersonCellTemplate(): string {
            //<%= address %>
            var template = "";
            // template += '<div class="cell-group">';
            template += '<% _.each(persons.models, function (person) { %>';
            template += '<div class="cell-link cell-person-detail" data-target="<%= person.getId() %>"><%= person.getName() %></div>';
            template += '<% }); %>';
            //template += '<div class="cell-button cell-edit"><i class="fa fa-edit fa-1x"></i></div>';
            //template += '</div>';
            return template;
        }


        public static getManageAdoptionViewTemplate(): string {
            var template = '';
            template += '<div id="wrapper-manage-adoption">';
            template += '<div class="outer-frame">';
            template += '<div class="inner-frame">';
            

            template +=     '<div id="wrapper-manage-adoption-table">';
            template +=         '<div id="wrapper-tablemenu">';
            template +=             '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 collapsible-button" data-target="#filter-list">Filter List</div></div>';
            template +=             '<div id="filter-list" class="collapsible-list">';
            template +=             '</div>';

            template +=             '<div class="button-outer-frame2 button3"><div class="button-inner-frame2 collapsible-button" data-target="#forage-list">Foragable List</div></div>';
            template +=             '<div id="forage-list" class="collapsible-list hidden">';
            template +=             '</div>';
            template +=         '</div>';

            template +=         '<div id="content-manage-adoption-table">';
            template +=             '<div class="view-title">Tree Adoption</div>';
            template +=             '<div class="view-description">Click <i class="fa fa-plus-square fa-1x"></i> icon to assign a new parent for <strong><i><%= treename %></i></strong>.</div>';
            template +=             '<div class="list-adoption" data-target="<%= treeId %>">';
            template +=             '</div>';
            template +=         '</div>';
            template +=     '</div>';

            template +=     '<div class="top-right-button button-close">';
            template +=         '<i class="fa fa-remove fa-2x"></i>';
            template +=     '</div>';


            template += '</div>';
            template += '</div>';
            template += '</div>';
            return template;
        }

        public static getDetailTreeGraphicViewTemplate(): string {
            var template = '';
            template += '<div id="wrapper-mtree">';

            template += '<div id="wrapper-graph">';

            template +=     '<div id="wrapper-chart"></div>';

            template +=     '<div id="wrapper-tooltip" class="hidden"></div>';

            template +=     '<div id="wrapper-mapmenu">';
            template +=         '<div class="button-outer-frame2 button3"><div class="button-inner-frame2">Switch To Map View</div></div>';
            template +=     '</div>';

            template +=     '<div id="wrapper-date-select">';
            template +=         '<div class="wrapper-date-preset">';
            template +=             '<div class="button-outer-frame2 button3 date-preset 4years"><div class="button-inner-frame2">4 Year</div></div>';
            template +=             '<div class="button-outer-frame2 button3 date-preset 2years"><div class="button-inner-frame2">2 Year</div></div>';
            template +=             '<div class="button-outer-frame2 button3 date-preset 1year"><div class="button-inner-frame2">1 Year</div></div>';
            template +=             '<div class="button-outer-frame2 button3 date-preset 6months"><div class="button-inner-frame2">6 months</div></div>';
            template +=             '<div class="button-outer-frame2 button3 date-preset 1month"><div class="button-inner-frame2">3 month</div></div>';
            template +=         '</div>';
            template +=         '<div class="wrapper-date-select-item"><input type="text" class="form-control tree-graph-start" /></div>';
            template +=         '<div class="wrapper-date-select-item"><span class="date-select-label">~</span><input type="text" class="form-control tree-graph-end" /></div>';
            template +=     '</div>';

            
            template += '</div>';   // end of #wrapper-graph



            template += '<div id="wrapper-tree-detail">';

            template += '<div class="content-tree-info">';
            template += '</div>';   // end of .content-tree-info

            template += '<div class="content-tree-recentactivities">';
            template +=     '<div class="info-header"><i class="fa fa-leaf fa-1x"></i> Recent Activities</div>';
            template +=     '<div id="list-activities" class="info-group">';
            template +=     '</div>';
            template += '</div>';   // end of .content-tree-recentactivities

            template += '<div class="content-tree-control">';
            template +=     '<div class="button-outer-frame2 button4"><div class="button-inner-frame2 button-new-note">Post New Note</div></div>';
            template +=     '<div class="button-outer-frame2 button4"><div class="button-inner-frame2 button-manage-adoption">Manage Adoption</div></div>';
            template +=     '<div class="button-outer-frame2 button4"><div class="button-inner-frame2 button-delete-tree">Delete Tree*</div></div>';
            template +=     '<div class="button-description">* marked operation cannot be undone.</div>';
            template += '</div>';   // end of .tree-control
            
            template += '</div>';   // end of #wrapper-tree-detail

            
            template += '</div>';   // end of #wrapper-mtree
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
            template += '<div class="info-header"><i class="fa fa-calendar-o"></i> Posted</div>';
            template += '<div class="info-group">';
            template += '<input type="text" class="form-control input-date" />';
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

            template +=                 '</div>';
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
            template += '<div class="info-header"><i class="fa fa-calendar-o"></i> Posted</div>';
            template += '<div class="info-group">';
            template += '<input type="text" class="form-control input-date" />';
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
    }
}