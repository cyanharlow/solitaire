# Solitaire

This is a browser-based implementation of the Solitaire card game.

## Issues with Google's implementation


The most similar solitaire version, the version created by Google, contain various bugs and design differences:

1. Placing a card onto a stack was inconsistent and required a significant amount of precision.
1. The "Undo" button's placement on the mobile version made it possible to accidentally back out of a page, which could allow for users to restart progress accidentally.
   1. The same issue happens on desktop when you leave the solitaire page.

## Version differences.


1. There are no longer timer or score trackers as they did not provide any meaningful gameplay changes. 
1. The drag-and-droppable zones have been made easier to click on.
1. The "Undo" button is functionally identical to Google's version, which works by calling the same process as using your browser's back button to help prevent any accidental restarts to your game.
   1. On Android, JavaScript's pushState() allows for an Undo button that works the same way, allowing for one to press the back button on mobile and keep their progress.
   1. Incase you exit the page on either mobile or desktop, your progress is stored as a cookie, allowing you to continue playing at any time.
1. Light and dark mode options are available depending on user's preference.