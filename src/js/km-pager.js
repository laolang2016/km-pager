;(function ($, window, document, undefined) {


    /**
     * 插件的私有方法
     * 初始化
     * @param jq jquery 对象，和你使用$('#one')获得的对象是一样的
     */
    function init(jq) {
        // 检查参数
        checkConfig(jq);
        // 修正 pageShow
        fixPageShow(jq);
        // 创建html结构
        initStruct(jq);
        // 绑定事件
        initClick(jq);
    }

    /**
     * 检查参数
     * @param jq
     */
    function checkConfig(jq) {
        var config = jq.config;
        if (null == config.pageSize || null == config.dataTotal || null == config.pageShow) {
            throw "pageSize , dataTotal , pageShow 必填";
        }
    }

    /**
     * 修正 pageShow
     * @param jq
     */
    function fixPageShow(jq) {
        var config = jq.config;
        var pageTotal = getPageTotal(jq);
        var realPageShow = config.dataTotal / config.pageSize;
        if (config.dataTotal % config.pageSize > 0) {
            realPageShow++;
        }

        if (realPageShow < config.pageShow) {
            config.pageShow = realPageShow;
        }
    }

    function initStruct(jq) {
        var config = jq.config;
        var div = jq.get(0);
        var ul = $('<ul>');
        // 首页 上一页
        var $liFirst = buildLi(config.lang.firstPageText);
        var $liPrev = buildLi(config.lang.prePageText);
        if (1 === config.pageCurr) {
            $liFirst.attr('class', 'km-pager-disabled');
            $liPrev.attr('class', 'km-pager-disabled');
        }
        ul.append($liFirst.get(0));
        ul.append($liPrev.get(0));


        var pagelist = getCurrPagelist(jq);
        // 页码
        for (var i = 0; i < pagelist.length; i++) {
            var $li = buildLi(pagelist[i]);
            if (pagelist[i] === config.pageCurr) {
                $li.attr('class', 'km-pager-curr');
            }
            ul.append($li.get(0));
        }

        var pageTotal = getPageTotal(jq);
        // 下一页 尾页
        var $liNext = buildLi(config.lang.nextPageText);
        var $liLast = buildLi(config.lang.lastPageText);
        if (pageTotal === config.pageCurr) {
            $liNext.attr('class', 'km-pager-disabled');
            $liLast.attr('class', 'km-pager-disabled');
        }
        ul.append($liNext.get(0));
        ul.append($liLast.get(0));

        div.append(ul.get(0));

    }

    /**
     * 创建li标签
     * @param text
     * @returns {*|jQuery|HTMLElement}
     */
    function buildLi(text) {
        var li = $('<li>');
        li.append(
            $('<a>')
                .attr('href', 'javascript:void(0);')
                .text(text)
                .get(0)
        );
        return li;
    }

    /**
     * 计算总页数
     * @param jq
     * @returns {number}
     */
    function getPageTotal(jq) {
        var total = jq.config.dataTotal;
        var size = jq.config.pageSize;
        var remainder = total % size;
        var pageTotal = (total - remainder) / size;
        if (remainder > 0) {
            pageTotal++;
        }
        return pageTotal;
    }

    /**
     * 计算当前页码数组
     * @param jq
     * @returns {Array}
     */
    function getCurrPagelist(jq) {
        var pageTotal = getPageTotal(jq);
        var pageShow = jq.config.pageShow;
        var halfSize = parseInt(jq.config.pageShow / 2);
        var curr = jq.config.pageCurr;

        var start = 1;

        // 计算开视页
        // 显示页数为偶数
        if (0 === pageShow % 2) {
            if (curr > halfSize) {
                start = curr - halfSize + 1;
            }
        } else {
            // 显示页数为奇数
            if (curr > halfSize + 1) {
                start = curr - halfSize;
            }
        }

        // 修正开视页
        if (start + pageShow - 1 > pageTotal) {
            start = start - (start + pageShow - 1 - pageTotal);
        }

        // 计算开始页
        var end = start + pageShow - 1;
        // 修正开始页
        if (end > pageTotal) {
            end = pageTotal;
        }

        // 显示的页码列表
        var pageArray = [];
        for (var i = start; i <= end; i++) {
            pageArray.push(i);
        }
        return pageArray;
    }

    /**
     * 单击
     * @param jq
     */
    function initClick(jq) {
        var ul = jq.children('ul');
        var pageShow = jq.config.pageShow;
        pageShow = parseInt(pageShow);
        var pageTotal = getPageTotal(jq);
        var pageList = getCurrPagelist(jq);
        ul.children('li').each(function (index) {
            var curr = parseInt(index);
            $(this).on('click', function () {
                // 首页
                if (0 === curr) {
                    jq.config.onPage(1);
                } else if (1 === curr) {
                    // 上一页
                    jq.config.onPage(pageList[0] - 1);
                } else if (curr === (pageShow + 2)) {
                    // 下一页
                    jq.config.onPage(pageList[pageList.length - 1] + 1);
                } else if (curr === (pageShow + 3)) {
                    // 尾页
                    jq.config.onPage(pageTotal);
                } else {
                    // 页码
                    if( pageList[curr - 2] !== jq.config.pageCurr ){
                        jq.config.onPage(pageList[curr - 2]);
                    }else{
                        //console.log('当前页');
                    }

                }
            });
        });

    }

    function _jump(jq,n){
        console.log('jump');
        jq.config.onPage(n);
    }

    /**
     * 插件实现代码
     * @param options 如果是json对象，则创建[初始化]插件，如果是字符串，则用来调用插件的公开方法
     * @param param 当前options是字符串时，代表传递给插件公开方法的参数。当然，你可以不传
     * @returns {*}
     */
    $.fn.kmPager = function (options, param) {
        // 如果是方法调用
        if (typeof options === 'string') {
            return $.fn.kmPager.methods[options](this, param);
        }

        // 获得配置，这里为了得到用户的配置项，覆盖默认配置项，并保存到当前jquery插件实例中
        var _opts = $.extend({}, $.fn.kmPager.defaults, options);
        var jq = this;
        jq.config = _opts;

        // 链式调用
        return this.each(function () {
            // console.log(this);
            // 调用私有方法，初始化插件
            init(jq);
        });
    };


    /**
     * 插件的公开方法
     */
    $.fn.kmPager.methods = {
        /**
         * 跳转到某一页
         * @param jq
         * @param n
         * @returns {Array|Object|*}
         */
        jump: function(jq,n){
            return jq.each(function () {
                _jump(jq,n);
            });
        },
        options: function (jq) {
            // 这个就不需要支持链式调用了
            return jq.config;
        }
    };


    /**
     * 插件的默认配置
     */
    $.fn.kmPager.defaults = {
        /**
         * 每一页多少条数据
         */
        pageSize: null,
        /**
         * 公多少条数据
         */
        dataTotal: null,
        /**
         * 当前页
         */
        pageCurr: null,
        /**
         * 显示多少个分页页码
         */
        pageShow: 10,

        lang:{
            firstPageText			: '首页',
            lastPageText			: '尾页',
            prePageText				: '上一页',
            nextPageText			: '下一页',
        },

        /**
         * 单击页码时调用
         * @param n 当前页码
         */
        onPage: function (n) {

        }
    };
})(jQuery, window, document);