import { Calendar, DateLocalizer, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useMemo } from "react";
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setTabHomeSelected } from "../store/myTasks";

const localizer = momentLocalizer(moment) // or globalizeLocalizer

export default function CustomCalendar({ mainView = 'month' }) {
    const listEvens = useSelector((state) => state.my_tasks.tasks);
    const userLogin = useSelector((state) => state.user_login.userLogin);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [listEventsMoment, setListEventsMoment] = useState([])
    const defaultDate = useMemo(() => new Date(), [])
    const handleSelectedEvent = (event) => {
        if (userLogin.role === 'student') {
            return;
        }
        
        navigate(`/event/${event._id}`);
        dispatch(setTabHomeSelected(0));
    }
    const randomColor = () => {
        const color = ['#90caf9', '#ef9a9a', '#80cbc4', '#81d4fa', '#ffcc80'];
        return color[Math.floor(Math.random() * color.length)];
    }
    useEffect(() => {
        setListEventsMoment(listEvens.map(item => ({
            ...item,
            startAt: new Date(moment(item.startAt).toDate()),
            endAt: new Date(moment(item.endAt).toDate()),
            color: randomColor()
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
                eventPropGetter={(event) => {
                    return {
                        style: {
                            backgroundColor: event.color,
                            color: '#000'
                        }
                    }
                }}
            />
        </div>
    )
}
CustomCalendar.propTypes = {
    localizer: PropTypes.instanceOf(DateLocalizer),
}