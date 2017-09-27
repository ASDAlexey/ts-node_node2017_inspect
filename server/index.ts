import * as express from 'express';
import * as Hubspot from 'hubspot';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';

const hubspot = new Hubspot({ apiKey: '56fed61e-a134-4844-a4d9-763333dc5ef8' });

const app = express();

app.use(cors());
app.use(bodyParser.json());


const getHubSpotProps = (obj: any) => {
  const options = [];
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      options.push({
        property: prop.toLowerCase(),
        value: obj[prop],
      })
    }
  }

  return { properties: options };
};

app.get('/contacts', (req, res) => {
  hubspot.contacts.get().then(results => {
    res.json(results)
  }).catch(err => {
    res.json(err)
  });
});

app.get('/contacts/:id', (req, res) => {
  const { id } = req.params;
  hubspot.contacts.getById(id).then(results => {
    res.json(results);
  }).catch(err => {
    res.json(err);
  });
});

app.post('/contacts', (req, res) => {
  const { email, firstName, lastName } = req.body;
  const options = getHubSpotProps({ email, firstName, lastName });

  hubspot.contacts.create(options).then(results => {
    res.json(results)
  }).catch(err => {
    res.json(err)
  });
});

app.put('/contacts/:id', (req, res) => {
  const { id } = req.params;
  const { email, firstName, lastName } = req.body;
  const options = getHubSpotProps({ email, firstName, lastName });

  hubspot.contacts.update(id, options).then(results => {
    hubspot.contacts.getById(id).then(results => {
      res.json(results)
    }).catch(err => {
      res.json(err)
    });
  }).catch(err => {
    res.json(err)
  });
});

app.listen(3000, function () {
  console.info('HubSpot app listening on port 3000!');
});