# Javascript implementation of the Eventfrog API

Basic implementation of the [Eventfrog](https://eventfrog.ch) Events API:

* Load events, filter them by various parameters
* Location-based search for events as far as the API allows
* Automatically load location and group endpoints for events

### Known limitations

* You cannot filter by group and have pagination at the same time because Eventfrog does not allow filtering by group ID
  at this time. This filter has to be applied after the events are loaded and thus pagination would be filtered afterwards.
* You cannot get all locations of an event (multiple are possible by the API). Only the first one is fetched.

### Known issues

* When not filtering events down to a small number, the amount of groups and locations being queried to later be matched
  to events for more detailed display can easily overwhelm the Eventfrog APIs. They handle this case correctly but this
  script does not! If you do not need groups and locations being matched to events, use the more granular methods
  of `EventfrogService`.

## Installation

The package is available on `npm`'s registry:

```shell
npm i eventfrog-api
```

## Usage

> See [eventfrog-api-example](https://github.com/poljpocket/eventfrog-api-example) for an example implementation.

### Load the library

Simply load the bundled `jQuery` plugin:

```html

<script src="dist/jquery.eventfrog.min.js"></script>
```

You can also use `commonJS`:

```js
const EventfrogService = require('eventfrog-api');
```

### Load some events

#### jQuery plugin

Load `10` events from a specific organization using `async/await`:

```js
const Service = $.EventfrogService('YOUR_API_KEY');
const events = await Service.loadEvents({
    perPage: 10,
    orgId: 'ORG_ID',
});

// do stuff
```

or using `Promise`s:

```js
const Service = $.EventfrogService('YOUR_API_KEY');
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
const Service = new EventfrogService('YOUR_API_KEY');
const events = await Service.loadEvents({
    perPage: 10,
    orgId: 'ORG_ID',
});

// do stuff
```

or using `Promise`s:

```js
const Service = new EventfrogService('YOUR_API_KEY');
Service.loadEvents({
    perPage: 10,
    orgId: 'ORG_ID',
}).then((events) => {
    // do stuff
});
```

> Other usage patterns exist. Please, refer to `EventfrogService` class for an extensive documentation of possibilities including API filter options.

## ToDo

See [Issues](https://github.com/poljpocket/eventfrog-api/issues).

## Disclaimer

I am not affiliated with Eventfrog and this implementation is provided as-is.

> The whole API is only partially public and subject to change!
