import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import AuthContext from "./contexts/Context";


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './theme/style.css';
import Login from './pages/Auth/Login';
import Bookings from './pages/Bookings/Bookings';
import BookingsCreate from './pages/Bookings/BookingCreate';
import Settings from './pages/Settings/Settings';
import CustomerDetails from './pages/Settings/CustomerDetails';
import CustomerPassword from './pages/Settings/ChangePassword';
import BookingsShow from './pages/Bookings/BookingsShow';
import { calendarOutline, homeOutline, listOutline, pricetagsOutline } from 'ionicons/icons';
import ShopDetails from './pages/Settings/ShopDetails';
import ChangePassword from './pages/Settings/ChangePassword';
import Items from './pages/Items/Items';
import ItemsCreate from './pages/Items/ItemsCreate';
import ItemsShow from './pages/Items/ItemsShow';
import VolunteerDetails from './pages/Settings/VolunteerDetails';
import Availability from './pages/VolunteersAvailabilities/Availability';
import AvailabilityCreate from './pages/VolunteersAvailabilities/AvailabilityCreate';
import AvailabilityShow from './pages/VolunteersAvailabilities/AvailabilityShow';
import BookingsReview from './pages/Bookings/BookingsReview';
import BookingsCreate2 from './pages/Bookings/BookingCreate2';
import BookingsCreate3 from './pages/Bookings/BookingCreate3';
import BookingsCreate4 from './pages/Bookings/BookingCreate4';
import Home from './pages/Home/Home';

setupIonicReact({
  animated: true,
  hardwareBackButton: true
});

const App: React.FC = () => {


  const { authValues } = useContext(AuthContext);

  return (
    <IonApp>
      {!authValues.authenticated ?

        <IonReactRouter>
          <IonRouterOutlet>
            <Route path="/login" component={Login} exact={true} />
          </IonRouterOutlet>
          <Route path="/" render={() => <Redirect to="/login" />} exact={true} />
          <Route path="*" render={() => <Redirect to="/login" />} exact={true} />
        </IonReactRouter>
        : authValues.user.type === "customer" ?
          <IonReactRouter>
            <IonTabs>
              <IonRouterOutlet>
                <Route path="/:tab(home)" component={Home} exact={true} />
                <Route path="/:tab(bookings)" component={Bookings} exact={true} />
                <Route path="/:tab(bookings)/:booking" component={BookingsShow} exact={true} />
                <Route path="/:tab(bookings)/:booking/review" component={BookingsReview} exact={true} />
                <Route path="/:tab(bookings)/create" component={BookingsCreate} exact={true} />
                <Route path="/:tab(bookings)/create/:type" component={BookingsCreate2} exact={true} />
                <Route path="/:tab(bookings)/create/:type/date" component={BookingsCreate3} exact={true} />
                <Route path="/:tab(bookings)/create/:type/form" component={BookingsCreate4} exact={true} />
                <Route path="/settings" component={Settings} exact={true} />
                <Route path="/settings/details" component={CustomerDetails} exact={true} />
                <Route path="/settings/password" component={ChangePassword} exact={true} />
              </IonRouterOutlet>
              <Route path="/" render={() => <Redirect to="/home" />} exact={true} />
              <IonTabBar slot="bottom" mode="ios">
                  <IonTabButton tab="products" href="/home">
                    <IonIcon icon={homeOutline} />
                    <IonLabel>Home</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="bookings" href="/bookings">
                    <IonIcon icon={listOutline} />
                    <IonLabel>Bookings</IonLabel>
                  </IonTabButton>
                  
                </IonTabBar>
            </IonTabs>
          </IonReactRouter>
          : authValues.user.type === "volunteer" ?
            <IonReactRouter>
              <IonTabs>
                <IonRouterOutlet>
                  <Route path="/:tab(bookings)" component={Bookings} exact={true} />
                  <Route path="/bookings/:booking" component={BookingsShow} exact={true} />
                  <Route path="/:tab(availability)" component={Availability} exact={true} />
                  <Route path="/:tab(availability)/:availability" component={AvailabilityShow} exact={true} />
                  <Route path="/:tab(availability)/create" component={AvailabilityCreate} exact={true} />
                  <Route path="/settings" component={Settings} exact={true} />
                  <Route path="/settings/details" component={VolunteerDetails} exact={true} />
                  <Route path="/settings/password" component={ChangePassword} exact={true} />
                </IonRouterOutlet>
                <Route path="/" render={() => <Redirect to="/bookings" />} exact={true} />
                <IonTabBar slot="bottom" mode="ios">
                  <IonTabButton tab="bookings" href="/bookings">
                    <IonIcon icon={homeOutline} />
                    <IonLabel>Bookings</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="products" href="/availability">
                    <IonIcon icon={calendarOutline} />
                    <IonLabel>Availability</IonLabel>
                  </IonTabButton>
                </IonTabBar>
              </IonTabs>
            </IonReactRouter>
            : authValues.user.type === "shop" &&
            <IonReactRouter>
              <IonTabs>
                <IonRouterOutlet>
                  <Route path="/:tab(bookings)" component={Bookings} exact={true} />
                  <Route path="/bookings/:booking" component={BookingsShow} exact={true} />
                  <Route path="/:tab(bookings)/create" component={BookingsCreate} exact={true} />
                  <Route path="/:tab(bookings)/create/:type" component={BookingsCreate2} exact={true} />
                  <Route path="/:tab(bookings)/create/:type/date" component={BookingsCreate3} exact={true} />
                  <Route path="/:tab(bookings)/create/:type/form" component={BookingsCreate4} exact={true} />
                  <Route path="/:tab(products)" component={Items} exact={true} />
                  <Route path="/:tab(products)/:product" component={ItemsShow} exact={true} />
                  <Route path="/:tab(products)/create" component={ItemsCreate} exact={true} />
                  <Route path="/settings" component={Settings} exact={true} />
                  <Route path="/settings/details" component={ShopDetails} exact={true} />
                  <Route path="/settings/password" component={ChangePassword} exact={true} />
                </IonRouterOutlet>
                <Route path="/" render={() => <Redirect to="/bookings" />} exact={true} />
                <IonTabBar slot="bottom" mode="ios">
                  <IonTabButton tab="bookings" href="/bookings">
                    <IonIcon icon={homeOutline} />
                    <IonLabel>Bookings</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="products" href="/products">
                    <IonIcon icon={pricetagsOutline} />
                    <IonLabel>Products</IonLabel>
                  </IonTabButton>
                </IonTabBar>
              </IonTabs>
            </IonReactRouter>

      }
    </IonApp>

  );
};

export default App;
