define(['dojo/topic'
], function (topic) {

    topic.subscribeStore = function (topicName, listener, stores) {
        var cb = function (evt) {
            if (Array.isArray(stores) && stores.indexOf(evt.store) >= 0 || stores == evt.store) {
                listener(evt);
            }
        }
        return topic.subscribe(topicName, cb);
    }

    return topic;

});
