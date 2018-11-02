var cards = [];
var suits = ['h', 's', 'c', 'd'];
var displays = {
    n1: 'A',
    n2: '2',
    n3: '3',
    n4: '4',
    n5: '5',
    n6: '6',
    n7: '7',
    n8: '8',
    n9: '9',
    n10: '10',
    n11: 'J',
    n12: 'Q',
    n13: 'K'
};
var icons = {
    h: '<span class="heart"></span>',
    s: '<span class="spade"></span>',
    c: '<span class="clubs"></span>',
    d: '<span class="diamond"></span>'
};

var availableLocations = {};

var lastLocation = {};
var movingCard = false;
var activeCard = {};

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
function cardContents(n, s) {
    var htmls = '<p>' + displays['n' + n] + '</p><hr/><h2>' + s.toUpperCase() + '</h2>';
    
    return htmls;
}

document.addEventListener('mousedown', function(e) {
    if (e.target.className.indexOf('cd') > -1 && !e.target.data.f) {
        movingCard = true;
        activeCard = e.target;
        lastLocation = e.target.parentNode;
    } else {
        movingCard = false;
        activeCard.style = '';
    }
});

document.addEventListener('hover', function(e) {
    if (movingCard && e.target.className.indexOf('cd') > -1 && !e.target.data.f) {
        window.console.log(e)
    }
});

document.addEventListener('mouseup', function(e) {
    var lastPosX = e.clientX;
    var lastPosY = e.clientY;
    if (movingCard) {
        var movingSuit = activeCard.data.s;
        var movingNum = activeCard.data.n;
        var movingColor = activeCard.data.colr;
        var accepters = document.getElementsByClassName('a');
        for (var a = 0; a < accepters.length; a++) {
            var accepter = accepters[a];
            var aX0 = accepter.offsetLeft;
            var aX1 = accepter.offsetLeft + accepter.offsetWidth;
            var aY0 = accepter.offsetTop;
            var aY1 = accepter.offsetTop + accepter.offsetH;

            var aN = accepter.data.n;
            var aS = accepter.data.s;
            var aC = accepter.data.colr;

            if (accepter.parentNode.className.indexOf('stack') > -1) {


                accepter.parentNode.appendChild(activeCard);
                flipOver(lastLocation.children[lastLocation.children.length - 1]);
                break;
            }



        }
    }
    movingCard = false;
    activeCard.style = '';
});

document.addEventListener('mousemove', function(e) {
    if (movingCard) {
        var left = e.clientX - 30;
        var top = e.clientY + 15;
        activeCard.style = 'position: fixed; left: ' + left + 'px; top: ' + top + 'px';
    }
});

function flipOver(card) {
    card.data.f = false;
    cData = card.data;
    card.className = 'cd ' + cData.s + ' n' +cData.n;
    card.innerHTML = cardContents(cData.n, cData.s);
}

for (var s = 0; s < suits.length; s++) {
    for (var c = 1; c < 14; c++) {
        cards.push({
            suit: suits[s],
            num: c
        });
    }
}

cards = shuffle(cards);


for (var i = 0; i < cards.length; i++) {
    var cardHTML = document.createElement("div");
    cardHTML.className = "cd f";
    cardHTML.data = {
        's': cards[i].suit,
        'n': cards[i].num,
        'colr': cards[i].suit === 'd' || cards[i].suit === 'h' ? 'r' : 'b',
        'folded': true
    };
    document.getElementById('refuse').appendChild(cardHTML);
}

var refuseCards = document.getElementById('refuse').children;
var maxStack = 0;
var nextStack = 2;
var delay = 1;
for (var r = 0; r < 29; r++) {
    setTimeout(function() {
        var sortoCard = refuseCards[refuseCards.length - 1];
        maxStack++;
        if (maxStack === 8) {
            maxStack = nextStack;
            nextStack++;
        }
        if (nextStack < 9) {
            var stack = document.getElementById('stack' + maxStack);
            stack.appendChild(sortoCard);
            if (Number(stack.getAttribute('data-max')) == stack.children.length) {
                flipOver(sortoCard);
                sortoCard.data.accepting = true;
                sortoCard.className = sortoCard.className + ' a';
            }
        }
    }, delay * 20);
    delay++;
}
