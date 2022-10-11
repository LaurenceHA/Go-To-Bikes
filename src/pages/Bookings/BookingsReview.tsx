import React, { useState, useContext } from 'react';
import {
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
    IonList, IonItem, IonLabel, IonRow, IonCol, IonSpinner, useIonViewWillEnter,
    IonGrid, IonButtons, IonButton, IonIcon, IonDatetime, IonDatetimeButton, IonTextarea, IonSelect, IonSelectOption, IonModal, IonCheckbox
} from '@ionic/react';
import AuthContext from "../../contexts/Context";
import axios from 'axios';
import { useHistory } from "react-router";
import moment from 'moment';
import { addCircleOutline, addOutline, removeCircleOutline, star } from 'ionicons/icons';
import { RouteComponentProps } from 'react-router';
import { AppBackButton } from '../../components/AppBackButton';

interface BookingProps extends RouteComponentProps<{
    booking: string
}> { }

const BookingsReview: React.FC<BookingProps> = ({ match }) => {

    const history = useHistory();
    const [modalSpinner, setModalSpinner] = useState<boolean>(true);

    const [notes, setNotes] = useState<string>("");
    const [rating, setRating] = useState<Number>(2);
    const [chat, setChat] = useState<string>("1");
    const [helpRating, setHelpRating] = useState<Number>(2);
    const [reuse, setReuse] = useState<string>("1");

    const [uploading, setUploading] = useState<boolean>(false);
    const [showToast, setShowToast] = useState<boolean>(false);
    const [shopModal, setShopModal] = useState<boolean>(false);
    const [errors, setErrors] = useState<[]>([]);
    const [rerender, setRerender] = useState(false);
    const { api_url, api_key, authValues, tokenCheck } = useContext(AuthContext);

    useIonViewWillEnter(() => {

    });

    function storeReview() {

        setUploading(true);

        var chat_val = null as any;
        if(chat){
            chat_val = "1";
        }
        var reuse_val = null as any;
        if(reuse){
            reuse_val = "1";
        }

        const data = {
            rating:rating,
            chat:chat_val,
            help_rating:helpRating,
            reuse:reuse_val,
            resource_id: authValues.user.id,
            resource_type: authValues.user.type,
        };

        axios.post(api_url + 'bookings/' + match.params.booking + '/review' + api_key, data)
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
                    <IonTitle>Booking Feedback</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent >
                <IonList>
                    <IonItem>
                    <IonLabel className="bold fixedLabel" position="stacked"  >How did you find the service?:</IonLabel>
                        <IonGrid className='rating-list-grid'>
                            <IonRow>
                                <IonCol size='3' style={{ "padding": "5px 0px 5px 0px" }} onClick={e => setRating(1)}>
                                    <IonIcon icon={star} size="large" color='danger' />
                                </IonCol>
                                <IonCol size='3' style={{ "padding": "5px 0px 5px 0px" }} onClick={e => setRating(2)} >
                                    {rating > 1 ?
                                        <IonIcon icon={star} size="large" color='orange' />
                                        :
                                        <IonIcon icon={star} size="large" color='medium' />
                                    }
                                </IonCol>
                                <IonCol size='3' style={{ "padding": "5px 0px 5px 0px" }} onClick={e => setRating(3)}>
                                    {rating > 2 ?
                                        <IonIcon icon={star} size="large" color='warning' />
                                        :
                                        <IonIcon icon={star} size="large" color='medium' />
                                    }
                                </IonCol>
                                <IonCol size='3' style={{ "padding": "5px 0px 5px 0px" }} onClick={e => setRating(4)}>
                                    {rating > 3 ?
                                        <IonIcon icon={star} size="large" color='success' />
                                        :
                                        <IonIcon icon={star} size="large" color='medium' />
                                    }
                                </IonCol>
                            </IonRow>

                        </IonGrid>
                    </IonItem>
                    <IonItem>
                        <IonLabel class="fixedLabel">Did you have a chat with the volunteer?</IonLabel>
                        <IonSelect interfaceOptions={{ cssClass: 'select-wide' }} onIonChange={e => setChat(e.detail.value)} value={chat}>
                            <IonSelectOption value="1">Yes</IonSelectOption>
                            <IonSelectOption value="">No</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                    <IonItem>
                        <IonLabel className="bold fixedLabel" position="stacked"  >Does knowing a service exists that will drop off things to you and a volunteer can always say hello, help with any feelings of anxiety or loneliness? </IonLabel>
                        <IonGrid className='rating-list-grid'>
                            <IonRow>
                                <IonCol size='3' style={{ "padding": "5px 0px 5px 0px" }} onClick={e => setHelpRating(1)}>
                                    <IonIcon icon={star} size="large" color='danger' />
                                </IonCol>
                                <IonCol size='3' style={{ "padding": "5px 0px 5px 0px" }} onClick={e => setHelpRating(2)} >
                                    {helpRating > 1 ?
                                        <IonIcon icon={star} size="large" color='orange' />
                                        :
                                        <IonIcon icon={star} size="large" color='medium' />
                                    }
                                </IonCol>
                                <IonCol size='3' style={{ "padding": "5px 0px 5px 0px" }} onClick={e => setHelpRating(3)}>
                                    {helpRating > 2 ?
                                        <IonIcon icon={star} size="large" color='warning' />
                                        :
                                        <IonIcon icon={star} size="large" color='medium' />
                                    }
                                </IonCol>
                                <IonCol size='3' style={{ "padding": "5px 0px 5px 0px" }} onClick={e => setHelpRating(4)}>
                                    {helpRating > 3 ?
                                        <IonIcon icon={star} size="large" color='success' />
                                        :
                                        <IonIcon icon={star} size="large" color='medium' />
                                    }
                                </IonCol>
                            </IonRow>

                        </IonGrid>
                    </IonItem>
                    <IonItem>
                        <IonLabel class="fixedLabel">Will you use the E-bike delivery service or Trishaw ride again ?</IonLabel>
                        <IonSelect interfaceOptions={{ cssClass: 'select-wide' }} onIonChange={e => setReuse(e.detail.value)} value={reuse}>
                            <IonSelectOption value="1">Yes</IonSelectOption>
                            <IonSelectOption value="">No</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                    <section className="full-width">
                        {uploading ?
                            <IonButton expand="block" color="primary" disabled={true}><IonSpinner name="crescent" className="button-spinner" /></IonButton>
                            :
                            <IonButton expand="block" color="primary" onClick={() => storeReview()} disabled={false}>Submit</IonButton>
                        }
                        {errors.map((error, key) => (
                            <div className="form-error" key={"error-" + key}>{error}</div>
                        ))}
                    </section>
                </IonList>
            </IonContent>
        </IonPage >
    );
};

export default BookingsReview;