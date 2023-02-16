# Javascript implementation of the Eventfrog API

Basic implementation of the [Eventfrog](https://eventfrog.ch) Events API:

* Load events, filter them by various parameters
* Location-based search for events as far as the API allows
* Automatically load location and group endpoints for events

### Known limitations

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

### Using es6 module

Load `10` events from a specific organization:

```js
import {EventfrogService, EventfrogEventRequest} from 'eventfrog-api';

const Service = new EventfrogService('YOUR_API_KEY');

const request = new EventfrogEventRequest({
    perPage: 10,
    orgId: 'ORG_ID',
});

let result = null;
do {
    result = await Service.loadEvents(request);
    const events = result.datasets;
    // do stuff with events
    request.nextPage();
} while (result.hasNextPage());
```

## ToDo

See [Issues](https://github.com/poljpocket/eventfrog-api/issues).

## Disclaimer

I am not affiliated with Eventfrog and this implementation is provided as-is.
