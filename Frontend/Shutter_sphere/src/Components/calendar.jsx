import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from "../utils/apiBase";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { EventPoPup } from './EventPoPup';

const Calendar = ({ signupId = '67d27565fea30f109c22501c', isPhotographer = true }) => {
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventDescription, setNewEventDescription] = useState('');
    const [newEventDate, setNewEventDate] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const calendarRef = useRef(null);
    const [addEventMessage, setAddEventMessage] = useState(false);

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const showAddEventMessage = () => {
        setAddEventMessage(true);
        setTimeout(() => setAddEventMessage(false), 3000);
      };
    useEffect(() => {

        fetchEvents();
        const calendarApi = calendarRef.current.getApi();
        calendarApi.gotoDate(selectedDate);
    }, [signupId], [selectedDate]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/calendar/event/${signupId}`);
            const formattedEvents = Array.isArray(response.data) ? response.data.map(event => ({
                id: event._id,
                title: event.title,
                date: event.date,
                description: event.description || '',
                backgroundColor: '#EAB305',
                borderColor: '#EAB305',
                textColor: '#000000',
                extendedProps: { // Only include non-cyclic data here
                    description: event.description,
                    // Optionally, you can include other non-cyclic data from the event
                }
            })) : [];
            setEvents(formattedEvents);
        } catch (error) {
            console.error("Error fetching events:", error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };
    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };


    const handleEventClick = (clickInfo) => {
        setSelectedEvent({
            id: clickInfo.event.id,
            title: clickInfo.event.title,
            description: clickInfo.event.extendedProps.description || "",
            start: clickInfo.event.startStr,
        });
    };


    const handleDateClick = (dateClickInfo) => {
        if (!isPhotographer) return;

        setNewEventDate(dateClickInfo.dateStr); // Set the selected date for the event
        setNewEventTitle('');
        setNewEventDescription('');
        setIsModalOpen(true); // Open the modal
    };

    const handleAddEvent = async (title, description, date) => {
       

        try {
            const eventData = {
                signupId,
                title,
                description: description || "",
                date,
            };

            const response = await axios.post(`${API_BASE_URL}/calendar/event`, eventData);

            const newEvent = {
                id: response.data._id,
                title: response.data.title,
                date: response.data.date,
                description: response.data.description || '',
                backgroundColor: '#EAB305',
                borderColor: '#EAB305',
                textColor: '#000000',
                extendedProps: { description: response.data.description || '' }
            };
            console.log("New Event:", JSON.stringify(newEvent, (key, value) => {
                if (typeof value === 'function') return undefined;
                return value;
            }, 2));

            const calendarApi = calendarRef.current.getApi();
            calendarApi.addEvent(newEvent);

            setEvents([...events, newEvent]);
            showAddEventMessage()
                        setIsModalOpen(false);
        } catch (error) {
            console.error("Error adding event:", error);
            toast.error("Failed to add event");
        }
    };



    const handleDeleteEvent = async () => {
        if (!selectedEvent?.id) return;
        if (!confirm("Are you sure you want to delete this event?")) return;

        try {
            await axios.delete(`${API_BASE_URL}/calendar/event/${selectedEvent.id}`);
            setEvents(events.filter(e => e.id !== selectedEvent.id));

            const calendarApi = calendarRef.current.getApi();
            const eventToDelete = calendarApi.getEventById(selectedEvent.id);
            if (eventToDelete) {
                eventToDelete.remove();
            }

            setSelectedEvent(null);
            toast.success("Event deleted successfully");
        } catch (error) {
            console.error("Error deleting event:", error);
            toast.error("Failed to delete event");
        }
    };

    return (
        <div className="w-full min-h-screen px-10 py-10 bg-[#1E293B]">
            <div className="p-6 bg-[#111827] rounded-xl shadow-xl text-gray-200">
                <ToastContainer position="top-right" autoClose={3000} />

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Calendar Section */}
                    <div className="w-full lg:w-2/3 custom-calendar">
                        <div className="flex items-center mb-4 space-x-4">
                            {/* Native Date Picker */}
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={handleDateChange}
                                className="p-2 rounded-lg border bg-[#374151] text-white"
                            />
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center h-96">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#EAB305]"></div>
                            </div>
                        ) : (
                            <FullCalendar
                                ref={calendarRef}
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                initialView="dayGridMonth"
                                headerToolbar={{
                                    left: 'prev,next today',
                                    center: 'title',
                                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                                }}
                                buttonText={{
                                    today: 'Today',
                                    month: 'Month',
                                    week: 'Week',
                                    day: 'Day',
                                }}
                                events={events}
                                dateClick={handleDateClick}
                                eventClick={handleEventClick}
                                height="auto"
                                aspectRatio={1.8}
                                themeSystem="standard"
                                eventTimeFormat={{
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    meridiem: 'short',
                                }}
                                dayMaxEvents={true}
                            />
                        )}
                    </div>


  {/* Login Message Popup */}
      <AnimatePresence>
        {addEventMessage && (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }} // Slide in from the right
            animate={{ opacity: 1, x: 0, scale: 1 }} // Appear smoothly
            exit={{ opacity: 0, x: 50, scale: 0.9 }} // Slide out to the right
            transition={{ duration: 0.5, ease: "easeOut", bounce: 0.3 }} // Smooth + bounce
            className="absolute top-20 right-5 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 border border-yellow-500 shadow-yellow-400/50"
          >
            {/* Camera Icon & Message */}

            <span className="font-medium">📸 Event Added Successfully</span>


            {/* Enhanced Progress Bar */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 3, ease: "linear" }}
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-yellow-400 to-red-500"
            />
          </motion.div>
        )}
      </AnimatePresence>

                    {/* Event Details Sidebar */}
                    <div className="w-full lg:w-1/3 mt-6 lg:mt-0 ">
                        <div className="bg-[#1F2937] p-5 rounded-xl border border-gray-700 h-full">
                            <h3 className="text-xl font-bold mb-4 text-white">
                                {selectedEvent
                                    ? `Event Details`
                                    : `Upcoming Events`}
                            </h3>

                            {selectedEvent ? (
                                <div className="bg-[#374151] p-4 rounded-lg shadow border border-gray-600 hover:border-[#EAB305] transition-colors duration-200 ">
                                    <div className="flex justify-between items-start ">
                                        <div className="flex items-center ">
                                            <div className="w-3 rounded-full bg-[#EAB305] mr-2 flex-shrink-0"></div>
                                            <h4 className="font-medium text-white">{selectedEvent.title}</h4>
                                        </div>
                                        {isPhotographer && (
                                            <button
                                                onClick={handleDeleteEvent}
                                                className="text-gray-400 hover:text-[#EAB305] transition-colors duration-200"
                                            >
                                                &times;
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-400 mt-2 ml-5">
                                        {new Date(selectedEvent.start).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </p>
                                    {selectedEvent.extendedProps.description && (
                                        <p className="text-sm mt-2 text-gray-300 ml-5">
                                            {selectedEvent.extendedProps.description}
                                        </p>
                                    )}
                                    <button
                                        onClick={() => setSelectedEvent(null)}
                                        className="mt-4 w-full px-4 py-2 bg-[#1F2937] hover:bg-[#374151] text-white rounded-lg transition duration-200"
                                    >
                                        Back to List
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                    {events.length > 0 ? (
                                        events
                                            .sort((a, b) => new Date(a.date) - new Date(b.date))
                                            .map((event) => (
                                                <div
                                                    key={event.id}
                                                    className="bg-[#374151] p-4 rounded-lg shadow border border-gray-600 hover:border-[#EAB305] transition-colors duration-200 cursor-pointer"
                                                    onClick={() => {
                                                        // Find the corresponding FullCalendar event object
                                                        const calendarApi = calendarRef.current.getApi();
                                                        const fcEvent = calendarApi.getEventById(event.id);
                                                        if (fcEvent) {
                                                            setSelectedEvent(fcEvent);
                                                        }
                                                    }}
                                                >
                                                    <div className="flex items-center">
                                                        <div className="w-3 h-3 rounded-full bg-[#EAB305] mr-2 flex-shrink-0"></div>
                                                        <h4 className="font-medium text-white">{event.title}</h4>
                                                    </div>
                                                    <p className="text-sm text-gray-400 mt-2 ml-5">
                                                        {new Date(event.date).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                    {event.description && (
                                                        <p className="text-sm mt-2 text-gray-300 ml-5 line-clamp-2">
                                                            {event.description}
                                                        </p>
                                                    )}
                                                </div>
                                            ))
                                    ) : (
                                        <p className="text-gray-400 text-center py-6">No upcoming events</p>
                                    )}
                                </div>
                            )}

                            {isPhotographer && !selectedEvent && (
                                <div className="mt-6">
                                    <button
                                        onClick={() => {
                                            // Open modal and prefill date from calendar
                                            const calendarApi = calendarRef.current.getApi();
                                            const dateStr = calendarApi.getDate().toISOString().split('T')[0];
                                            setNewEventDate(dateStr);
                                            setIsModalOpen(true); // Show the modal
                                        }}
                                        className="w-full px-4 py-2 bg-[#EAB305] text-black font-medium hover:bg-[#F5C13C] rounded-lg transition duration-200"
                                    >
                                        Add Event
                                    </button>

                                    {/* EventPopUp Modal */}
                                    <EventPoPup
                                        isOpen={isModalOpen}
                                        onClose={() => setIsModalOpen(false)}
                                        title={newEventTitle}
                                        setTitle={setNewEventTitle}
                                        description={newEventDescription}
                                        setDescription={setNewEventDescription}
                                        date={newEventDate}
                                        onSave={handleAddEvent}
                                    />

                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional CSS for FullCalendar styling */}
            <style global="true">{`
    .custom-calendar {
      --fc-border-color: #374151;
      --fc-button-bg-color: #1F2937;
      --fc-button-border-color: #374151;
      --fc-button-hover-bg-color: #374151;
      --fc-button-hover-border-color: #4B5563;
      --fc-button-active-bg-color: #4B5563;
      --fc-today-bg-color: rgba(234, 179, 5, 0.15);
      --fc-page-bg-color: #111827;
      --fc-neutral-bg-color: #1F2937;
      --fc-list-event-hover-bg-color: #374151;
      --fc-theme-standard-border-color: #374151;
    }

    .fc .fc-toolbar-title {
      color: #FFFFFF;
    }

    .fc .fc-col-header-cell {
      background-color: #1F2937;
    }

    .fc .fc-col-header-cell-cushion {
      color: #9CA3AF;
      font-weight: 600;
      padding: 10px 4px;
    }

    .fc .fc-daygrid-day-top {
      justify-content: left;
      padding-left: 5px;
      padding-top: 3px;
    }

    .fc .fc-daygrid-day-number {
      color: #E5E7EB;
      font-size: 0.875rem;
    }

    .fc .fc-day-today .fc-daygrid-day-number {
      background-color: #EAB305;
      color: #000;
      border-radius: 50%;
      width: 26px;
      height: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .fc-theme-standard .fc-scrollgrid {
      border-color: #374151;
    }

    .fc-theme-standard td, .fc-theme-standard th {
      border-color: #374151;
    }

    .fc .fc-button {
      color: #FFFFFF;
    }

    .fc .fc-button-primary:not(:disabled):active, 
    .fc .fc-button-primary:not(:disabled).fc-button-active {
      background-color: #4B5563;
      border-color: #6B7280;
    }
`}</style>

        </div>
    );
};

export default Calendar;