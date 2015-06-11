"use strict";function MainController(a){function b(){a.get("/api/pages").success(function(a){d.pages=a,d.pages.map(function(a){return a.formattedCreated=c(a.created),a.formattedUpdated=null,a.updated&&(a.formattedUpdated=c(a.updated)),a})})}function c(a){return new Date(a).toLocaleDateString()+" "+new Date(a).toLocaleTimeString()}var d=this;d.pages={},b()}function PageCreateController(a,b){function c(){a.post("/api/pages/",e.newPage).success(function(){b.simple("Page created")})["catch"](function(){b.simple("Failed to create page")})}function d(){}var e=this;e.newPage={contentType:"markdown"},e.onSubmit=c,d()}function PageShowController(a,b){function c(){a.get("/api/pages/"+b.id).success(function(a){e.page=a,e.page.formattedCreated=d(e.page.created),e.page.formattedUpdated=null,e.page.updated&&(e.page.formattedUpdated=d(e.page.updated))})}function d(a){return new Date(a).toLocaleDateString()+" "+new Date(a).toLocaleTimeString()}var e=this;e.page={},c()}function PageUpdateController(a,b,c){function d(){a.put("/api/pages/"+f.page.id,f.page).success(function(){c.simple("Update successful")})["catch"](function(){c.simple("Update failed")})}function e(){a.get("/api/pages/"+b.id).success(function(a){f.page=a})}var f=this;f.contentTypes={markdown:"Markdown"},f.page={},f.onSubmit=d,e()}function ContentPreviewerController(){function a(a){c.swOnSubmit()()}function b(){}var c=this;c.contentTypes={markdown:"Markdown"},c.onSubmit=a,b()}function SimpleWikiContentPreviewerDirective(){return{restrict:"E",scope:{swTitle:"@",swSubmitText:"@",swModel:"=",swOnSubmit:"&"},templateUrl:"/components/content-previewer/content-previewer.html",controller:"ContentPreviewerController",controllerAs:"contentPreviewerCtrl",bindToController:!0,link:function(){}}}function ToastService(a){function b(b,e){e=e||{},a.show(a.simple().content(b).position(e.position||d).hideDelay(e.delay||c))}var c=3e3,d="bottom right";return{simple:b}}angular.module("simpleWikiApp",["ngCookies","ngMaterial","ngResource","ngSanitize","ui.router","ui.bootstrap"]).config(["$stateProvider","$urlRouterProvider","$locationProvider",function(a,b,c){b.otherwise("/"),c.html5Mode(!0)}]),angular.module("simpleWikiApp").controller("MainController",MainController),MainController.$inject=["$http"],angular.module("simpleWikiApp").config(["$stateProvider",function(a){a.state("main",{url:"/",templateUrl:"app/main/main.html",controller:"MainController",controllerAs:"mainCtrl"})}]),angular.module("simpleWikiApp").controller("PageCreateController",PageCreateController),PageCreateController.$inject=["$http","toast"],angular.module("simpleWikiApp").config(["$stateProvider",function(a){a.state("pages:index",{url:"/pages",templateUrl:"app/pages/index/view.html",controller:"PagesController",controllerAs:"pagesCtrl"}).state("pages:create",{url:"/pages/create",templateUrl:"app/pages/create/view.html",controller:"PageCreateController",controllerAs:"pageCreateCtrl"}).state("pages:show",{url:"/pages/:id",templateUrl:"app/pages/show/view.html",controller:"PageShowController",controllerAs:"pageShowCtrl"}).state("pages:update",{url:"/pages/:id/edit",templateUrl:"app/pages/update/view.html",controller:"PageUpdateController",controllerAs:"pageUpdateCtrl"})}]),angular.module("simpleWikiApp").controller("PagesController",["$http",function(a){function b(){e.viewingLimit+=e.viewingLimitIncrement}function c(){a.get("/api/pages").success(function(a){e.pages=a,e.pages.map(function(a){return a.formattedCreated=d(a.created),a.formattedUpdated=null,a.updated&&(a.formattedUpdated=d(a.updated)),a})})}function d(a){return new Date(a).toLocaleDateString()+" "+new Date(a).toLocaleTimeString()}var e=this;e.viewingLimit=5,e.viewingLimitIncrement=10,e.incrementViewingLimit=b,c()}]),angular.module("simpleWikiApp").controller("PageShowController",PageShowController),PageShowController.$inject=["$http","$stateParams"],angular.module("simpleWikiApp").controller("PageUpdateController",PageUpdateController),PageUpdateController.$inject=["$http","$stateParams","toast"],angular.module("simpleWikiApp").controller("ContentPreviewerController",ContentPreviewerController),angular.module("simpleWikiApp").directive("swContentPreviewer",SimpleWikiContentPreviewerDirective),angular.module("simpleWikiApp").filter("markdown",function(){return function(a){return a&&a.length>0?marked(a):""}}),angular.module("simpleWikiApp").factory("Modal",["$rootScope","$modal",function(a,b){function c(c,d){var e=a.$new();return c=c||{},d=d||"modal-default",angular.extend(e,c),b.open({templateUrl:"components/modal/modal.html",windowClass:d,scope:e})}return{confirm:{"delete":function(a){return a=a||angular.noop,function(){var b,d=Array.prototype.slice.call(arguments),e=d.shift();b=c({modal:{dismissable:!0,title:"Confirm Delete",html:"<p>Are you sure you want to delete <strong>"+e+"</strong> ?</p>",buttons:[{classes:"btn-danger",text:"Delete",click:function(a){b.close(a)}},{classes:"btn-default",text:"Cancel",click:function(a){b.dismiss(a)}}]}},"modal-danger"),b.result.then(function(b){a.apply(b,d)})}}}}}]),angular.module("simpleWikiApp").controller("NavbarCtrl",["$scope","$location",function(a,b){a.isCollapsed=!0}]),angular.module("simpleWikiApp").service("toast",ToastService),ToastService.$inject=["$mdToast"],angular.module("simpleWikiApp").run(["$templateCache",function(a){a.put("app/main/main.html",'<div ng-include=&quot;components/navbar/navbar.html&quot;></div><header id=banner class=hero-unit><div class=container><h1 class=md-display-3>Simple Wiki</h1><p class=lead>Simple file system based wiki for Nodejs</p><div class="lead-images row"><div class=col-xs-4><a href="https://angularjs.org/" target=_blank><img src=assets/images/2485c2ac.angular.png alt="Angular"></a></div><div class=col-xs-4><a href="https://nodejs.org/" target=_blank><img src=assets/images/b0628153.nodejs.png alt="Nodejs"></a></div><div class=col-xs-4><a href="http://yeoman.io/" target=_blank><img src=assets/images/d535427a.yeoman.png alt="I\'m Yeoman"></a></div></div></div></header><md-content id=mainPage><div class=container><div class=row><md-content class="md-padding col-sm-6"><h2 class=md-title><i class="fa fa-file-text-o"></i>Recent Pages</h2><ol><li ng-repeat="page in mainCtrl.pages | orderBy:&quot;-created&quot; | limitTo:5" class=md-3-line><a ui-sref="pages:show({id: page.id})" tooltip={{page.readableTitle}}>{{page.readableTitle}}</a></li></ol></md-content><md-content class="md-padding col-sm-6"><h2 class=md-title><i class="fa fa-eye"></i>Most Viewed</h2><ol><li ng-repeat="page in mainCtrl.pages | orderBy:&quot;-views&quot; | limitTo:5" class=md-3-line><a ui-sref="pages:show({id: page.id})" tooltip={{page.readableTitle}}>{{page.readableTitle}}</a> ({{page.views}})</li></ol></md-content></div><div class=row><md-content class="md-padding col-sm-6"><h2 class=md-title><i class="fa fa-link"></i>Quick Links</h2><ul><li class=md-3-line><a ui-sref=pages:create>Create New Page</a></li></ul></md-content><md-content class="md-padding col-sm-6"><h2 class=md-title><i class="fa fa-book"></i>Documentation</h2><ul><li class=md-3-line><a href=https://github.com/vikeen/simple-wiki target=_blank>Github</a></li></ul></md-content></div></div></md-content>'),a.put("app/pages/create/view.html",'<div ng-include=&quot;components/navbar/navbar.html&quot;></div><div class=container><sw-content-previewer sw-title="Create Page" sw-model=pageCreateCtrl.newPage sw-submit-text=Submit sw-on-submit=pageCreateCtrl.onSubmit></sw-content-previewer></div>'),a.put("app/pages/index/view.html",'<div ng-include=&quot;components/navbar/navbar.html&quot;></div><div class="container page-index"><h1>All Pages ({{pagesCtrl.pages.length}})</h1><hr><ul ng-repeat="page in pagesCtrl.pages | orderBy:&quot;-created&quot; | limitTo:pagesCtrl.viewingLimit" class="md-3-line p-l-10"><li class="md-list-item-text list-style-none"><div class=title><h1 class=md-title><a ui-sref="pages:show({id: page.id})" tooltip={{page.readableTitle}}>{{page.readableTitle}}</a></h1></div><div class=meta><dl><dt><i class="fa fa-clock-o"></i></dt><dd>Created on {{page.formattedCreated}}</dd><dt><i class="fa fa-eye"></i></dt><dd>{{page.views}}</dd></dl></div><md-divider ng-if=!$last></md-divider></li></ul><md-button ng-hide="!pagesCtrl.pages.length || pagesCtrl.pages.length &lt;= pagesCtrl.viewingLimit" ng-click=pagesCtrl.incrementViewingLimit() class="md-raised md-primary">Show More</md-button></div>'),a.put("app/pages/show/view.html",'<div ng-include=&quot;components/navbar/navbar.html&quot;></div><div class="container page page-show"><div class=title><h1>{{pageShowCtrl.page.readableTitle}}</h1><hr></div><div class=meta><dl><dt><i class="fa fa-pencil"></i></dt><dd><a ui-sref="pages:update({id: pageShowCtrl.page.id})">Edit</a></dd><dt><i class="fa fa-clock-o"></i></dt><dd>Last edited on {{pageShowCtrl.page.formattedUpdated || pageShowCtrl.page.formattedCreated}}</dd><dt><i class="fa fa-eye"></i></dt><dd>{{pageShowCtrl.page.views}}</dd></dl></div><hr><div class=content><md-content ng-bind-html=pageShowCtrl.page.compiledContent></md-content></div></div>'),a.put("app/pages/update/view.html",'<div ng-include=&quot;components/navbar/navbar.html&quot;></div><div class=container><sw-content-previewer sw-title="Edit Page" sw-model=pageUpdateCtrl.page sw-submit-text=Update sw-on-submit=pageUpdateCtrl.onSubmit></sw-content-previewer></div>'),a.put("components/content-previewer/content-previewer.html",'<div class=content-previewer><md-content layout=row hide-md=hide-md hide-sm=hide-sm><form flex=50 ng-submit=contentPreviewerCtrl.onSubmit(contentPreviewerForm) class=md-padding><legend class=md-headline>{{contentPreviewerCtrl.swTitle}}</legend><fieldset><div class=form-group><label for=readableTitle class=control-label>Title</label><input ng-model=contentPreviewerCtrl.swModel.readableTitle id=readableTitle name=readableTitle required class="form-control"></div><div class=form-group><div class=row><div class=col-sm-6><label for=content style="margin-top: 8px" class=control-label>Content</label></div><div class=col-sm-6><select ng-model=contentPreviewerCtrl.swModel.contentType ng-options="key as value for (key, value) in contentPreviewerCtrl.contentTypes" class=form-control></select></div></div></div><div class=form-group><textarea ng-model=contentPreviewerCtrl.swModel.content id=content name=content rows=23 required class=form-control></textarea></div></fieldset></form><form flex=50 class=md-padding><legend class=md-headline>Preview</legend><md-content class=preview><h1 ng-if=contentPreviewerCtrl.swModel.readableTitle.length>{{contentPreviewerCtrl.swModel.readableTitle}}</h1><hr><md-content ng-bind-html="contentPreviewerCtrl.swModel.content | markdown"></md-content></md-content></form></md-content><md-content hide-gt-md=hide-gt-md class=md-padding><md-tabs md-dynamic-height=md-dynamic-height md-border-bottom=md-border-bottom><md-tab label=write><md-content class="md-padding p-r-0 p-l-0"><form name=contentPreviewerForm ng-submit=contentPreviewerCtrl.onSubmit(contentPreviewerForm)><fieldset><div class=form-group><label for=readableTitle class=control-label>Title</label><input ng-model=contentPreviewerCtrl.swModel.readableTitle id=readableTitle name=readableTitle required class="form-control"></div><div class=form-group><label for=content class=control-label>Content<select ng-model=contentPreviewerCtrl.swModel.contentType ng-options="key as value for (key, value) in contentPreviewerCtrl.contentTypes"></select></label><textarea ng-model=contentPreviewerCtrl.swModel.content id=content name=content rows=23 required class=form-control></textarea></div></fieldset></form></md-content></md-tab><md-tab label=preview ng-disabled=!contentPreviewerCtrl.swModel.content><md-content class="md-padding p-r-0 p-l-0 preview"><h1 ng-if=contentPreviewerCtrl.swModel.readableTitle.length>{{contentPreviewerCtrl.swModel.readableTitle}}</h1><hr><md-content ng-bind-html="contentPreviewerCtrl.swModel.content | markdown"></md-content></md-content></md-tab></md-tabs></md-content><div class=control-group><md-button ng-click=contentPreviewerCtrl.onSubmit(contentPreviewerForm) class="md-raised md-primary">{{contentPreviewerCtrl.swSubmitText}}</md-button></div></div>'),a.put("components/footer/footer.html","<!--footer#Footer(flex='100')--><!--  .container--><!--    nav--><!--      ul.list-style-none-->"),a.put("components/modal/modal.html",'<div class=modal-header><button ng-if=modal.dismissable type=button ng-click=$dismiss() class=close>&times;</button><h4 ng-if=modal.title ng-bind=modal.title class=modal-title></h4></div><div class=modal-body><p ng-if=modal.text ng-bind=modal.text></p><div ng-if=modal.html ng-bind-html=modal.html></div></div><div class=modal-footer><button ng-repeat="button in modal.buttons" ng-class=button.classes ng-click=button.click($event) ng-bind=button.text class=btn></button></div>'),a.put("components/navbar/navbar.html",'<nav id=MainNav ng-controller=NavbarCtrl role=navigation class="navbar navbar-default navbar-static-top"><div class=container><div class=navbar-header><button type=button ng-click="isCollapsed = !isCollapsed" class=navbar-toggle><span class=sr-only>Toggle navigation</span><span class=icon-bar></span><span class=icon-bar></span><span class=icon-bar></span></button><a href="/" class=navbar-brand>Simple Wiki</a></div><div id=navbar-main collapse=isCollapsed class="navbar-collapse collapse"><ul class="nav navbar-nav"><li><a ui-sref=pages:index>All Pages</a></li><li><a ui-sref=pages:create>Create Page</a></li></ul><ul class="nav navbar-nav pull-right"><li><a href=https://github.com/vikeen/simple-wiki target=_blank><i class="fa fa-code-fork"></i> Fork on Github</a></li></ul></div></div></nav>')}]);