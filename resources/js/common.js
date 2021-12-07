var isLeftMenuToggle;
var myTable; 
var replace; 
var periodDateFormat = "yy-mm-dd";
var jsonContent = "";
var subJsonContent = "";
var subContentTitle;
//var baseApiUrl = "http://170.20.10.3:8080";
var baseApiUrl = "";

//$(document).onkeydown(function() {
document.onkeydown = function() {
	
	var e  = event || window.event;
	var keyAscii		= parseInt(e.keyCode, 10);
	var sourceObject	= e.srcElement;
	var targetObject	= sourceObject.tagName.toUpperCase();
	var sourceType		= ("" + sourceObject.type).toUpperCase();
	
	if (keyAscii == 8) {
		if (sourceObject.readOnly || sourceObject.disabled || (targetObject != "INPUT" && targetObject != "TEXTAREA")) {
			return false;
		}

		if (sourceObject.type) {

			return sourceType != "CHECKBOX" && sourceType != "RADIO" && sourceType != "BUTTON";
		}
	}
	return true;
}

$(document).ready(function() {

	/* DatePicker 옵션 공통 */
	if($.datepicker != undefined){
		$.datepicker.setDefaults({
			dateFormat : 'yy-mm-dd',
			prevText : '이전 달',
			nextText : '다음 달',
			changeYear : true,
			//yearRange : "1900:2030",
			monthNames : [ '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월','10월', '11월', '12월' ],
			monthNamesShort : [ '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월','9월', '10월', '11월', '12월' ],
			dayNames : [ '일', '월', '화', '수', '목', '금', '토' ],
			dayNamesShort : [ '일', '월', '화', '수', '목', '금', '토' ],
			dayNamesMin : [ '일', '월', '화', '수', '목', '금', '토' ],
			showMonthAfterYear : true,
			yearSuffix : '년'
		});
		$(".datePick").datepicker();//단일 달력 선택
		
		/* MonthPicker 옵션 */
		var monthPickerOptions = {
			pattern: 'yyyy-mm',
			//selectedYear: 2017,
			//startYear: 2008,
			//finalYear: 2020,
			monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
		};
		// $('.monthPick').monthpicker(monthPickerOptions);
	}
	
	/**
	 * NumberOnly 클래스 <input type="text"> 숫자만 입력받을 수 있게 일괄적용 
	 * @author 유현돈
	 */
	$(".numberOnly").on("focus", function() {
        var x = $(this).val();
        x = removeCommas(x);
        $(this).val(x);
    }).on("focusout", function() {
        var x = $(this).val();
        if(x && x.length > 0) {
            if(!$.isNumeric(x)) {
                x = x.replace(/[^0-9]/g,"");
            }
            x = addCommas(x);
            $(this).val(x);
        }
    }).on("keyup", function() {
        $(this).val($(this).val().replace(/[^0-9]/g,""));
    });
	
	if($(':focus').length === 0) {
        $(':input:not([type="hidden"]):first').focus();
    }
	
	refreshGenerateDateFormatInputText();

	$("#myform :input:text:visible:enabled:first").focus();
	$("#myform :input:text, textarea").css("ime-mode", "active");
	
	$('.office_stats_size').css('max-height', $(window).height() - 539);
	
	//dateTimeRefresh();
	initOnlyNumeric();
});

function initSortTable(tableId){
	myTable = document.getElementById(tableId); 
	replace = replacement(myTable); 
}

function refreshDatePicker(isPeriod, fromId, toId){
	$(".datePick").datepicker();
	$(".datePick").on('keypress', function(){
		if(event.keyCode == 13) return false;
	});
	if(isPeriod){
	    from = $(fromId).datepicker({
	              	changeMonth: true,
	              	dateFormat: periodDateFormat
	            }).on( "change", function() {
	            	to.datepicker( "option", "minDate", getPeriodDate( this ) );
	            }),
	    to = $(toId).datepicker({
	    			changeMonth: true,
	    			dateFormat: periodDateFormat
	    		}).on( "change", function() {
	    			from.datepicker( "option", "maxDate", getPeriodDate( this ) );
	    		});

		$(fromId).on('click', function(){
			from.trigger('focus');
			return false;
		});
		$(toId).on('click', function(){
			to.trigger('focus');
			return false;
		});
	}
}

function getPeriodDate( element ) {
    var date;
    try {
      date = $.datepicker.parseDate( periodDateFormat, element.value );
    } catch( error ) {
      date = null;
    }
    return date;
}

function calendarShow(target){
	$(target).datepicker("show");
	//크롬일 경우만 달력레이어 position 변경
	//if(getBrowser() == "CR") $(target).datepicker('widget').css("position", "absolute");
}

function monthCalendarShow(target){
	$(target).monthpicker("show");
	//크롬일 경우만 달력레이어 position 변경
	//if(getBrowser() == "CR") $(target).datepicker('widget').css("position", "absolute");
}

function refreshGenerateDateFormatInputText(){
	$(".datePick").unbind("click");
	$(".datePick").unbind("blur");
	$(".datePick").on("keyup", function(){generateDateFormatInputText(this);});
	$(".datePick").on("blur", function(){generateDateFormatInputTextLength(this);});
}

String.prototype.replaceAll = function(target, replacement) {
	return this.split(target).join(replacement);
};

String.prototype.startsWith = function(str){
	if (this.length < str.length) { return false; }
	return this.indexOf(str) == 0;
}

String.prototype.endsWith = function(str){
	if (this.length < str.length) { return false; }
	return this.lastIndexOf(str) + str.length == this.length;
}

jQuery.fn.serializeObject = function() { 
    var obj = null; 
    try { 
        if(this[0].tagName && this[0].tagName.toUpperCase() == "FORM" ) { 
            var arr = this.serializeArray(); 
            if(arr){ obj = {}; 
            jQuery.each(arr, function() { 
                obj[this.name] = this.value; }); 
            } 
        } 
    }catch(e) { 
        alert(e.message); 
    }finally {} 
    return obj; 
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//3자리 단위마다 콤마 생성
function addCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
//모든 콤마 제거
function removeCommas(x) {
    if(!x || x.length == 0) return "";
    else return x.split(",").join("");
}

function isOnlyNumber(){
	if(event.keyCode < 48 || event.keyCode > 57){
		return false;
	}else{
		return true;
	}
}

function initInputTextSubmitDisabled(){
	$('input:text[submitDisabled]').on("keypress", function(e) {
		var keyCode = e.which?e.which:e.keyCode;
		if(keyCode == 13) return false;
		return true;
    });
	$('input:checkbox[submitDisabled]').on("keypress", function(e) {
		var keyCode = e.which?e.which:e.keyCode;
		if(keyCode == 13) return false;
		return true;
    });
}

function initOnlyNumeric(){
	$("input:text[numberOnly]").on("keyup", function(e){
		e.preventDefault();
		$(this).val($(this).val().replace(/[^0-9]/g,""));
	});
	$("input:text[numberOnly]").on("blur", function(e){
		e.preventDefault();
		$(this).val($(this).val().replace(/[^0-9]/g,""));
	});
	
	$(".onlyNumeric").bind("keyup", function(e){
		var keyCode = e.which?e.which:e.keyCode;
		if(!(keyCode >= 48 && keyCode <= 57)){
			return false;
		}else{
			return true;
		}
	});
}

var SetTime = 180;
var nowDatetime = 1;

function msg_time() {	// 1초씩 카운트
	m = Math.floor(SetTime / 60) + "분 " + (SetTime % 60) + "초";	// 남은 시간 계산
	var msg = m;
	$('#certificateTimer').text(msg);		
	SetTime--;					// 1초씩 감소
	//console.log(msg);
	if (SetTime < 0) {			// 시간이 종료 되었으면..
		clearInterval(tid);		// 타이머 해제
		$('#certificateTimer').text(msg_com_common0026);
		$('#certificateCode').hide();
		$('#certificateChk').hide();
		$('#reCeritificate').show();
	}
}
function TimerStart(){
	tid=setInterval('msg_time()',1000) 
};

function dateTimeRefresh(){
	tid=setInterval('getNowDatetimeStrateString()',1000) 
};

function removeSpecialCharByDatetimeCommon(p_datetime){
	return p_datetime.replaceAll("-", "").replaceAll(":", "").replaceAll(" ", "");
}

function getNowDatetimeStrateString(){  
	var d = new Date();
	var second = '' + d.getSeconds();
	var minute = '' + d.getMinutes();
	var hour = '' + d.getHours();
	var day = '' + d.getDate();
	var month = '' + (d.getMonth() + 1);
	var year = d.getFullYear();

	if (month.length < 2) month = '0' + month;
	if (day.length < 2) day = '0' + day;
	if (hour.length < 2) hour = '0' + hour;
	if (minute.length < 2) minute = '0' + minute;
	if (second.length < 2) second = '0' + second;
	
	return [year, month, day, hour, minute, second].join('');
}

function getNowDatetimeFormat(){  
	var d = new Date();
	var second = '' + d.getSeconds();
	var minute = '' + d.getMinutes();
	var hour = '' + d.getHours();
	var month = '' + (d.getMonth() + 1);
	var day = '' + d.getDate();
	var year = d.getFullYear();

	if (month.length < 2) month = '0' + month;
	if (day.length < 2) day = '0' + day;
	if (hour.length < 2) day = '0' + hour;
	if (minute.length < 2) minute = '0' + minute;
	if (second.length < 2) second = '0' + second;
	
	return [year, month, day].join('')+" "+[hour, minute, second].join(':');
}

function getBeforeMonthDate(dt, step){ 
	if(step == undefined) step = 1;
	var newDt = new Date(dt); 
	newDt.setMonth(newDt.getMonth() - step); 
	newDt.setDate(1); 
	return converDateString(newDt); 
}
function getAfterMonthDate(dt, step){ 
	if(step == undefined) step = 1;
	var newDt = new Date(dt); 
	newDt.setMonth(newDt.getMonth() + step); 
	newDt.setDate(1); 
	return converDateString(newDt); 
}
function getBeforeDayDate(dt, step){ 
	var newDt = new Date(dt); 
	newDt.setDate(newDt.getDate() - step); 
	return converDateString(newDt); 
}
function getAfterDayDate(dt, step){ 
	var newDt = new Date(dt); 
	newDt.setDate(newDt.getDate() + step); 
	return converDateString(newDt); 
}
function getBeforeMinuteDate(dt, step){ 
	var newDt = new Date(dt); 
	newDt.setDate(newDt.getMinutes() - step); 
	return converDateTimeString(newDt); 
}
function getAfterMinuteDate(dt, step){ 
	var newDt = new Date(dt); 
	newDt.setDate(newDt.getMinutes() + step); 
	return converDateTimeString(newDt); 
}
function addZero(i){ 
	var rtn = i + 100; 
	return rtn.toString().substring(1,3); 
}
function leadingZero(val, digits){ 
	var zero = "";
	val = val.toString();
	if(val.length < digits){
		for(var i = 0; i < digits-val.length; i++){
			zero += "0";
		}
	}
	return zero+val;
}
function converDateString(dt){ 
	return dt.getFullYear() + "-" + addZero(eval(dt.getMonth()+1)) + "-" + addZero(dt.getDate()); 
}
function converDateTimeString(dt){ 
	dt = String(dt);
	return dt.substr(0,4)+"-"+dt.substr(4,2)+"-"+dt.substr(6,2)+" "+dt.substr(8,2)+":"+dt.substr(10,2); 
}

function stringToDate(secDate){
	secDate = String(secDate);
	return new Date(secDate.substr(0,4), secDate.substr(4,2), secDate.substr(6,2));  // date로 변경
}

function stringToDateTime(secDate, monthCnt){
	secDate = String(secDate);
	var monthVal = secDate.substr(4,2);
	if(monthCnt < 0) monthVal = (Number(monthVal)-1)<10?"0"+Number(monthVal)-1:Number(monthVal)-1;
	return new Date(secDate.substr(0,4), monthVal, secDate.substr(6,2), secDate.substr(8,2), secDate.substr(10,2));  // date로 변경
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function formatDateTime(date) {
    var d = new Date(date),
    	minute = d.getMinutes(),
    	hour = d.getHours(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2 || month < 10) month = '0' + month;
    if (day.length < 2 || day < 10) day = '0' + day;
    if (hour.length < 2 || hour == "0" || hour < 10) hour = '0' + hour;
    if (minute.length < 2 || minute == "0" || minute < 10) minute = '0' + minute;

    return [year, month, day].join('-')+" "+[hour, minute].join(':');
}

function auto_date_format( e, oThis ){
//  var num_arr = [ 
//      97, 98, 99, 100, 101, 102, 103, 104, 105, 96,
//      48, 49, 50, 51, 52, 53, 54, 55, 56, 57
//  ]
	var num_arr = ";;97;;98;;99;;100;;101;;102;;103;;104;;105;;96;;48;;49;;50;;51;;52;;53;;54;;55;;56;;57;;";
  var key_code = ( e.which ) ? e.which : e.keyCode;
  if( num_arr.indexOf( ";;"+key_code+";;" ) > -1 ){
      var len = oThis.value.length;
      if( len == 4 ) oThis.value += "-";
      if( len == 7 ) oThis.value += "-";
  }
}

function dateValidate(d){
    var re = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/;
    //         yyyy -       MM      -       dd           hh
    return re.test(d);
}

function datetimeValidate(d){
    var re = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]/;
    //         yyyy -       MM      -       dd           hh     :   mm  :   ss
    return re.test(d);
}

function nl2br(str){  
    return str.replace(/\n/g, "<br />");  
} 

/**
 * <input type="checkbox" id="checkAll"> check/uncheck 시 <input type="checkbox" class="checkAll"> 전체 체크동기
 * @author 유현돈
 */
$(function(){
	$("#chkAll").click(function(){ 
		if($("#chkAll").prop("checked")) { 
			$(".chkAll").prop("checked",true);
		} else { 
			$(".chkAll").prop("checked",false); 
		} 
	});
});

/**
 * 리스트 페이지 이동처리 공통함수
 * @author 유현돈
 * @param targetUrl : 이동할 페이지 url, paramKey : 페이지번호 이름, paramValue : 페이지번호, rangeValue : 최소/최대치 숫자 패턴
 */
function createListPageUrl(targetUrl, paramKey, paramValue, rangeValue){
	//console.log("createListPageUrl : "+targetUrl+","+paramKey+","+paramValue+","+rangeValue);
	var pattern = new RegExp("[&]?"+paramKey+"=["+rangeValue+"]*");
	var targetUrlSplit = targetUrl.split("?");
	var targetUrlQueryString = "";
	if(targetUrlSplit[1] != undefined) targetUrlQueryString = targetUrlSplit[1].replace(pattern, "");
	var prefixChar = "";
	if(targetUrlQueryString != "") {
		prefixChar = "&";
		if(targetUrlQueryString.startsWith("&")) targetUrlQueryString = targetUrlQueryString.substring(1, targetUrlQueryString.length);
	}
    return targetUrlSplit[0]+"?"+targetUrlQueryString+prefixChar+paramKey+"="+paramValue;
}

/**
 * ajax 처리(일반) 공통함수
 * @author 유현돈
 * @param p_type : GET or POST, p_url : 호출주소, p_dataType : text or json, contentType : , p_data : 요청파라미터 객체, callbackFunc : ajax 호출 후 처리할 함수명, division : 구분자
 */
function ajaxCall(p_type, p_url, p_dataType, p_contentType, p_data, callbackFunc, division){
	$.ajax({
        type : p_type,
        url : p_url,
        dataType : p_dataType,
        contentType: p_contentType,
        data: p_data,
        cache: false,
        success : function(data){
        	if(data == null || data == undefined || data == "" && data.length == 0){
				data = "";
			}
			eval(callbackFunc+"(data, division);");
        }, 
        error : function(err1, err2, err3){
            //console.log(msg_com_common0027 + "\n["+err1+","+err2+","+err3+"]");
            var data = {"result" : "-1", "resultMsg" : err1+","+err2+","+err3};
            eval(callbackFunc+"(data, division);");
        }
    });
}

/**
 * ajax 처리(비동기 방식) 공통함수
 * @author 김성남
 * @param p_type : GET or POST, p_url : 호출주소, p_dataType : text or json, contentType : , p_data : 요청파라미터 객체, callbackFunc : ajax 호출 후 처리할 함수명, division : 구분자
 */
function ajaxCallSync(p_type, p_url, p_dataType, p_contentType, p_data, callbackFunc, division){
	$.ajax({
        type : p_type,
        url : p_url,
        async: false,        
        dataType : p_dataType,
        contentType: p_contentType,
        data: p_data,
        cache: false,
        success : function(data){
        	if(data == null || data == undefined || data == "" && data.length == 0){
				data = "";
			}
			eval(callbackFunc+"(data, division);");
        }, 
        error : function(err1, err2, err3){
            //console.log(msg_com_common0027 + "\n["+err1+","+err2+","+err3+"]");
            var data = {"result" : "-1", "resultMsg" : err1+","+err2+","+err3};
            eval(callbackFunc+"(data, division);");
        }
    });
}

/**
 * ajax 처리(첨부) 공통함수
 * @author 유현돈
 * @param p_type : GET or POST, p_url : 호출주소, p_dataType : text or json, contentType : , formName : 전송할 데이터 <form> 객체, callbackFunc : ajax 호출 후 처리할 함수명, division : 구분자
 */
function ajaxFormCall(p_type, p_url, p_dataType, p_contentType, formName, files, callbackFunc, division){

	console.log(p_type+"::"+p_url+"::"+p_dataType+"::"+p_contentType+"::"+formName+"::"+files+"::"+callbackFunc+"::"+division);
//	           POST::/task/develop/verify/save::json::multipart/form-data::taskVerifyForm::[object Object]::taskVerifyCallback::save
	$("#"+formName).ajaxForm({
        beforeSubmit: function (data,form,option) {
        	console.log(data+"::"+form+"::"+option);
        	//첨부파일 처리구간
        	if(files != null && files != ""){
        		$.each(files, function(i, val){
        			if(val != null){
        				var obj = {type : "file", name : "attach_file[]", value : files[i]};
            			console.log("files====>"+files[i]);
        				data.push(obj);
        			}
        		});
        	}
            return true;
        },
        type : p_type,
        url : p_url,
        dataType : p_dataType,
        contentType: p_contentType,
        cache: false,
        success: function(data, response, status){
        	if(data == null || data == undefined || data == "" && data.length == 0){
				data = "";
			}
        	eval(callbackFunc+"(data, division);");
        },
        error : function(err1, err2, err3){
        	console.log(msg_com_common0027 + "\n["+err1+","+err2+","+err3+"]");
            var data = {"result" : "-1", "resultMsg" : err1+","+err2+","+err3};
            eval(callbackFunc+"(data, division);");
        }                             
    });
}


/**
 * ajax 처리(비동기 방식) 공통함수
 * @author 김성남
 * @param p_type : GET or POST, p_url : 호출주소, p_dataType : text or json, contentType : , p_data : 요청파라미터 객체, callbackFunc : ajax 호출 후 처리할 함수명, division : 구분자
 */
function ajaxFormCallSync(p_type, p_url, p_dataType, p_contentType, formName, files, callbackFunc, division){

	console.log(p_type+"::"+p_url+"::"+p_dataType+"::"+p_contentType+"::"+formName+"::"+files+"::"+callbackFunc+"::"+division);
//	           POST::/task/develop/verify/save::json::multipart/form-data::taskVerifyForm::[object Object]::taskVerifyCallback::save
	$("#"+formName).ajaxForm({
        beforeSubmit: function (data,form,option) {
        	console.log(data+"::"+form+"::"+option);
        	//첨부파일 처리구간
        	if(files != null && files != ""){
        		$.each(files, function(i, val){
        			if(val != null){
        				var obj = {type : "file", name : "attach_file[]", value : files[i]};
            			console.log("files====>"+files[i]);
        				data.push(obj);
        			}
        		});
        	}
            return true;
        },
        type : p_type,
        url : p_url,
        async: false,
        dataType : p_dataType,
        contentType: p_contentType,
        cache: false,
        success: function(data, response, status){
        	if(data == null || data == undefined || data == "" && data.length == 0){
				data = "";
			}
        	eval(callbackFunc+"(data, division);");
        },
        error : function(err1, err2, err3){
        	console.log("=========" + "\n["+err1+","+err2+","+err3+"]");
//        	console.log(msg_com_common0027 + "\n["+err1+","+err2+","+err3+"]");
            var data = {"result" : "-1", "resultMsg" : err1+","+err2+","+err3};
            eval(callbackFunc+"(data, division);");
        }                             
    });
}

/**
 * json 객체 유효성 체크 공통함수
 * @author 유현돈
 * @param data : json 객체, validAttrName : 유효성 체크할 객체 키이름, isList : 목록화면 여부
 */
function ajaxResultDataJsonValidate(data, validAttrName, isList){
	/*console.log("ajaxResultDataJsonValidate : ==================");
	console.log(data);
	console.log(eval("data."+validAttrName));
	console.log("ajaxResultDataJsonValidate : ==================");*/
	
	if(data != undefined && data != null && (eval("data."+validAttrName) != undefined && eval("data."+validAttrName) != null)){//json이 유효할 경우
		if(data.result != "1" && data.result_msg != ""){//json 결과가 맞지 않을 경우
			alert(data.result_msg);
			if(isList) isMoreList = false;
			return false;
		}else{
			return true;
		}
	}else if(data.result != undefined && data.resultMsg != undefined){//json이 유효하지 않을 경우 오류 메세지 노출
		alert(data.resultMsg);
		if(isList) isMoreList = false;
		return false;
	}
//	console.log("data undefined");
	if(isList) isMoreList = false;
	return false;
}

function searchAddress(zoneCodeField, fullAddrField, elseAddrField) {
	new daum.Postcode({
		oncomplete : function(data) {
			// 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.
			// 각 주소의 노출 규칙에 따라 주소를 조합한다.
			// 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
			var fullAddr = ''; // 최종 주소 변수
			var extraAddr = ''; // 조합형 주소 변수

			// 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
			if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
				fullAddr = data.roadAddress;
			} else { // 사용자가 지번 주소를 선택했을 경우(J)
				fullAddr = data.jibunAddress;
			}
			// 사용자가 선택한 주소가 도로명 타입일때 조합한다.
			if (data.userSelectedType === 'R') {
				//법정동명이 있을 경우 추가한다.
				if (data.bname !== '') {
					extraAddr += data.bname;
				}
				// 건물명이 있을 경우 추가한다.
				if (data.buildingName !== '') {
					extraAddr += (extraAddr !== '' ? ', '
							+ data.buildingName : data.buildingName);
				}
				// 조합형주소의 유무에 따라 양쪽에 괄호를 추가하여 최종 주소를 만든다.
				fullAddr += (extraAddr !== '' ? ' (' + extraAddr
						+ ')' : '');
			}
			// 우편번호와 주소 정보를 해당 필드에 넣는다.
			document.getElementById(zoneCodeField).value = data.zonecode; //5자리 새우편번호 사용
			document.getElementById(fullAddrField).value = fullAddr;
			// 커서를 상세주소 필드로 이동한다.
			document.getElementById(elseAddrField).focus();
		},
		autoClose : true
	}).open();
}

/**
 * 로그인 ajax 호출 후 결과를 반환하는 함수
 * @author 유현돈
 */
function loginCallback(data, division){
	if(data.result == "SUCCESS"){
		alert(data.MEMBER_NAME+msg_com_common0001);
		top.location.href = "/";
	}else if(data.result == "PW_WRONG"){
		alert(msg_com_common0002);
	}else if(data.result == "NO_EXIST"){
		alert(msg_com_common0003);
	}else if(data.result == "UNAUTHORIZED"){
		alert(msg_com_common0004);
	}else if(data.result == "EXCEPT"){
		alert(msg_com_common0005 + "\n" + msg_com_common0024);
	}
}

/**
 * 로그아웃 ajax 호출 후 결과를 반환하는 함수
 * @author 유현돈
 */
function logoutCallback(data, division){
	if(data.result == "SUCCESS"){
		//alert(msg_com_common0006);
		if(division == "M" || division == "S" || division == "T"){
			top.location.href = "/";
		}else{
			top.location.href = "/cms/";
		}
	}else{
		alert(msg_com_common0007 + "\n" + msg_com_common0025);
	}
}

function loginByEnter(){
	if(window.event.keyCode == 13) login();
}

/**
 * 로그인 ajax 호출
 * @author 유현돈
 */
function login(){
	if($("#login_id").val() == ""){
		alert(msg_com_common0008);
		$("#login_id").focus();
	}else if($("#login_pw").val() == ""){
		alert(msg_com_common0009);
		$("#login_pw").focus();
	}else{
		var memberType = $("#member_type").val();
		if(memberType == undefined)  memberType = $( "input[type=radio][name=member_type]:checked" ).val();
		ajaxCall("POST", "/common/login/json", "json", "application/x-www-form-urlencoded", $("#loginForm").serialize(), "loginCallback", memberType);
	}
}

/**
 * 로그아웃 ajax 호출
 * @author 유현돈
 */
function logout(memberType){
	if(confirm(msg_com_common0021)){
		ajaxCall("POST", "/common/logout/json", "json", "application/x-www-form-urlencoded", $("#logoutForm").serialize(), "logoutCallback", memberType);
	}
}

function moveBySelect(url){
	top.location.href = url;
}

/**
 * jsp view 호출 후 레이어 랜더링 함수
 * @author 유현돈
 * @param data : jsp 뷰페이지, division : 뷰 구분(targetId, title, width, height)
 */
function htmlContentCallback(data, division){
	var divisionSplit = division.split(";;");
	openLayerForHTML(divisionSplit[0], divisionSplit[1], data, divisionSplit[2], divisionSplit[3], "#fff", "left");
	tooptipRefresh();
}

function htmlContentCallbackForSlideLayer(data, division){
	var divisionSplit = division.split(";;");
	openSlideLayerForHTML(divisionSplit[0], divisionSplit[1], data, "#fff", "left");
	tooptipRefresh();
}

function htmlContentCallbackForSlideRerender(data, division){
	var divisionSplit = division.split(";;");
	$(".pop_inner").html(data);
}

/**
 * 정중앙 레이어 오픈(페이지 내 html) 공통함수
 * @author 유현돈
 * @param layerTargetId : 레이어 div 아이디, layerTitle : 레이어 상단타이틀, width : 레이어너비, height : 레이어높이, textAlign : 레이어 내 텍스트 위치(center, left, right)
 */
function openLayer(layerTargetId, layerTitle, width, height, bgColor, textAlign){
	var top = (($(window).height()-height)/2+$(window).scrollTop());
	var left = (($(window).width()-width)/2+$(window).scrollLeft());
	$("body").append("<div id=\"layerDimd\" onclick=\"closeLayer('"+layerTargetId+"');\" style=\"position: absolute; left: 0; top: 0; width: 100%; height: "+($(window).height()+$(window).scrollTop())+"px; background-color: #000; opacity: 0.5; z-index: 101;\"></div>");
	$("body").append("<div id=\"layerTitle\" style=\"position: absolute; top: "+(top-57)+"px; left: "+left+"px; z-index: 103; border-top-left-radius:10px; border-top-right-radius:10px; overflow:hidden; background-color: #1853b6; width: "+width+"px; padding: 20px 30px; margin: -12px 0px; font-size: 20px; font-weight: 300; color:#fff; \">" +
					 "	<strong>"+layerTitle+"</strong>" +
					 "	<span style=\"float: right; margin-right: 10px;\"><a href=\"javascript:;\" onclick=\"closeLayer('"+layerTargetId+"');\"><img src=\"/resources/img/sub/pop_close_white.png\" /></a></span>" +
					 "</div>");
	$("#"+layerTargetId).css({"position": "absolute", "z-index": "102", "border-bottom-left-radius": "10px", "border-bottom-right-radius": "10px", "top": top+"px", "left": left+"px", "width": width+"px", "height": height+"px", "background-color": bgColor, "padding": "20px 30px", "text-align": textAlign});
	$("#"+layerTargetId).show();
	$("#"+layerTargetId).css("overflow-x", "hidden");
	$("#"+layerTargetId).css("overflow-y", "auto");
	$("body").css("overflow","hidden");
}
function closeLayer(layerTargetId){
	$("#layerDimd, #layerTitle").remove();
	$("#"+layerTargetId).hide();
	if($(".pop_box").attr("id") == undefined) $("body").css("overflow","auto");
}

/**
 * 정중앙 레이어 오픈(서버반환 페이지) 공통함수
 * @author 유현돈
 * @param targetId : 레이어 div 아이디, layerTitle : 레이어 상단타이틀, htmlContent : 랜더링 html 페이지, width : 레이어너비, height : 레이어높이, bgColor : 레이어 배경색, textAlign : 레이어 내 텍스트 위치(center, left, right)
 */
function openLayerForHTML(targetId, layerTitle, htmlContent, width, height, bgColor, textAlign){

	if(targetId == '_aafile_list') {
		var top = (($(window).height()-height)/2+$(window).scrollTop());
		var left = (($(window).width()-width)/2+$(window).scrollLeft());
		var layerTargetId = "pop_html"+targetId;
		$("body").append("<div id=\"layerDimdForHTML\" onclick=\"closeLayerForHTML('"+targetId+"');\" style=\"position: absolute; left: 0; top: 0; width: 100%; height: "+($(window).height()+$(window).scrollTop())+"px; background-color: #000; opacity: 0.5; z-index: 101;\"></div>");
		$("body").append("" +
				  "<div id=\"layerTitleForHTML\" style=\" position: absolute; top: "+(top-57)+"px; left: "+left+"px; z-index: 103; border-top-left-radius:10px; border-top-right-radius:10px; overflow:hidden; background-color: #1853b6; width: 500px; padding: 20px 30px; margin: -12px 0px; font-size: 20px; font-weight:300; color:#fff; \">" +
				  "	<strong class=\"table02_h1_tit\" style=\"font-weight:normal;\">"+layerTitle+"</strong>" +
				  "	<span style=\"float: right; margin-right: 10px;\"><a href=\"javascript:;\" onclick=\"closeLayerForHTML('"+targetId+"');\"><img src=\"/resources/img/sub/pop_close_white.png\" /></a></span>" +
				  "</div>");
		$("body").append("<div id=\""+layerTargetId+"\" style=\" position: absolute; z-index: 102; border-bottom-left-radius:10px; border-bottom-right-radius:10px; overflow:hidden; top: "+top+"px; left: "+left+"px; width: "+width+"px; height: "+height+"px; background-color: "+bgColor+"; padding: 20px 30px; text-align: "+textAlign+";\">"+htmlContent+"</div>")
		$("#"+layerTargetId).css("overflow-x", "hidden");
		$("#"+layerTargetId).css("overflow-y", "auto");
		$("body").css("overflow","hidden");
	} else {
		var top = (($(window).height()-height)/2+$(window).scrollTop());
		var left = (($(window).width()-width)/2+$(window).scrollLeft());
		var layerTargetId = "pop_html"+targetId;
		$("body").append("<div id=\"layerDimdForHTML\" onclick=\"closeLayerForHTML('"+targetId+"');\" style=\"position: absolute; left: 0; top: 0; width: 100%; height: "+($(window).height()+$(window).scrollTop())+"px; background-color: #000; opacity: 0.5; z-index: 101;\"></div>");
		$("body").append("" +
				  "<div id=\"layerTitleForHTML\" style=\" position: absolute; top: "+(top-57)+"px; left: "+left+"px; z-index: 103; border-top-left-radius:10px; border-top-right-radius:10px; overflow:hidden; background-color: #1853b6; width: "+width+"px; padding: 20px 30px; margin: -12px 0px; font-size: 20px; font-weight:300; color:#fff; \">" +
				  "	<strong class=\"table02_h1_tit\" style=\"font-weight:normal;\">"+layerTitle+"</strong>" +
				  "	<span style=\"float: right; margin-right: 10px;\"><a href=\"javascript:;\" onclick=\"closeLayerForHTML('"+targetId+"');\"><img src=\"/resources/img/sub/pop_close_white.png\" /></a></span>" +
				  "</div>");
		$("body").append("<div id=\""+layerTargetId+"\" style=\" position: absolute; z-index: 102; border-bottom-left-radius:10px; border-bottom-right-radius:10px; overflow:hidden; top: "+top+"px; left: "+left+"px; width: "+width+"px; height: "+height+"px; background-color: "+bgColor+"; padding: 20px 30px; text-align: "+textAlign+";\">"+htmlContent+"</div>")
		$("#"+layerTargetId).css("overflow-x", "hidden");
		$("#"+layerTargetId).css("overflow-y", "auto");
		$("body").css("overflow","hidden");
	}
}
function closeLayerForHTML(layerTargetId){
	$("#layerDimdForHTML, #layerTitleForHTML").remove();
	$("#pop_html"+layerTargetId).remove();
	if($(".pop_box").attr("id") == undefined) $("body").css("overflow","auto");
}

/**
 * 슬라이드 레이어 오픈(페이지 내 html) 공통함수
 * @author 유현돈
 * @param layerTargetId : 레이어 div 아이디, layerTitle : 레이어 상단타이틀, width : 레이어너비, height : 레이어높이, textAlign : 레이어 내 텍스트 위치(center, left, right)
 */
function openSlideLayer(layerTargetId, layerTitle, width, height, bgColor, textAlign){
	
}
function closeSlideLayer(layerTargetId){
	
}

/**
 * 슬라이드 레이어 오픈(서버반환 페이지) 공통함수
 * @author 유현돈
 * @param targetId : 레이어 div 아이디, layerTitle : 레이어 상단타이틀, htmlContent : 랜더링 html 페이지, bgColor : 레이어 배경색, textAlign : 레이어 내 텍스트 위치(center, left, right)
 */
function openSlideLayerForHTML(targetId, layerTitle, htmlContent, bgColor, textAlign){
	$("body").css("overflow","hidden");
	var html = "";
	html += '<div id="dimd_lv'+targetId+'" class="dimd_lv dimd_lv'+targetId+'" onclick="closeSlideLayerForHTML(\''+targetId+'\');"></div>';
	html += '<div id="pop_slide_lv'+targetId+'" class="pop_box card shadow">';
	html += '  <!-- Page Heading -->';
	html += '  <h3 class="h3 mb-2">'+layerTitle+'<a href="javascript:closeSlideLayerForHTML(\''+targetId+'\');" class="pop_close">닫기</a></h3>';
	html += '  <div class="pop_content_area">';
	html += '  <div id="pop_inner'+targetId+'" class="pop_inner">';
	html += htmlContent;
	html += '  </div>';
	html += '  </div>';
	html += '</div>';
	$("body").append(html);
	$("#pop_slide_lv"+targetId).animate({"top":0, "right":0},500,"easeInOutCubic");
}
function closeSlideLayerForHTML(layerTargetId){
	$("#pop_slide_lv"+layerTargetId).animate({"right":-1920},500,"easeInOutCubic");
	$("#dimd_lv"+layerTargetId).remove();
	if($(".dimd_lv").attr("id") == undefined){
		$("body").css("overflow","auto");
	}
	setTimeout(function() {$("#pop_slide_lv"+layerTargetId).remove();/*if($(".pop_box").attr("id") == undefined) $("body").css("overflow","auto");*/}, 500);
}

/**
 * 로딩중 레이어 공통함수
 * @author 유현돈
 * @param loadingImg : 로딩중 이미지경로, loadingTitle, 로딩중 상단타이틀, width : , height : , textAlign, textColor, textSize
 */
function openLayerLoading(loadingImg, loadingTitle, width, height, bgColor, textAlign, textColor, textSize){
	var top = (($(window).height()-height)/2+$(window).scrollTop())+"px";
	var left = (($(window).width()-width)/2+$(window).scrollLeft())+"px";
	$("body").append("<div id=\"layerloadingDimd\" style=\"position: absolute; left: 0; top: 0; width: 100%; height: "+($(window).height()+$(window).scrollTop())+"px; background-color: #000; opacity: 0.5; z-index: 101;\"></div>");
	$("body").append("<div id=\"layerloadingDiv\" style=\"position: absolute; z-index: 102; top: "+top+"; left: "+left+"; width: "+width+"px; height: "+height+"px; background-color: "+bgColor+"; padding: 12px; text-align: "+textAlign+";\"><img src=\""+loadingImg+"\" width=\"50px\" style=\"padding: 10px 10px;\"><br/><span style=\"color: "+textColor+"; font-size:"+textSize+"\">"+loadingTitle+"</span></div>")
	$("body").css("overflow","hidden");
}
function closeLayerLoading(){
	$("#layerloadingDimd").remove();
	$("#layerloadingDiv").remove();
	//$("body").css("overflow","auto");
	if($(".pop_box").attr("id") == undefined) $("body").css("overflow","auto");
}

function openSlideLayerLoading(loadingTitle){
	openLayerLoading("/resources/img/loading_circle.gif", loadingTitle, "400", "200", "#fff0", "center", "#fff", "20px");
}

/**
 * 페이지 내 로딩중 공통함수
 * @author 유현돈
 * @param parentId : 삽입될 부모 태그 아이디, loadingImg : 로딩중 이미지경로, loadingTitle, 로딩중 상단타이틀, width : , height : , textAlign
 */
function openPageLoading(parentId, loadingImg, loadingTitle, width, height, bgColor, textAlign, textColor, textSize, startTags, endTags){
	$(parentId).after((startTags!=undefined?startTags:"")+"<div id=\"pageloadingDiv\" style=\"width: "+width+"; height: "+height+"; background-color: "+bgColor+"; padding: 12px; text-align: "+textAlign+";\"><img src=\""+loadingImg+"\" width=\"50px\" style=\"padding: 10px 10px;\"><br/><span style=\"color: "+textColor+"; font-size:"+textSize+"\">"+loadingTitle+"</span></div>"+(endTags!=undefined?endTags:""));
}
function closePageLoading(){
	$("#pageloadingDiv").remove();
}

function attachChange(imgName, imgViewerId){
	var imgNameSplit = imgName.substring(imgName.lastIndexOf("\\")+1);
	$('#'+imgViewerId).val(imgNameSplit);
}

function print(target, hideObj, cssPath){
	if(hideObj != "") $(hideObj).hide();
	$(target).printThis({
	    debug: false,                   // show the iframe for debugging
	    importCSS: true,                // import parent page css
	    importStyle: true,             // import style tags
	    printContainer: true,           // grab outer container as well as the contents of the selector
	    //loadCSS: "path/to/my.css",      // path to additional css file - use an array [] for multiple
	    loadCSS: cssPath,      // path to additional css file - use an array [] for multiple
	    pageTitle: "",                  // add title to print page
	    removeInline: false,            // remove all inline styles from print elements
	    removeInlineSelector: "body *", // custom selectors to filter inline styles. removeInline must be true
	    printDelay: 333,                // variable print delay
	    header: null,                   // prefix to html
	    footer: null,                   // postfix to html
	    base: false,                    // preserve the BASE tag, or accept a string for the URL
	    formValues: true,               // preserve input/form values
	    canvas: false,                  // copy canvas elements
	    doctypeString: '<!DOCTYPE html>',           // enter a different doctype for older markup
	    removeScripts: false,           // remove script tags from print content
	    copyTagClasses: false,           // copy classes from the html & body tag
	    beforePrintEvent: null,         // callback function for printEvent in iframe
	    beforePrint: objhide(hideObj),              // function called before iframe is filled
	    afterPrint: objShow(hideObj)                // function called before iframe is removed
	});
	
	setTimeout(function(){ if(hideObj != "") $(hideObj).show(); }, 500);
}

function objShow(hideObj){
	//$(hideObj).show();
}

function objhide(hideObj){
	//$(hideObj).hide();
}

function jsonMergeForExcel(json){
	if(jsonContent == "") jsonContent = json;
	else 				  jsonContent = $.merge( $.merge( [], jsonContent ), json );
}

function excel(currentUrl, fileName, division){
	if(jsonContent != undefined && jsonContent != null && jsonContent != ""){
		if($("#excelDownloadFrame").attr("name") == undefined){
			$("body").append("<iframe name=\"excelDownloadFrame\" id=\"excelDownloadFrame\" width=\"0\" height=\"0\" style=\"display: none;\"></iframe>");
		}
		
		var form = createDynamicForm("excelForm", "excelForm", "/export/excel?time="+getNowDatetimeStrateString());
		for(var i = 0; i < jsonContent.length; i++){
			for(key in jsonContent[i]){
				createDynamicFormInputData(form, "hidden",key, jsonContent[i][key]);
			}
		}
		if(subJsonContent != undefined && subJsonContent != ""){
			createDynamicFormInputData(form, "hidden", "subContent", JSON.stringify(subJsonContent));
			createDynamicFormInputData(form, "hidden", "subContentTitle", subContentTitle);
		}
		createDynamicFormInputData(form, "hidden", "currentUrl", currentUrl);
		createDynamicFormInputData(form, "hidden", "fileName", fileName);
		createDynamicFormInputData(form, "hidden", "division", division);

		form.setAttribute("target", "excelDownloadFrame");
		form.submit();
		
		$("#excelDownloadFrame").on("load", function(){
			if($(this.contentDocument).find('body').html() == undefined) alert(msg_com_common0010);
			else if($(this.contentDocument).find('body').html().indexOf(msg_com_common0028) > -1) alert($(this.contentDocument).find('body').html());
	    });
		setTimeout(function() {$("#excelDownloadFrame, #excelForm").remove();}, 200);
	}else{
		alert(msg_com_common0011);
	}
}

function excel2(currentUrl, fileName, division){
	if(jsonContent != undefined && jsonContent != null && jsonContent != ""){
		if($("#excelDownloadFrame").attr("name") == undefined){
			$("body").append("<iframe name=\"excelDownloadFrame\" id=\"excelDownloadFrame\" width=\"0\" height=\"0\" style=\"display: none;\"></iframe>");
		}
		var form = createDynamicForm("excelForm", "excelForm", "/export/excel2?time="+getNowDatetimeStrateString());
		createDynamicFormInputData(form, "hidden", "content", JSON.stringify(jsonContent));
		if(subJsonContent != undefined && subJsonContent != ""){
			createDynamicFormInputData(form, "hidden", "subContent", JSON.stringify(subJsonContent));
			createDynamicFormInputData(form, "hidden", "subContentTitle", subContentTitle);
		}
		createDynamicFormInputData(form, "hidden", "currentUrl", currentUrl);
		createDynamicFormInputData(form, "hidden", "fileName", fileName);
		createDynamicFormInputData(form, "hidden", "division", division);
		
		form.setAttribute("target", "excelDownloadFrame");
		form.submit();
		
		$("#excelDownloadFrame").on("load", function(){
			if($(this.contentDocument).find('body').html() == undefined) alert(msg_com_common0010);
			else if($(this.contentDocument).find('body').html().indexOf(msg_com_common0028) > -1) alert($(this.contentDocument).find('body').html());
	    });
		setTimeout(function() {$("#excelDownloadFrame, #excelForm").remove();}, 200);
	}else{
		alert(msg_com_common0011);
	}
}

function createDynamicForm(id, name, url) {
    var form = document.createElement("form");
    form.setAttribute("id", id);
    form.setAttribute("name", name);
    form.setAttribute("charset", "UTF-8");
    form.setAttribute("method", "POST");  //Post 방식
    form.setAttribute("action", url); //요청 보낼 주소
    document.body.appendChild(form);
    return form;
 }

function createDynamicFormInputData(form, type, name, data){
	var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", type);
    hiddenField.setAttribute("name", name);
    hiddenField.setAttribute("value", data);
    form.appendChild(hiddenField);
}

function getParentObject(obj, depth){
	for(var i = 0; i < depth; i++){
		obj = obj.parent();
	}
	return obj;
}

function getChidrenObject(obj, depth){
	for(var i = 0; i < depth; i++){
		obj = obj.children();
	}
	return obj;
}

function attachCallBack(data, division){
	if(division == "delete"){
		alert(msg_com_common0012);
	}else{
		alert(msg_com_common0013);
	}
}
function imgDelete(inputId, attachNo, updateNo, wherePrefix){
	if(confirm(msg_com_common0022)){
		$('#'+inputId).val("");
		$('#imgViewer').empty();
		ajaxCall("POST", "/attach/delete", "json", "application/x-www-form-urlencoded", {"where_prefix" : wherePrefix, "update_no" : updateNo, "attach_no" : attachNo}, "attachCallBack", "delete");
	}
}
function attachDelete(inputId, attachNo, division){
	if(confirm(msg_com_common0023)){
		$('#'+inputId).val("");
		$('#imgViewer').empty();
		ajaxCall("POST", "/attach/delete", "json", "application/x-www-form-urlencoded", {"division" : division, "attach_no" : attachNo}, "attachCallBack", "delete");
	}
}

/**
 * 휴대폰번호 입력 후 인증번호 발송하는 함수
 * @author 유현돈
 * @param prefix : 회원구분자
 */
function certificate(prefix){
	$('#reCeritificate').hide();
	var phone = $('#'+prefix+'_phone1').val() + "-"+ $('#'+prefix+'_phone2').val() + "-" + $('#'+prefix+'_phone3').val();
	$('#sms_certificate_phone').val(phone);
	if(!blankValidate(prefix+'_phone1',msg_com_common0029)) return false;
	if(!blankValidate(prefix+'_phone2',msg_com_common0029)) return false;
	if(!blankValidate(prefix+'_phone3',msg_com_common0029)) return false;
	ajaxCall("POST", "/common/certificate/create", "json", "application/x-www-form-urlencoded", $('#certificateForm').serialize(), "cetificateCallBack", "certificate");
}

/**
 * 인증번호 유효성체크 함수
 * @author 유현돈
 */
function certificateCheck(){
	var code = $('#certificateCode').val();
	$('#sms_certificate_code').val(code);
	if(!blankValidate('certificateCode',msg_com_common0030)) return false;
	ajaxCall("POST", "/common/certificate/check", "json", "application/x-www-form-urlencoded", $('#certificateForm').serialize(), "cetificateCallBack", "certificateCheck");
}

/**
 * 인증문자 발송 서버 호출 후 결과콜백 함수
 * @author 유현돈
 * @param data : 결과, division : 호출 구분
 */
function cetificateCallBack(data, division){
	if(division == "certificate"){
		if (data.result == "SUCCESS") {
			alert(msg_com_common0014);
			$('.certificate').hide();
			$('#certificateCode').show();
			$('#certificateChk').show();
			SetTime = 180;
			TimerStart();
		}else{
			alert(msg_com_common0015);
		}
	}else if(division == "certificateCheck"){
		if (data == 1) {
			$('#sms_certificate_yn').val("Y");
			$('#certificateCode').hide();
			$('#certificateChk').hide();
			$('#certificateTimer').hide();
			$('#certificateY').show();
			clearInterval(tid);
		}else{
			alert(msg_com_common0016);
		}
	}
}

function getDefaultIfNull(str, defaultValue){
	return (str ? str == 'NaN' ? defaultValue : str : defaultValue);
}

/**
 * <input type="text"> 공백 유효성체크 공통함수
 * @author 유현돈
 * @param targetId : 유효성체크할 input 객체 아이디, alertText : 유효성 실패일 경우 노출된 alert 메세지
 */
function blankValidate(targetId,alertText){
	if ($('#'+targetId).val() == "") {
		alert(alertText);
		$('#'+targetId).focus();
		return false;
	}
	return true;
}

/**
 * <input type="text"> 공백 유효성체크 공통함수
 * @author 유현돈
 * @param target : 유효성체크할 input 객체 아이디, alertText : 유효성 실패일 경우 노출된 alert 메세지
 */
function blankValidate2(target,alertText){
	if (target.value == "") {
		alert(alertText);
		target.focus();
		return false;
	}
	return true;
}

/**
 * <input type="text"> 공백 유효성체크 공통함수
 * @author 유현돈
 * @param target : 유효성체크할 input 객체 아이디, alertText : 유효성 실패일 경우 노출된 alert 메세지
 */
function blankValidate3(target,alertText){
	if (target.val() == "") {
		alert(alertText);
		target.focus();
		return false;
	}
	return true;
}

/**
 * <input type="text"> 특수문자 체크 공통함수
 * @author 유현돈
 * @param str : 유효성체크할 input
 */
function checkSpecial(str){ 
	var special_pattern = /[`~!@#$%^&*|\\\'\";:\/?]/gi; 
	if (special_pattern.test(str) == true) { 
		return 0; 
	} else { 
		return -1; 
	} 
}

/**
 * <input type="text"> 이메일 유효성체크 공통함수
 * @author 유현돈
 * @param email : 유효성체크할 input 객체 아이디
 */
function emailValiedate(email){
	var emailVal = email;
	var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
	//var regExp = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/
	if (emailVal.match(regExp) != null) {
		return true;
	}else{
		alert(msg_com_common0017);
	    return false;
	}
}

/**
 * <input type="text"> 전화번호 유효성체크 공통함수
 * @author 유현돈
 * @param targetId : 유효성체크할 input 객체 아이디
 */
function phoneNumberValidate(phoneNum) { 
	//var regExp =/(02|0[3-9]{1}[0-9]{1})[1-9]{1}[0-9]{2,3}[0-9]{4}$/; 
	var regExp =/(02)([0-9]{3,4})([0-9]{4})$/; 
	var myArray; 
	if(regExp.test(phoneNum) == true){ 
		myArray = regExp.exec(phoneNum); 
		return true; 
	} else { 
		regExp =/(0[3-9]{1}[0-9]{1})([0-9]{3,4})([0-9]{4})$/; 
		if(regExp.test(phoneNum) == true){ 
			myArray = regExp.exec(phoneNum);  
			return true; 
		} else { 
			alert(msg_com_common0018);
			return false; 
		} 
	} 
} 

/**
 * <input type="text"> 휴대폰번호 유효성체크 공통함수
 * @author 유현돈
 * @param targetId : 유효성체크할 input 객체 아이디
 */
function mobileNumberValidate(mobileNum) { 
	var regExp =/(01[016789])([1-9]{1}[0-9]{2,3})([0-9]{4})$/; 
	var myArray; 
	if(regExp.test(mobileNum) == true){ 
		myArray = regExp.exec(mobileNum); 
		return true; 
	} else { 
		alert(msg_com_common0019);
		return false; 
	} 
}

function generateDateFormatInputText(el){
	el.value = el.value.replace(/[^0-9]/g,'');
    if (/*getBrowser() != "IE" && */el.value.length >= 8){
    	if(el.value.length >= 8) {
    		el.value = el.value.replace(/(\d\d\d\d)(\d\d)(\d\d)/g, '$1-$2-$3');
    		var isDate = dateValidate(el.value);
    		if(!isDate){
    			//console.log(msg_com_common0031);
    			//alert(msg_com_common0020);
    			el.value = "";
    		}
    	}
    	if(el.value.length > 10) el.value = el.value.substring(0, el.value.length-1);
    }
}

function generateDateFormatInputTextLength(el){
    if (el.value.length < 8){
    	//alert(msg_com_common0020);
		el.value = "";
    }
}

function getBrowser(){
	if (navigator.userAgent.search("MSIE") >= 0) {
	    return "IE";
	}else if (navigator.userAgent.search("Chrome") >= 0) {
	    return "CR";
	}else if (navigator.userAgent.search("Firefox") >= 0) {
	    return "FF";
	}else if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
	    return "SF";
	}else if (navigator.userAgent.search("Opera") >= 0) {
	    return "OP";
	}
}

function isMobile(){
	/*console.log(navigator.platform.toLowerCase());
	var filter = "win16|win32|win64|mac";
	if(navigator.platform){
		if(0 > filter.indexOf(navigator.platform.toLowerCase())){
			return true;
		}else{
			return false;
		}
	}*/
	var isMobile = false;
	var mobileArr = new Array("iPhone", "iPod", "BlackBerry", "Android", "Windows CE", "LG", "MOT", "SAMSUNG", "SonyEricsson");
	for(var txt in mobileArr){
	    if(navigator.userAgent.match(mobileArr[txt]) != null){
	    	isMobile = true;
	        break;
	    }
	}
	
	return isMobile;
}

function trimInputDatas(attr){
	/*$(":"+attr).each(function(index){
		console.log($(this));
        //console.log("this",$(this).val());//1.
        //console.log("text eq",$(":text").eq(index).val());//2.
    });*/
	$("input[type="+attr+"]").each(function(index, item){
		//console.log("before trim : "+$(item).val());
		//console.log($(item).val($.trim($(item).val())));
		//console.log("after trim : "+$(item).val());
		$(item).val($.trim($(item).val()));
	});
}

/**
 * 첨부파일 다운로드 공통함수
 * @author 유현돈
 * @param division : 첨부파일 구분(ex. 공지사항 or Q&A or ...), attachNo : 첨부파일 PK
 */
function iframeDownload(division, attachNo){
	if($("#attachDownloadFrame").attr("src") == undefined){
		$("body").append("<iframe id=\"attachDownloadFrame\" width=\"0\" height=\"0\" style=\"display: none;\"></iframe>");
	}
	
	/*$("#attachDownloadFrame").on("load", function(e){
		e.preventDefault();
		if(attachList != undefined && attachList.length > 0){
			attachIdx++;
			console.log(attachIdx+"=="+(attachList.length-1));
			if(attachIdx < (attachList.length-1)){
				var attachInfoSplit = attachList[attachIdx].split("/");
				setTimeout(function() {iframeDownload(attachInfoSplit[0], attachInfoSplit[1])}, 500);
			}else{
				attachIdx = 0;
				attachList = undefined;
			}
		}
		
    });*/
	$("#attachDownloadFrame").attr("src", "/attach/download/"+division+"/"+attachNo);
	setTimeout(function() {$("#attachDownloadFrame").unbind("load");$("#attachDownloadFrame").remove();}, 200);
	setTimeout(function() {
		if(attachList != undefined && attachList.length > 0){
			attachIdx++;
			console.log(attachIdx+"=="+(attachList.length-1));
			if(attachIdx < (attachList.length-1)){
				var attachInfoSplit = attachList[attachIdx].split("/");
				setTimeout(function() {iframeDownload(attachInfoSplit[0], attachInfoSplit[1])}, 500);
			}else{
				attachIdx = 0;
				attachList = undefined;
			}
		}
	}, 500);
}

var attachIdx = 0;
var attachList;

function iframeDownloadAll(attachInfoStr){
	console.log(attachInfoStr);
	attachList = attachInfoStr.split(";;");
	var attachInfoSplit = attachList[0].split("/");
	iframeDownload(attachInfoSplit[0], attachInfoSplit[1]);
}

function nullableJsonDataValidate(target, dataKeyName, defaultValue){
	return (target==undefined||target==null||target=="null"||target==""?defaultValue:(target[dataKeyName]));
}

function cloneObject(obj){
	//return Object.assign({}, obj);
	var clone = {};
	for(var i in obj){
		if(typeof(obj[i]) == "object" && obj[i] != null){
			clone[i] = cloneObject(obj[i]);
		}else{
			clone[i] = obj[i];
		}
	}
	return clone;
}
