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

var lastLocation = {};
var movingCard = false;
var activeCards = [];

var game = {
    steps: 0,
    stacks: {
        stack1: [],
        stack2: [],
        stack3: [],
        stack4: [],
        stack5: [],
        stack6: [],
        stack7: [],
    },
    refuse: [],
    closets: {
        c: [],
        d: [],
        h: [],
        s: []
    }
};

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

window.onhashchange = function() {
    renderBoard();
};

document.addEventListener('mousedown', function(e) {
    if (e.target.className.indexOf('cd') > -1 && !e.target.data.folded) {
        movingCard = true;
        lastLocation = e.target.parentNode;
        activeCards.push(e.target);
        var grabberCard = activeCards[0].nextElementSibling;
        while (lastLocation.id.indexOf('stack') > -1 && grabberCard !== null) {
            activeCards.push(grabberCard);
            grabberCard = grabberCard.nextElementSibling;
        }
    } else if (e.target.className.indexOf('cd f') > -1 && e.target.parentNode.className.indexOf('refuse') > -1 ) {
        movingCard = false;

        if (e.target.nextElementSibling) {
            var thisLast = game.refuse[game.refuse.length - 1];
            thisLast.folded = true;
            game.refuse.pop();
            game.refuse.unshift(thisLast);
        }
        game.refuse[game.refuse.length - 1].folded = false;
        game.steps = game.steps + 1;
        window.history.pushState(game, null, '#step' + game.steps);
        renderBoard();

    } else {
        movingCard = false;
    }
});

document.addEventListener('mousemove', function(e) {
    if (movingCard) {
        var left = e.clientX - 30;
        var top = e.clientY + 15;
        var zIndex = 999999;
        for (var ac = 0; ac < activeCards.length; ac++) {
            activeCards[ac].style = 'position: fixed; z-index: ' + zIndex + '; left: ' + left + 'px; top: ' + top + 'px';
            top = top + 20;
            zIndex = zIndex + 100;
        }
    }
});

document.addEventListener('mouseup', function(e) {
    var lastPosX = e.pageX
    var lastPosY = e.pageY;

    var accepterNode = null;
    var giverNode = lastLocation.id;

    var successfulMove = false;
    if (movingCard) {
        var movingSuit = activeCards[0].data.s;
        var movingNum = activeCards[0].data.n;
        var movingColor = activeCards[0].data.colr;
        var accepters = document.getElementsByClassName('a');
        for (var ac = 0; ac < accepters.length; ac++) {
            var accepter = accepters[ac];
            if (accepter.data && accepter.data.id == activeCards[0].data.id) {
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
                        accepterNode = game.stacks[accepter.id];

                        successfulMove = true;
                        break;
                    }
                } else if (isCloset) {
                    var accepterSuit = accepter.getAttribute('data-suit');
                    if (accepterSuit === movingSuit && movingNum === 1 && activeCards.length === 1) {
                        accepterNode = game.closets[accepter.id];
                        successfulMove = true;
                        break;
                    }
                } else if (isClosetCard) {
                    var accepterSuit = accepter.data.s;
                    var accepterNum = accepter.data.n;
                    if (accepterSuit === movingSuit && accepterNum + 1 === movingNum && activeCards.length === 1) {
                        accepterNode = game.closets[accepter.parentNode.id];
                        successfulMove = true;
                        break;
                    }
                } else if (isStackCard) {
                    var accepterNum = accepter.data.n;
                    var accepterColor = accepter.data.colr;
                    if (accepterColor !== movingColor && accepterNum - 1 === movingNum) {
                        var accepterNode = game.stacks[accepter.parentNode.id];
                        var giverNode = lastLocation.id;
                        successfulMove = true;
                        break;
                    }
                }

            }
        }
    }
    if (successfulMove) {
        var oldStack = game.stacks[giverNode];
        if (giverNode === 'refuse') {
            oldStack = game['refuse'];
        }

        while (activeCards.length) {
            if (activeCards.length === 1) {
                activeCards[0].data.accepting = true;
            }
            accepterNode.push(activeCards[0].data);
            oldStack.pop();

            activeCards.shift();
        }
        if (oldStack.length) {
            if (giverNode !== 'refuse') {
                oldStack[oldStack.length - 1].accepting = true;
            }
            oldStack[oldStack.length - 1].folded = false;
        }


        game.steps = game.steps + 1;
        window.history.pushState(game, null, '#step' + game.steps);

    } else {
        activeCards = []
    }
    movingCard = false;
    renderBoard();

    // activeCards.style = '';
});



function renderCard(data) {
    var newCard = document.createElement('div');
    newCard.data = data;
    newCard.className = 'cd ';
    if (data.folded) {
        newCard.className = newCard.className + 'f';
    } else {
        newCard.className += data.s + ' n' + data.n + (data.accepting ? ' a' : '');
        newCard.innerHTML = cardContents(data.n, data.s);
    }
    return newCard;
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

function startNewGame() {
    for (var i = 0; i < cards.length; i++) {
        var cardHTML = document.createElement("div");
        cardHTML.className = "cd f";
        var data = {
            's': cards[i].suit,
            'n': cards[i].num,
            'id': cards[i].suit + cards[i].num,
            'colr': cards[i].suit === 'd' || cards[i].suit === 'h' ? 'r' : 'b',
            'folded': true,
            'accepting': false
        };
        cardHTML.data = data;
        game.refuse.push(data);
        // document.getElementById('refuse').appendChild(cardHTML);
    }

    // var refuseCards = document.getElementById('refuse').children;
    var maxStack = 0;
    var nextStack = 2;
    var delay = 1;
    for (var r = 0; r < 29; r++) {
            var sortoObject = game.refuse[game.refuse.length - 1];
            game.refuse.pop();
            // var sortoCard = refuseCards[refuseCards.length - 1];
            maxStack++;
            if (maxStack === 8 || maxStack === 1) {
                sortoObject.folded = false;
                sortoObject.accepting = true;
            }
            if (maxStack === 8) {
                maxStack = nextStack;
                nextStack++;
            }

            if (nextStack < 9) {
                // var stack = document.getElementById('stack' + maxStack);
                // stack.appendChild(sortoCard);
                game.stacks['stack' + maxStack].push(sortoObject)
                // if (Number(stack.getAttribute('data-max')) == stack.children.length) {
                //     reveal(sortoCard, true);
                // }
            }
        delay++;
    }
    window.history.pushState(game, null, '#step0');
}

function renderBoard() {
    var currentGame = history.state;
    document.body.innerHTML = '';
    var board = document.createElement('div');
    var upperArea = document.createElement('div');
    upperArea.className = 'upper-area clear';
    for (var gc in currentGame.closets) {
        var closet = document.createElement('div');
        var cardsInCloset = currentGame.closets[gc];
        closet.id = gc;
        closet.className = 'closet closet' + gc + (cardsInCloset.length ? '' : ' a');
        closet.setAttribute('data-suit', gc);
        for (var c = 0; c < cardsInCloset.length; c++) {
            closet.appendChild(renderCard(cardsInCloset[c]));
        }
        upperArea.appendChild(closet);
    }
    var refuse = document.createElement('div');
    refuse.className = 'refuse-pile clear';
    refuse.id = 'refuse';
    for (var r = 0; r < currentGame.refuse.length; r++) {
        refuse.appendChild(renderCard(currentGame.refuse[r]));
    }
    upperArea.appendChild(refuse);
    board.appendChild(upperArea);
    var stacks = document.createElement('div');
    stacks.className = 'stacks clear';
    var sn = 0;
    for (var st in currentGame.stacks) {
        sn++;
        var stack = document.createElement('div');
        var childStackCards = currentGame.stacks[st];

        stack.id = 'stack' + sn;
        stack.className = 'stack' + (childStackCards.length ? '' : ' a');
        for (var f = 0; f < childStackCards.length; f++) {
            stack.appendChild(renderCard(childStackCards[f]));
        }
        stacks.appendChild(stack);
    }
    board.appendChild(stacks);
    document.body.appendChild(board)
}
startNewGame();
renderBoard();
