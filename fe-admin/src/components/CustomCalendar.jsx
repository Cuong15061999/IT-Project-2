import { Calendar, DateLocalizer, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useMemo } from "react";
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux';
import { openModalEditTask } from '../store/myTasks';

const localizer = momentLocalizer(moment) // or globalizeLocalizer

export default function CustomCalendar({ mainView = 'month' }) {
    const listEvens = useSelector((state) => state.my_tasks.tasks);
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
    return (
        <div className="myCustomHeight">
            <Calendar
                defaultView={mainView}
                defaultDate={defaultDate}
                events={listEvens.map(item => ({
                    ...item,
                    startAt: moment(item.startAt),
                    endAt: moment(item.endAt),
                }))}
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