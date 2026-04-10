import {Notificationbox} from "./styles.js";

const Notification = ({ message }) => {
    if (message === null) {
        return null
    }

    {/*
    return <div className="error">{message}</div>
    */}

    return (
        <Notificationbox>
            {message}
        </Notificationbox>
    )
}

export default Notification