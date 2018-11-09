(function() {
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
        h: '<div class="icon heart"><span class="a"></span><span class="b"></span><span class="c"></span></div>',
        s: '<div class="icon spade"><span class="c"></span><span class="a"></span><span class="b"></span><span class="d"></span></div>',
        c: '<div class="icon club"><span class="a"></span><span class="b"></span><span class="c"></span><span class="d"></span></div>',
        d: '<div class="icon diamond"><span></span></div>'
    };

    var lastLocation = {};
    var activeCards = [];

    var currentGame = {};
    var priorGame = {};
    var hasStarted = false;

    function historyPush() {
        currentGame.steps = currentGame.steps + 1;
        priorGame = window.history.state;
        window.history.pushState(currentGame, null, '#step' + currentGame.steps);
        document.cookie = 'currentGame=' + JSON.stringify(currentGame);
        renderBoard();
        priorGame = currentGame;
    }

    function getCookie(cookie) {
        var cookies = document.cookie.split('; ');
        for (var co = 0; co < cookies.length; co++) {
            var ident = cookie + '=';
            if (cookies[co].indexOf(ident) === 0) {
                return cookies[co].replace(ident, '');
            }
        }
        return null;
    }

    function getAllIcons(n, s) {
        if (n < 11) {
            var htmls = '<div class="numd len' + n + '">';

            for (var b = 0; b < n; b++) {
                htmls += icons[s];
            }
            htmls += '</div>';
            return htmls;
        }
        return '<h2 class="numd">' + displays['n' + n] + '</h2>';
    }

    function strEndsWith(needle, haystack) {
        var needLen = needle.length;
        var hayLen = haystack.length;
        if (needLen < hayLen) {
            var lopped = haystack.slice(-needLen);
            if (needle === lopped) {
                return true;
            }
        }
        return false;
    }

    function shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function cardContents(n, s) {
        return '<p>' + displays['n' + n] + '</p>' + icons[s] + '<hr/>' + getAllIcons(n, s);
    }

    window.onhashchange = function(e) {
        if (window.history.state) {
            currentGame = window.history.state;
            renderBoard();
            if (strEndsWith('step1', e.newURL) && strEndsWith('step2', e.oldURL)) {
                alert('You have reached the beginning of this game!');
            }
        }
    };

    window.onresize = function() {
        if (hasStarted) {
            renderBoard();
        }
    };

    document.addEventListener('click', function(e) {
        if (e.target.id === 'startnew') {
            startNewGame();
            return false;
        } else if (e.target.id === 'new-game') {
            if (window.confirm("Close this game and start a new one?")) {
                startNewGame();
            }
            return false;
        } else if (e.target.id === 'resume-game') {
            renderBoard();
            return false;
        } else if (e.target.id === 'back-button') {
            window.history.back();
            return false;
        } else if (e.target.id === 'color') {
            e.preventDefault();
            var thisColor = e.target.checked ? 'dark' : 'light';
            currentGame.color = thisColor;
            historyPush();
            return false;
        }
    });

    function renderCard(data, extraClass) {
        var newCard = document.createElement('div');
        newCard.data = data;
        newCard.className = 'cd ';
        newCard.ontouchstart = function(e) {
            e.preventDefault();
            startDrag(e);
            return false;
        };
        newCard.ontouchmove = function(e) {
            var lastPosX = e.changedTouches[0].clientX;
            var lastPosY = e.changedTouches[0].clientY;
            moveDrag(e, lastPosX, lastPosY);
        };
        newCard.ontouchend = function(e) {
            e.preventDefault();
            var lastPosX = e.changedTouches[0].pageX;
            var lastPosY = e.changedTouches[0].pageY;
            stopDrag(e, lastPosX, lastPosY);
            return false;
        };
        newCard.onmousedown = function(e) {
            startDrag(e);
        };
        newCard.onmousemove = function(e) {
            var lastPosX = e.pageX
            var lastPosY = e.pageY;
            moveDrag(e, lastPosX, lastPosY);
        };
        newCard.onmouseup = function(e) {
            var lastPosX = e.pageX
            var lastPosY = e.pageY;
            stopDrag(e, lastPosX, lastPosY);
        };
        if (data.folded) {
            newCard.className = newCard.className + 'f';
        } else {
            newCard.className += data.s + ' n' + data.n + (data.accepting ? ' a' : '') + (extraClass ? extraClass : '');
            newCard.innerHTML = cardContents(data.n, data.s);
        }
        return newCard;
    }

    function startDrag(e) {
        activeCards = [];
        if (e.target.className.indexOf('cd') > -1 && !e.target.data.folded) {
            lastLocation = e.target.parentNode;
            activeCards.push(e.target);
            var grabberCard = activeCards[0].nextElementSibling;
            while (lastLocation.id.indexOf('stack') > -1 && grabberCard !== null) {
                activeCards.push(grabberCard);
                grabberCard = grabberCard.nextElementSibling;
            }
        } else if (e.target.className.indexOf('cd f') > -1 && e.target.parentNode.className.indexOf('refuse') > -1) {
            if (e.target.nextElementSibling) {
                var thisLast = currentGame.refuse[currentGame.refuse.length - 1];
                thisLast.folded = true;
                currentGame.refuse.pop();
                currentGame.refuse.unshift(thisLast);
            }
            currentGame.refuse[currentGame.refuse.length - 1].folded = false;
            activeCards = [];
            historyPush();
        }
    }

    function moveDrag(e, lastPosX, lastPosY) {
        if (activeCards.length > 0) {
            var left = lastPosX - 30;
            var top = lastPosY + 15;
            var zIndex = 999999;
            for (var ac = 0; ac < activeCards.length; ac++) {
                activeCards[ac].style = 'position: fixed; z-index: ' + zIndex + '; left: ' + left + 'px; top: ' + top + 'px';
                top = top + 20;
                zIndex = zIndex + 100;
            }
        }
    }

    function stopDrag(e, lastPosX, lastPosY) {
        var accepterNode = null;
        var giverNode = lastLocation.id;

        var successfulMove = false;
        if (activeCards.length > 0) {
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
                var aX1 = aX0 + accepter.offsetWidth;
                var aY0 = accepter.offsetTop;
                var aY1 = aY0 + accepter.offsetHeight;

                var isStack = accepter.className.indexOf('stack') > -1 && accepter.children.length === 0;
                var isCloset = accepter.className.indexOf('closet') > -1 && accepter.children.length === 1;
                var isStackCard = accepter.parentNode.className.indexOf('stack') > -1;
                var isClosetCard = accepter.parentNode.className.indexOf('closet') > -1;

                if (lastPosX >= aX0 && lastPosX <= aX1 && lastPosY >= aY0 && lastPosY <= aY1) {
                    if (isStack) {
                        if (movingNum === 13) {
                            accepterNode = currentGame.stacks[accepter.id];
                            successfulMove = true;
                            break;
                        }
                    } else if (isCloset) {
                        var accepterSuit = accepter.getAttribute('data-suit');
                        if (accepterSuit === movingSuit && movingNum === 1 && activeCards.length === 1) {
                            accepterNode = currentGame.closets[accepter.id];
                            successfulMove = true;
                            break;
                        }
                    } else if (isClosetCard) {
                        var accepterSuit = accepter.data.s;
                        var accepterNum = accepter.data.n;
                        if (accepterSuit === movingSuit && accepterNum + 1 === movingNum && activeCards.length === 1) {
                            accepterNode = currentGame.closets[accepter.parentNode.id];
                            successfulMove = true;
                            break;
                        }
                    } else if (isStackCard) {
                        var accepterNum = accepter.data.n;
                        var accepterColor = accepter.data.colr;
                        if (accepterColor !== movingColor && accepterNum - 1 === movingNum) {
                            var accepterNode = currentGame.stacks[accepter.parentNode.id];
                            var giverNode = lastLocation.id;
                            successfulMove = true;
                            break;
                        }
                    }
                }
            }

            if (successfulMove) {
                var oldStack = currentGame.stacks[giverNode];
                if (giverNode === 'refuse') {
                    oldStack = currentGame['refuse'];
                } else if (giverNode.indexOf('stack') === -1) {
                    oldStack = currentGame.closets[giverNode];
                }

                while (activeCards.length > 0) {
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
                historyPush();
            } else {
                activeCards = [];
                renderBoard();
            }
        }
    }

    function startNewGame() {
        cards = [];
        var game = {
            steps: 0,
            color: 'dark',
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
        }

        var maxStack = 0;
        var nextStack = 2;
        for (var r = 0; r < 28; r++) {
            var sortoObject = game.refuse[game.refuse.length - 1];
            game.refuse.pop();
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
                game.stacks['stack' + maxStack].push(sortoObject)
            }
        }
        currentGame = game;
        historyPush();
    }

    function renderBoard() {
        var isFinished = true;
        document.body.innerHTML = '';

        var outerBoard = document.createElement('div');
        outerBoard.className = 'board clear ' + currentGame.color;
        var board = document.createElement('div');
        board.className = 'inner clear';

        var bottomButtons = document.createElement('div');
        bottomButtons.className = 'bottom-buttons';
        bottomButtons.innerHTML = '<div class="in"><button id="new-game" class="new">&#xff0b;</button><div class="toggle"><input type="checkbox" id="color" ' + (currentGame.color === 'dark' ? 'checked' : '') + '><label for="color"></label></div><button id="back-button" class="back">&larr;</button></div>';
        board.appendChild(bottomButtons);

        var closets = document.createElement('div');
        closets.className = 'closets-area';
        for (var gc in currentGame.closets) {
            var closet = document.createElement('div');
            var cardsInCloset = currentGame.closets[gc];
            closet.id = gc;
            closet.className = 'closet closet' + gc + (cardsInCloset.length ? '' : ' a');
            closet.innerHTML = icons[gc];
            closet.setAttribute('data-suit', gc);
            for (var c = 0; c < cardsInCloset.length; c++) {
                if (cardsInCloset[c].folded) {
                    isFinished = false;
                }
                closet.appendChild(renderCard(cardsInCloset[c]));
            }
            closets.appendChild(closet);
        }
        var refuse = document.createElement('div');
        var priorRefCard = priorGame ? priorGame.refuse[priorGame.refuse.length - 1] : null;
        var currentRefCard = currentGame.refuse[currentGame.refuse.length - 1];
        var shouldAnimate = currentRefCard && priorRefCard && (currentRefCard.id !== priorRefCard.id || currentRefCard.folded !== priorRefCard.folded || currentGame.refuse.length !== priorGame.refuse.length);
        refuse.className = 'refuse-pile len' + currentGame.refuse.length + (shouldAnimate ? ' accordion' : '');
        refuse.id = 'refuse';
        for (var r = 0; r < currentGame.refuse.length; r++) {
            if (currentGame.refuse[r].folded) {
                isFinished = false;
            }
            refuse.appendChild(renderCard(currentGame.refuse[r], (shouldAnimate && r === currentGame.refuse.length - 1 ? ' slide' : null)));
        }
        board.appendChild(refuse);
        board.appendChild(closets);
        var stacks = document.createElement('div');
        stacks.className = 'stacks';
        board.appendChild(stacks);

        var sn = 0;
        for (var st in currentGame.stacks) {
            sn++;
            var stack = document.createElement('div');
            var childStackCards = currentGame.stacks[st];
            var priorStack = priorGame ? priorGame.stacks[st] : null;

            var growAnimation = '';
            if (priorStack && priorStack.length > childStackCards.length) {
                growAnimation = ' contract';
            } else if (priorStack && priorStack.length < childStackCards.length) {
                growAnimation = ' expand';
            }

            stack.id = 'stack' + sn;
            stack.className = 'stack len' + childStackCards.length + (childStackCards.length ? '' : ' a') + growAnimation;

            for (var f = 0; f < childStackCards.length; f++) {
                if (childStackCards[f].folded) {
                    isFinished = false;
                }
                var animate = null;
                if (priorStack && f == childStackCards.length - 1 && !childStackCards[f].folded && priorStack[f] && priorStack[f].folded) {
                    animate = ' flipover'
                }
                stack.appendChild(renderCard(childStackCards[f], animate));
            }
            board.appendChild(stack);
        }

        outerBoard.appendChild(board);

        document.body.appendChild(outerBoard);

        var screenW = window.outerWidth;
        var screenH = window.outerHeight;

        var ratio = screenW > screenH ? '690' : '530';
        var browserColor = currentGame.color === 'dark' ? '000000' : 'ffffff';
        document.getElementById('metaColor').setAttribute("content", "#" + browserColor);
        document.getElementById('metaWidth').setAttribute("content", "width=" + ratio + ",user-scalable=no");

        if (isFinished) {
            setTimeout(function() {
                alert('You finished the game!');
                startNewGame();
            }, 500);
        }
        hasStarted = true;
    }

    if (getCookie('currentGame') !== null) {
        currentGame = JSON.parse(getCookie('currentGame'));
        var resumeButton = document.createElement('button');
        resumeButton.innerHTML = 'Resume previous';
        resumeButton.className = 'resumer';
        resumeButton.id = 'resume-game';
        document.getElementById('start-container').appendChild(resumeButton);
    }
})();
