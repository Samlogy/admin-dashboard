import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import TopBar from "../../Components/TopBar/TopBar"
import SideBar from "../../Components/SideBar/SideBar"

import Avatar from "../../Components/Avatar/Avatar"
import Accordion from "../../Components/Accordion/Accordion"
// import proxy from "../../proxy"
import "./style.css";
const proxy = "http://localhost:5000"

const Notifications = () => {
    const [notif, setNotif] = useState({
        response: [], contacts: [], posts: [], comments: [], appNews: [], type: "all", loading: false
      })
    
    //   const { addToast } = useToasts()
      const authStore = useSelector(state => state.auth)
    
      /* API Calls */
      // sort notifs arr into arrs according to types retrieved
      const sortNotifs = (data) => {
        data.forEach(el => { 
          switch (el.type) {
            case "contact": {
              setNotif((prevState) => {
                return { ...prevState, contacts: [...prevState.contacts, el]}
              })
              break
            }
            case "comment": {
              setNotif((prevState) => {
                return { ...prevState, comments: [...prevState.comments, el]}
              })
              break
            }
            case "post": {
              setNotif((prevState) => {
                return { ...prevState, posts: [...prevState.posts, el]}
              })
              break
            }
            case "appNews": {
              setNotif((prevState) => {
                return { ...prevState, appNews: [...prevState.appNews, el]}
              })
              break
            }
            default: break
          }
        })
      };
      const checkType = (type) => {
        switch(type) {
          case "all": {
            return <>
                    { displayNotifs("Contacts", notif.contacts) }
                    { displayNotifs("Comments", notif.comments) }
                    { displayNotifs("Posts", notif.posts) }
                    { displayNotifs("App News", notif.appNews) }
                   </>
            break;
          }
          case "contacts": {
            return displayNotifs("Contacts", notif.contacts)
            break;
          }
          case "comments": {
            return displayNotifs("Comments", notif.comments)
            break;
          }
          case "posts": {
            return displayNotifs("Posts", notif.posts)
            break;
          }
          case "appNews": {
            return displayNotifs("App News", notif.appNews)
            break;
          }
          default: {
            return <>
                    { displayNotifs('Contacts', notif.contacts) }
                    { displayNotifs('Contacts', notif.comments) }
                    { displayNotifs('Contacts', notif.posts) }
                    { displayNotifs('Contacts', notif.appNews) }
                   </>
          }
        }
      };
    
      const loadNotifications = async () => {
        const userId = authStore.userData._id

        setNotif({...notif, loading: true })
        const url = `${proxy}/admin/notifications/${userId}`
    
        try {
          const res = await fetch(url)
         
          if (res.ok) {
            const result = await res.json()
            // set state
            setNotif((prevState) => {
                return { ...prevState, response: [...result.data, prevState], loading: false }
            })
            // sort data
            sortNotifs(result.data)
            return;
          }
        //   addToast('Error occured while loading User Notification !', { appearance: 'error', autoDismiss: false })
    
        } catch (err) {
            // addToast(err.message, { appearance: 'error', autoDismiss: false })
        }
      };

      const onDelete = async (notificationId) => {
        const url = `${proxy}/admin/notifications/delete/${notificationId}`
    
        try {
          const res = await fetch(url, { method: 'DELETE' })
    
          if (res.ok) {
            const result = await res.json()
            // update state after delete op
            // addToast(result.message, { appearance: 'success', autoDismiss: false })
          }
    
        } catch (err) {
          // addToast(err.message, { appearance: 'error', autoDismiss: false })
        }
      };
      const onCancel = () => { // cancel remove post action
        // hide modal box --> delete
      };
      const onHide = async (notificationId) => {
        const url = `${proxy}/admin/notifications/hide/${notificationId}/${'hidden'}`
    
        try {
          const res = await fetch(url, {
            headers: {
              "Content-Type": "applicaion/json"
            },
            method: "PUT",
            body: {}
          })
    
          if (res.ok) {
            const result = await res.json()
            console.log(result.data)
            // update state after edit op
            // addToast(result.message, { appearance: 'success', autoDismiss: false })
          }
    
        } catch (err) {
          // addToast(err.message, { appearance: 'error', autoDismiss: false })
        }
      };
    
      useEffect(() => {
        loadNotifications() // Load notifs from bdd
      }, [])
      
      // Functions
      const convertDate = (date) => {
        const new_date = new Date(date).toLocaleDateString("en-US").split(/:| /)[0]
        return new_date
      };

      // Components
      const displayNotifs = (label, data) => {
        return  <>
                  <h4> {label} </h4>
    
                  {  data.length > 0 ?
                     data.map((el, idx) => 
                          <Accordion key={idx} hiddenData={ el.content && el.content }>
                            { el.avatar ? <Avatar imgUrl={el.avatar} size='xs' shape='circle' /> : 
                                        <Avatar icon size='xs' shape='circle' /> 
                            }
                            <p> { el.type && el.type } </p>
                            <span> 
                                { el.createdAt && convertDate(el.createdAt) } 
                            </span>
                            <span onClick={() => onDelete(el._id)}> del </span>
                            <span onClick={() => onHide(el._id)}> hide </span>
                          </Accordion>
                        )
                    : `No ${label}`}
                </>
      };
  
    return (
      <>
      <TopBar />
        <div className="notifications-container">
            <h2> Notifications </h2>

            <select name="notif-type" onChange={e => setNotif({...notif, type: e.target.value})}>
              <option value="all"> All </option>
              <option value="contacts"> My Contacts </option>
              <option value="comments"> My Comments </option>
              <option value="posts"> My Posts </option>
              <option value="appNews"> App News </option>
            </select>
            
            <div className="notifications-container">
            {   notif.loading ? "Loading ..." :
                notif.response ?
                    <div className="all-notifications">
                      { notif.type && checkType(notif.type) }
                    </div> :
                <h3> There is not any new Notification </h3>
            }
            </div>
        </div>
        <SideBar />
      </>
    )
};

export default Notifications;
