KB.component('calendar', function (containerElement, options) {
    var modeMapping = {
        month: 'month',
        week: 'agendaWeek',
        day: 'agendaDay'
    };

    this.render = function () {
        var calendar = $(containerElement);
        var mode = 'month';
        if (window.location.hash) { // Check if hash contains mode
            var hashMode = window.location.hash.substr(1);
            mode = modeMapping[hashMode] || mode;
        }

        calendar.fullCalendar({
		/*****begin of persian jalali calendar configs ******/
			lang: 'fa',
			isJalaali: true,
			isRTL: true,
		/*****end of persian jalali calendar configs ******/
            locale: $("body").data("js-lang"),
            editable: true,
            eventLimit: true,
            defaultView: mode,
            header: {
                left: 'next,prev today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            eventDrop: function(event) {
                $.ajax({
                    cache: false,
                    url: options.saveUrl,
                    contentType: "application/json",
                    type: "POST",
                    processData: false,
                    data: JSON.stringify({
                        "task_id": event.id,
                        "date_due": event.start.format()
                    })
                });
            },
            viewRender: function(view) {
                // Map view.name back and update location.hash
                for (var id in modeMapping) {
                    if (modeMapping[id] === view.name) { // Found
                        window.location.hash = id;
                        break;
                    }
                }
                var url = options.checkUrl;
                var params = {
                    "start": calendar.fullCalendar('getView').start.format(),
                    "end": calendar.fullCalendar('getView').end.format()
                };

                for (var key in params) {
                    url += "&" + key + "=" + params[key];
                }

                $.getJSON(url, function(events) {
                    calendar.fullCalendar('removeEvents');
                    calendar.fullCalendar('addEventSource', events);
                    calendar.fullCalendar('rerenderEvents');
                });
            }
        });
    };
});

KB.on('dom.ready', function () {
    function goToLink (selector) {
        if (! KB.modal.isOpen()) {
            var element = KB.find(selector);

            if (element !== null) {
                window.location = element.attr('href');
            }
        }
    }

    KB.onKey('v+c', function () {
        goToLink('a.view-calendar');
    });
});
