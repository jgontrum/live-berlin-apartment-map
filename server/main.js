import {
    Meteor
} from 'meteor/meteor';

Meteor.publishComposite('immos', (limit) => {
    return {
        find() {
            return Immos.find({
                "geocoding.accuracy": "ROOFTOP"
            }, {
                sort: {
                    createdAt: -1
                },
                fields: {
                    "geocoding.lng": true,
                    "geocoding.lat": true,
                    "rent": true,
                    "totalRent": true,
                    "createdAt": true
                },
                limit: Math.min(limit, 1500)
            });
        }
    }
});
