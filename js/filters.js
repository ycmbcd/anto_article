var myFilters = angular.module('myApp');

myFilters.filter('field_filter', function(){
    return function(item){
		switch (item)
		{
		case 'field_txt':
		  	res = "文本";
		  break;
		case 'field_big_txt':
		  	res = "大文本";
		 	break;
		default:
		 	res = item;
		}
        return res;
    }
});

myFilters.filter('shop_filter', function(){
    return function(item){
		switch (item)
		{
		case 'yahoo':
		  	res = "雅虎";
		  break;
		case 'amazon':
		  	res = "亚马逊";
		  break;
		case 'rakuten':
		  	res = "乐天";
		 	break;
		default:
		 	res = item;
		}
        return res;
    }
});