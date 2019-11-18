// Demostration JS
(function ($) {
    var
        $cont = $('#prog'),
        $bar  = $cont.find('.progress'),
        value = 0,
        time  = 0;

    function reset() {
        value = 0;
        $bar.css('height', '0%');
        time = setInterval(function(){
            increment();
        },50)
    }

    function increment() {
        value += 1;
        $bar.css('height', value + '%');
        if (value === 100) {
            clearInterval(time);
            return;
        }
    }
    reset();
}(this.jQuery));