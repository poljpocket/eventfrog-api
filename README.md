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

### Known issues

* When not filtering events down to a small number, the amount of groups and locations being queried to later be matched
  to events for more detailed display can easily overwhelm the EventFrog APIs. They handle this case correctly but this
  script does not! If you do not need groups and locations being matched to events, use the more granular methods
  of `EventFrogService`.

## Usage

> The file `example.js` inside the `example` directory contains extensive usage examples.

### Load the library

Simply load the bundled `jQuery` plugin:

```html

<script src="dist/jquery.eventfrog.min.js"></script>
```

You can also use `commonJS`:

```js
const EventFrogService = require('./src/service/EventFrogService');
```

### Load some events

#### jQuery plugin

Load `10` events from a specific organization using `async/await`:

```js
const Service = $.eventfrogService('YOUR_API_KEY');
const events = await Service.loadEvents({
    perPage: 10,
    orgId: 'ORG_ID',
});

// do stuff
```

or using `Promise`s:

```js
const Service = $.eventfrogService('YOUR_API_KEY');
Service.loadEvents({
    perPage: 10,
    orgId: 'ORG_ID',
}).then((events) => {
    // do stuff
});
```

#### commonJS

Load `10` events from a specific organization using `async/await`:

```js
const Service = new EventFrogService('YOUR_API_KEY');
const events = await Service.loadEvents({
    perPage: 10,
    orgId: 'ORG_ID',
});

// do stuff
```

or using `Promise`s:

```js
const Service = new EventFrogService('YOUR_API_KEY');
Service.loadEvents({
    perPage: 10,
    orgId: 'ORG_ID',
}).then((events) => {
    // do stuff
});
```

> Other usage patterns exist. Please, refer to `EventFrogService` class for an extensive documentation of possibilities including API filter options.

## ToDo

- [x] Document the whole API as-is
- [ ] Allow multiple locations for a single event
- [x] Implement `Rubrics` part of the API

## Disclaimer

I am not affiliated with Eventfrog and this implementation is provided as-is.

> The whole API is only partially public and subject to change!
