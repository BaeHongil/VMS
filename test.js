// ==UserScript==
// @name        addPack
// @namespace   sugangpack
// @include     http://sugang.knu.ac.kr/*
// @version     1
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// ==/UserScript==

$.noConflict();
jQuery(document).ready(function() {
    var rows = jQuery('[id^=lectPackReqGrid_]');
    rows.each(function(index, item) {
        var item = jQuery(item);
        var subjName = item.find('.subj_nm').text();
        if( subjName === '글로벌리더십1' || subjName === '글로벌리더십2' ) {
            console.log(item);
        }
    })
});

// 수강꾸러미에서 수강신청 버튼 클릭 시
function doAddFromPack2(rowId) {
    Utils.focus('search_subj_class_cde');
    // var rowId  = lectPackReqGrid.getSelectedRowId();
    var result = requestData( 	'procLectPackReqForInpt',
        {
            'onlineLectReq.open_yr_trm': '',
            // 자동입력방지
            //'onlineLectReq.captcha_cde': Utils.getFieldValue( 'captcha_cde' ),
            'onlineLectReq.subj_cde': lectPackReqGrid.getValue( rowId, 'subj_cde' ),
            'onlineLectReq.sub_class_cde': lectPackReqGrid.getValue( rowId, 'sub_class_cde' ),
            'onlineLectReq.subj_div_cde': lectPackReqGrid.getValue( rowId, 'subj_div_cde' ),
            'onlineLectReq.lect_req_div_cde': '',
            'onlineLectReq.lect_req_sts_cde': '',
            'onlineLectReq.stu_nbr': '',
            'onlineLectReq.strt_stu_nbr_yr': '',
            'onlineLectReq.div': ''
        },
        function( fieldName ) {
            Utils.focus( 'captcha_cde');
        });
    if ( result == null ) {
        return false;
    }
    if ( result.substr(0, 1) == '0' ) {
        //저장 후 메시지를 서버에서 받음.. (2012.12.6)
        if ( result.substr(1) == '' || result.substr(1) == null ) {

            alert('다시  신청하세요.');



        } else {
            alert( result.substr(1) );
        }
        doInitOnlineLectCourseGrid();
        doLoadOnlineLectReqGrid();
        doLoadLectPackReqGrid();
        Utils.focus('search_subj_class_cde');
    }else if ( result.substr(0, 3) == '111' || result.substr(0, 3) == '132' ) {
        alert( result.substr(3) );
        location.reload();
        return ;
    }else if ( result.substr(0, 1) != '0' ) {
        alert ( result.substr(3) );
        doInitOnlineLectCourseGrid();
        //2016.2.16(추가)
        doLoadLectPackReqGrid();

        window.focus();
        return ;
    } else if ( result.substr(0, 3) == '***' ) {
        alert ( result.substr(3) );
        doInitOnlineLectCourseGrid();
    }
    Utils.focus('search_subj_class_cde');
}