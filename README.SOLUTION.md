# Meetrics Code Challenge Solution

Output folder holds the solution files produced. You could just open index.html file to see the results.

Solution is created using pure JavaScript no 3rd party libraries nor CoffeeScript were used.

JavaScript sources are split into several files to make it easier to maintain and improve.
For instance in case definition of 'viewable advert' changes would be contained inside ad_visibility_rules.js
file where current rules could be changed or new once could be added.

Solution logs everything to console including
    - Is advert viewable or not
    - What percentage of advert is visible
    - if advert is not viewable what rule was violated
    - clicks on the advert

Future impovements could be
    - check if some one actively tring to interfer with our code and force it to consider advert viwable
    - add some reporting mechanism so we could send results to our server
    - cases when advert is closed by another HTML element or set to be invisible using CSS