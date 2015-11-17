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

        public getBaseTemplate(): string {
            var template = "";
            template += '<div id="wrapper-main-popup" class="hidden"></div>';
            template += '<div id="wrapper-main-body"></div>';
            template += '<div id="wrapper-main-header"></div>';
            return template;
        }

        public getMainHeaderTemplate(): string {
            var template = "";
            template += '<div class="row-100">';
            template +=     '<div class="col-xs-3 btn-nav nav-home"><%= site %></div>';
            template +=     '<div class="col-xs-3 btn-nav nav-trees"><%= trees %></div>';
            template +=     '<div class="col-xs-3 btn-nav nav-people"><%= people %></div>';
            template +=     '<div class="col-xs-3 btn-nav nav-about"><%= about %></div>';
            template += '</div>';
            return template;
        }

        public getMainTreeViewTemplate(): string {
            var template = "";
            template += '<div class="col-xs-3 panel-body">';
            template +=     '<div class="panel-tree-info"></div>';
            template +=     '<div id="map-tree" class="panel-tree-map"></div>';
            template += '</div>';
            template += '<div class="col-xs-9 panel-body">';
            template +=     '<div class="panel-breadcrumb"></div>';
            template +=     '<div class="panel-tree-coverflow"></div>';
            template +=     '<div class="panel-tree-detail"></div>';
            template +=     '<div id="panel-popup" class="hidden">';
            template +=         '<div class="wrapper-popup">';
            template +=         '</div>';
            template +=     '</div>';
            template += '</div>';
            return template;
        }

        public getMainTreesViewTemplate(): string {
            var template = "";
            //template += '<div class="row panel-body">';
            template += '<div class="col-xs-3 panel-body panel-sideinfo panel-left-split"></div>';
            template += '<div id="map-trees" class="col-xs-9 panel-body panel-map"></div>';
            
            //template += '</div>';
            return template;
        }

        public getMainPeopleViewTemplate(): string {
            var template = "";
            //template += '<div class="row panel-body">';
            template += '<div class="col-xs-3 panel-body panel-sideinfo panel-left-split panel-side-people"></div>';
            template += '<div id="map-people" class="col-xs-9 panel-body panel-people"></div>';
            
            //template += '</div>';
            return template;
        }

        public getEmptySideInfoViewTemplate(): string {
            var template = "";
            template += '<div class="form-group">';
            template += '<div class="col-xs-12 left"><input type="checkbox" checked id="toggle-table"></div>';
            template += '</div>';
            return template;
        }

        public getTreesSideInfoViewTemplate(): string {
            var template = "";
            template += '<div class="form-group">';
            template += '<div class="col-xs-12 left"><input type="checkbox" checked id="toggle-table"></div>';
            template += '</div>';

            template += '<div class="col-xs-9 panel-sideinfo"><h2><span class="glyphicon glyphicon-flag" aria-hidden="true"></span> Filtering</h2></div>';
            template += '<div class="col-xs-3 panel-sideinfo"><h2><i data-toggle="collapse" data-target="#peoplefilter" class="toggle-collapse fa fa-folder-open-o fa-1x"></i></h2></div>';
            template += '<div class="clear" />';
            template += '<div id="peoplefilter" class="collapse in filter">';

            

            template += '<div data-toggle="buttons">';
            template += '<label class="btn filter-checkbox">';
            template += '<input type="checkbox" name="showall">';
            template += '<i class="fa fa-square-o fa-1x"></i>';
            template += '<i class="fa fa-check-square-o fa-1x"></i>';
            template += ' show / hide all</label>';
            template += '</div>';

            template += '<div data-toggle="buttons">';
            template += '<label class="btn filter-checkbox">';
            template += '<input type="checkbox" name="assigned">';
            template += '<i class="fa fa-square-o fa-1x"></i>';
            template += '<i class="fa fa-check-square-o fa-1x"></i>';
            template += ' adopted</label>';
            template += '</div>';

            template += '<div data-toggle="buttons">';
            template += '<label class="btn filter-checkbox">';
            template += '<input type="checkbox" name="unassigned">';
            template += '<i class="fa fa-square-o fa-1x"></i>';
            template += '<i class="fa fa-check-square-o fa-1x"></i>';
            template += ' unadopted</label>';
            template += '</div>';

            template += '<% _.each(food.models, function (food) { %>';

            template += '<div data-toggle="buttons">';
            template += '<label class="btn filter-checkbox">';
            template += '<input type="checkbox" name="<%= food.getId() %>">';
            template += '<i class="fa fa-square-o fa-1x"></i>';
            template += '<i class="fa fa-check-square-o fa-1x"></i>';
            template += ' <%= food.getName() %></label>';
            template += '</div>';

            template += '<% }); %>';

            template += '</div>';

            // split
            template += '<div class="form-group split">';
            template += '<div class="col-xs-10 split-rect"></div>';
            template += '<div class="col-xs-2 split-label"></div>';
            template += '<div class="clear" />';

            return template;
        }

        public getPeopleSideInfoViewTemplate(): string {
            var template = "";
            template += '<div class="form-group">';
            template += '<div class="col-xs-12 left"><input type="checkbox" checked id="toggle-table"></div>';
            template += '</div>';

            template += '<div class="col-xs-9 panel-sideinfo"><h2><span class="glyphicon glyphicon-flag" aria-hidden="true"></span> Filtering</h2></div>';
            template += '<div class="col-xs-3 panel-sideinfo"><h2><i data-toggle="collapse" data-target="#peoplefilter" class="toggle-collapse fa fa-folder-open-o fa-1x"></i></h2></div>';
            template += '<div class="clear" />';
            template += '<div id="peoplefilter" class="collapse in">';
            template +=     '<div data-toggle="buttons">';
            template +=         '<label class="btn filter-checkbox">';
            template +=             '<input type="checkbox" name="showall">';
            template +=             '<i class="fa fa-square-o fa-1x"></i>';
            template +=             '<i class="fa fa-check-square-o fa-1x"></i>';
            template +=         ' show / hide all</label>';
            template +=     '</div>';

            template +=     '<div data-toggle="buttons">';
            template +=         '<label class="btn filter-checkbox">';
            template +=             '<input type="checkbox" name="assigned">';
            template +=             '<i class="fa fa-square-o fa-1x"></i>';
            template +=             '<i class="fa fa-check-square-o fa-1x"></i>';
            template +=         ' assigned</label>';
            template +=     '</div>';

            template +=     '<div data-toggle="buttons">';
            template +=         '<label class="btn filter-checkbox">';
            template +=             '<input type="checkbox" name="unassigned">';
            template +=             '<i class="fa fa-square-o fa-1x"></i>';
            template +=             '<i class="fa fa-check-square-o fa-1x"></i>';
            template +=         ' unassigned</label>';
            template +=     '</div>';

            //template +=     '<% _.each(flags.models, function (flag) { %>';
            //template +=     '<label class="btn flag-radio" data-flag="<%= flag.getId() %>">';
            //template +=     '<input type="radio" name="flag" data-flag="<%= flag.getId() %>">';
            //template +=     '<i class="fa fa-circle-o fa-1x" data-flag="<%= flag.getId() %>"></i>';
            //template +=     '<i class="fa fa-check-circle-o fa-1x" data-flag="<%= flag.getId() %>"></i>';
            //template +=     ' <%= flag.getName() %></label>';
            //template +=     '<% }); %>';
            template += '</div>';

            // split
            template += '<div class="form-group split">';
            template += '<div class="col-xs-10 split-rect"></div>';
            template += '<div class="col-xs-2 split-label"></div>';
            template += '<div class="clear" />';

            return template;
        }

        public getRecentActivityTemplate(): string {
            var template = "";

            template += '<div class="col-xs-12 panel-sideinfo"><h2><span class="glyphicon glyphicon-time" aria-hidden="true"></span> <%= recent %></h2></div>';
            template += '<div class="form-group">';
            template += '<% _.each(notes, function (note) { %>';
            template += '<div class="col-xs-12"><span class="glyphicon glyphicon-leaf" aria-hidden="true"></span> <%= note.getComment() %> (<%= note.getFormattedDate() %>)</div>';
            template += '<% }); %>';
            template += '</div>';

            return template;
        }

        public getTreeDetailTemplate(): string {
            var template = "";
            template += '<div class="col-xs-8 panel-body panel-sideinfo">';
            template += '</div>';


            template += '<div class="col-xs-4 panel-body panel-sideinfo panel-right-split">';


            template += '<div class="col-xs-9"><h2><i class="fa fa-child fa-1x" /> Parents</h2></div><div id="edit-parents" class="col-xs-3 pointer"><h2><i class="fa fa-pencil-square-o fa-1x"></i></h2></div>';
            template += '<div id="list-parents" class="col-xs-12">';

            template += '<%= persons %>';
            //template += '<% _.each(persons.models, function (person) { %>';
            //template += '<a href="#tree/<%= tree.getId() %>"><%= person.getName() %></a>';
            //template += '<% }); %>';

            template += '</div>';
            template += '<div class="clear" />';
            // split
            template += '<div class="form-group split">';
            template += '<div class="col-xs-10 split-rect"></div>';
            template += '<div class="col-xs-2 split-label"></div>';
            template += '<div class="clear" />';

            template += '</div>';
            return template;
        }

        public getSideInfoViewTemplate(): string {
            var template = "";

            template += '<div class="form-group">';
            template += '<div class="col-xs-12 left"><input type="checkbox" checked id="toggle-table"></div>';
            template += '</div>';

            template += '<div class="col-xs-9 panel-sideinfo"><h2><span class="glyphicon glyphicon-flag" aria-hidden="true"></span> Filtering</h2></div>';
            template += '<div class="col-xs-3 panel-sideinfo"><h2><i data-toggle="collapse" data-target="#peoplefilter" class="toggle-collapse fa fa-folder-o fa-1x"></i></h2></div>';
            template += '<div class="clear" />';
            template += '<div id="peoplefilter" class="collapse filter">';



            template += '<div data-toggle="buttons">';
            template += '<label class="btn filter-checkbox">';
            template += '<input type="checkbox" name="showall">';
            template += '<i class="fa fa-square-o fa-1x"></i>';
            template += '<i class="fa fa-check-square-o fa-1x"></i>';
            template += ' show / hide all</label>';
            template += '</div>';

            template += '<div data-toggle="buttons">';
            template += '<label class="btn filter-checkbox">';
            template += '<input type="checkbox" name="assigned">';
            template += '<i class="fa fa-square-o fa-1x"></i>';
            template += '<i class="fa fa-check-square-o fa-1x"></i>';
            template += ' adopted</label>';
            template += '</div>';

            template += '<div data-toggle="buttons">';
            template += '<label class="btn filter-checkbox">';
            template += '<input type="checkbox" name="unassigned">';
            template += '<i class="fa fa-square-o fa-1x"></i>';
            template += '<i class="fa fa-check-square-o fa-1x"></i>';
            template += ' unadopted</label>';
            template += '</div>';

            template += '<% _.each(foods.models, function (food) { %>';

            template += '<div data-toggle="buttons">';
            template += '<label class="btn filter-checkbox">';
            template += '<input type="checkbox" name="<%= food.getId() %>">';
            template += '<i class="fa fa-square-o fa-1x"></i>';
            template += '<i class="fa fa-check-square-o fa-1x"></i>';
            template += ' <%= food.getName() %></label>';
            template += '</div>';

            template += '<% }); %>';

            template += '</div>';

            // split
            template += '<div class="form-group split">';
            template += '<div class="col-xs-10 split-rect"></div>';
            template += '<div class="col-xs-2 split-label"></div>';
            template += '<div class="clear" />';

            template += '<div class="col-xs-12 panel-sideinfo center"><h1><%= name %></h1></div>';
            template += '<div class="col-xs-12 panel-sideinfo location"><%= location %></div>';
            template += '<div class="clear" />';
            
            // flags
            template += '<div class="form-group split">';
            template += '<div class="col-xs-4 split-rect"></div>';
            template += '<div class="col-xs-8 split-label"></div>';
            template += '<div class="clear" />';

            template += '<div class="col-xs-12 panel-sideinfo"><h2><span class="glyphicon glyphicon-flag" aria-hidden="true"></span> <%= flag %></h2></div>';
            template += '<div class="btn-group" data-toggle="buttons">';
            template += '<% _.each(flags.models, function (flag) { %>';
            template += '<label class="btn flag-radio" data-flag="<%= flag.getId() %>">';
            template += '<input type="radio" name="flag" data-flag="<%= flag.getId() %>">';
            template += '<i class="fa fa-circle-o fa-1x" data-flag="<%= flag.getId() %>"></i>';
            template += '<i class="fa fa-check-circle-o fa-1x" data-flag="<%= flag.getId() %>"></i>';
            template += ' <%= flag.getName() %></label>';
            template += '<% }); %>';
            template += '</div>';
            
            // ownership
            template += '<div class="form-group split">';
            template += '<div class="col-xs-4 split-rect"></div>';
            template += '<div class="col-xs-8 split-label"></div>';
            template += '<div class="clear" />';
            
            template += '<div class="col-xs-12 panel-sideinfo"><h2><span class="glyphicon glyphicon-bookmark" aria-hidden="true"></span> <%= ownership %></h2></div>';
            template += '<div class="btn-group" data-toggle="buttons">';
            template += '<% _.each(ownerships.models, function (ownership) { %>';
            template += '<label class="btn ownership-radio" data-ownership="<%= ownership.getId() %>">';
            template += '<input type="radio" name="ownership" data-ownership="<%= ownership.getId() %>">';
            template += '<i class="fa fa-circle-o fa-1x" data-ownership="<%= ownership.getId() %>"></i>';
            template += '<i class="fa fa-check-circle-o fa-1x" data-ownership="<%= ownership.getId() %>"></i>';
            template += ' <%= ownership.getName() %></label>';
            template += '<% }); %>';
            template += '</div>';

            /*
            template += '<div class="form-group">';
            template += '<% _.each(ownerships.models, function (ownership) { %>';
            template += '<div class="col-xs-6 group-radio">';
            template += '<label class="label-radio"><input type="radio" class="ownership-radio" data-ownership="<%= ownership.getId() %>">&nbsp <%= ownership.getName() %></label>';
            template += '</div>';
            template += '<% }); %>';
            template += '</div>';
            */

            // recent
            template += '<div class="form-group split">';
            template += '<div class="col-xs-4 split-rect"></div>';
            template += '<div class="col-xs-8 split-label"></div>';

            template += '<div class="wrapper-recent-activity"></div>';
            
            return template;
        }

        public getMapPopupTemplate(): string {
            var template = "";
            template += '<%= name %>&nbsp&nbsp<span class="glyphicon glyphicon-log-in" aria-hidden="true" data-id="<%= id %>"></span>&nbsp';
            return template;
        }

        public getSmallMapPopupTemplate(): string {
            var template = "";
            template += '<span data-id="<%= id %>"><%= name %></span>';
            return template;
        }

        public getTreeInfoViewTemplate(): string {
            var template = "";
            //template += '<div class="row panel-body">';
            template += '<div class="col-xs-12"><h1><%= name %></h1></div>';
            template += '<div class="col-xs-12"><%= location %></div>';
            template += '<div class="clear" />';

            // circle-progress
            template += '<div class="form-group">';
            template +=     '<div class="col-xs-3 circle-progress-left"><div><%= ripening %></div><div><%= ratio %></div></div>';
            template +=     '<div class="col-xs-6">';
            template +=         '<div id="ripen-progress" class="circle-progress"></div>';
            template +=     '</div>';
            template +=     '<div class="col-xs-3 circle-progress-right"><div><%= approximate %></div><div><%= food %></div></div>';
            template += '</div>';
            template += '<div class="clear" />';
            
            // flags
            template += '<div class="form-group split">';
            template += '<div class="col-xs-10 split-rect"></div>';
            template += '<div class="col-xs-2 split-label"></div>';
            template += '<div class="clear" />';

            template += '<div class="col-xs-12 panel-sideinfo"><h2><span class="glyphicon glyphicon-flag" aria-hidden="true"></span> <%= flag %></h2></div>';
            template += '<div class="btn-group" data-toggle="buttons">';
            template += '<% _.each(flags.models, function (flag) { %>';
            template += '<label class="btn flag-radio" data-flag="<%= flag.getId() %>">';
            template += '<input type="radio" name="flag" data-flag="<%= flag.getId() %>">';
            template += '<i class="fa fa-circle-o fa-1x" data-flag="<%= flag.getId() %>"></i>';
            template += '<i class="fa fa-check-circle-o fa-1x" data-flag="<%= flag.getId() %>"></i>';
            template += ' <%= flag.getName() %></label>';
            template += '<% }); %>';
            template += '</div>';
            
            // ownership
            template += '<div class="form-group split">';
            template += '<div class="col-xs-10 split-rect"></div>';
            template += '<div class="col-xs-2 split-label"></div>';
            template += '<div class="clear" />';

            template += '<div class="col-xs-12 panel-sideinfo"><h2><span class="glyphicon glyphicon-bookmark" aria-hidden="true"></span> <%= ownership %></h2></div>';
            template += '<div class="btn-group" data-toggle="buttons">';
            template += '<% _.each(ownerships.models, function (ownership) { %>';
            template += '<label class="btn ownership-radio" data-ownership="<%= ownership.getId() %>">';
            template += '<input type="radio" name="ownership" data-ownership="<%= ownership.getId() %>">';
            template += '<i class="fa fa-circle-o fa-1x" data-ownership="<%= ownership.getId() %>"></i>';
            template += '<i class="fa fa-check-circle-o fa-1x" data-ownership="<%= ownership.getId() %>"></i>';
            template += ' <%= ownership.getName() %></label>';
            template += '<% }); %>';
            template += '</div>';

            return template;
        }

        public getCoverflowTemplate(): string {
            var template = "";
            

            template += '<div class="panel-coverflow col-xs-8">';
            template += '<div class="wrapper-coverflow">';
            template +=     '<div id="coverflow">';
            template +=     '<% _.each(notes.models, function (note) { %>';
            template +=         '<img src="<%= note.getPicturePath() %>" data-id="<%= note.getId() %>" />';
            template +=     '<% }); %>';
            template +=     '</div>';
            template += '</div>';
            template += '</div>';
            template += '<div id="coverflow-info" class="col-xs-4">';
            template += '</div>';

            template += '<div class="clear" />';

            template += '<div class="label-coverflow">';
            template +=     '<div class="col-xs-8">';
            template +=         '<div id="select-date" class="btn btn-default"><i class="fa fa-calendar-check-o fa-1x"></i>&nbsp;<span><%= curdate %></span></div>';
            template +=     '</div>';
            template +=     '<div class="col-xs-4">';
            template +=         '<div id="add-note" class="btn btn-default"><i class="fa fa-plus-square-o fa-1x"></i>&nbsp;<%= addnote %></div>';
            template +=         '<div id="delete-note" class="btn btn-default"><i class="fa fa-minus-square-o fa-1x"></i>&nbsp;<%= deletenote %></div>';
            template +=     '</div>';
            template += '</div>';
            
            return template;
        }

        public getCoverflowInfoTemplate(): string {
            var template = '';
            template += '<div class="col-xs-12"><h1><%= detail %></h1></div>';

            template += '<div class="input-group">';
            template +=     '<span class="input-group-addon"><i class="fa fa-calendar fa-fw"></i></span>';
            template +=     '<input class="form-control date-input" type="text" placeholder="date" value="<%= date %>">';
            template += '</div>';

            template += '<div class="input-group">';
            template += '<span class="input-group-addon"><i class="fa fa-star-half-o fa-fw"></i></span>';
            template += '<div class="form-control rating">';
            template += '<span class="rating-element" data-rating="5">☆</span><span class="rating-element" data-rating="4">☆</span><span class="rating-element" data-rating="3">☆</span><span class="rating-element" data-rating="2">☆</span><span class="rating-element" data-rating="1">☆</span>';
            template += '</div>';
            template += '</div>';

            template += '<div class="input-group">';
            template +=     '<span class="input-group-addon"><i class="fa fa-comment fa-fw"></i></span>';
            template +=     '<textarea class="form-control comment-input" rows="5" placeholder="comment"><%= note %></textarea>';
            template += '</div>';

            template += '<div class="clear" />';
            return template;
        }

        public getAddNotePopupTemplate(): string {
            var template = '';
            template += '<div class="col-xs-12"><h1><%= title %></h1></div>';

            template += '<div class="col-xs-4">';
            template += '<div id="popup-confirm" class="btn btn-default"><i class="fa fa-circle-o fa-1x"></i>&nbsp;<%= confirm %></div>';
            template += '<div id="popup-close" class="btn btn-default"><i class="fa fa-times fa-1x"></i>&nbsp;<%= close %></div>';
            template += '</div>';

            return template;
        }

        public getLocationTableTemplate(): string {
            var template = "";
            template += '<div class="list">';

            template += '<div class="col-xs-12"><h1><%= title %></h1></div>';
            template += '<div class="clear" />';

            // circle-progress
            template += '<div class="form-group">';
            template += '<div class="col-xs-12">';
            template +=     '<div class="list-location"></div>';
            template += '</div>';
            template += '<div class="clear" />';


            template += '</div>';

            return template;
        }

        public getPeopleTableTemplate(): string {
            var template = "";
            template += '<div class="list">';

            template += '<div class="col-xs-12"><h1><%= title %></h1></div>';
            template += '<div class="clear" />';

            // circle-progress
            template += '<div class="form-group">';
            template += '<div class="col-xs-12">';
            template +=     '<div class="list-people"></div>';
            template += '</div>';
            template += '<div class="clear" />';

            template += '</div>';

            return template;
        }

        public getAdoptTreeCellTemplate(): string {
            var template = "";
            template += '<% _.each(trees.models, function (tree) { %>';
            template += '<a href="#tree/<%= tree.getId() %>"><%= tree.getName() %></a>';
            template += '<% }); %>';
            return template;
        }

        public getEditParentPopupViewTemplate(): string {
            var template = "";
            template += '<div class="popup-wrapper">';
            template += '<div class="col-xs-3 panel-body panel-sideinfo panel-left-split panel-side-people">';


            ////////////////

            template += '<div class="col-xs-9 panel-sideinfo"><h2><span class="glyphicon glyphicon-flag" aria-hidden="true"></span> Filtering</h2></div>';
            template += '<div class="col-xs-3 panel-sideinfo"><h2><i data-toggle="collapse" data-target="#peoplefilter" class="toggle-collapse fa fa-folder-open-o fa-1x"></i></h2></div>';
            template += '<div class="clear" />';
            template += '<div id="peoplefilter" class="collapse in">';
            template += '<div data-toggle="buttons">';
            template += '<label class="btn filter-checkbox">';
            template += '<input type="checkbox" name="showall">';
            template += '<i class="fa fa-square-o fa-1x"></i>';
            template += '<i class="fa fa-check-square-o fa-1x"></i>';
            template += ' show / hide all</label>';
            template += '</div>';

            template += '<div data-toggle="buttons">';
            template += '<label class="btn filter-checkbox">';
            template += '<input type="checkbox" name="assigned">';
            template += '<i class="fa fa-square-o fa-1x"></i>';
            template += '<i class="fa fa-check-square-o fa-1x"></i>';
            template += ' assigned</label>';
            template += '</div>';

            template += '<div data-toggle="buttons">';
            template += '<label class="btn filter-checkbox">';
            template += '<input type="checkbox" name="unassigned">';
            template += '<i class="fa fa-square-o fa-1x"></i>';
            template += '<i class="fa fa-check-square-o fa-1x"></i>';
            template += ' unassigned</label>';
            template += '</div>';

            //template +=     '<% _.each(flags.models, function (flag) { %>';
            //template +=     '<label class="btn flag-radio" data-flag="<%= flag.getId() %>">';
            //template +=     '<input type="radio" name="flag" data-flag="<%= flag.getId() %>">';
            //template +=     '<i class="fa fa-circle-o fa-1x" data-flag="<%= flag.getId() %>"></i>';
            //template +=     '<i class="fa fa-check-circle-o fa-1x" data-flag="<%= flag.getId() %>"></i>';
            //template +=     ' <%= flag.getName() %></label>';
            //template +=     '<% }); %>';
            template += '</div>';

            // split
            template += '<div class="form-group split">';
            template += '<div class="col-xs-10 split-rect"></div>';
            template += '<div class="col-xs-2 split-label"></div>';
            template += '<div class="clear" />';

            ////////////////

            template += '</div>';
            template += '</div>';
            template += '<div class="col-xs-9 panel-body panel-people">';



            ////////////////


            template += '<div class="list">';

            template += '<div class="col-xs-12"><h1>Tree Adoption</h1></div>';
            template += '<div class="col-xs-12"><h2><i>Click <i class="fa fa-plus-square fa-1x"></i> icon to assign a new parent for tree <strong><%= tree %></strong>.</h2></i></div>';
            template += '<div class="clear" />';

            // circle-progress
            template += '<div class="form-group">';
            template += '<div class="col-xs-12">';
            template += '<div class="list-people"></div>';
            template += '</div>';
            template += '<div class="clear" />';

            template += '</div>';




            ///////////////
            template += '</div>';
            return template;
        }

        
    }
}