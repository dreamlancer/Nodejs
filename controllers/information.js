const mongoose = require('mongoose');
const Information = require('../models/information');
const xml2js = require('xml2js');
const nodeGeocoder = require('node-geocoder');

const getAll = async (req, res) => {
    const data = await Information.find({});
    res.render('index', {data : data});
}

const xmlUploadInformation = async (req, res) => {
    const xml = req.body.xml_data;
    let data;
    xml2js.parseString(xml, (err, result) => {
        if(err) {
            throw err;
        }
        data = result;
    });
    let options = {
        provider: 'openstreetmap'
      };
       
    let geocoder = nodeGeocoder(options);

    for (let i = 0 ; i < data['Company']['HomeOwner'].length; i++) {
        
        const rest = await geocoder.geocode({
            address : data['Company']['HomeOwner'][i]['Address'][0]['Street'][0],
            country : data['Company']['HomeOwner'][i]['Address'][0]['Country'][0],
            city : data['Company']['HomeOwner'][i]['Address'][0]['City'][0],
            state : data['Company']['HomeOwner'][i]['Address'][0]['State'][0],
        })
        
        var date = new Date(data['Company']['HomeOwner'][i]['DOB'][0]);
        
        let isExist = await Information.find({email : data['Company']['HomeOwner'][i]['Email'][0]});
        
        if(isExist.length != 0) continue;
        const information = new Information({
            _id: mongoose.Types.ObjectId(),
            id: data['Company']['HomeOwner'][i]['Id'][0],
            first_name: data['Company']['HomeOwner'][i]['FirstName'][0],
            last_name: data['Company']['HomeOwner'][i]['LastName'][0],
            contact_no: data['Company']['HomeOwner'][i]['ContactNo'][0],
            email: data['Company']['HomeOwner'][i]['Email'][0],
            address: {
                street: data['Company']['HomeOwner'][i]['Address'][0]['Street'][0],
                city: data['Company']['HomeOwner'][i]['Address'][0]['City'][0],
                state: data['Company']['HomeOwner'][i]['Address'][0]['State'][0],
                postal_code: data['Company']['HomeOwner'][i]['Address'][0]['PostalCode'][0],
                country: data['Company']['HomeOwner'][i]['Address'][0]['Country'][0]
            },
            birthday: data['Company']['HomeOwner'][i]['DOB'][0],
            age : new Date().getFullYear() - date.getFullYear(),
            latitude: rest[0]['latitude'],
            longitude: rest[0]['longitude']
        });

        information.save()
        .then((newInformation) => {
            console.log("success");
        })
        .catch((error) => {
            console.log("err ------ ", error);
        });
    }        

    res.status(204).json({success: true,}) ;
}

const deleteInformation = async (req, res) => {
    for (let i = 0; i < req.body.ids.length; i++) {
        Information.findByIdAndRemove(req.body.ids[i])
        .exec()
        .then(()=> res.status(204).json({
            success: true,
        }))
        .catch((err) => {res.status(500).json({
            success: false,
        })});
    }
}

const editInformation = async (req, res) => {
    const data = await Information.find({_id:req.params.id});
    res.render('edit', {data : data});
}

const updateInformation = async (req, res) => {
    const id = req.body._id;
    const updateObject = req.body;
    updateObject.age = new Date().getFullYear() - new Date(updateObject.birthday).getFullYear();
    updateObject.address = {
        'street' : updateObject.street,
        'city' : updateObject.city,
        'state' : updateObject.state,
        'postal_code' : updateObject.postal_code,
        'country' : 'CA'
    }
    let options = {
        provider: 'openstreetmap'
      };
       
    let geocoder = nodeGeocoder(options);
    const rest = await geocoder.geocode({
        address : updateObject.street,
        country : 'CA',
        city : updateObject.city,
        state : updateObject.state,
    });
    if(rest.length != 0 ) {
        updateObject.latitude = rest[0]['latitude'];
        updateObject.longitude = rest[0]['longitude'];
    } else {
        updateObject.latitude = '';
        updateObject.longitude = '';
    }
    Information.update({ _id:id }, { $set:updateObject })
    .exec()
    .then(() => {
      res.redirect('/');
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: 'Server error. Please try again.'
      });
    });
}

module.exports = {
    getAll,
    xmlUploadInformation,
    deleteInformation,
    editInformation,
    updateInformation
}