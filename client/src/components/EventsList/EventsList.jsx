import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import {
  deleteEvent,
  updateEventProgress,
} from '../../store/slices/eventSlice';
import styles from './EventsList.module.sass';
import classNames from 'classnames';
import { useCallback } from 'react';

const calculateTime = time => {
  const days = Math.floor(time / (1000 * 60 * 60 * 24));
  const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((time % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
};

const calculateProgress = (
  createdAt,
  eventDate,
  eventTime,
  eventDaysNotify,
  eventHoursNotify,
  eventMinutesNotify,
  eventSecondsNotify,
  isNotify,
  isFinished,
  name
) => {
  const currentTime = new Date();
  const eventDateTime = new Date(`${eventDate} ${eventTime}`);
  const maxDifference = eventDateTime - new Date(createdAt);
  const timeDifference = eventDateTime - currentTime;

  const { days, hours, minutes, seconds } = calculateTime(timeDifference);
  const progress = (1 - timeDifference / maxDifference) * 100;

  if (
    isNotify &&
    eventDaysNotify * 86400000 +
      eventHoursNotify * 3600000 +
      eventMinutesNotify * 60000 +
      eventSecondsNotify * 1000 >=
      timeDifference
  ) {
    isNotify = false;
    toast(`Don\`t forget about '${name}' event`);
  }

  if (timeDifference < 0) {
    return {
      progress: 100,
      days,
      hours,
      minutes,
      seconds,
      isNotify,
      isFinished,
    };
  }
  return { progress, days, hours, minutes, seconds, isNotify, isFinished };
};

const EventsList = ({ events, remove, updateEventProgress }) => {
  const [isFilterActive, setIsFilterActive] = useState(false);

  const handleFilterToggle = () => {
    setIsFilterActive(!isFilterActive);
  };

  const updateProgress = useCallback(() => {
    const updatedEvents = events.map(e => {
      const { progress, days, hours, minutes, seconds, isNotify, isFinished } =
        calculateProgress(
          e.createdAt,
          e.date,
          e.time,
          e.daysNotify,
          e.hoursNotify,
          e.minutesNotify,
          e.secondsNotify,
          e.isNotify,
          e.isFinished,
          e.name
        );
      return {
        ...e,
        progress,
        days,
        hours,
        minutes,
        seconds,
        isNotify,
        isFinished,
      };
    });

    const finishedProgressEvents = updatedEvents.filter(
      e => e.progress === 100
    );
    const newFinishedEvents = updatedEvents.filter(
      e => e.progress === 100 && !e.isFinished
    );

    if (finishedProgressEvents.length > 0 && newFinishedEvents.length > 0) {
      toast(`All finished events: ${finishedProgressEvents.length}`, {
        className: styles.redToast,
      });
    }

    const finishedEvents = updatedEvents.map(e => {
      if (newFinishedEvents.some(newEvent => newEvent.id === e.id)) {
        return { ...e, isFinished: true };
      } else {
        return e;
      }
    });

    const filteredEvents = isFilterActive
      ? finishedEvents.filter(event => event.progress !== 100)
      : finishedEvents;

    updateEventProgress(filteredEvents);
  }, [events, isFilterActive, updateEventProgress]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateProgress();
    }, 1000);

    return () => clearInterval(interval);
  }, [updateProgress]);

  const eventsSorted = [...events].sort(
    (a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`)
  );
  const eventsCompleted = [...events].filter(e => e.progress === 100);

  return (
    <div className={styles.events}>
      {eventsSorted.length > 0 ? (
        <>
          <div className={styles.eventsTitle}>
            <p className={styles.eventsListTitle}>Live upcomming checks</p>
            {eventsCompleted.length > 0 ? (
              <p
                className={styles.eventsCompleted}
              >{`Completed ${eventsCompleted.length}`}</p>
            ) : null}
          </div>
          <ul
            className={
              eventsSorted.length > 6
                ? classNames(styles.eventUl, styles.overflowContainer)
                : styles.eventUl
            }
          >
            {eventsSorted.map(e => {
              const progressStyle = {
                width: `${e.progress}%`,
                backgroundColor: e.progress === 100 ? '#ff3b3b' : '#35e65c',
                height: '100%',
              };

              const eventLiStyle = {
                marginRight: '20px',
              };

              let time = '';
              if (e.days > 0) time += `${e.days} d `;
              if (e.hours > 0) time += `${e.hours} h `;
              if (e.minutes > 0) time += `${e.minutes} m `;
              if (e.seconds >= 0) time += `${e.seconds} s`;
              if (time === '') time = 'Completed';

              return (
                <li
                  className={styles.eventLi}
                  style={eventsSorted.length > 6 ? eventLiStyle : {}}
                  key={e.id}
                >
                  <div
                    className={styles.progressStyle}
                    style={progressStyle}
                  ></div>
                  <div className={classNames(styles.content, styles.nameText)}>
                    {e.name}
                  </div>
                  <div className={styles.contentBox}>
                    <div className={styles.content}>{time}</div>
                    <button
                      className={classNames(styles.content, styles.closeBtn)}
                      onClick={() => remove(e.id)}
                    >
                      X
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className={styles.checkboxContainer}>
            Delete all completed
            <label className={styles.switch}>
              <input
                type='checkbox'
                checked={isFilterActive}
                onChange={handleFilterToggle}
              />
              <span className={classNames(styles.slider, styles.round)}></span>
            </label>
          </div>
        </>
      ) : (
        <p className={styles.eventsListTitle}>No upcoming checks</p>
      )}
    </div>
  );
};

const mapStateToProps = ({ eventStore }) => eventStore;

const mapDispatchToProps = dispatch => ({
  remove: id => dispatch(deleteEvent(id)),
  updateEventProgress: updatedEvents => {
    dispatch(updateEventProgress(updatedEvents));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EventsList);
