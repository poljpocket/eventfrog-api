const _apiKey = 'YOUR_API_KEY';

(($) => {
    $('.events-wrapper').each(async function () {
        let $eventList = $(this).find('.event-list');
        try {
            const Service = $.eventfrogService(_apiKey);
            const events = await Service.loadEvents({
                locId: '51436', // KKThun
                rubId: 233, // Theater
                perPage: 12,
            });
            await Service.mapTopics(events);
            events.forEach(event => {
                let groupString = event.group ? `Gruppe: <a href="${event.group.link}" target="_blank">${event.group.title}</a> (${event.group.id})<br />` : '';
                let locationString = event.location ? `Ort: ${event.location.title}, ${event.location.address}, ${event.location.zip} ${event.location.city} (${event.location.id})<br />` : '';
                let organizerString = event.organizer ? `Organisator: ${event.organizer.name} (${event.organizer.id})<br />` : '';
                let imageString = event.image.url ? `<img src="${event.image.url}" alt=""/>` : '';
                let parentTopicString = event.topic.parent ? `< ${event.topic.parent.title} (${event.topic.parent.id})` : '';
                let topicString = `Rubrik: ${event.topic.title} (${event.topic.id}) ${parentTopicString}<br />`;
                $eventList.append(`<div class="event-wrapper"><div class="event"><h2>${event.title}</h2>${imageString}<p>Datum: ${event.startDate}<br />${groupString} ${locationString} ${organizerString} ${topicString} Link: <a href="${event.link}" target="_blank">Tickets</a><br />Agenda only: ${event.agendaOnly}</p></div></div>`);
            });
        } catch (error) {
            console.log(error);
        }
    });

    $('.topics-wrapper').each(async function () {
        let $topicList = $(this).find('.topic-list');
        try {
            const Service = $.eventfrogService(_apiKey);
            const topics = await Service.loadTopics();
            const topLevelTopics = topics.filter(t => !t.parent);
            for (const topic of topLevelTopics) {
                $topicList.append(`<h2>${topic.title}</h2>`);
                let subTopics = topics.filter(t => t.parentId === topic.id);
                if (subTopics.length) {
                    let $list = $(document.createElement('ol'));
                    for (const subTopic of subTopics) {
                        $list.append(`<li>${subTopic.title}</li>`);
                    }
                    $topicList.append($list);
                }
            }
        } catch (error) {
            console.log(error);
        }
    });
})(jQuery);
