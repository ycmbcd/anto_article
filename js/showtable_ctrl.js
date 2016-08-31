var app=angular.module('myApp');
app.controller('showtableCtrl', ['$scope','$state','$stateParams','$http', function($scope,$state,$stateParams,$http){
    $scope.folder_id = $stateParams.folder_id;  //文件夹id
    $scope.tb_name = $stateParams.tb_name;  //tb_name 传参赋值
    //查询是否有模板
    var post_data = {is_tpl:'post',folder_id:$scope.folder_id,tb_name:$scope.tb_name};
    $http.post('/fuck/table/show_table.php', post_data).success(function(data) { 
        $scope.tb_tpl = data;
        if($scope.tb_tpl == '无模板'){
            $scope.plug_alert('danger','无模板，请添加模板再操作！','icon-ban-circle');
            $state.go('site.systable');
            $scope.select_folder_all();
        }
    }).error(function(data) {  
        alert("系统错误，请联系管理员。");
    }); 

    //获取标题
    var post_data = {table_title:'get'};
    $http.post('/fuck/table/show_table.php', post_data).success(function(data) {  
        $scope.table_title = data;
    }).error(function(data) {  
        alert("系统错误，请联系管理员。");
    }); 

    //获取内容
    var post_data = {show_table:'show_table'};
    $http.post('/fuck/table/show_table.php', post_data).success(function(data) {  
        $scope.show_table = data;
    }).error(function(data) {  
        alert("系统错误，请联系管理员。");
    }); 
}])