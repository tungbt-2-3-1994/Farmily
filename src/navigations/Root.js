import { StackNavigator } from 'react-navigation';
import { Animated, Easing } from 'react-native';
import Welcome from '../screens/Welcome';
import AppIntroduce from '../screens/AppIntroduce';
import RootNavigator from './RootNavigator';


const Root = StackNavigator({
    WelcomeScreen: {
        screen: Welcome,
    },
    AppIntroduceScreen: {
        screen: AppIntroduce
    },
    MainScreen: {
        screen: RootNavigator
    },
}, {
        headerMode: 'none',
        navigationOptions: {
            gesturesEnabled: false
        },
    });

export default Root;