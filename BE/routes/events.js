var express = require('express');
const eventServices = require('../services/eventServices')
const sendEmailService = require('../services/emailServices')
var router = express.Router();

/* GET All event. */
router.get('/', async function (req, res, next) {
  try {
    const allEvents = await eventServices.getEvents();
    res.status(200).json({
      data: allEvents,
      message: 'Get all events',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
});

/* GET All event. */
router.post('/sendEmail', async function (req, res, next) {
  try {
    const response = await sendEmailService.setEmail(req.body.listemails, req.body.content, req.body.subject);
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
});

/* GET All event by year and status. */
router.get('/year/:year?/status/:status?', async function (req, res, next) {
  try {
    const targetYear = req.params.year || new Date().getFullYear();
    const status = req.params.status || null;
    const allEventsInYear = await eventServices.getEventsInYear(targetYear, status);
    res.status(200).json({
      total: allEventsInYear.length,
      data: allEventsInYear,
      message: 'Get all events in Year ' + req.params.year,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
});

/* GET events summary in current year */
router.get('/summary/year', async function (req, res, next) {
  try {
    const summary = await eventServices.getSummaryEventsInYear();
    res.status(200).json({
      summary: summary
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
})

/* GET events summary in current month */
router.get('/summary/month', async function (req, res, next) {
  try {
    const summary = await eventServices.getSummaryEventsInMonth();
    res.status(200).json({
      summary: summary
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
})

/* GET 10 newest event*/
router.get('/newest', async function (req, res, next) {
  try {
    const newestEvents = await eventServices.getNewestEvents();
    res.status(200).json({
      data: newestEvents,
      message: 'Get newest events',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
});

/* GET Specific event. */
router.get('/:id', async function (req, res, next) {
  try {
    const event = await eventServices.getEvent(req.params.id);
    if (event) {
      res.status(200).json({
        data: event,
        message: 'Get event with id: ' + req.params.id,
      });
    } else {
      res.status(404).json({
        message: 'Can not find event with id' + req.params.id,
      })
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
});

/* ADD event. */
router.post('/', async function (req, res, next) {
  try {
    const addEvent = await eventServices.addEvent(req);
    if (addEvent) {
      res.status(200).json({
        data: addEvent,
        message: 'Add event successfully',
      });
    } else {
      res.status(404).json({
        message: 'Event already existed',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
});

/* Edit event. */
router.put('/:id', async function (req, res, next) {
  try {
    const updateEvent = await eventServices.editEvent(req);
    if (updateEvent) {
      res.status(200).json({
        data: updateEvent,
        message: 'Edit event with id:' + req.params.id,
      });
    } else {
      res.status(404).json({
        message: 'Can not find event with id:' + req.params.id,
      })
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

/* Delete event. */
router.delete('/:id', async function (req, res, next) {
  try {
    const delEvent = await eventServices.delEvent(req.params.id);
    if (delEvent) {
      res.status(200).json({
        data: delEvent,
        message: 'Del event with id: ' + req.params.id,
      });
    } else {
      res.status(200).json({
        message: 'Can not find event with id: ' + req.params.id,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
});

module.exports = router;
