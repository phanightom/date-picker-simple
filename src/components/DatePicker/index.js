import React, { useState, useEffect, useRef, createRef, useReducer } from 'react'
import {
  getDateStringFromTimestamp,
  getMonthDetails,
} from './shared'
import PropTypes from 'prop-types'

const date = new Date()
const oneDay = 60 * 60 * 24 * 1000
const todayTimestamp = date.getTime() - (date.getTime() % oneDay) + (date.getTimezoneOffset() * 1000 * 60)
const monthMap = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const monthShortMap = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const initialState = {
  todayTimestamp: todayTimestamp,
  year: date.getFullYear(),
  month: date.getMonth(),
  selectedDay: todayTimestamp,
  monthDetails: getMonthDetails(date.getFullYear(), date.getMonth())
}

const DatePicker = (props) => {
  const el = useRef(null)
  const inputRef = createRef()
  const [state, dispatch] = useReducer(reducer, initialState)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [calandarStatus, setCalandarStatus] = useState(0)
  const isOriginCalandar = calandarStatus === 0;
  const isMonthCalandar = calandarStatus === 1;

  const setDateToInput = (timestamp) => {
    const dateString = getDateStringFromTimestamp(timestamp)
    inputRef.current.value = dateString
  }

  useEffect(() => {
    setDateToInput(state.selectedDay)
  }, [showDatePicker])

  const isCurrentDay = day => day.timestamp === todayTimestamp
  const isSelectedDay = day => day.timestamp === state.selectedDay
  const isSelectedMonth = month => month === state.month
  const getMonthStr = month => monthMap[Math.max(Math.min(11, month), 0)] || 'Month'

  const onDateClick = day => {
    dispatch({ type: 'selectedDay', value: day.timestamp })
    setDateToInput(day.timestamp)
    props.onChange(day.timestamp)
  }

  const onMonthClick = month => {
    dispatch({ type: 'month', value: month })
    dispatch({ type: 'monthDetails', value: getMonthDetails(state.year, month) })
  }

  const setYear = offset => {
    const year = state.year + offset
    dispatch({ type: 'year', value: year })
    dispatch({ type: 'monthDetails', value: getMonthDetails(year, state.month) })
  }

  const setMonth = offset => {
    let year = state.year
    let month = state.month + offset
    if (month === -1) {
      month = 11
      year--
    } else if (month === 12) {
      month = 0
      year++
    }

    dispatch({ type: 'year', value: year })
    dispatch({ type: 'month', value: month })
    dispatch({ type: 'monthDetails', value: getMonthDetails(year, month) })
  }

  const setDate = dateData => {
    const selectedDay = new Date(dateData.year, dateData.month - 1, dateData.date).getTime()
    dispatch({ type: 'selectedDay', value: selectedDay })
    props.onChange(selectedDay)
  }

  const getDateFromDateString = dateValue => {
    const dateData = dateValue.split('-').map(d => parseInt(d, 10))

    if (dateData.length < 3) {
      return null
    }

    const year = dateData[0]
    const month = dateData[1]
    const date = dateData[2]
    return { year, month, date }
  }

  const updateDateFromInput = () => {
    const dateValue = inputRef.current.value
    const dateData = getDateFromDateString(dateValue)

    if (dateData !== null) {
      setDate(dateData)
      dispatch({ type: 'year', value: dateData.year })
      dispatch({ type: 'month', value: dateData.month - 1 })
      dispatch({ type: 'monthDetails', value: getMonthDetails(dateData.year, dateData.month - 1) })
    }
  }

  const daysMarkup = (
    state.monthDetails.map((day, index) => (
      <div className={'c-day-container ' + (day.month !== 0 ? ' disabled' : '') +
        (isCurrentDay(day) ? ' highlight' : '') + (isSelectedDay(day) ? ' highlight-red' : '')} key={index}>
        <div className='cdc-day'>
          <span onClick={() => onDateClick(day)}>
            {day.date}
          </span>
        </div>
      </div>
    ))
  )

  const calendarMarkup = (
    <div className='c-container'>
      <div className='cc-head'>
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d, i) => <div key={i} className='cch-name'>{d}</div>)}
      </div>
      <div className='cc-body'>
        {daysMarkup}
      </div>
    </div>
  )

  const calendarMonthMarkup = (
    <div>
      {
        monthShortMap.map((d, i) => {
          return (
            <div
              key={i}
              className={`cdc-month` + `${isSelectedMonth(i) ? ' cdc-month-highlight-red' : ''}`}
              onClick={() => {
                onMonthClick(i);
                setCalandarStatus(0);
              }}
            >
              {d}
            </div>
          )
        })}
    </div>
  );
  return (
    <div ref={el} className='MyDatePicker'>
      <div className='mdp-input' onClick={() => setShowDatePicker(true)}>
        <input
          type='date'
          ref={inputRef}
          onChange={updateDateFromInput}
        />
      </div>
      {showDatePicker ? (
        <div className='mdp-container'>
          <div className='mdpc-head'>
            <div className='mdpch-button'>
              <div
                className='mdpchb-inner'
                onClick={() => {
                  if (isOriginCalandar) {
                    setMonth(-1)
                  } else {
                    setYear(-1)
                  }
                }}
              >
                <span className='mdpchbi-left-arrow'></span>
              </div>
            </div>
            <div className='mdpch-container'>
              <div onClick={() => { setCalandarStatus(1) }}>
                <div className={`mdpchc-year ${isMonthCalandar ? 'mdpchc-year-vertical' : ''}`}>{state.year}</div>
                {
                  isOriginCalandar && (
                    <div className='mdpchc-month'>{getMonthStr(state.month)}</div>
                  )
                }
              </div>
            </div>
            <div className='mdpch-button'>
              <div
                className='mdpchb-inner'
                onClick={() => {
                  if (isOriginCalandar) {
                    setMonth(1)
                  } else {
                    setYear(1)
                  }
                }}
              >
                <span className='mdpchbi-right-arrow'></span>
              </div>
            </div>
          </div>
          <div className='mdpc-body'>
            {isOriginCalandar && calendarMarkup}
            {isMonthCalandar && calendarMonthMarkup}
          </div>
        </div>
      ) : ''}
    </div>
  )
}

function reducer(state, action) {
  if (state.hasOwnProperty(action.type)) {
    return {
      ...state,
      [`${action.type}`]: action.value
    }
  }
}

DatePicker.propTypes = {
  onChange: PropTypes.func.isRequired
}

export default DatePicker;