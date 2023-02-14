export namespace EventfrogApiModel {
    interface Model {
        id: string;
    }

    interface Image {
        url: string;
        width: number;
        height: number;
    }

    interface Event extends Model {
        /*
         * external source id if the event was imported from another source an the extSourceId was set, otherwise null
         */
        extSrcId: string | null;

        /*
         * external id if the event was imported from another source
         */
        extId: string | null;

        /*
         * 0 or null if event is not in a group
         */
        groupId: string;
        rubricId: string;

        /*
         * localized strings in array ('de', ...), max 255 characters
         */
        title: string[];
        url: string;
        organizerId: string;
        organizerName: string;
        websiteUrl: string;
        facebookUrl: string;
        twitterUrl: string;

        /*
         * url for ticketing
         */
        presaleLink: string;
        presaleText: string;

        /*
         * event image if available, otherwise null
         */
        emblemToShow: Image | null;

        /*
         * ISO 8601
         */
        begin: string;

        /*
         * ISO 8601
         */
        end: string;
        cancelled: boolean;
        visible: boolean;
        published: boolean;
        agendaEntryOnly: boolean;
        locationIds: string[];

        /*
         * ISO 8601
         */
        modifyDate: string;

        /*
         * localized strings in array ('de', ...), max 255 characters
         */
        shortDescription: string[];

        /*
         * localized strings in array ('de', ...), unlimited max length, contains encoded HTML
         */
        descriptionAsHTML: string[];
    }

    interface Location extends Model {
        title: string[];

        /*
         * on eventfrog.ch
         */
        url: string;

        /*
         * localized strings in array ('de', ...), unlimited max length, contains encoded HTML
         */
        descriptionAsHTML: string[];

        /*
         * location image if available, otherwise null
         */
        img: Image | null;

        addressLine: string;
        zip: string;
        city: string;
        lat: number;
        lng: number;
        websiteUrl: string;
        facebookUrl: string;
        twitterUrl: string;
        /*
         * ISO 8601
         */
        modifyDate: string;
    }

    interface Group extends Model {
        /*
         * TODO #2 - this is wrong by API docs but actually, there is no array here
         */
        title: string;

        /*
         * on eventfrog.ch
         */
        url: string;

        /*
         * localized strings in array ('de', ...), unlimited max length, contains encoded HTML
         */
        descriptionAsHTML: string[];

        /*
         * location images if available
         */
        imgs: Image[];

        /*
         * ISO 8601
         */
        modifyDate: string;
    }

    interface Topic extends Model {
        /*
         * parent rubric id or 0 if no parent rubric exists
         */
        parentId: string;

        /*
         * TODO #2 - this is wrong by API docs but actually, there is no array here
         */
        title: string;
    }
}

export namespace EventfrogApiRequest {
    interface Request {
        /*
         * Event-Id, nur Events mit dieser/n Id/s werden gefunden
         */
        id?: string | string[];

        /*
         * default 100, gibt an, wieviele Events zurückgegeben werden sollen
         */
        perPage?: number;

        /*
         * Gibt an welche Seite der Resultate zurückgegeben werden soll (in Zusammenhang mit perPage)
         */
        page?: number;
    }
    
    interface Events extends Request {
        /*
         * Der Suchbegriff
         */
        q?: string;

        /*
         * Die bei locId angegebenen Locations sollen ausgeschlossen werden
         */
        excludeLocs?: boolean;

        /*
         * Die bei orgId angegebenen Organizers sollen ausgeschlossen werden
         */
        excludeOrgs?: boolean;

        /*
         * Die bei rubId angegebenen Organizers sollen ausgeschlossen werden
         */
        excludeRubrics?: boolean;

        /*
         * Die bei extSourceId angegebenen externen Source-Ids sollen ausgeschlossen werden
         */
        excludeExtSrcIds?: boolean;

        /*
         * locationIds
         */
        locId?: string | string[];

        /*
         * organizerIds
         */
        orgId?: string | string[];

        /*
         * rubricids
         */
        rubId?: number | number[];

        /*
         * event group id(s)
         */
        groupId?: string | string[];

        /*
         * extSourceIds
         */
        extSrcId?: string | string[];

        /*
         * PLZ, nur Events mit dieser/n PLZs werden gefunden
         */
        zip?: string | string[];

        /*
         * Latitude für Umkreissuche (nur zusammen mit lng und r verwendbar)
         */
        lat?: number;

        /*
         * Longitude für Umkreissuche (nur zusammen mit lat und r verwendbar)
         */
        lng?: number;

        /*
         * Gibt den Radius in km für die Umkreissuche an. (nur zusammen mit lat und lng verwendbar)
         */
        r?: number;

        /*
         * dd.MM.YYYY, nur Events die ab diesem Datum stattfinden sollen zurückgegeben werden
         */
        from?: string;

        /*
         * dd.MM.YYYY, nur Events die bis zu diesem Datum stattfinden sollen zurückgegeben werden
         */
        to?: string;

        /*
         * dd.MM.YYYY[+HH:mm:ss], Es werden nur Events zurückgegeben die ab diesem Datum (MEZ) geändert wurden (angegebenes Datum inklusive).
         */
        modifiedSince?: string;

        /*
         * true = nur nach Live-Streamingevents suchen; false = nur nach Events suchen, die kein Live-Streaming haben
         */
        stream?: boolean;

        /*
         * true = Es wird auch in den eigenen versteckten Events gesucht (Erfasser der Events = Besitzer des APIKeys)
         */
        withOwnHiddens?: boolean;
    }

    interface Locations extends Request {
        /*
         * Latitude für Umkreissuche (nur zusammen mit lng und r verwendbar)
         */
        lat?: number;

        /*
         * Longitude für Umkreissuche (nur zusammen mit lat und r verwendbar)
         */
        lng?: number;

        /*
         * Gibt den Radius in km für die Umkreissuche an. (nur zusammen mit lat und lng verwendbar)
         */
        r?: number;

        /*
         * PLZ, nur Events mit dieser/n PLZs werden gefunden
         */
        zip?: string | string[];

        /*
         * dd.MM.YYYY[+HH:mm:ss], Es werden nur Events zurückgegeben die ab diesem Datum (MEZ) geändert wurden (angegebenes Datum inklusive).
         */
        modifiedSince?: string;
    }

    interface Groups extends Request {
        /*
         * Event-Id, nur Events mit dieser/n Id/s werden gefunden
         */
        groupId?: string | string[];

        /*
         * Latitude für Umkreissuche (nur zusammen mit lng und r verwendbar)
         */
        lat?: number;

        /*
         * Longitude für Umkreissuche (nur zusammen mit lat und r verwendbar)
         */
        lng?: number;

        /*
         * Gibt den Radius in km für die Umkreissuche an. (nur zusammen mit lat und lng verwendbar)
         */
        r?: number;

        /*
         * PLZ, nur Events mit dieser/n PLZs werden gefunden
         */
        zip?: string | string[];

        /*
         * dd.MM.YYYY[+HH:mm:ss], Es werden nur Events zurückgegeben die ab diesem Datum (MEZ) geändert wurden (angegebenes Datum inklusive).
         */
        modifiedSince?: string;
    }
}

export namespace EventfrogApiResult {
    interface Result<T extends EventfrogApiModel.Model> {
        totalNumberOfResources: number;
        events?: Array<EventfrogApiModel.Event>;
        locations?: Array<EventfrogApiModel.Location>;
        eventgroups?: Array<EventfrogApiModel.Group>;
        rubrics?: Array<EventfrogApiModel.Topic>;
    }
}
