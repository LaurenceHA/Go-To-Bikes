import React, { useState, useContext, useEffect } from 'react';
import {
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
    IonList, IonItem, IonLabel, IonRow, IonCol, IonSpinner, useIonViewWillEnter,
    IonGrid, IonButtons, IonButton, IonIcon, IonDatetime, IonDatetimeButton, IonTextarea, IonSelect, IonSelectOption, IonModal
} from '@ionic/react';
import AuthContext from "../../contexts/Context";
import axios from 'axios';
import { useHistory } from "react-router";
import moment from 'moment';
import { addCircleOutline, addOutline, removeCircleOutline } from 'ionicons/icons';
import { AppBackButton } from '../../components/AppBackButton';

const BookingsCreate: React.FC = () => {

    const history = useHistory();
    const [spinner, setSpinner] = useState<boolean>(true);
    const [modalSpinner, setModalSpinner] = useState<boolean>(true);
    const [shops, setShops] = useState<any>([]);
    const [locations, setLocations] = useState<any>([]);
    const [items, setItems] = useState<any>([]);
    const [customers, setCustomers] = useState<any>([]);
    const [date, setDate] = useState<any>(moment().format("YYYY-MM-DD"));
    const [time, setTime] = useState<string>(moment().add(1, 'hours').startOf('hour').format());
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
    const [itemTotal, setItemTotal] = useState<string>("0.00");
    const [itemCount, setItemCount] = useState<string>("0");
    const [uploading, setUploading] = useState<boolean>(false);
    const [showToast, setShowToast] = useState<boolean>(false);
    const [shopModal, setShopModal] = useState<boolean>(false);
    const [errors, setErrors] = useState<[]>([]);
    const [rerender, setRerender] = useState(false);
    const { api_url, api_key, authValues, tokenCheck } = useContext(AuthContext);

    useEffect(() => {
        if (authValues.user.type === "customer") {
            fetchCAddress(authValues.user.id);
        } else {
            fetchCAddress(customer);
        }

    }, [type]);

    useEffect(() => {

        fetchDates();

    }, [location, type]);

    useEffect(() => {

        fetchTimes();

    }, [location, date, type]);

    function fetchData() {

        if (authValues.user.type === "shop") {
            setShop(authValues.user.id);
            fetchItems(authValues.user.id);
        }

        setSpinner(true);
        axios.get(api_url + 'bookings/create' + api_key + '&resource_id=' + authValues.user.id + '&resource_type=' + authValues.user.type)
            .then((res: any) => {

                setLocations(res.data.locations);
                setShops(res.data.shops);
                setCustomers(res.data.customers);
                setSpinner(false);

            }).catch((error: any) => {
                setSpinner(false);
                setShowToast(true);
            });
    }

    function fetchItems(shop: string) {

        setModalSpinner(true);
        axios.get(api_url + 'shops/' + shop + '/items' + api_key + '&resource_id=' + authValues.user.id + '&resource_type=' + authValues.user.type)
            .then((res: any) => {
                setItems(res.data);
                setSpinner(false);
            }).catch((error: any) => {
                setSpinner(false);
                setShowToast(true);
            });

    }

    function fetchCAddress(customer: string) {

        setModalSpinner(true);
        axios.get(api_url + 'customers/' + customer + '/address' + api_key + '&resource_id=' + authValues.user.id + '&resource_type=' + authValues.user.type)
            .then((res: any) => {
                if (type == "delivery") {
                    setDropoff(res.data);
                } else {
                    setPickup(res.data);
                }
            }).catch((error: any) => {

            });

    }

    function fetchSAddress() {

        
            setModalSpinner(true);
            axios.get(api_url + 'shops/' +  authValues.user.id + '/address' + api_key + '&resource_id=' + authValues.user.id + '&resource_type=' + authValues.user.type)
            .then((res: any) => {
                if (type == "delivery") {
                    setPickup(res.data);
                }
            }).catch((error: any) => {

            });
        

    }

    function fetchDates() {

        setModalSpinner(true);
        axios.get(api_url + 'locations/' + location + '/dates' + api_key + '&resource_id=' + authValues.user.id + '&resource_type=' + authValues.user.type + '&type=' + type)
            .then((res: any) => {
                setValidDates(res.data);
            }).catch((error: any) => {

            });

    }

    function fetchTimes() {
        
        if (date && location) {
            var tdate = moment(date).format("DD/MM/YYYY");

            setModalSpinner(true);
            axios.get(api_url + 'locations/' + location + '/times' + api_key + '&resource_id=' + authValues.user.id + '&resource_type=' + authValues.user.type + '&date=' + tdate + '&type=' + type)
                .then((res: any) => {
                    setValidTimeFrom(res.data.time_from);
                    setValidTimeTo(res.data.time_to);
                }).catch((error: any) => {

                });
        }

    }

    useIonViewWillEnter(() => {
        fetchData();

        if (authValues.user.type === "customer") {
            fetchCAddress(authValues.user.id);
        }

        if (authValues.user.type === "shop") {
            fetchSAddress();
        }

    });

    function storeBooking() {

        setUploading(true);

        var time_from = "";
        if (time) {
            time_from = moment(time).format("HH:mm");
        }

        const data = {
            date: moment(date).format("DD/MM/YYYY"),
            time_from: time_from,
            type: type,
            notes: notes,
            pickup: pickup,
            dropoff: dropoff,
            customer_id: customer,
            shop_id: shop,
            location_id: location,
            resource_id: authValues.user.id,
            resource_type: authValues.user.type,
            products: items
        };
        axios.post(api_url + 'bookings' + api_key, data)
            .then((res: any) => {
                setUploading(false);
                history.goBack();
            }).catch((error: any) => {
                setUploading(false);
                if (error.response && error.response.status === 422 && error.response.request.response) {
                    const response_errors = Object.values(JSON.parse(error.response.request.response)) as [];
                    setErrors(response_errors);
                } else {
                    setShowToast(true);
                }
            });

    }

    function shopSelected(shop: string) {
        setShop(shop);
        fetchItems(shop);
    }

    function customerSelected(customer: string) {

        setCustomer(customer);
        fetchCAddress(customer);

    }

    function calculateTotals() {

        var total = 0.00;
        var count = 0;
        for (var i = 0; i < items.length; i++) {
            if (items[i].quantity > 0) {
                var subtotal = items[i].quantity * items[i].price;
                total = total + subtotal;
                count = count + items[i].quantity;
            }
        }
        setItemTotal(total.toFixed(2).toString());
        setItemCount(count.toString());

    }

    function incrementQuantity(items: any, key: any) {
        items[key].quantity = parseInt(items[key].quantity) + 1;
        setItems(items);

        setRerender(!rerender);
        calculateTotals();
    }

    function decrementQuantity(items: any, key: any) {

        items[key].quantity = parseInt(items[key].quantity) - 1;
        setItems(items);

        setRerender(!rerender);
        calculateTotals();
    }

    const enabledDates = (dateString: string) => {
        const date = new Date(dateString);
        const utcDay = date.getUTCDay();
        const fDate = date.toISOString().split('T')[0];
        var allowed = 0;
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
                    console.log(bdate.date);
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
                    <IonModal isOpen={shopModal}>
                        <IonHeader>
                            <IonToolbar>
                                <IonTitle>Select Items</IonTitle>
                                <IonButtons slot="end">
                                    <IonButton strong={true} onClick={() => setShopModal(false)}>
                                        Confirm
                                    </IonButton>
                                </IonButtons>
                            </IonToolbar>
                        </IonHeader>
                        <IonContent className="ion-padding">
                            <IonList>
                                {Object.keys(items).map((key) => (
                                    <IonItem className='product-list-item' key={"item" + items[key].id}>
                                        <IonGrid className='product-list-grid'>
                                            <IonRow>
                                                <IonCol size='7' style={{ "padding": "5px 0px 5px 0px" }}>
                                                    {items[key].name}
                                                    <br></br>{items[key].price && <span> £{parseFloat(items[key].price).toFixed(2)}</span>}
                                                </IonCol>
                                                <IonCol size='5' style={{ "padding": "5px 0px 5px 0px" }}>
                                                    <IonIcon icon={addCircleOutline} size="large" color='primary' className='float-right' onClick={e => incrementQuantity(items, key)} />
                                                    <div className='float-right' style={{ marginRight: "10px", marginTop: "8px" }}>{items[key].quantity}</div>
                                                    {items[key].quantity > 0 &&
                                                        <IonIcon icon={removeCircleOutline} size="large" color='primary' className='float-right' style={{ marginRight: "10px" }} onClick={e => decrementQuantity(items, key)} />
                                                    }
                                                </IonCol>
                                            </IonRow>
                                        </IonGrid>

                                    </IonItem>
                                ))}
                                <IonItem className='product-list-item'>
                                    <IonLabel style={{ textAlign: "right" }}>Total: £{itemTotal}</IonLabel>
                                </IonItem>
                            </IonList>
                        </IonContent>
                    </IonModal>
                    <IonModal keepContentsMounted={true}>
                        <IonDatetime id="date" presentation='date' value={date} onIonChange={e => setDate(e.detail.value as string)} isDateEnabled={enabledDates}></IonDatetime>
                    </IonModal>
                    <IonModal keepContentsMounted={true}>
                        <IonDatetime id="time" presentation='time' value={time} onIonChange={e => setTime(e.detail.value as string)} minuteValues="0,15,30,45" min={"2022-10-21T" + validTimeFrom} max={"2022-10-21T" + validTimeTo}></IonDatetime>
                    </IonModal>
                    <IonList>
                        {authValues.user.type === "customer" &&
                            <IonItem>
                                <IonLabel className="bold" position="stacked">Product / Service: </IonLabel>
                                <IonSelect interfaceOptions={{ cssClass: 'select-wide' }} onIonChange={e => setType(e.detail.value)} value={type}>
                                    <IonSelectOption value="delivery">Delivery Service</IonSelectOption>
                                    <IonSelectOption value="ride">Bike Ride</IonSelectOption>
                                </IonSelect>
                            </IonItem>
                        }
                        <IonItem>
                            <IonLabel className="bold" position="stacked">Location</IonLabel>
                            <IonSelect interfaceOptions={{ cssClass: 'select-wide' }} onIonChange={e => setLocation(e.detail.value)} value={location}>
                                {Object.keys(locations).map((key) => (
                                    <IonSelectOption key={"route-" + key} value={locations[key].id}>{locations[key].name}</IonSelectOption>
                                ))}
                            </IonSelect>
                        </IonItem>
                        {(authValues.user.type === "shop" && customers && customers.length > 0) &&
                            <IonItem>
                                <IonLabel className="bold" position="stacked">Customer: </IonLabel>
                                <IonSelect interfaceOptions={{ cssClass: 'select-wide' }} onIonChange={e => customerSelected(e.detail.value)} value={customer}>
                                    {Object.keys(customers).map((key) => (
                                        <IonSelectOption key={"customer-" + key} value={customers[key].id}>{customers[key].first_name + " " + customers[key].last_name}</IonSelectOption>
                                    ))}
                                </IonSelect>
                            </IonItem>
                        }
                        {location &&
                            <div>
                                <IonItem>
                                    <IonLabel className="bold" position="stacked">Date: </IonLabel>
                                    <IonDatetimeButton datetime="date" className='date-time-picker'></IonDatetimeButton>
                                </IonItem>
                                <IonItem>
                                    <IonLabel className="bold" position="stacked">Start Time: </IonLabel>
                                    <IonDatetimeButton datetime="time" className='date-time-picker'></IonDatetimeButton>
                                </IonItem>
                                {(type === "delivery" && authValues.user.type === "customer") &&
                                    <IonItem>
                                        <IonLabel className="bold" position="stacked">Shop: </IonLabel>
                                        <IonSelect interfaceOptions={{ cssClass: 'select-wide' }} onIonChange={e => shopSelected(e.detail.value)} value={shop}>
                                            {Object.keys(shops).map((key) => (
                                                <IonSelectOption key={"shop-" + key} value={shops[key].id}>{shops[key].name}</IonSelectOption>
                                            ))}
                                        </IonSelect>
                                    </IonItem>
                                }
                                {(type === "delivery" && shop) &&
                                    <IonItem detail={true} detailIcon={addOutline} onClick={e => setShopModal(true)}>
                                        <IonLabel className="bold" >{itemCount} items<br></br>Total: £{itemTotal}</IonLabel>

                                    </IonItem>
                                }
                                {((authValues.user.type == "customer" && type === "ride") || authValues.user.type == "shop") &&
                                    <IonItem>
                                        <IonLabel className="bold" position="stacked">Pickup Address: </IonLabel>
                                        <IonTextarea rows={4} onIonChange={e => setPickup(e.detail.value as string)} autocapitalize="sentences" value={pickup}></IonTextarea>
                                    </IonItem>
                                }
                                {authValues.user.type == "customer" && type === "delivery" &&
                                    <IonItem>
                                        <IonLabel className="bold" position="stacked">Dropoff Address: </IonLabel>
                                        <IonTextarea rows={4} onIonChange={e => setDropoff(e.detail.value as string)} autocapitalize="sentences" value={dropoff}></IonTextarea>
                                    </IonItem>
                                }
                                <IonItem>
                                    <IonLabel className="bold" position="stacked">Notes: </IonLabel>
                                    <IonTextarea rows={4} onIonChange={e => setNotes(e.detail.value as string)} autocapitalize="sentences" value={notes}></IonTextarea>
                                </IonItem>


                                {(type === "ride" && location) &&
                                    < IonItem >
                                        <IonLabel className="bold" position="stacked">Route description: </IonLabel>
                                        {Object.keys(locations).map((key) => (
                                            <div key={"route-" + key} style={{ whiteSpace: "pre-line", paddingTop: "5px" }}>
                                                {locations[key].id === location &&
                                                    locations[key].description
                                                }
                                            </div>
                                        ))}
                                    </IonItem>

                                }

                                <section className="full-width">
                                    {uploading ?
                                        <IonButton expand="block" color="primary" disabled={true}><IonSpinner name="crescent" className="button-spinner" /></IonButton>
                                        :
                                        <IonButton expand="block" color="primary" onClick={() => storeBooking()} disabled={false}>Save</IonButton>
                                    }
                                    {errors.map((error, key) => (
                                        <div className="form-error" key={"error-" + key}>{error}</div>
                                    ))}
                                </section>

                            </div>
                        }
                    </IonList>
                </IonContent>
            }
        </IonPage >
    );
};

export default BookingsCreate;