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
import { RouteComponentProps } from 'react-router';
import { trashBinOutline } from 'ionicons/icons';

interface ItemProps extends RouteComponentProps<{
    availability: string
}> { }

const AvailabilityShow: React.FC<ItemProps> = ({ match }) => {

    const history = useHistory();
    const { api_url, api_key, authValues } = useContext(AuthContext);
    const [showToast, setShowToast] = useState<boolean>(false);
    const [date, setDate] = useState<any>(moment().format("YYYY-MM-DD"));
    const [timeFrom, setTimeFrom] = useState<string>(moment().add(1, 'hours').startOf('hour').format());
    const [timeTo, setTimeTo] = useState<string>(moment().add(2, 'hours').startOf('hour').format());
    const [description, setDescription] = useState<string>("");
    const [errors, setErrors] = useState<[]>([]);
    const [uploading, setUploading] = useState<boolean>(false);
    const [spinner, setSpinner] = useState<boolean>(true);
    const [deleteWarning, setDeleteWarning] = useState(false);

    useIonViewWillEnter(() => {
        fetchData();
    });

    function fetchData() {
        axios.get(api_url + 'volunteers/' + authValues.user.id + "/availability/" + match.params.availability + api_key + '&resource_id=' + authValues.user.id + '&resource_type=' + authValues.user.type)
            .then((res: any) => {
                setDate(moment(res.data.date).format("YYYY-MM-DD"));
                setTimeFrom(moment(res.data.time_from, "HH:mm:ss").format());
                setTimeTo(moment(res.data.time_to, "HH:mm:ss").format());
                setDescription(res.data.description);
                setSpinner(false);
            }).catch((error: any) => {
                setShowToast(true);
                setSpinner(false);
            });
    }

    function updateItem() {

        setUploading(true);

        var time_from = "";
        if (timeFrom) {
            time_from = moment(timeFrom).format("HH:mm");
        }

        var time_to = "";
        if (timeTo) {
            time_to = moment(timeTo).format("HH:mm");
        }

        const data = {
            date: moment(date).format("DD/MM/YYYY"),
            from: time_from,
            to: time_to,
            description: description,
            resource_id: authValues.user.id,
            resource_type: authValues.user.type
        };
        axios.patch(api_url + 'volunteers/' + authValues.user.id + '/availability/' + match.params.availability + api_key, data)
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

    function deleteSlot() {
        axios.delete(api_url + 'volunteers/' + authValues.user.id + "/availability/" + match.params.availability + api_key + '&resource_id=' + authValues.user.id + '&resource_type=' + authValues.user.type)
            .then((res: any) => {
                history.goBack();
            }).catch((error: any) => {
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
            <IonAlert
                isOpen={deleteWarning}
                onDidDismiss={() => setDeleteWarning(false)}
                cssClass='my-custom-class'
                header={'Are you sure you want to cancel this booking? This action cannot be undone.'}
                buttons={[
                    {
                        text: 'Back',
                        role: 'cancel',
                        cssClass: 'secondary'
                    },
                    {
                        text: 'Yes',
                        handler: () => {
                            deleteSlot()
                        }
                    }
                ]}
            />
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons slot="start">
                        <AppBackButton />
                    </IonButtons>
                    <IonTitle>Edit Availability Slot</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={e => setDeleteWarning(true)}>
                            <IonIcon icon={trashBinOutline}  />
                        </IonButton>
                    </IonButtons>
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

                        <section className="full-width">
                            {uploading ?
                                <IonButton expand="block" color="primary" disabled={true}><IonSpinner name="crescent" className="button-spinner" /></IonButton>
                                :
                                <IonButton expand="block" color="primary" onClick={() => updateItem()} disabled={false}>Save</IonButton>
                            }
                            {errors.map((error, key) => (
                                <div className="form-error" key={"error-" + key}>{error}</div>
                            ))}
                        </section>
                    </IonList>
                </IonContent>
            }
        </IonPage>
    );

};

export default AvailabilityShow;