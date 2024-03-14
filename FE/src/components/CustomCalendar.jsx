import { Calendar, DateLocalizer, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useMemo } from "react";
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux';
import { openModalEditTask } from '../store/myTasks';
import { useEffect } from "react";
import { useState } from "react";

const localizer = momentLocalizer(moment) // or globalizeLocalizer

export default function CustomCalendar({ mainView = 'month' }) {
    const listEvens = useSelector((state) => state.my_tasks.tasks);
    const [listEventsMoment, setListEventsMoment] = useState([])
    const dispatch = useDispatch();

    const defaultDate = useMemo(() => new Date(), [])
    const handleSelectedEvent = (event) => {
        dispatch(openModalEditTask({
            action: 'edit',
            taskSelected: {
                ...event,
                startAt: event.startAt.toISOString(),
                endAt: event.endAt.toISOString(),
            }
        }));
    }
    useEffect(() => {
        setListEventsMoment(listEvens.map(item => ({
            ...item,
            startAt: new Date(moment(item.startAt).toDate()),
            endAt: new Date(moment(item.endAt).toDate())
        })))
    }, [listEvens]);
    useEffect(() => {
        console.log(listEventsMoment)
    }, [listEventsMoment]);
    return (
        <div className="myCustomHeight">
            <Calendar
                defaultView={mainView}
                defaultDate={defaultDate}
                events={listEventsMoment}
                localizer={localizer}
                popup
                startAccessor="startAt"
                endAccessor="endAt"
                titleAccessor="name"
                onSelectEvent={handleSelectedEvent}
            />
        </div>
    )
}
CustomCalendar.propTypes = {
    localizer: PropTypes.instanceOf(DateLocalizer),
}