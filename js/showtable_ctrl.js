var app=angular.module('myApp');
app.controller('showtableCtrl', ['$scope','$state','$stateParams','$http','$log','$modal',function($scope,$state,$stateParams,$http,$log,$modal){
    $scope.folder_id = $stateParams.folder_id;  //文件夹id
    $scope.tb_name = $stateParams.tb_name;  //tb_name 传参赋值

    //获取此表id
    var post_data = {table_id:'get',folder_id:$scope.folder_id,tb_name:$scope.tb_name};
    $http.post('/fuck/table/show_table.php', post_data).success(function(data) {  
        $scope.table_id = data;

        //获取序列内容
        var post_data = {show_table:$scope.table_id};
        $http.post('/fuck/table/show_table.php', post_data).success(function(data) {  
            $scope.show_table = data;
        }).error(function(data) {  
            alert("系统错误，请联系管理员。");
        });

        //获取序列标题
        var post_data = {table_title:$scope.table_id};
        $http.post('/fuck/table/show_table.php', post_data).success(function(data) { 
            $log.info(data)
            $scope.table_title = data;
        }).error(function(data) {  
            alert("系统错误，请联系管理员。");
        }); 

    }).error(function(data) {  
        alert("系统错误，请联系管理员。");
    }); 

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

    //查询此表字段序列
    $scope.table_field = function(tpl){
        //查询通用字段
        $http.get('/fuck/field/commonfield.php', {params:{select_comfield:"get"}
        }).success(function(data) {
            $scope.common_fields = data;
        }).error(function(data) {
            alert("系统错误，请联系管理员。");
        });
        tpl=tpl+'field';    //比如tpl为yahoo，此处yahoofield

        //查询tpl字段
        $http.get('/fuck/field/'+tpl+'.php', {params:{select_field:"get"}
        }).success(function(data) {
            $scope.tpl_fields = data;
        }).error(function(data) {
            alert("系统错误，请联系管理员。");
        });

        //初始化选择序列字段
        $scope.my_select = [];
        $scope.my_select_name = []; //用于前台展示
    }

    //选择序列字段

    $scope.select = function(front,id,name,event){      
        field = front+'_'+id;   //前缀     
        //alert(name)
        var action = event.target;
        if(action.checked){//选中，就添加
            if($scope.my_select.indexOf(field) == -1){//不存在就添加
                $scope.my_select.push(field);
                $scope.my_select_name.push(name);
            }
        }else{ //去除就删除com_select里
            var idx = $scope.my_select.indexOf(field);
            if( idx != -1){ //存在就删除
                $scope.my_select.splice(idx,1);
                $scope.my_select_name.splice(idx,1);
            }
        }
    };

    //提交，更新此表的字段序列
    $scope.sub_myfields = function(){
        var post_data = {my_fields:$scope.my_select,table_id:$scope.table_id,my_fields_title:$scope.my_select_name};
        $http.post('/fuck/table/show_table.php', post_data).success(function(data) {  
            //刷新
            $state.go('site.show_table({folder_id:$scope.folder_id,$scope.tb_name})');
        }).error(function(data) {  
            alert("系统错误，请联系管理员。");
        });

    }



    
}])