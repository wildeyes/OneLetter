var sound,
    assets = {loading: './assets/loading.gif',play:'./assets/play.png'},
    onelet = angular.module('onelet',[]),
    url = 'http://apifree.forvo.com/key/6fe79f82a9b76cec818979a08e29112c/format/json/callback/pronounce/action/standard-pronunciation/word/',
    active = false,
    activelang;

function mainCtrl ($scope, $http) {
    langlist = 'Arabic – ar, Bulgarian – bg, Czech – cs, Danish – da, German – de, Greek – el, English – en, Spanish – es, Estonian – et, Farsi – fa, Finnish – fi, French – fr, Hebrew – he, Croatian – hr, Hungarian – hu, Indonesian – id, Icelandic – is, Italian – it, Korean – ko, Lithuanian – lt, Latvian – lv, Macedonian – mk, Malay – ms, Dutch – nl, Norwegian – no, Polish – pl, Portuguese – pt, Portuguese Brazilian – pt-br, Romanian – ro, Russian – ru, Slovak – sk, Slovenian – sl, Albanian – sq, Serbian Cyrillic – sr-Cyrl, Serbian Latin – sr-Latn, Swedish – sv, Turkish – tr, Ukrainian – uk, Simplified Chinese – zh-CN';

    ll = langlist.split(',');
    for ( i = 0; i < ll.length; i += 1) {
        tmp = ll[i].split(' – ');
        ll[i] = {value:tmp[1],text:tmp[0]};
    }
    $scope.langs = ll;
    $scope.selectedLang = localStorage['lang'] || 'en';

    $scope.$watch('selectedLang', function() {
        lang = $scope.selectedLang
        loadlang($http,$scope,lang);
        localStorage['lang'] = lang
    }, true);

    $scope.currentPage = 0
    $scope.pageSize = 15
    $scope.data = []
    $scope.reset = function () {
        $scope.currentPage = 0;
    }
    $scope.numberOfPages = function () {
        return Math.ceil($scope.data.length/$scope.pageSize);
    }

    function loadlang($http,$scope,lang) {
        path = 'dicts/' + lang;
        $http.get(path).success(function(data) {
            $scope.data = data;
        }).error(function (err) {
            console.log(err);
        });
    }
    $scope.cachedRange = null;
    $scope.range = function(min, max, step){
        if ($scope.cachedRange && $scope.cachedRange.min == min && $scope.cachedRange.max == max) return $scope.cachedRange
        step = (step === undefined) ? 1 : step;
        var input = [];
        for (var i=min; i<= max; i += step) input.push(i);
        if ($scope.cachedRange == null)
            $scope.cachedRange = {'min':min,'max':max,'step':step,'arr':input}
  };
}
onelet.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});

function playClip(img, word) {
    if(active)
        return;
    active = true;
    lang = "en";//, lang = $('#language').val().split(' – ')[1] || "en";
    urlz = url + encodeURI(word)+'/language/' + lang;

    img.src = assets.loading;

    $.ajax({
        url: urlz,
        jsonpCallback: "pronounce",
        dataType: "jsonp",
        type: "jsonp",
        success: function (json) {
            var mp3 = json.items[0].pathmp3;
            var ogg = json.items[0].pathogg;
            //sound.stop();
            sound = new Audio();

            if(sound.canPlayType('audio/ogg'))
                sound.src = ogg;
            else if(sound.canPlayType('audio/mpeg'))
                sound.src = mp3;
            else
                sound.src = null;
            if(sound.src) {
                sound.load();
                //TODO: Add Loading sign?
                sound.addEventListener('canplay', function() {
                    img.src = assets.play;
                    sound.play();
                    active = false;
                });
            }
   },
    error: function(){
        console.log("error");
    }});
}


/*
#From :http://invokeit.wordpress.com/frequency-word-lists/
#Gen with:
    - $("td:nth-child(1) strong").each(function() { console.log($(this).text() + "\n"); });
    - $("td:nth-child(2) a").each(function() { console.log($(this).attr('href') + "\n"); });
# oh shoot, have to download manually ^- doesn't work! cmdfu: unzip ‘*.zip’
#Cut to first 5000 with (in dir)
    - for file in ./*; do head -5000 $file > ${file}.less; done
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>
    <script>!window.jQuery && document.write('<script src="js/jquery-1.10.1.min.js"><\/script>')</script>
*/