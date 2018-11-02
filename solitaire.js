function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

var lastLocation;
var movingCard = false;
var activeCard = {};

document.addEventListener('mousedown', function(e) {
    if (e.target.className.indexOf('cd') > -1) {
        movingCard = true;
        activeCard = e.target;
        cData = activeCard.data;
        activeCard.className = 'cd ' + cData.s + ' n' +cData.n;
        activeCard.innerHTML = cardContents(cData.n, cData.s);
    } else {
        movingCard = false;
        activeCard.style = '';
    }
});

document.addEventListener('mouseup', function(e) {
    movingCard = false;
    activeCard.style = '';
});

document.addEventListener('mousemove', function(e) {
    if (movingCard) {
        var left = e.clientX - 25;
        var top = e.clientY - 30;
        activeCard.style = 'position: fixed; left: ' + left + 'px; top: ' + top + 'px';
    }
});

var startMove = setInterval(function() {
console.log()
}, 500);

var suits = ['h', 's', 'c', 'd'];
var cards = [];

function cardContents(n, s) {
    var htmls = "";
    if (n < 11) {
        htmls = n + '<hr>';
        for (var i = 1; i < n + 1; i++) {
            htmls += '<i class="n' + i + ' ' + s + '"></i>';
        }
        return htmls;
    } else {
        return "r";
    }
}

for (var s = 0; s < suits.length; s++) {
    for (var c = 1; c < 14; c++) {
        cards.push({
            suit: suits[s],
            num: c
        });
    }
}

for (var i = 0; i < cards.length; i++) {
    var cardHTML = document.createElement("div");
    cardHTML.className = "cd f";
    cardHTML.data = {
        's': cards[i].suit,
        'n': cards[i].num,
        'f': true,
        'l': 'd',
        'm': false
    };
    document.body.appendChild(cardHTML);
}

function activateDrag(e, elem) {
    elem.data.f = false;
    elem.data.m = true;
    elem.className = "cd " + elem.data.s + ' n' + elem.data.n;
    elem.innerHTML = elem.data.n + '<hr/>' + cardContents(elem.data.n, elem.data.s);
    //
    // e.preventDefault();
    // var elem = e.target;

    elem.style.position = 'absolute';
    // calculate the new cursor position:
    var posL = e.clientX;
    var posT = e.clientY;
    // set the element's new position:
    console.log(elem.data)
    //
    // elem.style.top = (elem.offsetTop - posT) + "px";
    // elem.style.left = (elem.offsetLeft - posL) + "px";
    // while (elem.data.m) {
    //
    //     elem.style.top = posT + "px";
    //     elem.style.left = posL + "px";
    // }
}
