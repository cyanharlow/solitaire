

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
var cards = [];
var lastLocation;
var movingCard = false;
var activeCard = {};

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

document.addEventListener('mousedown', function(e) {
    if (e.target.className.indexOf('cd') > -1 && !e.target.data.f) {
        movingCard = true;
        activeCard = e.target;
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
        var top = e.clientY + 30;
        activeCard.style = 'position: fixed; left: ' + left + 'px; top: ' + top + 'px';
    }
});

function flipOver(card) {
    card.data.f = false;
    cData = card.data;
    card.className = 'cd ' + cData.s + ' n' +cData.n;
    card.innerHTML = cardContents(cData.n, cData.s);
}

function cardContents(n, s) {
    var htmls = displays['n' + n] + '<hr/>';
    if (n < 11) {
        for (var i = 1; i < n + 1; i++) {
            htmls += '<i class="n' + i + ' ' + s + '"></i>';
        }
    } else {
        htmls += 'R';
    }
    return htmls;
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
        'f': true,
        'l': 'd',
        'm': false
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
            }
        }
    }, delay * 20);
    delay++;
}
