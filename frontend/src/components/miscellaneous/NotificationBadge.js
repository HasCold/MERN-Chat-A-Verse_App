import React from 'react'
import './NotificationBadge.css'

// const {notification, setNotification} = useContext(ChatContext)

const NotificationBadge = ({notification}) => {

  return (
    <div className='notification-badge'>
        {/* The && operator is used to conditionally render the element. It checks if the left-hand side (LHS) of the expression is truthy, and if it is, it evaluates the right-hand side (RHS) and returns it. If the LHS is falsy, it returns the LHS without evaluating the RHS.So in this case, if notification.length > 0 is true, the LHS is truthy, so the RHS will be evaluated and the span element will be rendered with the value of the count prop inside. If notification.length > 0 is false, the LHS is falsy, so nothing will be rendered. */}
        
    {
        notification.length > 0 && <span className='badge'>{notification.length}</span>
    }
    </div>
  )
}

export default NotificationBadge