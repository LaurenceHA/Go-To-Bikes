import React, { useState, useContext } from 'react';
import {
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList,
    IonItem, IonLabel, IonButtons, IonButton,
    IonInput, useIonViewWillEnter, IonToast, IonIcon, IonAlert, IonSpinner, IonNote, IonTextarea, IonSelect, IonSelectOption
} from '@ionic/react';
import AuthContext from "../../contexts/Context";
import axios from 'axios';
import { useHistory } from "react-router";
import { RouteComponentProps } from 'react-router';
import { AppBackButton } from '../../components/AppBackButton';
import { trashBinOutline } from 'ionicons/icons';

interface ItemProps extends RouteComponentProps<{
    product: string
}> { }

const ItemsShow: React.FC<ItemProps> = ({ match }) => {

    const history = useHistory();
    const { api_url, api_key, authValues } = useContext(AuthContext);
    const [spinner, setSpinner] = useState<boolean>(true);
    const [showToast, setShowToast] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [status, setStatus] = useState<string>("1");
    const [errors, setErrors] = useState<[]>([]);
    const [uploading, setUploading] = useState<boolean>(false);
    const [deleteWarning, setDeleteWarning] = useState(false);

    useIonViewWillEnter(() => {
        fetchData();
    });

    function fetchData() {
        axios.get(api_url + 'shops/' + authValues.user.id + "/items/" + match.params.product + api_key + '&resource_id=' + authValues.user.id + '&resource_type=' + authValues.user.type)
            .then((res: any) => {
                setName(res.data.name);
                setDescription(res.data.description);
                setStatus(res.data.status);
                setPrice(res.data.price);
            }).catch((error: any) => {
                setShowToast(true);
            });
    }

    function deleteItem() {
        axios.delete(api_url + 'shops/' + authValues.user.id + "/items/" + match.params.product + api_key + '&resource_id=' + authValues.user.id + '&resource_type=' + authValues.user.type)
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

    function updateItem() {

        setUploading(true);

        const data = {
            name: name,
            description: description,
            price: price,
            status: status,
            resource_id: authValues.user.id,
            resource_type: authValues.user.type
        };
        axios.patch(api_url + 'shops/' + authValues.user.id + '/items/' + match.params.product + api_key, data)
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
            <IonAlert
                isOpen={deleteWarning}
                onDidDismiss={() => setDeleteWarning(false)}
                cssClass='my-custom-class'
                header={'Are you sure you want to delete this product? This action cannot be undone.'}
                buttons={[
                    {
                        text: 'Back',
                        role: 'cancel',
                        cssClass: 'secondary'
                    },
                    {
                        text: 'Yes',
                        handler: () => {
                            deleteItem()
                        }
                    }
                ]}
            />
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons slot="start">
                        <AppBackButton />
                    </IonButtons>
                    <IonTitle>Edit Product</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={e => setDeleteWarning(true)}>
                            <IonIcon icon={trashBinOutline}  />
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
                    <IonItem>
                        <IonLabel position="stacked">Name: </IonLabel>
                        <IonInput onIonChange={e => setName(e.detail.value as string)} value={name} autocapitalize="sentences"></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">Description: </IonLabel>
                        <IonTextarea onIonChange={e => setDescription(e.detail.value as string)} value={description} autocapitalize="sentences"></IonTextarea>
                    </IonItem>
                    <IonItem>
                        <IonLabel className="bold" position="stacked">Amount (£): </IonLabel>
                        <IonInput type="tel" inputmode="decimal" step="0.01" onIonChange={e => setPrice(e.detail.value as any)} value={price}></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel className="bold" position="stacked">Status: </IonLabel>
                        <IonSelect interfaceOptions={{ cssClass: 'select-wide' }} onIonChange={e => setStatus(e.detail.value)} value={status}>
                            <IonSelectOption key={"status-1"} value="1">Visible</IonSelectOption>
                            <IonSelectOption key={"status-2"} value="2">Hidden</IonSelectOption>
                        </IonSelect>
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
        </IonPage>
    );

};

export default ItemsShow;