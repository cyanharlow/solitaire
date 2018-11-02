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
var multiCards = [];

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function cardContents(n, s) {
    return '<p>' + displays['n' + n] + '</p><hr/><h2>' + s.toUpperCase() + '</h2>';
}

document.addEventListener('mousedown', function(e) {
    if (e.target.className.indexOf('cd') > -1 && !e.target.data.folded) {
        movingCard = true;
        activeCard = e.target;
        lastLocation = e.target.parentNode;
        
    } else {
        movingCard = false;
        activeCard.style = '';
    }
});

document.addEventListener('click', function(e) {
    if (e.target.className.indexOf('cd f') > -1 && e.target.parentNode.className.indexOf('refuse') > -1 ) {
        if (e.target.nextElementSibling) {
            tuck(e.target.nextElementSibling);
        }
        if (e.target.nextElementSibling == null) {
            reveal(e.target);
        }
    }
});

document.addEventListener('mouseup', function(e) {
    var lastPosX = e.pageX
    var lastPosY = e.pageY;

    var successfulMove = false;
    if (movingCard) {
        var movingSuit = activeCard.data.s;
        var movingNum = activeCard.data.n;
        var movingColor = activeCard.data.colr;
        var accepters = document.getElementsByClassName('a');
        for (var ac = 0; ac < accepters.length; ac++) {
            var accepter = accepters[ac];
            if (accepter.data && accepter.data.id == activeCard.data.id) {
                continue;
            }

            var aX0 = accepter.offsetLeft;
            var aX1 = accepter.offsetLeft + accepter.offsetWidth;
            var aY0 = accepter.offsetTop;
            var aY1 = accepter.offsetTop + accepter.offsetHeight;            

            var isStack = accepter.className.indexOf('stack') > -1 && accepter.children.length === 0;
            var isCloset = accepter.className.indexOf('closet') > -1 && accepter.children.length === 0;
            var isStackCard = accepter.parentNode.className.indexOf('stack') > -1;
            var isClosetCard = accepter.parentNode.className.indexOf('closet') > -1 ;


            if (lastPosX >= aX0 && lastPosX <= aX1 && lastPosY >= aY0 && lastPosY <= aY1) {
                if (isStack) {
                    if (movingNum === 13) {
                        accepter.className = accepter.className.replace(' a', '');
                        accepter.appendChild(activeCard);
                        reveal(activeCard, true);
                        while (multiCards.length) {
                            reveal(activeCard, false);
                            multiCards[0].style = '';
                            accepter.appendChild(multiCards[0]);
                            if (multiCards.length === 1) {
                                reveal(multiCards[0], true);
                            }
                            multiCards.shift();
                        }
                        successfulMove = true;
                        break;
                    }
                } else if (isCloset) {
                    var accepterSuit = accepter.getAttribute('data-suit');
                    if (accepterSuit === movingSuit && movingNum === 1 && multiCards.length === 0) {
                        accepter.className = accepter.className.replace(' a', '');
                        accepter.appendChild(activeCard);
                        reveal(activeCard, true);
                        successfulMove = true;
                        break;
                    }
                } else if (isClosetCard) {
                    var accepterSuit = accepter.data.s;
                    var accepterNum = accepter.data.n;
                    if (accepterSuit === movingSuit && accepterNum + 1 === movingNum && multiCards.length === 0) {
                        accepter.className = accepter.className.replace(' a', '');
                        accepter.parentNode.appendChild(activeCard);
                        reveal(activeCard, true);
                        successfulMove = true;
                        break;
                    }
                } else if (isStackCard) {
                    var accepterNum = accepter.data.n;
                    var accepterColor = accepter.data.colr;
                    if (accepterColor !== movingColor && accepterNum - 1 === movingNum) {
                        accepter.className = accepter.className.replace(' a', '');
                        accepter.parentNode.appendChild(activeCard);
                        reveal(activeCard, true);
                        while (multiCards.length) {
                            reveal(activeCard, false);
                            multiCards[0].style = '';
                            accepter.parentNode.appendChild(multiCards[0]);
                            if (multiCards.length === 1) {
                                reveal(multiCards[0], true);
                            }
                            multiCards.shift();
                        }
                        successfulMove = true;
                        break;
                    }
                }
                
            }
        }
    }
    if (successfulMove) {
        if (lastLocation.children.length) {
            reveal(lastLocation.children[lastLocation.children.length - 1], lastLocation.className.indexOf('refuse') > -1 ? false : true);
        } else {
            lastLocation.className = lastLocation.className + ' a';
        }
    } else {
        while (multiCards.length) {
            multiCards[multiCards.length - 1].style = '';
            multiCards.pop();
        }
    }
    movingCard = false;
    activeCard.style = '';
});

document.addEventListener('mousemove', function(e) {
    if (movingCard) {
        var left = e.clientX - 30;
        var top = e.clientY + 15;
        var zIndex = 999999;
        activeCard.style = 'position: fixed; z-index: ' + zIndex + '; left: ' + left + 'px; top: ' + top + 'px';
        var grabberCard = activeCard.nextElementSibling;
        while (activeCard.parentNode.className.indexOf('stack') > -1 && grabberCard !== null) {
            multiCards.push(grabberCard);
            top = top + 10;
            zIndex = zIndex + 100;
            grabberCard.style = 'position: fixed; z-index: ' + zIndex + '; left: ' + left + 'px; top: ' + top + 'px';
            grabberCard = grabberCard.nextElementSibling;
        }
    }    
});

function reveal(card, accepting) {
    card.data.folded = false;
    cData = card.data;
    card.className = 'cd ' + cData.s + ' n' + cData.n + (accepting ? ' a' : '');
    card.innerHTML = cardContents(cData.n, cData.s);
}

function tuck(card) {
    card.data.folded = true;
    card.className = 'cd f';
    card.innerHTML = '';
    card.parentNode.insertBefore(card, card.parentNode.firstChild);
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
        'id': cards[i].suit + cards[i].num,
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
                reveal(sortoCard, true);
            }
        }
    }, delay * 20);
    delay++;
}
