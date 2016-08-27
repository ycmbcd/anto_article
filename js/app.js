var myApp = angular.module('myApp', ['ui.router','ui.bootstrap','ngAnimate']);
//由于整个应用都会和路由打交道，所以这里把$state和$stateParams这两个对象放到$rootScope上，方便其它地方引用和注入。
myApp.run(function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    //跳转开始
    $rootScope.$on('$stateChangeStart',function(){ 
    	document.getElementById('info1').innerHTML='等待响应';
    	document.getElementById('info2').innerHTML='等待响应';
    })
    //跳转成功执行
    $rootScope.$on('$stateChangeSuccess',function(){ 
    	document.getElementById('info1').innerHTML='跳转完成！';
    })
    //跳转失败执行（可能没有找到模板）
    $rootScope.$on('$stateChangeError',function(){
    	document.getElementById('info1').innerHTML='跳转错误！';
    })
    //跳转没有找到（可能没有声明state）
    $rootScope.$on('$stateNotFound',function(){
    	document.getElementById('info1').innerHTML='跳转没有找到！';
    })

    //视图加载中
    $rootScope.$on('$viewContentLoading',function(){
    	document.getElementById('info2').innerHTML='视图...ing';
    });
    //视图加载完成
    $rootScope.$on('$viewContentLoaded',function(){
    	document.getElementById('info2').innerHTML='视图...ok';
    	
    });
});

//为post而设
myApp.config(function($httpProvider){
    $httpProvider.defaults.transformRequest=function(obj){
        var str=[];
        for(var p in obj){
            str.push(encodeURIComponent(p)+"="+encodeURIComponent(obj[p]));
        }
        return str.join("&");
    };
    $httpProvider.defaults.headers.post={'Content-Type':'application/x-www-form-urlencoded'}      
})

myApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');	//重定向
    $stateProvider
    	.state('login', {
            url: '/login',
            data : { pageTitle: '登陆' },
            templateUrl: 'tpls/login.html'
        })

        .state('site', {
            url: '/site',
            data : { pageTitle: 'site' },
            views: {
                '': {
                    templateUrl: 'tpls/site.html'
                },
                'sidebar@site': {
                    templateUrl: 'tpls/sidebar.html'
                }
            }
        })
    //商品管理
        //新建商品
        .state('site.addgoods',{
            url: '/addgoods/{data}',
            views:{
                'show@site':{
                    templateUrl: 'tpls/goods/addgoods.html'
                }
            }
        })
    //模板管理
        //sku字段
        .state('site.skufield',{
            url: '/skufield/{data}',
            views:{
                'show@site':{
                    templateUrl: 'tpls/field/skufield.html'
                }
            }
        })
        //通用字段
        .state('site.commonfield',{
            url: '/commonfield/{data}',
            views:{
                'show@site':{
                    templateUrl: 'tpls/field/commonfield.html'
                }
            }
        })
        //雅虎字段
        .state('site.yahoofield',{
            url: '/yahoofield/{data}',
            views:{
                'show@site':{
                    templateUrl: 'tpls/field/yahoofield.html'
                }
            }
        })
        //乐天字段
        .state('site.rakutenfield',{
            url: '/rakutenfield/{data}',
            views:{
                'show@site':{
                    templateUrl: 'tpls/field/rakutenfield.html'
                }
            }
        })
        //亚马逊字段
        .state('site.amazonfield',{
            url: '/amazonfield/{data}',
            views:{
                'show@site':{
                    templateUrl: 'tpls/field/amazonfield.html'
                }
            }
        })

    //系统设置
        //表单管理
        .state('site.systable',{
            url: '/systable/{data}',
            views:{
                'show@site':{
                    templateUrl: 'tpls/sysconf/systable.html'
                }
            }
        })
        //文件夹管理
        .state('site.sysfolder',{
            url: '/sysfolder/{data}',
            views:{
                'show@site':{
                    templateUrl: 'tpls/sysconf/sysfolder.html'
                }
            }
        })
        //账号管理
        .state('site.sysuser',{
            url: '/sysuser/{data}',
            views:{
                'show@site':{
                    templateUrl: 'tpls/sysconf/sysuser.html'
                }
            }
        })
        //系统备份
        .state('site.syscopy',{
            url: '/syscopy/{data}',
            views:{
                'show@site':{
                    templateUrl: 'tpls/sysconf/syscopy.html'
                }
            }
        })
        //系统日志
        .state('site.syslog',{
            url: '/syslog/{data}',
            views:{
                'show@site':{
                    templateUrl: 'tpls/sysconf/syslog.html'
                }
            }
        })
        //轮子
        .state('site.modal',{
            url: '/modal',
            views:{
                'show@site':{
                    templateUrl: '/modal.html'
                }
            }
        })


        .state('page', {
            url: '/page/{show}',
           	data : { pageTitle: 'page页' },
            views: {
                '': {
                    templateUrl: 'tpls/site.html'
                },
                'show@page': {
                	templateUrl: function($stateParams){
                		return 'tpls/pages/'+$stateParams.show+'.html';
                	}
     //                ,
	    //             controller: function($scope){
				 //    	$scope.innertxt = '内部传参';
					// }
            	},
                'sidebar@page': {
                    templateUrl: 'tpls/sidebar.html'
                }
            },
   //          onEnter: function(){ 		//进入后的触发状态、退出：onExit
			//     alert(1)
			// },
        })

        .state('text', {
            url: '/text',
            views: {
                '': {
                	template: '<h2>一段html</h2>',

                }
            },
            controller: function($scope){
			    $scope.title = '加载一段HTML';
			}
        })
});

//页头
myApp.directive('title', ['$rootScope', '$timeout',
  function($rootScope, $timeout) {
    return {
      link: function() {

        var listener = function(event, toState) {

          $timeout(function() {
            $rootScope.title = (toState.data && toState.data.pageTitle) 
            ? toState.data.pageTitle 
            : '默认站名';	//默认title
          });
        };

        $rootScope.$on('$stateChangeSuccess', listener);
      }
    };
  }
]);
