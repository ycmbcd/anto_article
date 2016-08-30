var app=angular.module('myApp');
app.controller('addgoodsCtrl', ['$scope','$state','$http', function($scope,$state,$http){
//新建商品
    //初始化
    $scope.aaaa = [];
    $scope.bbbb = [];
    $scope.sku_id = "0";    //默认0，数据库无id=0，即使出错也不会影响数据

    //跳转下一条
    $scope.next_add = function(){
        var time=new Date().getTime();
        $state.go('site.addgoods',{data:time});
    }

    //遍历通用字段
    $http.get('/fuck/field/commonfield.php', {params:{select_comfield:"get"}
    }).success(function(data) {
        $scope.all_commonfield = data;
    }).error(function(data) {
        alert("系统错误，请联系管理员。");
    });

    //遍历雅虎字段
    $http.get('/fuck/field/yahoofield.php', {params:{select_yahoofield:"get"}
    }).success(function(data) {
        $scope.all_yahoofield = data;
    }).error(function(data) {
        alert("系统错误，请联系管理员。");
    });

    //新建sku
    $scope.submit_sku = function(){
        $http.get('/fuck/goods/add_goods.php', {params:{add_sku:$scope.sku_name}
        }).success(function(data) {
            if(data=="has"){
                $scope.plug_alert('danger','该 SKU 已存在。','icon-ban-circle');  
            }else{
                $scope.plug_alert('success','SKU 添加完成。','icon-ok');
                $scope.sku_id=data;     //定义sku_id
                $scope.sku_over = true;
            }
        }).error(function(data) {
            alert("系统错误，请联系管理员。");
        });
    }

    //公用新建http
    $scope.add_field_go = function(field_name,field_id,field_val){
        $http.get('/fuck/goods/add_goods.php', {params:{add_field:field_name,field_id:field_id,field_val:field_val,sku_id:$scope.sku_id}
        }).success(function(data) {
            if(data=="ok"){
                $scope.plug_alert('success','记录完成。','icon-ok');  
            }else{
                $scope.plug_alert('danger','系统错误，请联系管理员。','icon-ban-circle');
            }
        }).error(function(data) {
            alert("系统错误，请联系管理员。");
        });
    }

    //新建通用
    $scope.new_com = function(id){
        var sid = 'new_com_'+id;
        var field_id = 'com_'+id;
        var dom = document.querySelector('#'+sid);
        var field_val = angular.element(dom).val();
        var field_name = 'com';
        $scope.add_field_go(field_name,field_id,field_val);
    }

    $scope.submit_com = function(){
        $scope.com_over = true;
        //取消新建功能
        $scope.new_com = function(){
            return false;
        }
    }
    
    //新建雅虎
    $scope.new_yahoo = function(id){
        var sid = 'new_yahoo_'+id;
        var field_id = 'yahoo_'+id;
        var dom = document.querySelector('#'+sid);
        var field_val = angular.element(dom).val();
        var field_name = 'yahoo';
        $scope.add_field_go(field_name,field_id,field_val);
    }

    $scope.submit_yahoo = function(){
        $scope.yahoo_over = true;
        //取消新建功能
        $scope.new_yahoo = function(){
            return false;
        }
    }

}])