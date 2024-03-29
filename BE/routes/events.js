var express = require('express');
const eventServices = require('../services/eventServices')
const sendEmailService = require('../services/emailServices');
var router = express.Router();

/* GET All event. */
router.get('/userId/:userId?', async function (req, res, next) {
  try {
    let allEvents = []
    if (req.params.userId) {
      allEvents = await eventServices.getEventsByUserId(req.params.userId);
    }
    else {
      allEvents = await eventServices.getEvents();
    }
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

/* GET All event participate history. */
router.get('/history/userId/:userId?', async function (req, res, next) {
  try {
    let allEvents = []
    if (req.params.userId) {
      allEvents = await eventServices.getEventsHistoryByUserId(req.params.userId);
    }
    else {
      allEvents = await eventServices.getEvents();
    }
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

/* GET event total attend and activities point in year. */
router.get('/history-summary/:userId', async function (req, res, next) {
  try {
    const historySummary = await eventServices.getHistorySummary(req.params.userId);

    res.status(200).json({
      data: historySummary,
      message: 'Get History summary',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
})


/* Send email when some change happen in the Event */
router.post('/sendEmail/:id', async function (req, res, next) {
  try {
    const Event = await eventServices.getEvent(req.params.id);
    if (Event) {
      await sendEmailService.sendEditEventEmail(Event);
      return res.status(200).json({
        message: 'Send email successfully',
      });
    } else {
      return res.status(404).json({
        message: 'Can not find event with id ' + req.params.id,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
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
      //Send email to teacher who invited to new Event
      const newEvent = await eventServices.getEvent(addEvent._id);
      await sendEmailService.sendNewEventEmail(newEvent);

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
