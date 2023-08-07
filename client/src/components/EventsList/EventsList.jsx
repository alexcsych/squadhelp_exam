import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
  deleteEvent,
  updateEventProgress,
} from '../../store/slices/eventSlice';
import style from './EventsList.module.sass';

const calculateTime = time => {
  const days = Math.floor(time / (1000 * 60 * 60 * 24));
  const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((time % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
};

const calculateProgress = (createdAt, eventDate, eventTime) => {
  const currentTime = new Date();
  const eventDateTime = new Date(`${eventDate} ${eventTime}`);
  const maxDifference = eventDateTime - new Date(createdAt);
  const timeDifference = eventDateTime - currentTime;

  const { days, hours, minutes, seconds } = calculateTime(timeDifference);
  const progress = (1 - timeDifference / maxDifference) * 100;

  if (timeDifference < 0) {
    return { progress: 100, days, hours, minutes, seconds };
  }
  return { progress, days, hours, minutes, seconds };
};

const EventsList = ({ events, remove, updateEventProgress }) => {
  const updateProgress = () => {
    const updatedEvents = events.map(e => {
      const { progress, days, hours, minutes, seconds } = calculateProgress(
        e.createdAt,
        e.date,
        e.time
      );
      return { ...e, progress, days, hours, minutes, seconds };
    });
    updateEventProgress(updatedEvents);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      updateProgress();
    }, 1000);

    return () => clearInterval(interval);
  }, [events]);

  const eventsSorted = [...events].sort((a, b) => b.progress - a.progress);
  const eventsCompleted = [...events].filter(e => e.progress === 100);

  return (
    <div className={style.events}>
      {eventsSorted.length > 0 ? (
        <>
          <div className={style.eventsTitle}>
            <p className={style.eventsListTitle}>Live upcomming checks</p>
            {eventsCompleted.length > 0 ? (
              <p
                className={style.eventsCompleted}
              >{`Completed ${eventsCompleted.length}`}</p>
            ) : null}
          </div>
          <ul
            className={
              eventsSorted.length > 6
                ? `${style.eventUl} ${style.overflowContainer}`
                : style.eventUl
            }
          >
            {eventsSorted.map(e => {
              const progressStyle = {
                width: `${e.progress}%`,
                backgroundColor: e.progress === 100 ? '#ff3b3b' : '#35e65c',
                height: '100%',
              };

              let time = '';
              if (e.days > 0) time += `${e.days} d `;
              if (e.hours > 0) time += `${e.hours} h `;
              if (e.minutes > 0) time += `${e.minutes} m `;
              if (e.seconds >= 0) time += `${e.seconds} s`;
              if (time === '') time = 'Completed';

              return (
                <li className={style.eventLi} key={e.id}>
                  <div
                    className={style.progressStyle}
                    style={progressStyle}
                  ></div>
                  <div className={style.content}>{e.name}</div>
                  <div className={style.contentBox}>
                    <div className={style.content}>{time}</div>
                    <button
                      className={`${style.content} ${style.closeBtn}`}
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
        <p className={style.eventsListTitle}>No upcoming checks</p>
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
