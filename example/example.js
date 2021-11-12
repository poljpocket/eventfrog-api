const _apiKey = 'YOUR_API_KEY';

(($) => {
    $('.events-wrapper').each(async function () {
        let $eventList = $(this).find('.event-list');
        try {
            const events = await $.eventfrog({
                apiKey: _apiKey,
                amount: $(this).data('amount'),
                organization: '1783600', // This organization is "Sternwarte Planetarium SIRIUS"
            });
            events.forEach(event => {
                let groupString = event.group ? `Gruppe: <a href="${event.group.link}" target="_blank">${event.group.title}</a> (${event.group.id})<br />` : '';
                let locationString = event.location ? `Ort: ${event.location.title}, ${event.location.address}, ${event.location.zip} ${event.location.city} (${event.location.id})<br />` : '';
                let organizerString = event.organizer ? `Organisator: ${event.organizer.name} (${event.organizer.id})<br />` : '';
                let imageString = event.image.url ? `<img src="${event.image.url}" alt=""/>` : '';
                $eventList.append(`<div class="event-wrapper"><div class="event"><h2>${event.title}</h2>${imageString}<p>Datum: ${event.startDate}<br />${groupString} ${locationString} ${organizerString} Link: <a href="${event.link}" target="_blank">Tickets</a><br />Agenda only: ${event.agendaOnly}</p></div></div>`);
            });
        } catch (error) {
            console.log(error);
        }
    });
})(jQuery);
