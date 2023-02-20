$(document).ready(function(){

    var count = 0;

    setInterval(function(){
        count++;
        count %= 3; // 0 1 2 순환

        $("#swiper .swiper-slide").eq(count).addClass('action').siblings().removeClass('action');
    }, 7000)

    //연혁 천천히 내려가기
    const offset = $(".scroll-2").offset();
    $('.timeline').animate({scrollTop: offset.top}, 25000);
    

})