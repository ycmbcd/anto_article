var app=angular.module('myApp');
//为post而设
app.config(function($httpProvider){
    $httpProvider.defaults.transformRequest=function(obj){
        var str=[];
        for(var p in obj){
            str.push(encodeURIComponent(p)+"="+encodeURIComponent(obj[p]));
        }
        return str.join("&");
    };
    $httpProvider.defaults.headers.post={'Content-Type':'application/x-www-form-urlencoded'}      
})

//登陆控制器
app.controller('loginCtrl', ['$rootScope','$scope','$state','$http',function ($rootScope,$scope,$state,$http) {
    $rootScope.bg = true;   //设置背景
    $scope.save = function(){
        var post_data = {u_num:$scope.u_num,u_pwd:$scope.u_pwd};
        if($scope.loginForm.$valid){
            $http.post('/fuck/login.php', post_data).success(function(data) {  
                if(data=='go'){
                    $state.go('site');  //跳转到main
                }else{
                    alert('数据验证失败')     // %
                }
            }).error(function(data) {  
                alert("系统错误，请联系管理员。")   // %
            });  
        }else{
            alert("表单验证失败") // %
        }
    }
}])
 

//面板控制器
app.controller('siteCtrl', ['$rootScope','$scope','$state','$http', function($rootScope,$scope,$state,$http){
    $rootScope.bg = false;
    //查询u_name
    $http.get('/fuck/login.php', {params:{u_name:"get"}
    }).success(function(data) {
        if(data=="logout"){
            $state.go('login');  //跳转到首页登录，%添加超时提醒
        }else{
            $scope.u_name = data;
        }
    }).error(function(data) {
        alert(data)
        alert("系统错误，请联系管理员。") // %
    });

    //查询文件夹
    $scope.select_folder = function(){
        $http.get('/fuck/sysfolder.php', {params:{folder:"get"}
        }).success(function(data) {
            $scope.folders=data;
        }).error(function(data) {
            alert("系统错误，请联系管理员。");
        });
    }

    $scope.select_folder(); //调用文件夹

    //查询文件夹包括表单
    $scope.select_folder_all = function(){
        $http.get('/fuck/sysfolder.php', {params:{folder_all:"get"}
        }).success(function(data) {
            $scope.folder_all=data;
        }).error(function(data) {
            alert("系统错误，请联系管理员。");
        });
    }

    $scope.select_folder_all(); //调用

    //查询表单
    $scope.select_table = function(click_key,click_id){
        $scope.click_me(click_key,click_id);   //赋值
        $http.get('/fuck/systable.php', {params:{select_table:click_id}
        }).success(function(data) {
            $scope.tables=data;
        }).error(function(data) {
            alert("系统错误，请联系管理员。");
        });
    }


}])

//文件夹管理
app.controller('folderCtrl', ['$scope','$state','$http', function($scope,$state,$http){
    $scope.plug_dropdown(); //调用下拉
    
    //新建文件夹名
    $scope.add_folder = function(){
        var time=new Date().getTime();
        if($scope.new_folder==undefined){
            return false;
        }
        var post_data = {new_folder:$scope.new_folder};
        $http.post('/fuck/sysfolder.php', post_data).success(function(data) {  
            if(data=='ok'){
                $scope.plug_alert('success','文件夹 '+$scope.new_folder+' 添加完成。','icon-ok');
                $state.go('site.sysfolder',{data:time});
            }else{
                $scope.plug_alert('danger','文件夹名 '+$scope.new_folder+' 已存在，请输入其他的名称。','icon-ban-circle');
            }
        }).error(function(data) {  
            alert("系统错误，请联系管理员。");
        });  
    }

    //重命名
    $scope.rename_popover = {
        title: '重命名',
        templateUrl: 'rename_popover.html'
    };
    $scope.rename_folder = function(){
        var time=new Date().getTime();
        if($scope.rename_popover.re_folder==undefined){
            return false;
        }
        var post_data = {re_folder:$scope.rename_popover.re_folder,click_key:$scope.click_key};
        $http.post('/fuck/sysfolder.php', post_data).success(function(data) {  
            if(data=='ok'){
                $scope.plug_alert('success','文件夹已改为 '+$scope.rename_popover.re_folder+' 。','icon-ok');
                $state.go('site.sysfolder',{data:time});    //这里为了刷新页面，随机传一个参数过去
                $scope.select_folder_all(); //重新加载侧栏
            }else if(data=='has'){
                $scope.plug_alert('danger','文件夹 '+$scope.rename_popover.re_folder+' 已存在。','icon-ban-circle');
            }else{
                $scope.plug_alert('danger','系统出错，请联系管理员。','icon-ban-circle');
            }
        }).error(function(data) {  
            alert("系统错误，请联系管理员。");
        });  
    }

    //删除
    $scope.del_popover = {
        title: '删 除 ?',
        templateUrl: 'del_popover.html'
    };
    $scope.del_folder = function(){
        var time=new Date().getTime();
        var post_data = {del_folder:$scope.click_key};
        $http.post('/fuck/sysfolder.php', post_data).success(function(data) {  
            if(data=='ok'){
                $scope.plug_alert('success',$scope.click_key+' 删除完成。','icon-ok');
                var time=new Date().getTime()
                $state.go('site.sysfolder',{data:time});
                $scope.select_folder_all(); //重新加载侧栏
            }else if(data=='has'){
                $scope.plug_alert('danger',$scope.click_key+' 包含表单，删除后再试。','icon-ban-circle');
            }else{
                $scope.plug_alert('danger','系统出错，请联系管理员。','icon-ban-circle');
            }
        }).error(function(data) {  
            alert("系统错误，请联系管理员。");
        });  
    }

}])

//表单管理
app.controller('tableCtrl', ['$scope','$state','$http', function($scope,$state,$http){
    $scope.plug_dropdown(); //调用下拉

    //新建表单
    $scope.add_table = function(){
        var time=new Date().getTime();
        if($scope.new_table==undefined){
            return false;
        }

        var post_data = {new_table:$scope.new_table,folder_id:$scope.click_id};
        $http.post('/fuck/systable.php', post_data).success(function(data) {  
            if(data=='ok'){
                $scope.plug_alert('success','表单 '+$scope.new_table+' 添加完成。','icon-ok');
                $scope.select_table($scope.click_key,$scope.click_id);  //查询表单
            }else if(data=='has'){
                $scope.plug_alert('danger','此文件夹中包含 '+$scope.new_table+' 表单，请输入其他的名称。','icon-ban-circle');
            }else{
                $scope.plug_alert('danger','系统出错，请联系管理员。','icon-ban-circle');
            }
        }).error(function(data) {  
            alert("系统错误，请联系管理员。");
        });
    }
}])

