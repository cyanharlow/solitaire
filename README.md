# Solitaire

I know - it's what the world has been demanding. A _different_ solitaire game - even though Solitaire has come pre-installed on almost every computer since the dawn of man!

Well I don't appreciate your sarcasm but THIS AIN'T FOR YOU

## Why Solitaire?

There are always going to be factors that contribute to my impostor syndrome as someone living in Silicon Valley and working in tech. But the biggest ones by far? The fact that:

1. I hate La Croix (fizzy garbage water).
1. I am **not a gamer**.

Almost everyone in this industry is super into D&D or first-person-shooters. And to be a team player in your company you should participate in these things. But I'd rather first-person-shoot myself in the face.

I _am_ however, quite the aficionado of solo games like Solitaire, Sudoku, Crosswords, etc. And when they are implemented digitally in just about a thousand different ways, I have strong opinions on the intricacies of how they're implemented.

So when Google launched their within-search-engine Solitaire game, I was _delighted_.

Their custom search engine apps, like the Calculator, are incredible. I mean, I don't even use my pre-installed Windows Calculator Utility App anymore - I just go straight to Google Search for all of my calculator needs. And I thank the Seven every day that y'all don't have access to my browser history for evidence of just how rudimentary these calculations are. Last week I _may_ have Googled "6 * 12".

So imagine my surprise when this Solitaire app was not only weirdly buggy, but also had some of the most frustrating UX I'd experienced in a Solitaire game. Notably:

1. Dropping a card onto a stack had about a 1 in 9 success rate - it required finding just the exact right active sweet spot for getting the event to register.
1. **The "Undo" button**. Very cool in theory, but in practice it was located right above the Native Android Back Button. Which meant that the already-second-nature act of hitting "Back" on your Android Phone would frequently be confused with the position of Google Solitaire's "Undo" button. So instead of simply undoing your last step, you'd navigate right out of the page. And then your game would be LOST. FOREVER. ARRRRRGH FRUSTRATION.

I've been playing games like these for a good portion of my adult life, but I've only been a developer for a small fraction of that time. So it took several frustrating Solitaire games for me to remember that **no one is forcing me to play Solitaire** and that I can actually just **build one my damn self if I care so much about it**.

## SO I DID.

And because I do love our all-powerful Google with its blackmail-worthy database of information (they've got more than just arithmetic searches on me, you know) I kept the UI Google-inspired. I just redid it in a way that was specific to my desires.

1. I abandoned the timing/scores feature because oh my god who cares
1. The drag-and-droppable zones work as I expect them to
1. The "Undo" button works just like Google's, but it's actually _the exact same process as using your browser's back button_. Use either one! Use both for all I care!
   1. JavaScript's pushState() allows for an Undo button that works the way I would want it to on Android - so that even a mistaken use of the native Android Back Button keeps you in the game.
   1. If you somehow infinity-back-button your way out of the page, no fear! Come back and find your game cookied so that you can jump right back into things.
1. No ugly bright green felt colors. Day mode and night mode!
