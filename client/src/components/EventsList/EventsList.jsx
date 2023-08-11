import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
  deleteEvent,
  updateEventProgress,
} from '../../store/slices/eventSlice';
import styles from './EventsList.module.sass';
import classNames from 'classnames';

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
    alert(`Don\`t forget about '${name}' event`);
  }

  if (timeDifference < 0) {
    return { progress: 100, days, hours, minutes, seconds, isNotify };
  }
  return { progress, days, hours, minutes, seconds, isNotify };
};

const EventsList = ({ events, remove, updateEventProgress }) => {
  const updateProgress = () => {
    const updatedEvents = events.map(e => {
      const { progress, days, hours, minutes, seconds, isNotify } =
        calculateProgress(
          e.createdAt,
          e.date,
          e.time,
          e.daysNotify,
          e.hoursNotify,
          e.minutesNotify,
          e.secondsNotify,
          e.isNotify,
          e.name
        );
      return { ...e, progress, days, hours, minutes, seconds, isNotify };
    });
    updateEventProgress(updatedEvents);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      updateProgress();
    }, 1000);

    return () => clearInterval(interval);
  }, [events]);

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
                  <div className={styles.content}>{e.name}</div>
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
