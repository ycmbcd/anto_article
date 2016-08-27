var app=angular.module('myApp');
app.controller('addgoodsCtrl', ['$scope','$state','$http', function($scope,$state,$http){
//新建商品
    //初始化
    $scope.conf = [];
    $scope.sku_id = "0";
    //通用
    $http.get('/fuck/field/commonfield.php', {params:{select_comfield:"get"}
    }).success(function(data) {
        $scope.all_commonfield = data;
    }).error(function(data) {
        alert("系统错误，请联系管理员。");
    });

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

    $scope.ok = function(e,f){
        // alert(e)
        // alert(f)
    }

    //雅虎
    $http.get('/fuck/field/yahoofield.php', {params:{select_yahoofield:"get"}
    }).success(function(data) {
        $scope.all_yahoofield = data;
    }).error(function(data) {
        alert("系统错误，请联系管理员。");
    });

    $scope.submit_com = function(){
        alert($scope.conf)
    }
}])