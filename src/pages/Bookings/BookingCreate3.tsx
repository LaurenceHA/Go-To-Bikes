import React, { useState, useContext, useEffect, useRef } from 'react';
import {
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
    IonList, IonItem, IonLabel, IonRow, IonCol, IonSpinner, useIonViewWillEnter,
    IonGrid, IonButtons, IonButton, IonIcon, IonDatetime, IonDatetimeButton, IonTextarea, IonSelect, IonSelectOption, IonModal, IonBadge
} from '@ionic/react';
import AuthContext from "../../contexts/Context";
import axios from 'axios';
import { useHistory } from "react-router";
import moment from 'moment';
import { Preferences } from '@capacitor/preferences';
import { RouteComponentProps } from 'react-router';
import { AppBackButton } from '../../components/AppBackButton';
import { calendarOutline } from 'ionicons/icons';

interface BookingProps extends RouteComponentProps<{
    type: string
}> { }

const BookingsCreate3: React.FC<BookingProps> = ({ match }) => {

    const history = useHistory();
    const [spinner, setSpinner] = useState<boolean>(true);
    const [timetableSpinner, setTimetableSpinner] = useState<boolean>(false);
    const [shops, setShops] = useState<any>([]);
    const [locations, setLocations] = useState<any>([]);
    const [items, setItems] = useState<any>([]);
    const [customers, setCustomers] = useState<any>([]);
    const [date, setDate] = useState<any>(undefined);
    const [sdate, setSDate] = useState<any>(undefined);
    const [timeFrom, setTimeFrom] = useState<string>("");
    const [timeTo, setTimeTo] = useState<string>("");
    const [notes, setNotes] = useState<string>("");
    const [pickup, setPickup] = useState<string>("");
    const [dropoff, setDropoff] = useState<string>("");
    const [type, setType] = useState<string>("delivery");
    const [location, setLocation] = useState<string>("");
    const [shop, setShop] = useState<string>("");
    const [customer, setCustomer] = useState<string>("");
    const [validTimeFrom, setValidTimeFrom] = useState<string>("10:30:00");
    const [validTimeTo, setValidTimeTo] = useState<string>("14:30:00");
    const [validDates, setValidDates] = useState<any>([]);
    const [unavailableDates, setUnavailableDates] = useState<any>([]);
    const [timetableDates, setTimetableDates] = useState<any>([]);
    const [timetableTimes, setTimetableTimes] = useState<any>([]);
    const [itemTotal, setItemTotal] = useState<string>("0.00");
    const [itemCount, setItemCount] = useState<string>("0");
    const [uploading, setUploading] = useState<boolean>(false);
    const [showToast, setShowToast] = useState<boolean>(false);
    const [shopModal, setShopModal] = useState<boolean>(false);
    const [errors, setErrors] = useState<[]>([]);
    const [rerender, setRerender] = useState(false);
    const { api_url, api_key, authValues, tokenCheck } = useContext(AuthContext);

    function fetchData(location_id: any = null) {

        var loc = location_id;
        if (!location_id) {
            loc = location;
        }

        setSpinner(true);

        axios.get(api_url + 'locations/' + loc + '/dates' + api_key + '&resource_id=' + authValues.user.id + '&resource_type=' + authValues.user.type + '&type=' + match.params.type)
            .then((res: any) => {
                setValidDates(res.data);
                setUnavailableDates(res.data.unavailable_dates);
                setSpinner(false);
            }).catch((error: any) => {
                setSpinner(false);
                setShowToast(true);
            });
    }

    function fetchTimetable() {

        if (date && location) {

            var tdate = moment(date).format("DD/MM/YYYY");
            setTimetableSpinner(true);
            axios.get(api_url + 'locations/' + location + '/times' + api_key + '&resource_id=' + authValues.user.id + '&resource_type=' + authValues.user.type + '&date=' + tdate + '&type=' + match.params.type)
                .then((res: any) => {
                    setTimetableDates(res.data.dates);
                    setTimetableTimes(res.data.times);
                    setTimetableSpinner(false);
                }).catch((error: any) => {
                    setTimetableDates([]);
                    setTimetableTimes([]);
                    setTimetableSpinner(false);
                });

        }
    }

    useEffect(() => {

        fetchTimetable();

    }, [date]);

    useIonViewWillEnter(() => {

        setTimetableDates([]);
        setTimetableTimes([]);
        setDate("");
        setSDate("");
        setTimeFrom("");
        setTimeTo("");
        setSpinner(true);
        getLocation();

    });

    const getLocation = async () => {
        await Preferences.get({ key: 'location_id' }).then(e => {
            if (e.value) {
                setLocation(e.value);
                fetchData(e.value);
            } else {
                history.goBack();
            }
        });
    }

    const enabledDates = (dateString: string) => {
        const date = new Date(dateString);
        const utcDay = date.getUTCDay();
        const fDate = date.toISOString().split('T')[0];
        var allowed = 0;

        if (unavailableDates && unavailableDates.length > 0) {
            for (let uKey in unavailableDates) {
                var udate = unavailableDates[uKey];
                if (fDate === udate.date) {
                    return false;
                }
            }
        }

        if (validDates && validDates.week_days) {
            var weekdays = validDates.week_days;
            var dates = validDates.dates;
            if (weekdays.length > 0) {
                for (let dayKey in weekdays) {
                    var weekday = weekdays[dayKey];
                    if (utcDay == weekday.day_week) {
                        allowed = 1;
                    }
                }
            }
            if (dates.length > 0) {
                for (let dateKey in dates) {
                    var bdate = dates[dateKey];
                    if (fDate === bdate.date) {
                        allowed = 1;
                    }
                }
            }
        } else {
            return false;
        }
        if (allowed > 0) {
            return true;
        } else {
            return false;
        }
    }

    function selectSlot(date: string, time_from: string, time_to: string) {

        setSDate(date);
        setTimeFrom(time_from);
        setTimeTo(time_to);

    }

    function storeDateTime() {

        Preferences.set({
            key: 'date',
            value: sdate + ""
        }).then(function () {
            Preferences.set({
                key: 'time_from',
                value: timeFrom + ""
            }).then(function () {
                Preferences.set({
                    key: 'time_to',
                    value: timeTo + ""
                }).then(function () {
                    history.push({
                        pathname: '/bookings/create/' + match.params.type + '/form'
                    });
                });
            });

        });

    }

    return (

        <IonPage>
            <IonHeader>

                <IonToolbar color="primary">
                    <IonButtons slot="start">
                        <AppBackButton />
                    </IonButtons>
                    <IonTitle>Create Booking</IonTitle>
                </IonToolbar>

            </IonHeader>

            {spinner ?
                <IonContent >
                    <div className="spinner-wrapper spinner-wrapper-requests">
                        <IonSpinner name="crescent" />
                    </div>
                </IonContent>
                :
                <IonContent >
                    <IonModal keepContentsMounted={true}>
                        <IonDatetime id="date" mode='ios' className="date-picker" presentation='date' color="primary" onIonChange={e => {setDate(e.detail.value as string); e.target.confirm(true)}}  isDateEnabled={enabledDates} min={moment().format()} showDefaultTimeLabel={false}></IonDatetime>
                    </IonModal>
                    <IonList style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                        {match.params.type === "delivery" ?
                            <p className='' style={{ marginLeft: "10px", marginBottom: "5px" }}>Select a date and delivery window.</p>
                            :
                            <p className='' style={{ marginLeft: "10px", marginBottom: "5px" }}>Select a date and a timeslot.</p>
                        }

                        <div style={{ width: "100%", display: "inline-block", paddingLeft: "5px", paddingTop: "10px" }}>
                            <span style={{ display: "inline-block", paddingLeft: "5px", paddingRight: "8px", paddingTop: "10px" }} className="float-left ">Pick a date: </span>
                            <IonDatetimeButton datetime="date" className='date-time-picker float-left' placeholder="Select a Date" style={{ paddingTop: "5px" }}></IonDatetimeButton>
                        </div>

                        {timetableSpinner ?
                            <div className="spinner-wrapper spinner-wrapper-requests">
                                <IonSpinner name="crescent" />
                            </div>
                            :
                            <div style={{ width: "100%", display: "inline-block" }}>
                                {!timetableDates || timetableDates.length === 0 &&
                                    <p className=' text-center' style={{ marginLeft: "10px" }}>No timeslots to display.<br></br>Please select a date.</p>
                                }
                                {(timetableDates) &&
                                    <IonGrid className="timetable-wrapper" style={{ width: "100%" }}>
                                        <IonRow>
                                            <IonCol size='3' style={{ "padding": "0px" }}></IonCol>

                                        </IonRow>
                                        {timetableTimes &&
                                            <div>
                                                <IonRow>
                                                    <IonCol size='3' style={{ "padding": "5px" }}></IonCol>
                                                    {Object.keys(timetableDates).map((key) => (
                                                        <IonCol size='9' style={{ "padding": "5px", textAlign:"center" }} key={"dates-" + key}>
                                                            <h5>
                                                                {moment(timetableDates[key], "YYYY-MM-DD").format("ddd D MMM")}
                                                            </h5>
                                                        </IonCol>
                                                    ))}
                                                </IonRow>
                                                {Object.keys(timetableTimes).map((tkey) => (
                                                    <IonRow key={"time-" + tkey}>
                                                        <IonCol size='3'>{timetableTimes[tkey].from} -<br></br> {timetableTimes[tkey].to}</IonCol>
                                                        {Object.keys(timetableDates).map((key) => (
                                                            <IonCol key={"datestimes-" + key} size='9' style={{ "padding": "5px" }} onClick={e => selectSlot(timetableDates[key], timetableTimes[tkey].from, timetableTimes[tkey].to)}>
                                                                {(timetableDates[key] === sdate && timetableTimes[tkey].from === timeFrom && timetableTimes[tkey].to === timeTo) ?
                                                                    <div className="timetable-slot active">
                                                                        Selected
                                                                    </div>
                                                                    :
                                                                    <div className="timetable-slot">
                                                                        Select
                                                                    </div>
                                                                }

                                                            </IonCol>
                                                        ))}
                                                        <IonCol size='3'>
                                                            <div >

                                                            </div>
                                                        </IonCol>
                                                        <IonCol size='3'></IonCol>
                                                        <IonCol size='3'></IonCol>
                                                    </IonRow>

                                                ))}
                                            </div>
                                        }

                                    </IonGrid>
                                }
                            </div>
                        }
                        {sdate && timeFrom && timeTo &&
                            <section className="full-width">
                                {uploading ?
                                    <IonButton expand="block" color="primary" disabled={true}><IonSpinner name="crescent" className="button-spinner" /></IonButton>
                                    :
                                    <IonButton expand="block" color="primary" onClick={() => storeDateTime()} disabled={false}>Next</IonButton>
                                }
                                {errors.map((error, key) => (
                                    <div className="form-error" key={"error-" + key}>{error}</div>
                                ))}
                            </section>
                        }
                    </IonList>

                </IonContent>
            }
        </IonPage >
    );
};

export default BookingsCreate3;