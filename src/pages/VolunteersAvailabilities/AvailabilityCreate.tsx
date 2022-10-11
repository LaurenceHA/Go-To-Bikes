import React, { useState, useContext } from 'react';
import {
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList,
    IonItem, IonLabel, IonButtons, IonButton,
    IonInput, useIonViewWillEnter, IonToast, IonIcon, IonAlert, IonSpinner, IonNote, IonTextarea, IonSelect, IonSelectOption, IonDatetimeButton, IonModal, IonDatetime
} from '@ionic/react';
import AuthContext from "../../contexts/Context";
import axios from 'axios';
import { useHistory } from "react-router";
import moment from 'moment';
import { AppBackButton } from '../../components/AppBackButton';

const AvailabilityCreate: React.FC = () => {

    const history = useHistory();
    const { api_url, api_key, authValues } = useContext(AuthContext);
    const [showToast, setShowToast] = useState<boolean>(false);
    const [date, setDate] = useState<any>(moment().format("YYYY-MM-DD"));
    const [timeFrom, setTimeFrom] = useState<string>(moment().add(1, 'hours').startOf('hour').format());
    const [timeTo, setTimeTo] = useState<string>(moment().add(2, 'hours').startOf('hour').format());
    const [description, setDescription] = useState<string>("");
    const [errors, setErrors] = useState<[]>([]);
    const [uploading, setUploading] = useState<boolean>(false);
    const [recurring, setRecurring] = useState<any>("");
    const [recurringEndDate, setRecurringEndDate] = useState<any>("");

    useIonViewWillEnter(() => {

    });

    function storeItem() {

        setUploading(true);

        var time_from = "";
        if (timeFrom) {
            time_from = moment(timeFrom).format("HH:mm");
        }

        var time_to = "";
        if (timeTo) {
            time_to = moment(timeTo).format("HH:mm");
        }

        var end_date;
        if(recurringEndDate){
            end_date = moment(recurringEndDate).format("DD/MM/YYYY");
        }

        const data = {
            date: moment(date).format("DD/MM/YYYY"),
            from: time_from,
            to: time_to,
            description: description,
            end_date: end_date,
            recur_weekly: recurring,
            resource_id: authValues.user.id,
            resource_type: authValues.user.type
        };
        axios.post(api_url + 'volunteers/' + authValues.user.id + '/availability' + api_key, data)
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

    return (

        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons slot="start">
                        <AppBackButton />
                    </IonButtons>
                    <IonTitle>Add Availability Slot</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent >
                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message="An error occurred, please try again or contact support if the issue persists."
                    position="top"
                    buttons={[{
                        text: 'Close',
                        role: 'cancel'
                    }]}
                />
                <IonModal keepContentsMounted={true}>
                    <IonDatetime id="date" presentation='date' value={date} onIonChange={e => setDate(e.detail.value as string)}></IonDatetime>
                </IonModal>
                <IonModal keepContentsMounted={true}>
                    <IonDatetime id="recurringDate" presentation='date' value={recurringEndDate} onIonChange={e => setRecurringEndDate(e.detail.value as string)}></IonDatetime>
                </IonModal>
                <IonModal keepContentsMounted={true}>
                    <IonDatetime id="time" presentation='time' value={timeFrom} onIonChange={e => setTimeFrom(e.detail.value as string)} minuteValues="0,15,30,45"></IonDatetime>
                </IonModal>
                <IonModal keepContentsMounted={true}>
                    <IonDatetime id="timeTo" presentation='time' value={timeTo} onIonChange={e => setTimeTo(e.detail.value as string)} minuteValues="0,15,30,45"></IonDatetime>
                </IonModal>
                <IonList>
                    <IonItem>
                        <IonLabel className="bold" position="stacked">Date: </IonLabel>
                        <IonDatetimeButton datetime="date" className='date-time-picker'></IonDatetimeButton>
                    </IonItem>
                    <IonItem>
                        <IonLabel className="bold" position="stacked">Time From: </IonLabel>
                        <IonDatetimeButton datetime="time" className='date-time-picker'></IonDatetimeButton>
                    </IonItem>
                    <IonItem>
                        <IonLabel className="bold" position="stacked">Time To: </IonLabel>
                        <IonDatetimeButton datetime="timeTo" className='date-time-picker'></IonDatetimeButton>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">Description: </IonLabel>
                        <IonTextarea onIonChange={e => setDescription(e.detail.value as string)} value={description} autocapitalize="sentences"></IonTextarea>
                    </IonItem>
                    <IonItem>
                        <IonLabel className="bold" position="stacked">Recur Weekly: </IonLabel>
                        <IonSelect value={recurring} onIonChange={e => setRecurring(e.detail.value)} >
                            <IonSelectOption key={"1"} value={""}>No</IonSelectOption>
                            <IonSelectOption key={"2"} value={"1"}>Yes</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                    {recurring === "1" &&
                        <IonItem>
                            <IonLabel position="stacked">End Date: </IonLabel>
                            <IonDatetimeButton datetime="recurringDate" className='date-time-picker'></IonDatetimeButton>
                        </IonItem>
                    }
                    <section className="full-width">
                        {uploading ?
                            <IonButton expand="block" color="primary" disabled={true}><IonSpinner name="crescent" className="button-spinner" /></IonButton>
                            :
                            <IonButton expand="block" color="primary" onClick={() => storeItem()} disabled={false}>Save</IonButton>
                        }
                        {errors.map((error, key) => (
                            <div className="form-error" key={"error-" + key}>{error}</div>
                        ))}
                    </section>
                </IonList>
            </IonContent>
        </IonPage>
    );

};

export default AvailabilityCreate;