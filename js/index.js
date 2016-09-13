//制作轮播图
$(function(){
    //固定导航
        function fixed(){
            var topHeight = $('.topbar').height();
            $(window).scroll(function(){
                var scrollTop = $(this).scrollTop();
                if(scrollTop>topHeight){
                    $('.nav').addClass('fixed');
                    $('section').css({marginTop:'80px'})
                }else{
                    $('.nav').removeClass('fixed');
                    $('section').css({marginTop:'0'})
                }
            })
        }

    fixed();


    //蒙版显示头像
    function mask(){
        var $picMask = $('.picMask'),$picShow = $('.picShow');
        $('.topbar .setPic').on('click',function(){
            document.body.style.overflow = 'hidden';
            $picMask.fadeIn();
            $picShow.fadeIn();

        })
        ///蒙版按关闭按钮关闭
        $('.picShow .closeBtn').on("click",function(){
            $picMask.fadeOut();
            $picShow.fadeOut();
            document.body.style.overflow = 'visible';

        })
    }
   mask();

    //点击changeReact中的li，点击的加上active 类名
    function addActive(){
        $('.changeReact li').on("click",function(){
            $(this).addClass('active').siblings().removeClass('active');
            var $index = $(this).index();
            $('.showReact li').eq($index).addClass('active').siblings().removeClass('active');
        });
    }
    addActive();

    //点击选择图片可以换图片做头像

    //var cvs1 = document.getElementById("cvs1");
    function changeTitle(){
        var backgroundCanvas = document.getElementById('background');
        var selectorCanvas = document.getElementById('selector');
        var previewCanvas = document.getElementById('preview');
        var imgElem = document.getElementById('imgElem');
        var imgSmall = document.getElementById('imgSmall');
        var imageData;
        function hideSelf(){
            $(this).css({
                display:'none'
            })
        }
        function getImage(cvs) {
            var ctx = cvs.getContext('2d');

            // 文件上传控件
            var fileInput = document.getElementById('file');

            // 用户选择文件之后，会发生change事件，监听这个事件
            fileInput.addEventListener('change', function () {
                ctx.clearRect(0, 0, 300, 300);
                backgroundCanvas.style.display = 'block';
                selectorCanvas.style.display = 'block';
                //$('.showContainer span').html("");
                $('.addPic').css({
                    'left':0,
                    "top":270,
                    "display":"block",
                    "z-index":99
                })
                $('#clickButton').val('重新上传')
                var imageFile = fileInput.files[0];

                // 用于把file对象转换成一个当前页面里可以使用的url。记住就行。
                var url = URL.createObjectURL(imageFile);

                var img = new Image();
                img.src = url;
                img.addEventListener('load', function () {
                    // 图像加载之后执行：使图像正好占满屏幕又不改变缩放的大小
                    var w = img.width;
                    var h = img.height;
                    var scaleX = 300 / w;
                    var scaleY = 300 / h;
                    var scale = scaleX < scaleY ? scaleX : scaleY;

                    ctx.save();
                    ctx.translate(150, 150);
                    ctx.scale(scale, scale); // 对坐标系进行缩放
                    ctx.drawImage(img, -w / 2, -h / 2);

                    ctx.restore();
                })
            });
        }
        getImage(backgroundCanvas);

        function selectSquare(selectorCanvas, previewCanvas, backgroundCanvas) {
            var ctx = selectorCanvas.getContext('2d');
            var selector = {
                x: 0,
                y: 0,
                l: 0, // 因为是正方形，所以没有长宽，只有边长
                dragX: 0,
                dragY: 0,
                draw: function () {
                    ctx.save();
                    ctx.fillStyle = 'rgba(0,0,0,0.5)'; // 半透明的黑色
                    ctx.clearRect(0, 0, 300, 300);
                    ctx.fillRect(0, 0, 300, 300);
                    ctx.clearRect(this.x, this.y, this.l, this.l);
                    ctx.restore();
                }
            };

            var state = '闲置';


            function preview() {
                $('.showContainer span').html("");
                var ctxPreview = previewCanvas.getContext('2d');
                ctxPreview.clearRect(0, 0, 300, 300);
                ctxPreview.drawImage(backgroundCanvas,
                    selector.x, selector.y, selector.l, selector.l,
                    0, 0, 100, 100);
                /*
                 toDataURL()方法
                 此函数，返回一张使用canvas绘制的图片，返回值符合data:URL格式，格式如下：
                 url = canvas . toDataURL( [ type, ... ])
                 规范规定，在未指定返回图片类型时，返回的图片格式必须为PNG格式，
                 type的可以在image/png，image/jpeg,image/svg+xml等 MIME类型中选择。
                 如果是image/jpeg，可以有第二个参数，如果第二个参数的值在0-1之间，则表示JPEG的质量等级，否则使用浏览器内置默认质量等级。
                 */
                var dataurl = previewCanvas.toDataURL('image/jpeg', 0.5);
                imgElem.src = dataurl;
                imgSmall.src = dataurl;
            }
            function small() {
                var ctxSmall = previewCanvas.getContext('2d');
                ctxSmall.clearRect(0, 0, 300, 300);
                ctxSmall.drawImage(backgroundCanvas,
                    selector.x, selector.y, selector.l, selector.l,
                    0, 0, 50, 50);
                /*
                 toDataURL()方法
                 此函数，返回一张使用canvas绘制的图片，返回值符合data:URL格式，格式如下：
                 url = canvas . toDataURL( [ type, ... ])
                 规范规定，在未指定返回图片类型时，返回的图片格式必须为PNG格式，
                 type的可以在image/png，image/jpeg,image/svg+xml等 MIME类型中选择。
                 如果是image/jpeg，可以有第二个参数，如果第二个参数的值在0-1之间，则表示JPEG的质量等级，否则使用浏览器内置默认质量等级。
                 */
                //var dataurl = ctxSmall.toDataURL('image/jpeg', 0.5);
                //imgElem.src = dataurl;
            }

            selectorCanvas.addEventListener('mousedown', function (evt) {
                var x = evt.offsetX;
                var y = evt.offsetY;
                if (state == '闲置') {
                    selector.x = x;
                    selector.y = y;
                    state = '选择中'
                } else if (state == '选择结束') {
                    // 判断鼠标是不是点在选择器里面
                    ctx.beginPath();
                    //ctx.scale(0.5,0.5);
                    ctx.rect(selector.x, selector.y, selector.l, selector.l);
                    var inPath = ctx.isPointInPath(x, y);

                    if (inPath) { // 如果鼠标点在选择器里面,则开始准备拖动
                        selector.dragX = x;
                        selector.dragY = y;
                        state = "拖动中";
                    } else { // 如果鼠标点在选择器外面则清空屏幕，让选择器恢复闲置状态
                        ctx.clearRect(0, 0, 300, 300);
                        state = "闲置";
                    }
                }
            });
            selectorCanvas.addEventListener('mousemove', function (evt) {
                evt.preventDefault(); // 阻止浏览器的默认行为
                var x = evt.offsetX;
                var y = evt.offsetY;
                if (state == '选择中') {
                    var w = x - selector.x;
                    var h = y - selector.y;
                    selector.l = w > h ? w : h;
                    selector.draw();
                } else if (state == '拖动中') {
                    // 得到拖动过程中，“两帧之间”鼠标移动的距离
                    var moveX = x - selector.dragX;
                    var moveY = y - selector.dragY;
                    // 根据移动的距离改变选择器的位置
                    selector.x = selector.x + moveX;
                    selector.y = selector.y + moveY;

                    selector.draw();
                    // 记录这一帧时鼠标的位置
                    selector.dragX = x;
                    selector.dragY = y;
                }

            });
            selectorCanvas.addEventListener('mouseup', function (evt) {
                var x = evt.offsetX;
                var y = evt.offsetY;
                if (state == '选择中') {
                    var w = x - selector.x;
                    var h = y - selector.y;
                    selector.l = w > h ? w : h;
                    selector.draw();
                    state = '选择结束'
                    preview();
                    //small();
                } else if (state == '拖动中') {
                    // 拖动结束之后，重置状态到选择结束
                    state = '选择结束';
                    preview();
                    //small();
                }
            });

            //setInterval(function(){
            //    //console.log(state)
            //},100)
        }
        selectSquare(selectorCanvas, previewCanvas, backgroundCanvas);
        //点击确定按钮，图片中的地址换成本地的
        var finalSrc;
        $('.sure').on('click', function () {
            var imgSmall = document.getElementById('imgSmall');
            finalSrc =  imgSmall.src;
            console.log(finalSrc);
            $('.picShow').fadeOut();
            $('.picMask').fadeOut();
            document.body.style.overflow = 'visible';
            var finalChoice = document.getElementById('finalChoice');
            finalChoice.src = finalSrc;
        })
        $('.cancel').on('click', function () {
            $('.picShow').fadeOut();
            $('.picMask').fadeOut();
            document.body.style.overflow = 'visible';
        })
    }

    changeTitle()

    //按住头像设置可以在document中移动
    function bodyMove(moveTitle,moveBody){
        moveTitle.on('mousedown',function(e){
            var pageX = e.pageX;
            var pageY = e.pageY;
            var offsetX = moveBody.offset().left;
            var offsetY = moveBody.offset().top;
            var spaceX = pageX - offsetX;
            var spaceY = pageY - offsetY;
            $("body").on('mousemove', function (e) {
                var pageX = e.pageX;
                var pageY = e.pageY;
                var left = pageX - spaceX;
                var top = pageY - spaceY;
                moveBody.css({left:left,top:top})
                window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
            })
        })
        $('body').on('mouseup', function () {
            $('body').unbind('mousemove')
        })
    }
    bodyMove($('#title'),$("#picShow"));



    //用原生js实现
    //var title = document.getElementById("title");
    //var picShow = document.getElementById("picShow");//拖动条
    ////在拖动条上 按下鼠标 之后 移动鼠标 盒子会跟着鼠标
    //title.onmousedown = function (event) {
    //    var event = event || window.event;
    //    var pageX = event.pageX || event.clientX + document.documentElement.scrollLeft;
    //    var pageY = event.pageY || event.clientY + document.documentElement.scrollTop;
    //    //计算鼠标在拖动条中的位置
    //    var spaceX = pageX - picShow.offsetLeft;
    //    var spaceY = pageY - picShow.offsetTop;
    //    //鼠标在页面上移动 就要让盒子跟着
    //    document.onmousemove = function (event) {
    //        //获取鼠标在页面上的位置 设置 盒子的位置
    //        var event = event || window.event;
    //        var pageX = event.pageX || event.clientX + document.documentElement.scrollLeft;
    //        var pageY = event.pageY || event.clientY + document.documentElement.scrollTop;
    //        //设置盒子的位置
    //        picShow.style.left = pageX - spaceX + "px";
    //        picShow.style.top = pageY - spaceY + "px";
    //        //防止选中文字
    //        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
    //    }
    //}
    ////鼠标在页面上任何位置 只要弹起来 就把 让盒子跟着鼠标移动的事件清空
    //document.onmouseup = function () {
    //    document.onmousemove = null;
    //}

    //大图轮播图
    //放入显示。离开不显示
    function slider(){
        var index= 0,wPic = $('.v').width(),length,timer=null,key=0;
        $('.v').hover(function(){
            $('.smallPics').stop().fadeIn();
            clearInterval(timer);

        },function(){
            $('.smallPics').stop().fadeOut();
            timer = setInterval(bigMove,2000);
        })
        //大图轮播

        $('.wrap a:first').clone().appendTo('.wrap');
        function bigMove(){
            clearInterval(timer);
            length = $('.wrap a').length-1;
            if(index === length){
                $('.wrap').css("left",0);
                index = 0;
            }
            index++;
            $('.wrap').stop().animate({
                "left":-index*wPic+'px'
            });
        }
        timer = setInterval(bigMove,2000);
        //小图跟随
        $('.smallPics li').on("mouseenter",function(){
            clearInterval(timer);
            key = $(this).index();
            $('.wrap').stop().animate({left:-key*710});
            clearInterval(timer)

        }).on("mouseleave",function(){
            //clearInterval(timer)
            key = $(this).index();
            index = key-1;
            timer = setInterval(bigMove,2000);
        })
    }

    slider();

    //字体滚动
    $('.block p').slideDown(4000);


    //sec中的每一张图鼠标移入都会出现边框
    $('.sec').on("mouseenter","li",function(){
        $(this).find('.cover').css('display','block');
    })
    $('.sec').on("mouseleave","li",function(){
        $(this).find('.cover').css('display','none');
    })


//悟悟中移动
    function removeWhitespace(xml) {
        var loopIndex;

        for (loopIndex = 0; loopIndex < xml.childNodes.length; loopIndex++){
            var currentNode = xml.childNodes[loopIndex];
            if (currentNode.nodeType == 1){
                removeWhitespace(currentNode);
            }

            if (((/^\s+$/.test(currentNode.nodeValue))) && (currentNode.nodeType == 3)){
                xml.removeChild(xml.childNodes[loopIndex--]);
            }
        }
    }
    var ulObj = document.getElementById('msg');
    removeWhitespace(ulObj);
    var firstLi = ulObj.firstChild;
    var firstLiHeight = firstLi.offsetHeight;

    ulObj.style.top = - firstLiHeight -0 + 'px';
    var h = parseInt(ulObj.style.top);
    var n = h;
    function tw() {
        n = n + Math.abs(h / 100);

        if(n <= 0) {
            ulObj.style.top = n + 'px';
            window.setTimeout(arguments.callee,30);
        } else {
            firstLi = ulObj.lastChild.cloneNode(true);
            ulObj.removeChild(ulObj.lastChild);
            ulObj.insertBefore(firstLi,ulObj.firstChild);
            firstLiHeight = firstLi.offsetHeight;
            ulObj.style.top = - firstLiHeight -0 + 'px';
            h = parseInt(ulObj.style.top);
            n = h;
            window.setTimeout(arguments.callee,5000);
        }

    }
    tw();


})
