module.exports = () => {
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

                if(objResult[element.phone_id].)

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
        });

        resolve(objResult);
    })
};