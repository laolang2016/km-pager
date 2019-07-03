$(function () {
    console.log('km pager');
    var pageOne = $('#page-one').kmPager({
        pageSize: 10,
        dataTotal: 256,
        pageCurr: 1,
        // pageShow: 7,
        onPage : function (n) {
            console.log(n);
        }
    });

    pageOne.kmPager('jump',1);

    var pageTwo = $('#page-two').kmPager({
        pageSize: 10,
        dataTotal: 256,
        pageCurr: 12,
        // pageShow: 7,
        onPage : function (n) {
            console.log(n);
        }
    });
});