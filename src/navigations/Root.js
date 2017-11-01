import { StackNavigator } from 'react-navigation';

import Welcome from '../screens/Welcome';
import RootNavigator from './RootNavigator';


const Root = StackNavigator({
    WelcomeScreen: {
        screen: Welcome,
    },
    MainScreen: {
        screen: RootNavigator
    },
}, {
        headerMode: 'none',
        navigationOptions: {
            gesturesEnabled: false
        }
    });

export default Root;