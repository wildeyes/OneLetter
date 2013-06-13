
var fk='6fe79f82a9b76cec818979a08e29112c', sound, onelet = angular.module('onelet',[]);

function mainCtrl ($scope, $http) {
   $http.get('dicts/en_50K.txt.less').success(function(data) {
    $scope.data = data.split('\n');
  });
}

onelet.filter("emptyifblank", function() {
    return function(object, query) {
        if(!query)
            return {};
        else
            return object;
    };
});

function playClip(res) {
    word = res.split(' ')[0], url = 'get.php';
    $.get(url, function(data) {
        var item = $(data).find("item");

        sound = new Audio();

        if(sound.canPlayType('audio/mpeg'))
            sound.src = item.find('pathmp3').text();
        else if(sound.canPlayType('audio/ogg'))
            sound.src = item.find('pathogg').text();
        else
            sound.src = null;
        if(sound.src) {
            sound.load();
            //TODO: Add Loading sign?
            sound.addEventListener('canplay', function() {
                sound.play();
            });
        }
    }, {url:url});
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