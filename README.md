# Javascript implementation of the Eventfrog API

Basic implementation of the [Eventfrog](https://eventfrog.ch) Events API:
* Load events, filter them by various parameters
* Filter events by group (see [Limitations](#known-limitations))
* Location-based search for events as far as the API allows
* Automatically load location and group endpoints for events

### Known limitations

* You cannot filter by group and have pagination at the same time because EventFrog does not allow filtering by group ID
  at this time. This filter has to be applied after the events are loaded and thus paginated.
* You cannot get all locations of an event (multiple are possible by the API). Only the first one is fetched.
* The Rubrics part of the API is not yet implemented

### Known issues

* When not filtering events down to a small number, the amount of groups and locations being queried to later be matched
  to events for more detailed display can easily overwhelm the EventFrog APIs. They handle this case correctly but this
  script does not!
* If you do not need groups and locations being matched to events, use the more granular methods of EventFrogLoader.

## Usage

> For the moment, for full usage, please refer to the `example` directory,
> specifically its `example.js` file in the `src` subdirectory.

#### Load the library

Simply load the bundled `jQuery` plugin:

```html
<script src="dist/jquery.eventfrog.min.js"></script>
```

You can also use `commonJS`:

```js
const loadEvents = require('./src/EventFrog');
```

#### Load some events

This allows you to load events e.g. with:

```js
const events = await loadEvents({
    apiKey: 'YOUR_API_KEY',
    amount: 10,
    organization: 'ORG_ID',
});

// do stuff
```
or, using Promises themselves:

```js
loadEvents({
    apiKey: 'YOUR_API_KEY',
    amount: 10,
    organization: 'ORG_ID',
}).then((events) => {
    // do stuff
});
```

Other usage patterns exist. Please, refer to the source code for an extensive documentation of possibilities including API filter options.

## ToDo

- [x] Document the whole API as-is
- [ ] Allow multiple locations for a single event
- [ ] Implement `Rubrics` part of the API

## Disclaimer

I am not affiliated with Eventfrog and this implementation is provided as-is.

> The whole API is only partially public and subject to change!
