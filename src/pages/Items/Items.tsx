import React, { useState, useContext } from 'react';
import {
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList,
    IonItem, IonLabel, IonButtons, IonButton, useIonViewWillEnter, IonToast, IonIcon, IonNote
} from '@ionic/react';
import AuthContext from "../../contexts/Context";
import axios from 'axios';
import { useHistory } from "react-router";
import { addOutline } from 'ionicons/icons';

const Items: React.FC = () => {

    const history = useHistory();
    const { api_url, api_key, authValues } = useContext(AuthContext);
    const [spinner, setSpinner] = useState<boolean>(true);
    const [showToast, setShowToast] = useState<boolean>(false);
    const [errors, setErrors] = useState<[]>([]);
    const [success, setSuccess] = useState<string>("");
    const [items, setItems] = useState<any>([]);
    const [uploading, setUploading] = useState<boolean>(false);

    useIonViewWillEnter(() => {
        fetchData();
    });

    function fetchData() {
        axios.get(api_url + 'shops/' + authValues.user.id + '/items' + api_key + '&resource_id=' + authValues.user.id + '&resource_type=' + authValues.user.type + "&status[]=1&status[]=2")
            .then((res: any) => {
                setItems(res.data);
                setSpinner(false);
            }).catch((error: any) => {
                setSpinner(false);
                setShowToast(true);
            });
    }

    function itemClick(item: any) {
        history.push({
            pathname: '/products/' + item.id,
            state: item
        });

    }

    return (

        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle>Products</IonTitle>
                    <IonButtons slot="end">
                        <IonButton routerLink={'/products/create'}>
                            <IonIcon icon={addOutline} />
                        </IonButton>
                    </IonButtons>
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
                <IonList>
                    {Object.keys(items).map((key) => (
                        <IonItem className='product-list-item' key={"item" + items[key].id} onClick={e => itemClick(items[key])}>
                            <IonLabel>
                                <h2>{items[key].name}</h2>
                                <p className='ws-pl'>{items[key].description}</p>
                            </IonLabel>
                            {items[key].price &&
                                <IonNote slot="end" color="medium">£{parseFloat(items[key].price).toFixed(2)}</IonNote>
                            }
                        </IonItem>
                    ))}
                </IonList>
            </IonContent>
        </IonPage>
    );

};

export default Items;