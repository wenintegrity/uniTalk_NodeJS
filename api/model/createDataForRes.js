module.exports = (docs) => {
    return new Promise((resolve, reject) => {
        let objResult = {};

        docs.forEach(element => {
            element.phone_id in objResult ? addNewPropertyPhone() : addNewPhone();

            function addNewPropertyPhone() {
                objResult[element.phone_id].arr.push({
                    id: element._id,
                    location: element.reqBody.location,
                    time: element.reqBody.time
                });

                filterLocations();
            }

            function addNewPhone() {
                objResult[element.phone_id] = {
                    arr: [
                        {
                            id: element._id,
                            location: element.reqBody.location,
                            time: element.reqBody.time
                        }
                    ],
                    locations: [
                        {
                            location: element.reqBody.location,
                            arr_id: [element._id]
                        }
                    ]
                }
            }

            function filterLocations() {
                let faultLatitude = 0.000350924;
                let faultLongitude = 0.000224951;

                let isLocation = objResult[element.phone_id].locations.some(loc => {
                    if ((loc.location.latitude + faultLatitude) > element.reqBody.location.latitude &&
                        (loc.location.latitude - faultLatitude) < element.reqBody.location.latitude &&
                        (loc.location.longitude + faultLongitude) > element.reqBody.location.longitude &&
                        (loc.location.longitude - faultLongitude) < element.reqBody.location.longitude) {
                        loc.arr_id.push(element._id);
                        return true;
                    }
                });

                if (!isLocation) {
                    objResult[element.phone_id].locations.push({
                        location: element.reqBody.location,
                        arr_id: [element._id]
                    });
                }
            }
        });

        resolve(objResult);
    })
};