# Multilayout Bootstrap
Designed to get complicated layouts, like those seen on email, to work in Bootstrap on the web and mobile. Requires jQuery, can be used either with static pages, AngularJS, or both.

![Image of desktop](https://raw.githubusercontent.com/jacobp100/Multilayout-Bootstrap/master/example-images/desktop.png)
![Image of mobile](https://raw.githubusercontent.com/jacobp100/Multilayout-Bootstrap/master/example-images/mobile.png)

## Basics
Each column layout requires the class `fragment`, with the default fragment also having the class `visible` (else nothing will show up on the page). Each fragment must also have the attribute `data-fragment-order="<number>"` with number starting at 0, incrementing in steps of 1, and having no duplicates. A back button will show in the navbar if the fragment is non-zero.

To have a link jump to a different fragment (required for mobile), add `data-change-fragment="<fragment-index>"`, which will navigate without reloading the page. To have link jump directly into a fragment, the url parameter, `?fragment=<fragment-index>` may be used.

Sometimes fragments require a view. In the example of an email client, the second column can either be an inbox, sent items box, or drafts box. Attaching `data-fragment-view="<any string>"` to a link, or `?fragment-view="<any string>"` to the url will handle this.

When a fragment is changed, a document event `$(document).on('viewChanged', function(event, index, view, element)` is fired. This will be fired on `document.ready` and when a link is clicked.

To manually change a view, call into `$.changeFragment(index, [view], [element])`. The current fragment is stored at `$.currentFragment`.

By default, navigating to a different fragment will change the url parameters (via pushState) such that a refresh will leave you will leave you where you left off. This can be disabled via `$.changeUrlWithFragment`.

## AngularJS Route
Create a controller for each fragment that will update. In the email example, a controller would be made for the inbox, and clicking inbox, sent, or drafts would send events to this controller to update the content. To respond to these events, listen to `viewChanged`, and filter out only the fragment index you are interested in.

See example in `index.html`.

## Static Route
Make each link that would update a fragment pass in `?fragment=<number>` as described above. Alternatively, have your layout engine dynamically set the `visible` class on the correct fragment.

Don't reload the page to navigate to switch to a fragment on the current page for mobiles, just use the `data-fragment` attribute.

See example in `settings.html`
