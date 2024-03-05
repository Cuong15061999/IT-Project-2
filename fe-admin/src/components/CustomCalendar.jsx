import { Calendar, DateLocalizer, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useMemo } from "react";
import PropTypes from 'prop-types'

const localizer = momentLocalizer(moment) // or globalizeLocalizer

export default function CustomCalendar({ data = [], mainView = 'month' }) {
    const defaultDate = useMemo(() => new Date(), [])
   
    return (
        <div className="myCustomHeight">
            <Calendar
                defaultView={mainView}
                defaultDate={defaultDate}
                events={data}
                localizer={localizer}
                popup
                startAccessor="startAt"
                endAccessor="endAt"
                titleAccessor="name" 
            />
        </div>
    )
}
CustomCalendar.propTypes = {
    localizer: PropTypes.instanceOf(DateLocalizer),
}