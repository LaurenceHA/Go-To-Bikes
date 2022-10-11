import React, { useState, useContext } from 'react';
import { IonButton, IonIcon, useIonViewDidEnter, isPlatform, NavContext } from '@ionic/react'
import { useHistory } from 'react-router'
import { arrowBack, chevronBackOutline } from 'ionicons/icons'

interface backButtonProps {
    forceLink?: string
}

export const AppBackButton: React.FC <backButtonProps> = (props) => {

	const [disabled, setDisabled] = useState(true);
	const {navigate } = useContext(NavContext);
	const history = useHistory()

	useIonViewDidEnter(() => {
		setDisabled(false)
	})

	const onClick = () => {
		
		setDisabled(true)
		if (!disabled && props.forceLink) {
			navigate(props.forceLink, "back");
		}else if(!disabled){
			history.goBack();
		}
	}

	return (
		<div>
			{isPlatform('ios') ?
				<IonButton onClick={onClick} disabled={disabled}>
					<IonIcon icon={chevronBackOutline} /> Back
				</IonButton>
				:
				<IonButton onClick={onClick} disabled={disabled}>
					<IonIcon icon={arrowBack} />
				</IonButton>
			}
		</div>
	)
}