import React, { useState, useContext } from 'react';
import {
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList,
    IonItem, IonLabel, IonButtons, IonToast, IonAlert,
} from '@ionic/react';
import AuthContext from "../../contexts/Context";
import { useHistory } from "react-router";
import { AppBackButton } from '../../components/AppBackButton';

const Settings: React.FC = () => {

    const history = useHistory();
    const { logout, authValues } = useContext(AuthContext);
    const [showToast, setShowToast] = useState<boolean>(false);
    const [logoutWarning, setLogoutWarning] = useState(false);

    const attemptLogout = async () => {
        await logout().then(function (e: any) {
            if (e === true) {
                history.replace("/login");
                history.go(0);
            }
        });
    }
    return (

        <IonPage>
            <IonAlert
                isOpen={logoutWarning}
                onDidDismiss={() => setLogoutWarning(false)}
                cssClass='my-custom-class'
                header={'Are you sure?'}
                buttons={[
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        cssClass: 'secondary'
                    },
                    {
                        text: 'Yes',
                        handler: () => {
                            attemptLogout();
                        }
                    }
                ]}
            />
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons slot="start">
                        <AppBackButton />
                    </IonButtons>
                    <IonTitle>Account</IonTitle>
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
                    <IonItem routerLink="/settings/details">
                        <IonLabel>Edit your profile</IonLabel>
                    </IonItem>
                    <IonItem routerLink="/settings/password">
                        <IonLabel>Change password</IonLabel>
                    </IonItem>
                    <IonItem onClick={e => setLogoutWarning(true)}>
                        <IonLabel>Logout</IonLabel>
                    </IonItem>
                </IonList>
            </IonContent>
        </IonPage>
    );

};

export default Settings;