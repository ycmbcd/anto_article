var myFilters = angular.module('myApp');

myFilters.filter('field_filter', function(){
    return function(item){
		switch (item)
		{
		case 'field_txt':
		  	res = "文本";
		  break;
		case 'field_int':
		  	res = "整数";
		 	break;
		case 'field_big_txt':
		  	res = "大文本";
		 	break;
		case 'field_decimal':
		  	res = "小数";
		 	break;
		case 'field_date':
		  	res = "日期";
		 	break;
		default:
		 	res = item;
		}
        return res;
    }
});