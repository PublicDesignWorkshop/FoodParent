﻿module FoodParent {
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
            template +=         '<div class="enter-left"><i class="fa fa-angle-left"></i> manage food assets</div>';
            template +=     '</div>';
            template +=     '<div class="home-menu-right">';
            template +=         '<div class="title-right">Parent</div>';
            template +=         '<div class="enter-left">parent food assets <i class="fa fa-angle-right"></i></div>';
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
            template +=             '<div class="tree-list-title">List of Trees</div>';
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
            template += '<div class="item-nav item-manage-title">FoodParent&#8482;</div>';
            template += '<div class="item-nav item-manage trees">TREES</div>';
            template += '<div class="item-nav item-manage people">PEOPLE</div>';
            template += '<div class="item-nav item-manage adops">ADOPTS</div>';
            template += '<div class="item-nav item-manage donations">DONATIONS</div>';
            template += '<div class="item-nav item-manage-parent parent">PARENT</div>';
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
            template +=     '<div class="marker-control-item marker-control-info">';
            template +=         '<i class="fa fa-user fa-2x"></i>';
            template +=     '</div>';
            template +=     '<div class="marker-control-item marker-control-info">';
            template +=         '<i class="fa fa-sticky-note-o fa-2x"></i>';
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
            template += '<div class="tree-info-coordinate">@&nbsp;<div class="input-lat"><%= lat %></div>,&nbsp;<div class="input-lng"><%= lng %></div></div>';
            template += '<div class="tree-info-address"><div>&nbsp;</div><div>&nbsp;</div></div>';

            template += '<div class="hr"><hr /></div>';
            template += '<div class="info-header"><i class="fa fa-sticky-note fa-1x"></i> Description</div>';
            template += '<div class="info-group">';
            template += '<div class="input-description"><%= description %></div>';
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

        public static getRecentActivitiesTemplate(): string {
            var template = '';
            template += '<% _.each(notes.models, function (note) { %>';
            template += '<div class="item-activity"><i class="fa fa-caret-right fa-1x"></i> <div><%= note.getComment() %></div></div>';
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
            template +=         '<input type="checkbox" name="assigned" checked>';
            template +=         '<i class="fa fa-square-o fa-1x"></i>';
            template +=         '<i class="fa fa-check-square-o fa-1x"></i>';
            template +=     ' Assigned</label>';
            template += '</div>';

            template += '<div data-toggle="buttons">';
            template +=     '<label class="btn filter-checkbox filter-adopt active list-hiearchy2">';
            template +=         '<input type="checkbox" name="unassigned" checked>';
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
    }
}